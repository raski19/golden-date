import fs from "fs";
import path from "path";
import { parseDailyText, ParsedDayData } from "../utils/textParser";

// 1. Load the raw JSON file
const rawPath = path.join(__dirname, "raw_calendar.json");
const rawData = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

// 2. Create the Lookup Map
const CALENDAR_CACHE: Record<string, ParsedDayData> = {};

// 3. Parse everything on startup
console.log("⏳ Parsing Calendar Data...");
if (rawData.items && Array.isArray(rawData.items)) {
  rawData.items.forEach((item: any) => {
    if (item.date && item.description) {
      // "2026-02-09" -> { parsed object }
      CALENDAR_CACHE[item.date] = parseDailyText(item.date, item.description);
    }
  });
}
console.log(
  `✅ Loaded details for ${Object.keys(CALENDAR_CACHE).length} days.`,
);

// 4. Export the Lookup Function
export const getDayDetails = (date: string) => {
  return CALENDAR_CACHE[date] || null;
};
