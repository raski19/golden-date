const { Solar } = require("lunar-javascript");
import { DayInfo } from "../types";
import {
  STEMS,
  BRANCHES,
  BRANCHES_LIST,
  OFFICERS,
  STARS,
  ELEMENT_LOOKUP,
  YELLOW_BLACK_BELT,
  NINE_LUMINARIES,
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

// --- HELPER 2: Calculate 9 Luminaries ---
// function getLuminary(dateStr: string) {
//   const date = new Date(dateStr);
//   // Arbitrary Anchor: Jan 1 2024 was within a specific cycle.
//   // For a repeating 9-day cycle, we calculate days elapsed.
//   const anchor = new Date("2024-01-01").getTime();
//   const target = date.getTime();
//
//   // Days elapsed
//   const diffDays = Math.floor((target - anchor) / (1000 * 60 * 60 * 24));
//
//   // Modulo 9
//   const index = ((diffDays % 9) + 9) % 9;
//
//   return NINE_LUMINARIES[index];
// }

export const getDayInfo = (dateString: string): DayInfo => {
  const parts = dateString.split("-").map(Number);
  // Note: parts[1] is 1-based month, Solar expects 1-based
  const solar = Solar.fromYmd(parts[0], parts[1], parts[2]);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const dayGanChar = eightChar.getDayGan();
  const dayZhiChar = eightChar.getDayZhi();
  const monthZhiChar = eightChar.getMonthZhi();
  const yearZhiChar = eightChar.getYearZhi();

  const officerChar = lunar.getZhiXing();
  const starChar = lunar.getXiu();

  const stem = STEMS[dayGanChar] || dayGanChar;
  const dayBranch = BRANCHES[dayZhiChar] || dayZhiChar;
  const monthBranch = BRANCHES[monthZhiChar] || monthZhiChar;
  const yearBranch = BRANCHES[yearZhiChar] || yearZhiChar;

  // New Calculations
  const yellowBlackBelt = getYellowBlackBelt(monthBranch, dayBranch);
  // const luminary = getLuminary(dateString);

  return {
    date: dateString,
    stem: stem,
    dayBranch,
    monthBranch,
    yearBranch,
    element: ELEMENT_LOOKUP[stem] || "Unknown",
    officer: OFFICERS[officerChar] || officerChar,
    constellation: STARS[starChar] || starChar,
    rawStar: starChar,

    yellowBlackBelt,
    // luminary,
  };
};
