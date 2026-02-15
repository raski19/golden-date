import { IUser } from "../types";
import {
  ELEMENT_MAP,
  CLASH_PAIRS,
  STEMS_LIST,
  BRANCHES_LIST,
  STEM_INFO,
  ELEMENT_RELATIONSHIPS,
  CONTROL_CYCLE,
} from "./constants";

// --- CONFIGURATION ---
// prettier-ignore
const MONTH_STEMS_2026 = ["Geng", "Xin", "Ren", "Gui", "Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin"];
// prettier-ignore
const MONTH_BRANCHES = ["Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox"];

// Industries based on Wealth Element
const WEALTH_INDUSTRIES: Record<string, string[]> = {
  Wood: ["Education", "Publishing", "Design", "Agriculture", "Textiles"],
  Fire: ["Tech/AI", "Media", "Energy", "Marketing", "Content"],
  Earth: ["Real Estate", "Construction", "Insurance", "Storage", "HR"],
  Metal: ["Finance", "Auto", "Legal", "Hardware", "Jewelry"],
  Water: ["Logistics", "F&B", "Tourism", "Retail", "Trading"],
};

// Reference for Daily Calculation (Jan 1, 2000 = Wu Wu)
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

  return { stem, branch, stemElement: ELEMENT_MAP[stem] };
};

// CRITICAL NEW HELPER: Calculates the specific "Ten God" (e.g., "7 Killings")
const getTenGod = (dmStem: string, targetStem: string): string => {
  const dm = STEM_INFO[dmStem.split(" ")[0]];
  const target = STEM_INFO[targetStem.split(" ")[0]];

  if (!dm || !target) return "Friend";

  const relation = ELEMENT_RELATIONSHIPS[dm.element][target.element];
  const isSamePolarity = dm.polarity === target.polarity;

  // Map Element Relation + Polarity to Ten God Name
  if (relation === "Same") return isSamePolarity ? "Friend" : "Rob Wealth";
  if (relation === "Output")
    return isSamePolarity ? "Eating God" : "Hurting Officer";
  if (relation === "Wealth")
    return isSamePolarity ? "Indirect Wealth" : "Direct Wealth";
  if (relation === "Power")
    return isSamePolarity ? "7 Killings" : "Direct Officer";
  if (relation === "Resource")
    return isSamePolarity ? "Indirect Resource" : "Direct Resource";

  return "Friend";
};

// --- 2. ARCHETYPE LOGIC ---
const getArchetype = (dm: string, strength: string) => {
  const isStrong = strength === "Strong";
  const dmElem = ELEMENT_MAP[dm];
  const wealthEl = CONTROL_CYCLE[dmElem];

  const baseIndustries = WEALTH_INDUSTRIES[wealthEl] || ["General Business"];
  const industries = baseIndustries.slice(0, 3).join(", "); // "Finance, Auto, Legal"

  // Logic: Strong DM = Output/Wealth (Execution); Weak DM = Resource/Friend (Leverage)
  if (isStrong) {
    if (["Jia", "Yi", "Geng", "Xin"].includes(dm))
      return {
        title: "The Dealmaker",
        icon: "🤝",
        strategy: "Direct Execution. Buy, trade, and scale.",
        css: "profile-dealmaker",
        wealthEl,
        industries,
      };
    if (["Bing", "Ding", "Ren", "Gui"].includes(dm))
      return {
        title: "The Creator",
        icon: "🎨",
        strategy: "Visibility & Innovation. Launch products.",
        css: "profile-creator",
        wealthEl,
        industries,
      };
    return {
      title: "The Architect",
      icon: "🏛️",
      strategy: "Systems & Assets. Build platforms.",
      css: "profile-architect",
      wealthEl,
      industries,
    };
  } else {
    if (["Jia", "Yi", "Bing", "Ding"].includes(dm))
      return {
        title: "The Connector",
        icon: "🔗",
        strategy: "Leverage & Networks. Partner up.",
        css: "profile-connector",
        wealthEl,
        industries,
      };
    return {
      title: "The Specialist",
      icon: "🧠",
      strategy: "Niche Skills & IP. Consult and license.",
      css: "profile-specialist",
      wealthEl,
      industries,
    };
  }
};

