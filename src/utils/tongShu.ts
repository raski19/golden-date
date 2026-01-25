const { Solar } = require("lunar-javascript");
import { DayInfo } from "../types";

const STEMS: Record<string, string> = {
  甲: "Jia (Wood)",
  乙: "Yi (Wood)",
  丙: "Bing (Fire)",
  丁: "Ding (Fire)",
  戊: "Wu (Earth)",
  己: "Ji (Earth)",
  庚: "Geng (Metal)",
  辛: "Xin (Metal)",
  壬: "Ren (Water)",
  癸: "Gui (Water)",
};

const BRANCHES: Record<string, string> = {
  子: "Rat",
  丑: "Ox",
  寅: "Tiger",
  卯: "Rabbit",
  辰: "Dragon",
  巳: "Snake",
  午: "Horse",
  未: "Goat",
  申: "Monkey",
  酉: "Rooster",
  戌: "Dog",
  亥: "Pig",
};

const OFFICERS: Record<string, string> = {
  建: "Establish",
  除: "Remove",
  满: "Full",
  平: "Balance",
  定: "Stable",
  执: "Initiate",
  破: "Destruction",
  危: "Danger",
  成: "Success",
  收: "Receive",
  开: "Open",
  闭: "Close",
};

const STARS: Record<string, string> = {
  角: "Horn",
  亢: "Neck",
  氐: "Foundation",
  房: "House",
  心: "Heart",
  尾: "Tail",
  箕: "Basket",
  斗: "Dipper",
  牛: "Ox",
  女: "Weaving Maiden",
  虚: "Void",
  危: "Danger",
  室: "Room",
  壁: "Wall",
  奎: "Astride",
  娄: "Mound",
  胃: "Stomach",
  昴: "Pleiades",
  毕: "Net",
  觜: "Beak",
  参: "Orion",
  井: "Well",
  鬼: "Ghost",
  柳: "Willow",
  星: "Star",
  张: "Bow",
  翼: "Wing",
  轸: "Carriage",
};

const ELEMENT_LOOKUP: Record<string, string> = {
  "Jia (Wood)": "Wood",
  "Yi (Wood)": "Wood",
  "Bing (Fire)": "Fire",
  "Ding (Fire)": "Fire",
  "Wu (Earth)": "Earth",
  "Ji (Earth)": "Earth",
  "Geng (Metal)": "Metal",
  "Xin (Metal)": "Metal",
  "Ren (Water)": "Water",
  "Gui (Water)": "Water",
};

export const getDayInfo = (dateString: string): DayInfo => {
  const parts = dateString.split("-").map(Number);
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
  const branch = BRANCHES[dayZhiChar] || dayZhiChar;

  return {
    date: dateString,
    stem: stem,
    branch: branch,
    monthBranch: BRANCHES[monthZhiChar] || monthZhiChar,
    yearBranch: BRANCHES[yearZhiChar] || yearZhiChar,
    element: ELEMENT_LOOKUP[stem] || "Unknown",
    officer: OFFICERS[officerChar] || officerChar,
    constellation: STARS[starChar] || starChar,
    rawStar: starChar,
  };
};
