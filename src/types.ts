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
  badBranches: string[];
  wealthElements: string[];
  careerElements: string[];
  healthElements: string[];
  favorableBranches: string[];
  favorableElements?: string[];
  avoidElements: string[];
  favorableOfficers: string[];
}

export interface IUser {
  _id?: string;
  name: string;
  baZiProfile: string;
  dayMaster: string; // e.g. "Bing"
  baZiBranch: string; // e.g. "Horse"
  description?: string;
  rules: UserRules;
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
  yellowBlackBelt: {
    name: string;
    type: "Yellow" | "Black";
    icon: string;
    desc: string;
  };
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
  specificActions: { action: string; icon: string; desc: string }[];
  badHours: string[];
  goodHours: string[];
  dayType: string;
  tenGodName: string;
  actionTitle: string;
  actionTagline: string;
  suitableActions: string[];
  cautionAction: string;
  actionKeywords: string;
  officerRec: OfficerRecommendation;
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
