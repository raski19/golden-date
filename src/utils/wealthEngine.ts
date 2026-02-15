import { IUser } from "../types";
import {
  ELEMENT_MAP,
  CLASH_PAIRS,
  STEMS_LIST,
  BRANCHES_LIST,
  CONTROL_CYCLE,
  INFLUENCE_ELEMENT,
} from "./constants";

// --- CONFIGURATION ---
// 2026 is Bing Wu Year. The "Five Tigers" rule starts the year with Geng-Tiger.
const MONTH_STEMS_2026 = [
  "Geng",
  "Xin",
  "Ren",
  "Gui",
  "Jia",
  "Yi",
  "Bing",
  "Ding",
  "Wu",
  "Ji",
  "Geng",
  "Xin",
];
const MONTH_BRANCHES = [
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
  "Rat",
  "Ox",
];

// Industries based on Wealth Element
const WEALTH_INDUSTRIES: Record<string, string[]> = {
  Wood: ["Education", "Publishing", "Design", "Agriculture", "Textiles"],
  Fire: ["Tech/AI", "Media", "Energy", "Marketing", "Content"],
  Earth: ["Real Estate", "Construction", "Insurance", "Storage", "HR"],
  Metal: ["Finance", "Auto", "Legal", "Hardware", "Jewelry"],
  Water: ["Logistics", "F&B", "Tourism", "Retail", "Trading"],
};

// --- HELPER: CALCULATE DAILY PILLAR ---
// Reference: Jan 1, 2000 was a Wu-Wu (Earth Horse) day.
// Stem Index: 4 (Wu), Branch Index: 6 (Wu/Horse)
const REF_DATE = new Date(2000, 0, 1);
const REF_STEM_IDX = 4;
const REF_BRANCH_IDX = 6;

const getDailyPillar = (date: Date) => {
  const diffTime = date.getTime() - REF_DATE.getTime();
  const daysPassed = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let stemIdx = (REF_STEM_IDX + daysPassed) % 10;
  let branchIdx = (REF_BRANCH_IDX + daysPassed) % 12;

  if (stemIdx < 0) stemIdx += 10;
  if (branchIdx < 0) branchIdx += 12;

  const stem = STEMS_LIST[stemIdx];
  const branch = BRANCHES_LIST[branchIdx];

  return {
    stem,
    branch,
    stemElement: ELEMENT_MAP[stem],
    branchElement: ELEMENT_MAP[branch], // Simplified branch element mapping
  };
};

// --- 1. ARCHETYPE LOGIC ---
const getArchetype = (dm: string, strength: string, wealthEl: string) => {
  const isStrong = strength === "Strong";
  const baseIndustries = WEALTH_INDUSTRIES[wealthEl] || [];
  const topIndustries = baseIndustries.slice(0, 3).join(", ");

  if (isStrong) {
    if (["Jia", "Yi", "Geng", "Xin"].includes(dm))
      return {
        title: "The Dealmaker",
        icon: "🤝",
        strategy: "Direct Execution. Buy inventory, trade actively, and scale.",
        css: "profile-dealmaker",
        industries: topIndustries,
      };
    if (["Bing", "Ding", "Ren", "Gui"].includes(dm))
      return {
        title: "The Creator",
        icon: "🎨",
        strategy: "Visibility & Innovation. Launch products and build a brand.",
        css: "profile-creator",
        industries: topIndustries,
      };
    return {
      title: "The Architect",
      icon: "🏛️",
      strategy: "Systems & Assets. Build platforms and manage resources.",
      css: "profile-architect",
      industries: topIndustries,
    };
  } else {
    if (["Jia", "Yi", "Bing", "Ding"].includes(dm))
      return {
        title: "The Connector",
        icon: "🔗",
        strategy: "Leverage & Networks. Don't build alone; partner up.",
        css: "profile-connector",
        industries: topIndustries,
      };
    return {
      title: "The Specialist",
      icon: "🧠",
      strategy: "Niche Skills & IP. Charge for value/consulting, not time.",
      css: "profile-specialist",
      industries: topIndustries,
    };
  }
};

