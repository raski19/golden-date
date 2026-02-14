import dotenv from "dotenv";
dotenv.config();
// import { config } from "./config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import User from "./models/User";
import { IUser } from "./types";
import { STANDARD_RULES } from "./utils/constants";
import { getDayInfo } from "./utils/tongShu";
import { calculateScore, analyzeMonth } from "./utils/calculator";
import { calculateTenGods } from "./utils/tenGods";
import { calculateBaZiProfile } from "./utils/baziHelper";
import { getDayDetails } from "./data/calendarData";

const app = express();

// const PORT = config.port || 3333;
// const MONGO_URI = config.mongoUri || "mongodb://127.0.0.1:27017/goldenDateDB";

const PORT = process.env.APP_PORT || 3333;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/goldenDateDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected (Pro Mode)"))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.static("public"));

// Get Users
app.get("/api/users", async (req: Request, res: Response) => {
  const users = await User.find({}, "name dayMaster strength dayBranch");
  res.json(users);
});
app.post("/api/generate-guest", (req: Request, res: Response) => {
  try {
    const { name, birthDate, gender, hasTime = true } = req.body;

    // Parse Date (Ensure it's valid)
    const dateObj = new Date(birthDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "Invalid Date Format" });
    }

    // 1. Calculate Profile
    const profile = calculateBaZiProfile(name, dateObj, gender, hasTime);

    // 2. Return as a "User" object (No ID, it's a guest)
    res.json(profile);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Get Calendar Data
interface CalendarData {
  userId: string;
  year: string;
  month: string;
}
app.get(
  "/api/calendar",
  async (req: Request<{}, {}, {}, CalendarData>, res: Response) => {
    const { userId, year, month } = req.query;

    if (!userId || !year || !month) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const user = (await User.findById(userId).lean()) as unknown as IUser;
    if (!user) return res.status(404).json({ error: "User not found" });

    const y = parseInt(year as string);
    const m = parseInt(month as string);
    const daysInMonth = new Date(y, m, 0).getDate();
    const monthlyData = [];

    // 1. Calculate the "Dominant Branch" for the month (Using the 15th)
    const midMonthDateStr = `${y}-${String(m).padStart(2, "0")}-15`;
    const midMonthInfo = getDayInfo(midMonthDateStr);
    const dominantMonthBranch = midMonthInfo.monthBranch;

    // 2. Run the Month Analysis
    const monthAnalysis = analyzeMonth(user, dominantMonthBranch);

    // 3. Loop days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const dayInfo = getDayInfo(dateStr);
      const analysis = calculateScore(user, dayInfo, y);

      const cleanStem = dayInfo.stem.split(" ")[0] || "";
      const tenGods = calculateTenGods(
        user.dayMaster,
        cleanStem,
        dayInfo.dayBranch,
      );

      monthlyData.push({
        day: d,
        fullDate: dateStr,
        info: dayInfo,
        analysis,
        tenGods,
      });
    }

    res.json({
      user,
      monthAnalysis: monthAnalysis,
      days: monthlyData,
    });
  },
);
app.post("/api/calendar/guest", async (req: Request, res: Response) => {
  // Extract year and month from query, user from body
  const { year, month } = req.query;
  const user = req.body.user as IUser; // The generated guest profile

  if (!user || !year || !month) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const y = parseInt(year as string);
  const m = parseInt(month as string);
  const daysInMonth = new Date(y, m, 0).getDate();
  const monthlyData = [];

  // 1. Calculate the "Dominant Branch" for the month (Using the 15th)
  const midMonthDateStr = `${y}-${String(m).padStart(2, "0")}-15`;
  const midMonthInfo = getDayInfo(midMonthDateStr);
  const dominantMonthBranch = midMonthInfo.monthBranch;

  // 2. Run the Month Analysis
  const monthAnalysis = analyzeMonth(user, dominantMonthBranch);

  // 3. Loop days (Exact same logic as your GET route)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    const dayInfo = getDayInfo(dateStr);
    const analysis = calculateScore(user, dayInfo, y);

    const cleanStem = dayInfo.stem.split(" ")[0] || "";
    const tenGods = calculateTenGods(
      user.dayMaster,
      cleanStem,
      dayInfo.dayBranch,
    );

    monthlyData.push({
      day: d,
      fullDate: dateStr,
      info: dayInfo,
      analysis,
      tenGods,
    });
  }

  // Return the exact same structure as the GET route
  res.json({
    user,
    monthAnalysis: monthAnalysis,
    days: monthlyData,
  });
});

app.get("/api/day-details/:date", (req, res) => {
  const { date } = req.params; // Expects YYYY-MM-DD
  const details = getDayDetails(date);

  if (!details) {
    return res.status(404).json({ error: "No data found for this date" });
  }

  res.json(details);
});

