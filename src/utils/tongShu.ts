const { Lunar } = require("lunar-javascript");
import { DayInfo } from "../types";
import {
  STEMS,
  BRANCHES,
  OFFICERS,
  STARS,
  STAR_DEFINITIONS,
  ELEMENT_LOOKUP,
  NINE_STAR_DEFINITIONS,
  CHINESE_NUMBERS,
  NINE_STARS,
} from "./constants";
import { getYellowBlackBelt } from "./shenSha";

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
  };
};