// --- 3. MONTHLY STRATEGY (Enhanced with User's Logic) ---
const generateMonthlyPlan = (user: IUser) => {
  const userDm = user.dayMaster.split(" ")[0];
  const userBranch = user.dayBranch;

  return MONTH_BRANCHES.map((branch, index) => {
    const stem = MONTH_STEMS_2026[index];

    // 1. Calculate Ten God
    const tenGod = getTenGod(userDm, stem);

    // 2. Critical Safety Checks
    // Triple Penalty: 2026 is Horse Year. If Month is Horse + User is Horse => Danger.
    const isSelfPunish = userBranch === "Horse" && branch === "Horse";
    const isClash = CLASH_PAIRS[userBranch] === branch;

    let focus = "Maintain";
    let action = "Steady progress";
    let css = "neutral-month";

    // --- A. DANGER ZONES (Override all others) ---
    if (isSelfPunish) {
      focus = "🛑 DEFENSE";
      action = "Triple Penalty (Jian Xing). High stress/injury risk. Lie low.";
      css = "clash-month"; // Re-using clash style for danger
    } else if (isClash) {
      focus = "⚠️ PIVOT";
      action = `Clash with ${branch}. Cut costs. Do not sign contracts.`;
      css = "clash-month";
    }
    // --- B. OPPORTUNITY ZONES (Ten Gods) ---
    else if (["Direct Wealth", "Indirect Wealth"].includes(tenGod)) {
      focus = "💰 REVENUE";
      action = "Launch products. Ask for the sale. Scale.";
      css = "wealth-month";
    } else if (["Direct Officer", "7 Killings"].includes(tenGod)) {
      focus = "⚔️ POWER";
      action = "Lead the team. Solve crises. Execute strategy.";
      css = "power-month";
    } else if (["Hurting Officer", "Eating God"].includes(tenGod)) {
      focus = "🚀 VISIBILITY";
      action = "Marketing push. Public speaking. Create content.";
      css = "career-month";
    } else if (["Direct Resource", "Indirect Resource"].includes(tenGod)) {
      focus = "📚 STRATEGY";
      action = "Deep work. Research. Asset planning.";
      css = "resource-month";
    } else {
      // Friend / Rob Wealth
      focus = "🤝 NETWORK";
      action = "Partnerships. Competitor analysis. Socialize.";
      css = "social-month";
    }

    return {
      month: index + 1,
      stem,
      branch,
      focus,
      action,
      css,
    };
  });
};

// --- 4. DAILY TACTICS (Next 7 Days) ---
const generateDailyTactics = (user: IUser) => {
  const tactics = [];
  const today = new Date();
  const userDm = user.dayMaster.split(" ")[0];
  const userBranch = user.dayBranch;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    // 1. Get Real Pillar
    const pillar = getDailyPillar(d);

    // 2. Get Relationship
    const dayTenGod = getTenGod(userDm, pillar.stem);

    let focus = "Routine";
    let advice = "Maintain steady progress.";
    let css = "neutral-day";

    // CHECK 1: RISKS
    if (CLASH_PAIRS[userBranch] === pillar.branch) {
      focus = "💥 CLASH";
      advice = "Expect disruptions. Delay big decisions.";
      css = "clash-card";
    }
    // Self-Punishment Check (Day Level - Horse/Horse, Dragon/Dragon, Pig/Pig, Rooster/Rooster)
    else if (
      userBranch === pillar.branch &&
      ["Horse", "Dragon", "Pig", "Rooster"].includes(pillar.branch)
    ) {
      focus = "🔥 COOL DOWN";
      advice = "Self-Punishment day. Watch your temper/mistakes.";
      css = "clash-card";
    }
    // CHECK 2: OPPORTUNITIES
    else if (dayTenGod.includes("Wealth")) {
      focus = "💰 MONEY";
      advice = "Send invoices. Close deals. Buy assets.";
      css = "wealth-card";
    } else if (
      dayTenGod.includes("Officer") ||
      dayTenGod.includes("Killings")
    ) {
      focus = "⚔️ EXECUTE";
      advice = "Clear your to-do list. Handle admin/legal.";
      css = "power-card";
    } else if (dayTenGod.includes("Eating") || dayTenGod.includes("Hurting")) {
      focus = "🎤 PITCH";
      advice = "Post content. Share ideas. Design.";
      css = "career-card";
    } else if (dayTenGod.includes("Resource")) {
      focus = "🧠 PLAN";
      advice = "Review goals. Learn. Rest & recharge.";
      css = "resource-card";
    } else {
      focus = "🤝 CONNECT";
      advice = "Team syncs. Networking. Sales calls.";
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

  return {
    archetype: getArchetype(dm, user.strength),
    monthly: generateMonthlyPlan(user),
    daily: generateDailyTactics(user),
  };
};
