const { Lunar } = require("lunar-javascript");
import { DayInfo } from "../types";
import {
  STEMS,
  BRANCHES,
  BRANCHES_LIST,
  OFFICERS,
  STARS,
  STAR_DEFINITIONS,
  ELEMENT_LOOKUP,
  YELLOW_BLACK_BELT,
  NINE_STAR_DEFINITIONS,
  CHINESE_NUMBERS,
  NINE_STARS,
} from "./constants";

// --- HELPER: Calculate Yellow/Black Belt (Dong Gong) ---
function getYellowBlackBelt(monthBranch: string, dayBranch: string) {
  // Branch Order: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig
  // const branchList = Object.values(BRANCHES); // Ensure this matches constant order

  let startOffset = 0;

  // Dong Gong Starting Offsets for "Green Dragon"
  switch (monthBranch) {
    case "Tiger":
    case "Monkey":
      startOffset = 0;
      break; // Starts on Rat
    case "Rabbit":
    case "Rooster":
      startOffset = 2;
      break; // Starts on Tiger
    case "Dragon":
    case "Dog":
      startOffset = 4;
      break; // Starts on Dragon
    case "Snake":
    case "Pig":
      startOffset = 6;
      break; // Starts on Horse
    case "Rat":
    case "Horse":
      startOffset = 8;
      break; // Starts on Monkey
    case "Ox":
    case "Goat":
      startOffset = 10;
      break; // Starts on Dog
  }

  // Find index of the day
  // Note: We need to match the English string "Rat" to the index 0
  const dayIndex = BRANCHES_LIST.indexOf(dayBranch);

  // Formula: (Day - Start + 12) % 12
  const ybIndex = (dayIndex - startOffset + 12) % 12;

  return YELLOW_BLACK_BELT[ybIndex];
}

export const getDayInfo = (dateString: string): DayInfo => {
  // 1. Force Noon to avoid "previous day" errors due to timezone
  const date = new Date(dateString + "T12:00:00");
  const lunar = Lunar.fromDate(date);

  // 2. Get Raw Characters
  const dayGanChar = lunar.getDayGan();
  const dayZhiChar = lunar.getDayZhi();
  const monthZhiChar = lunar.getMonthZhi();
  const yearZhiChar = lunar.getYearZhi();

  // Use getZhiXing() for the 12 Day Officers (Establish, Remove...)
  const officerChar = lunar.getZhiXing();
  const starChar = lunar.getXiu();
  const constellation = STARS[starChar] || starChar;
  const constellationDesc =
    STAR_DEFINITIONS[constellation] || "No description available.";

  // 5. Nine Star (Flying Star)
  let nineStar = "Unknown";
  let nineStarDesc = "";

  try {
    const nineStarObj = lunar.getDayNineStar();
    if (nineStarObj) {
      const starNumChinese = nineStarObj.getNumber(); // Returns "一", "二", "三"...
      // Convert "三" -> "3" (fallback to original if not found)
      const starNum = CHINESE_NUMBERS[starNumChinese] || starNumChinese;
      nineStar = NINE_STARS[starNum] || `Star ${starNum}`;
      nineStarDesc = NINE_STAR_DEFINITIONS[nineStar] || "";
    }
  } catch (e) {
    console.error(`Error calculating 9 Star for ${dateString}:`, e);
  }

  const stem = STEMS[dayGanChar] || dayGanChar;
  const dayBranch = BRANCHES[dayZhiChar] || dayZhiChar;
  const monthBranch = BRANCHES[monthZhiChar] || monthZhiChar;
  const yearBranch = BRANCHES[yearZhiChar] || yearZhiChar;

  const yellowBlackBelt = getYellowBlackBelt(monthBranch, dayBranch);
  // const luminary = getLuminary(dateString);

  return {
    date: dateString,
    stem,
    dayBranch,
    monthBranch,
    yearBranch,
    element: ELEMENT_LOOKUP[stem] || "Unknown",
    officer: OFFICERS[officerChar] || officerChar,
    constellation,
    constellationDesc,
    nineStar,
    nineStarDesc,
    rawStar: starChar,

    yellowBlackBelt,
    // luminary,
  };
};
