export interface StandardRule {
  officers: string[];
  type: "wealth" | "career" | "health";
  action: string;
  icon: string;
  description: string;
}

export interface UserRules {
  breaker: string;
  selfPunishment: string;
  favorableBranches: string[];
  badBranches: string[];
  wealthElements: string[];
  careerElements: string[];
  healthElements: string[];
  avoidElements: string[];
}

export interface IUser {
  _id?: string;
  name: string;

  // Analysis Data
  dayMasterElement: string; // e.g. "Fire"
  strength: "Strong" | "Weak" | "Unknown";

  // Pillars
  dayMaster: string; // Day Stem
  dayBranch: string; // Day Branch

  monthStem: string;
  monthBranch: string;

  yearStem: string;
  yearBranch: string;

  hourStem?: string;
  hourBranch?: string;

  birthYear: number;
  luckBranch: string;
  gender: "male" | "female";

  rules: UserRules;
}

export interface YellowBlackBelt {
  name: string;
  type: "Yellow" | "Black";
  icon: string;
  desc: string;
}
export interface DayInfo {
  date: string;
  stem: string;
  dayBranch: string;
  monthBranch: string;
  yearBranch: string;
  element: string;
  officer: string;
  constellation: string;
  constellationDesc: string;
  nineStar: string;
  nineStarDesc: string;
  rawStar: string;
  yellowBlackBelt: YellowBlackBelt;
  // luminary: {
  //   name: string;
  //   element: string;
  //   icon: string;
  //   color: string;
  // };
}

export interface OfficerRecommendation {
  action: string;
  icon: string;
  desc: string;
  reality: string;
}
export interface HourInfo {
  branch: string;
  time: string;
  tags: string[];
}
export interface SpecificActions {
  action: string;
  icon: string;
  desc: string;
}
export interface ScoreResult {
  pillarNote: string;
  pillarIcon: string;
  pillarScore: number;
  score: number;
  verdict: string;
  cssClass: string;
  log: string[];
  flags: string[];
  tags: string[];
  specificActions: SpecificActions[];
  hours: HourInfo[];
  dayType: string;
  tenGodName: string;
  actionTitle: string;
  actionTagline: string;
  suitableActions: string[];
  cautionAction: string;
  actionKeywords: string;
  officerRec: OfficerRecommendation;
  starQuality: string;
  isStarFavorable: boolean;
  isStarAvoid: boolean;
  isAvoidElement: boolean;
  isVoidDay: boolean;
}

export interface TenGodsResult {
  stemGod: string;
  branchGod: string;
}

export interface MonthAnalysis {
  verdict: string; // e.g. "CAUTION"
  title: string; // e.g. "Personal Breaker Month"
  description: string; // e.g. "This month clashes with your Horse. Expect volatility."
  cssClass: string; // e.g. "warn-banner"
}

export interface CalendarResponse {
  days: any[]; // The existing array of days
  monthAnalysis: MonthAnalysis;
}
