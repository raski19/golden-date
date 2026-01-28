import express, { Request, Response } from "express";
import mongoose from "mongoose";
import User from "./models/User";
import { IUser } from "./types";
import { STANDARD_RULES } from "./utils/constants";
import { getDayInfo } from "./utils/tongShu";
import { calculateScore, analyzeMonth } from "./utils/calculator";
import { calculateTenGods } from "./utils/tenGods";

const app = express();

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
  const users = await User.find({}, "name baZiProfile");
  res.json(users);
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
      const analysis = calculateScore(user, dayInfo);

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
      monthAnalysis: monthAnalysis,
      days: monthlyData,
    });
  },
);

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
        const analysis = calculateScore(user, dayInfo);

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
