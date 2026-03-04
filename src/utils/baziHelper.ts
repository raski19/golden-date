import {
  ELEMENT_ORDER,
  STEM_ELEMENTS,
  CLASH_PAIRS,
  STEM_MAP,
  HIDDEN_STEMS_WEIGHT,
  BRANCH_MAP,
  SELF_PUNISHMENT,
} from "./constants";
const { Solar } = require("lunar-javascript");

const getElementRelations = (dmElement: string) => {
  const idx = ELEMENT_ORDER.indexOf(dmElement);

  // 0 = Self (Companion)
  // 1 = Output (Self produces Output)
  // 2 = Wealth (Self controls Wealth)
  // 3 = Influence (Influence controls Self)
  // 4 = Resource (Resource produces Self)

  return {
    Companion: ELEMENT_ORDER[idx],
    Output: ELEMENT_ORDER[(idx + 1) % 5],
    Wealth: ELEMENT_ORDER[(idx + 2) % 5],
    Influence: ELEMENT_ORDER[(idx + 3) % 5],
    Resource: ELEMENT_ORDER[(idx + 4) % 5],
  };
};

// ==========================================
// 3. HELPER ALGORITHMS
// ==========================================

export const calculateDMStrength = (
  dmStem: string,
  monthBranch: string,
  allStems: string[], // [Year, Month, Hour]
  branches: { year: string; day: string; hour: string }
) => {
  const dmElement = STEM_ELEMENTS[dmStem];
  if (!dmElement)
    return { strength: "Unknown", score: 0, dmElement: "Unknown" };

  const rel = getElementRelations(dmElement);
  let score = 0;

  // --------------------------------------------------------
  // 1️⃣ SEASON / MONTH BRANCH (Max ~40)
  // We apply the hidden stem logic here too! A Dragon month is Earth,
  // but its hidden Water and Wood drastically change the season's feel.
  // --------------------------------------------------------
  const monthHiddenStems = HIDDEN_STEMS_WEIGHT[monthBranch] || [];

  monthHiddenStems.forEach(({ stem, weight }) => {
    const el = STEM_ELEMENTS[stem];
    const pct = weight / 100; // e.g., 60% = 0.6

    if (el === dmElement) score += 40 * pct;
    // Prosperous
    else if (el === rel.Resource) score += 30 * pct;
    // Supported
    else if (el === rel.Output) score -= 15 * pct;
    // Drained by output
    else if (el === rel.Wealth) score -= 15 * pct;
    // Drained by wealth
    else if (el === rel.Influence) score -= 20 * pct; // Attacked by power
  });

  // --------------------------------------------------------
  // 2️⃣ STEM SUPPORT (Year, Month, Hour) (Max ~24)
  // Stems are pure, so they don't have hidden elements.
  // --------------------------------------------------------
  allStems.forEach((stem) => {
    const el = STEM_ELEMENTS[stem];
    if (el === dmElement) score += 8;
    else if (el === rel.Resource) score += 8;
    else if (el === rel.Output) score -= 5;
    else if (el === rel.Wealth) score -= 5;
    else if (el === rel.Influence) score -= 7;
  });

  // --------------------------------------------------------
  // 3️⃣ BRANCH SUPPORT (Proximity Weighted + Hidden Stems)
  // --------------------------------------------------------
  const scoreBranch = (branch: string, weightMulti: number) => {
    if (!branch) return; // Safety check if Hour is missing

    const hiddenStems = HIDDEN_STEMS_WEIGHT[branch] || [];

    hiddenStems.forEach(({ stem, weight }) => {
      const el = STEM_ELEMENTS[stem];
      const pct = weight / 100;

      // Multiply the base score by the proximity weight AND the hidden stem percentage
      if (el === dmElement) score += 8 * weightMulti * pct;
      else if (el === rel.Resource) score += 8 * weightMulti * pct;
      else if (el === rel.Output) score -= 5 * weightMulti * pct;
      else if (el === rel.Wealth) score -= 5 * weightMulti * pct;
      else if (el === rel.Influence) score -= 6 * weightMulti * pct;
    });
  };

  // Day Branch sits directly under DM (Weight 1.5x)
  scoreBranch(branches.day, 1.5);
  // Year and Hour are further away (Weight 1x)
  scoreBranch(branches.year, 1.0);
  scoreBranch(branches.hour, 1.0);

  // --------------------------------------------------------
  // Normalize to 0–100
  // --------------------------------------------------------

  // Shift the base score so neutral sits around 50
  let finalScore = Math.round(50 + score);
  finalScore = Math.max(0, Math.min(100, finalScore));

  let strength: string;
  if (finalScore >= 80) strength = "Extremely Strong";
  else if (finalScore >= 60) strength = "Strong";
  else if (finalScore >= 40) strength = "Balanced";
  else if (finalScore >= 20) strength = "Weak";
  else strength = "Extremely Weak";

  return { strength, score: finalScore, dmElement };
};

