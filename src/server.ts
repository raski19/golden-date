import express, { Request, Response } from "express";
import mongoose from "mongoose";
import User from "./models/User";
import { IUser } from "./types";
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

app.use(express.static("public"));

// Get Users (Includes ActionRules for Frontend Legend)
app.get("/api/users", async (req: Request, res: Response) => {
  const users = await User.find({}, "name baZiProfile actionRules");
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
interface FindDatesQuery {
  userId: string;
  action: string;
  days?: string;
  year?: string;
  month?: string;
}
app.get(
  "/api/find-dates",
  async (req: Request<{}, {}, {}, FindDatesQuery>, res: Response) => {
    try {
      const { userId, action, days = "90", year, month } = req.query;

      const user = (await User.findById(userId).lean()) as unknown as IUser;
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const results: any[] = [];

      // 1. Determine Start Date (Context-Aware)
      let startDate = new Date();
      if (year && month) {
        startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      }

      const limit = parseInt(days) || 90;

      // 2. Scan
      for (let i = 0; i < limit; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${d}`;

        const dayInfo = getDayInfo(dateStr);
        const analysis = calculateScore(user, dayInfo);

        const match = analysis.specificActions.find((a) => a.action === action);

        if (match) {
          results.push({
            date: dateStr,
            fullDate: date.toDateString(),
            score: analysis.score,
            verdict: analysis.verdict,
            cssClass: analysis.cssClass,
            dayInfo: dayInfo,
            matchDetails: match,
            flags: analysis.flags,
            goodHours: analysis.goodHours,
          });
        }
      }

      // 3. LOGIC: Get the Best, then Sort by Time

      // Step A: Sort by Score DESC (Best candidates first)
      const topCandidates = results
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      // Step B: Sort by Date ASC (Chronological)
      const finalResults = topCandidates.sort((a, b) =>
        a.date.localeCompare(b.date),
      );

      res.json(finalResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Search failed" });
    }
  },
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