// Find Dates
interface FindDatesBody {
  userId: string;
  action: string;
  days?: string;
  year?: string;
  month?: string;
}
app.post(
  "/api/find-dates",
  async (req: Request<{}, {}, FindDatesBody>, res: Response) => {
    try {
      const { userId, action, days = "90", year, month } = req.body;

      // 1. Fetch User (Lean = JSON object, faster)
      const user = (await User.findById(userId).lean()) as unknown as IUser;
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // 2. Lookup Rule Definition (The "Dictionary" Check)
      const ruleDef = STANDARD_RULES.find((r) => r.action === action);
      if (!ruleDef) {
        res.status(400).json({ error: `Unknown action: '${action}'` });
        return;
      }

      // 3. Hydrate Requirements (The "Link")
      // We know the rule type, so we grab the specific User Elements needed.
      let requiredElements: string[] = [];

      if (ruleDef.type === "wealth")
        requiredElements = user.rules.wealthElements;
      else if (ruleDef.type === "career")
        requiredElements = user.rules.careerElements;
      else if (ruleDef.type === "health")
        requiredElements = user.rules.healthElements;

      // console.log(`🔎 Searching: "${action}" (${ruleDef.type})`);
      // console.log(`🎯 Needs: Officer [${ruleDef.officers}] + Elements [${requiredElements}]`);

      // 4. Setup Date Range
      const results: any[] = [];
      let startDate = new Date();

      // Handle "Start from specific month" logic
      if (year && month) {
        startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      }

      const limit = parseInt(days) || 90;

      // 5. Scan Loop
      for (let i = 0; i < limit; i++) {
        // A. Increment Day
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // B. Format YYYY-MM-DD
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        // C. Get Day Energies
        const dayInfo = getDayInfo(dateStr);

        // --- ⚡ FILTER 1: OFFICER CHECK (Fastest Fail) ---
        if (!ruleDef.officers.includes(dayInfo.officer)) {
          continue; // Skip this day immediately
        }

        // --- ⚡ FILTER 2: ELEMENT CHECK (Personal Link) ---
        // If the user *has* required elements for this goal, the day MUST match one.
        if (
          requiredElements.length > 0 &&
          !requiredElements.includes(dayInfo.element)
        ) {
          continue; // Skip: Right Officer, Wrong Element (e.g. Success Day but it's Fire, user needs Metal)
        }

        // --- ⚡ FILTER 3: SCORE CHECK (Deep Analysis) ---
        // Only calculate score if basic conditions are met
        const analysis = calculateScore(user, dayInfo, y);

        // We accept "Good" (60+) or "Excellent" (80+) days
        if (analysis.score >= 60) {
          results.push({
            date: dateStr,
            fullDate: date.toDateString(),
            score: analysis.score,
            verdict: analysis.verdict,
            cssClass: analysis.cssClass,
            dayInfo: dayInfo,

            // ✅ Construct the reason manually since we don't have analysis.specificActions
            reason: `A <strong>${dayInfo.officer}</strong> day with your ${ruleDef.type} element (${dayInfo.element}).`,

            // Pass the static details for the UI to render the icon
            matchDetails: {
              action: action,
              icon: ruleDef.icon,
              desc: ruleDef.description,
            },
          });
        }
      }

      // 6. Sort & Filter Results

      // Step A: Pick Top 5 Highest Scores
      const topCandidates = results
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // Step B: Sort those Top 5 Chronologically
      const finalResults = topCandidates.sort((a, b) =>
        a.date.localeCompare(b.date),
      );

      res.json(finalResults);
    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  },
);

// 1. ADD TEAM SYNERGY ENDPOINT
app.post("/api/team-synergy", async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "No users selected" });
    }

    // A. Fetch All Users
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length === 0)
      return res.status(404).json({ error: "Users not found" });

    const results = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // B. Generate next 90 days
    for (let i = 0; i < 90; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Format Date for Calculations
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // ✨ ADDED: Friendly Date format for the Modal Title (e.g., "Fri, Jan 30")
      const fullDate = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const dayInfo = getDayInfo(dateStr);

      // C. Calculate Score for Each User
      const userScores = users.map((user) => {
        const scoreResult = calculateScore(
          user.toObject() as Omit<IUser, "_id">,
          dayInfo,
          year,
        );
        return {
          name: user.name,
          score: scoreResult.score,
          verdict: scoreResult.verdict,
          flags: scoreResult.flags,
          // Keep breaker notes for the team modal details
          notes: scoreResult.log.filter(
            (l) =>
              l.includes("Breaker") ||
              l.includes("Clash") ||
              l.includes("Nobleman"),
          ),
        };
      });

      // D. Veto Logic
      const isFatal = userScores.some(
        (u) => u.verdict === "DANGEROUS" || u.score === 0,
      );

      if (!isFatal) {
        const totalScore = userScores.reduce((sum, u) => sum + u.score, 0);
        const avgScore = Math.round(totalScore / users.length);
        const minScore = Math.min(...userScores.map((u) => u.score));

        // Filter: Optional threshold (e.g., must be > 40 average)
        if (avgScore >= 40) {
          results.push({
            dateStr: dateStr,
            fullDate: fullDate, // ✨ Needed for Modal Title
            dateNum: currentDate.getDate(),
            dayInfo: {
              officer: dayInfo.officer,
              constellation: dayInfo.constellation,
              element: dayInfo.element,
              // ✨ Needed for Modal Header Badge
              yellowBlackBelt: dayInfo.yellowBlackBelt,
              nineStar: dayInfo.nineStar,
            },
            teamMetrics: {
              avgScore,
              minScore,
            },
            userBreakdown: userScores,
          });
        }
      }
    }

    // F. Sort by "Safest" (Highest Minimum Score), then Average
    results.sort((a, b) => {
      if (b.teamMetrics.minScore !== a.teamMetrics.minScore) {
        return b.teamMetrics.minScore - a.teamMetrics.minScore;
      }
      return b.teamMetrics.avgScore - a.teamMetrics.avgScore;
    });

    res.json(results);
  } catch (error) {
    console.error("Team Synergy Error:", error);
    res.status(500).json({ error: "Calculation failed" });
  }
});
app.post("/api/momentum", async (req: Request, res: Response) => {
  try {
    const { userId, duration = 2 } = req.body;
    const durationNum = parseInt(duration, 10);

    // Validate duration parameter
    if (durationNum !== 2 && durationNum !== 3) {
      return res.status(400).json({
        error: "Duration must be 2 or 3 days",
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const chains = [];
    const daysToCheck = 180;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyScores = [];

    // 1. GENERATE SCORES FOR 90 DAYS
    for (let i = 0; i < daysToCheck; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const fullDate = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const dayInfo = getDayInfo(dateStr);

      const scoreData = calculateScore(
        user.toObject() as Omit<IUser, "_id">,
        dayInfo,
        year,
      );

      dailyScores.push({
        date: d,
        fullDate,
        dayInfo,
        score: scoreData.score,
        verdict: scoreData.verdict,
        flags: scoreData.flags || [],
        officer: dayInfo.officer,
      });
    }

    // 🔴 DEFINING THE GROUPS
    // A chain is valid ONLY if ALL days belong to one of these groups.
    const OFFICER_GROUPS = {
      LAUNCH: ["Establish", "Initiate", "Open"],
      HARVEST: ["Success", "Receive", "Full"],
      FOUNDATION: ["Stable", "Balance"],
      CLEANSING: ["Remove", "Destruction"],
    };

    // 2. FIND STREAKS
    for (let i = 0; i <= dailyScores.length - durationNum; i++) {
      const potentialChain = dailyScores.slice(i, i + durationNum);

      // A. Check Consecutive Dates (No gaps)
      let isConsecutive = true;
      for (let j = 1; j < potentialChain.length; j++) {
        const prevDate = new Date(potentialChain[j - 1].date);
        const currDate = new Date(potentialChain[j].date);
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(
          Math.abs(currDate.getTime() - prevDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (diffDays !== 1) {
          isConsecutive = false;
          break;
        }
      }
      if (!isConsecutive) continue;

      // B. Check Safety (Score & Breakers)
      // Note: We check this BEFORE theme to fail fast
      const isSafeChain = potentialChain.every(
        (d) =>
          d.score >= 40 &&
          d.verdict !== "DANGEROUS" &&
          !(Array.isArray(d.flags) && d.flags.includes("PERSONAL BREAKER")),
      );

      if (isSafeChain) {
        // C. 🔴 STRICT THEME CHECK
        // Iterate through our defined groups. If the chain matches a group entirely, we keep it.
        let detectedTheme = null;

        for (const [key, allowedOfficers] of Object.entries(OFFICER_GROUPS)) {
          const isMatch = potentialChain.every((d) =>
            allowedOfficers.includes(d.officer),
          );
          if (isMatch) {
            detectedTheme = key; // Returns "LAUNCH", "HARVEST", etc.
            break;
          }
        }

        // Only proceed if a valid theme was found
        if (detectedTheme) {
          const avg = Math.round(
            potentialChain.reduce((sum, d) => sum + d.score, 0) / durationNum,
          );

          if (avg >= 60) {
            chains.push({
              startDate: potentialChain[0].fullDate,
              endDate: potentialChain[potentialChain.length - 1].fullDate,
              startDateObj: potentialChain[0].date,
              theme: detectedTheme, // Use the strictly detected theme
              avgScore: avg,
              duration: potentialChain.length,
              scores: potentialChain.map((d) => d.score),
              days: potentialChain,
            });
          }
        }
      }
    }

    // 3. SORT LOGIC
    chains.sort((a, b) => a.startDateObj.getTime() - b.startDateObj.getTime());

    // 4. RETURN
    res.json({
      summary: {
        totalDaysAnalyzed: daysToCheck,
        totalChainsFound: chains.length,
        durationRequested: duration,
      },
      chains: chains.slice(0, 50),
    });
  } catch (error) {
    console.error("Momentum Error:", error);
    res.status(500).json({ error: "Momentum calculation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