const generateRules = (
  dmElement: string,
  strength: string,
  userDayBranch: string
) => {
  const rel = getElementRelations(dmElement);
  const isSelfPunishing = SELF_PUNISHMENT.includes(userDayBranch);

  const rules = {
    wealthElements: [] as string[],
    careerElements: [] as string[],
    healthElements: [] as string[],
    avoidElements: [] as string[],
    favorableBranches: [] as string[],
    badBranches: [] as string[],
    breaker: CLASH_PAIRS[userDayBranch] || "",
    selfPunishment: isSelfPunishing ? userDayBranch : "",
  };

  // ==========================================================
  // PROFESSIONAL BALANCING LOGIC
  // ==========================================================

  switch (strength) {
    case "Extremely Strong":
    case "Strong":
      rules.wealthElements = [rel.Wealth];
      rules.careerElements = [rel.Output, rel.Influence];
      rules.healthElements = [rel.Output]; // Output is the "medicine" (vents excess energy)
      rules.avoidElements = [rel.Resource, rel.Companion]; // Companions steal wealth here
      break;

    case "Balanced":
      rules.wealthElements = [rel.Wealth];
      rules.careerElements = [rel.Influence, rel.Output];
      rules.healthElements = [rel.Resource, rel.Companion];
      rules.avoidElements = []; // True balanced charts don't have strict taboos
      break;

    case "Weak":
    case "Extremely Weak":
      rules.wealthElements = [rel.Companion]; // Needs friends/partners to help carry the wealth
      rules.careerElements = [rel.Resource]; // Relies on knowledge/strategy rather than brute force
      rules.healthElements = [rel.Resource]; // Resource is the ultimate medicine/shield
      rules.avoidElements = [rel.Output, rel.Wealth, rel.Influence]; // CRITICAL: Must avoid Influence
      break;

    default:
      break;
  }

  return rules;
};

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export const calculateBaZiProfile = (
  name: string,
  birthDate: Date,
  gender: "male" | "female",
  hasTime: boolean = true
) => {
  // 1. Solar Conversion
  const solar = Solar.fromYmdHms(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    hasTime ? birthDate.getHours() : 12, // Default to noon if no time, just for safety
    hasTime ? birthDate.getMinutes() : 0,
    0
  );

  const lunar = solar.getLunar();
  const baZi = lunar.getEightChar();

  // 2. Pillars
  const yearStemCn = baZi.getYearGan();
  const yearBranchCn = baZi.getYearZhi();
  const monthStemCn = baZi.getMonthGan();
  const monthBranchCn = baZi.getMonthZhi();
  const dayStemCn = baZi.getDayGan();
  const dayBranchCn = baZi.getDayZhi();

  // Only grab the hour if they provided it
  const timeStemCn = hasTime ? baZi.getTimeGan() : "";
  const timeBranchCn = hasTime ? baZi.getTimeZhi() : "";

  // 3. Translation
  const dayMaster = STEM_MAP[dayStemCn] || dayStemCn;
  const dayBranch = BRANCH_MAP[dayBranchCn] || dayBranchCn;
  const monthStem = STEM_MAP[monthStemCn] || monthStemCn;
  const monthBranch = BRANCH_MAP[monthBranchCn] || monthBranchCn;
  const yearStem = STEM_MAP[yearStemCn] || yearStemCn;
  const yearBranch = BRANCH_MAP[yearBranchCn] || yearBranchCn;

  const hourStem = hasTime ? STEM_MAP[timeStemCn] || timeStemCn : undefined;
  const hourBranch = hasTime
    ? BRANCH_MAP[timeBranchCn] || timeBranchCn
    : undefined;

  // ... (Luck Pillar logic remains the same) ...
  const genderNum = gender === "male" ? 1 : 0;
  const yun = baZi.getYun(genderNum);
  const daYunArr = yun.getDaYun();
  let currentLuckBranchCn = "";
  const currentYear = new Date().getFullYear();

  for (const dy of daYunArr) {
    if (currentYear >= dy.getStartYear() && currentYear <= dy.getEndYear()) {
      currentLuckBranchCn = dy.getGanZhi().charAt(1);
      break;
    }
  }
  if (!currentLuckBranchCn && daYunArr.length > 0) {
    currentLuckBranchCn = daYunArr[0].getGanZhi().charAt(1);
  }
  const luckBranch = BRANCH_MAP[currentLuckBranchCn] || "Unknown";

  // 4. Calculate Strength (Excluding Hour if missing)
  const chartStems = [yearStem, monthStem];
  if (hourStem) chartStems.push(hourStem);

  const chartBranches = [yearBranch, dayBranch];
  if (hourBranch) chartBranches.push(hourBranch);

  // const analysis = calculateDMStrength(
  //   dayMaster,
  //   monthBranch,
  //   chartStems,
  //   chartBranches
  // );
  const analysis = calculateDMStrength(dayMaster, monthBranch, chartStems, {
    year: yearBranch,
    day: dayBranch,
    hour: hourBranch || "",
  });

  // 5. Generate Rules
  const rules = generateRules(
    analysis.dmElement,
    (analysis.strength || "Unknown") as "Strong" | "Weak" | "Unknown",
    dayBranch
  );

  return {
    name,
    gender,
    birthYear: birthDate.getFullYear(),
    dayMaster,
    dayBranch,
    monthStem,
    monthBranch,
    yearStem,
    yearBranch,
    hourStem,
    hourBranch,
    luckBranch,
    dayMasterElement: analysis.dmElement,
    strength: analysis.strength,
    strengthScore: analysis.score,
    rules,
  };
};