// --- 2. MONTHLY STRATEGY ---
const generateMonthlyPlan = (user: IUser) => {
  const dmElement = ELEMENT_MAP[user.dayMaster.split(" ")[0]];

  return MONTH_BRANCHES.map((branch, index) => {
    const stem = MONTH_STEMS_2026[index];
    const stemElement = ELEMENT_MAP[stem];
    const isClash = CLASH_PAIRS[user.dayBranch] === branch;

    let focus;
    let action;
    let css;

    // Detect Ten God of the Month
    if (isClash) {
      focus = "Pivot";
      action = "Cut Costs / Break Habits";
      css = "clash-month";
    } else if (user.rules.wealthElements.includes(stemElement)) {
      focus = "Revenue";
      action = "Launch / Sell / Close";
      css = "wealth-month";
    } else if (user.rules.careerElements.includes(stemElement)) {
      focus = "Visibility";
      action = "Marketing / Creation";
      css = "career-month";
    } else if (user.rules.healthElements.includes(stemElement)) {
      focus = "Strategy";
      action = "Learn / Plan / Rest";
      css = "resource-month";
    } else if (INFLUENCE_ELEMENT[dmElement] === stemElement) {
      focus = "Power";
      action = "Lead / Solve Problems";
      css = "power-month";
    } else {
      focus = "Network";
      action = "Partner / Connect";
      css = "social-month";
    }

    return { month: index + 1, stem, branch, focus, action, css };
  });
};

// --- 3. DAILY TACTICS (Next 7 Days) ---
const generateDailyTactics = (user: IUser) => {
  const tactics = [];
  const today = new Date();
  const userDmElement = ELEMENT_MAP[user.dayMaster.split(" ")[0]];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const pillar = getDailyPillar(d);

    let focus = "Routine";
    let advice = "Maintain steady progress.";
    let css = "neutral-day";

    // CHECK 1: PERSONAL CLASH (High Priority)
    if (CLASH_PAIRS[user.dayBranch] === pillar.branch) {
      focus = "⚠️ DEFENSE";
      advice = "Do not sign contracts. Avoid conflict.";
      css = "clash-card";
    }
    // CHECK 2: WEALTH DAY
    else if (user.rules.wealthElements.includes(pillar.stemElement)) {
      focus = "💰 REVENUE";
      advice = "Ask for the sale. Send invoices.";
      css = "wealth-card";
    }
    // CHECK 3: OUTPUT DAY
    else if (user.rules.careerElements.includes(pillar.stemElement)) {
      focus = "🚀 VISIBILITY";
      advice = "Pitch ideas. Publish content.";
      css = "career-card";
    }
    // CHECK 4: POWER DAY
    else if (INFLUENCE_ELEMENT[userDmElement] === pillar.stemElement) {
      focus = "⚔️ AUTHORITY";
      advice = "Solve problems. Admin tasks.";
      css = "power-card";
    }
    // CHECK 5: RESOURCE DAY
    else if (user.rules.healthElements.includes(pillar.stemElement)) {
      focus = "📚 STRATEGY";
      advice = "Plan, learn, and review.";
      css = "resource-card";
    }
    // CHECK 6: COMPANION DAY
    else {
      focus = "🤝 NETWORK";
      advice = "Connect with partners.";
      css = "social-card";
    }

    tactics.push({
      date: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
      pillar: `${pillar.stem} ${pillar.branch}`,
      focus,
      advice,
      css,
    });
  }
  return tactics;
};

// --- MAIN EXPORT ---
export const getWealthRoadmap = (user: IUser) => {
  const dm = user.dayMaster.split(" ")[0];
  const wealthEl = CONTROL_CYCLE[ELEMENT_MAP[dm]];

  return {
    archetype: getArchetype(dm, user.strength, wealthEl),
    monthly: generateMonthlyPlan(user),
    daily: generateDailyTactics(user),
  };
};
