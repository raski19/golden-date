import {
  ELEMENT_ORDER,
  STEM_ELEMENTS,
  BRANCH_ELEMENTS,
  CLASH_PAIRS,
  REVERSE_PRODUCTION_CYCLE,
  STEM_MAP,
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

const calculateDMStrength = (
  dmStem: string,
  monthBranch: string,
  allStems: string[], // Year, Month, Hour
  allBranches: string[], // Year, Day, Hour
) => {
  const dmElement = STEM_ELEMENTS[dmStem];
  if (!dmElement)
    return { strength: "Unknown", score: 0, dmElement: "Unknown" };

  const monthElement = BRANCH_ELEMENTS[monthBranch];
  const resourceElement = REVERSE_PRODUCTION_CYCLE[dmElement];

  let score = 0;

  // 1. CHECK SEASON (Month Branch) - Weight: 40%
  // Being born in your season is the biggest factor.
  if (monthElement === dmElement) {
    score += 40; // Prosperous (Same Season)
  } else if (monthElement === resourceElement) {
    score += 40; // Strong (Resource Season)
  }

  // 2. CHECK STEMS (Year, Month, Hour) - Weight: 10% each
  allStems.forEach((stem) => {
    const el = STEM_ELEMENTS[stem];
    if (el === dmElement) score += 10; // Friend / Rob Wealth
    if (el === resourceElement) score += 10; // Direct / Indirect Resource
  });

  // 3. CHECK BRANCHES (Year, Day, Hour) - Weight: 10% each
  allBranches.forEach((branch) => {
    const el = BRANCH_ELEMENTS[branch];
    if (el === dmElement) score += 10;
    if (el === resourceElement) score += 10;
  });

  // 4. VERDICT
  // > 50 means you have significant support (Season + 1 Support OR 5 Supports)
  const strength = score >= 50 ? "Strong" : "Weak";

  return { strength, score, dmElement };
};

const generateRules = (
  dmElement: string,
  strength: "Strong" | "Weak" | "Unknown",
  userDayBranch: string,
) => {
  const rel = getElementRelations(dmElement);

  // BaZi Self-Punishment Branches
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

  // --- LOGIC: BALANCING THE CHART ---
  if (strength === "Strong") {
    rules.wealthElements = [rel.Wealth];
    rules.careerElements = [rel.Influence, rel.Output];
    rules.healthElements = [rel.Wealth];
    rules.avoidElements = [rel.Resource, rel.Companion];
  } else {
    rules.wealthElements = [rel.Companion];
    rules.careerElements = [rel.Resource];
    rules.healthElements = [rel.Resource];
    rules.avoidElements = [rel.Output, rel.Wealth, rel.Influence]; // Updated to Influence
  }

  // --- POPULATE BRANCHES BASED ON ELEMENTS ---
  const allFavorableElements = [
    ...rules.wealthElements,
    ...rules.careerElements,
    ...rules.healthElements,
  ];

  Object.entries(BRANCH_ELEMENTS).forEach(([branch, element]) => {
    if (allFavorableElements.includes(element)) {
      rules.favorableBranches.push(branch);
    } else if (rules.avoidElements.includes(element)) {
      rules.badBranches.push(branch);
    }
  });

  return rules;
};

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export const calculateBaZiProfile = (
  name: string,
  birthDate: Date,
  gender: "male" | "female",
  hasTime: boolean = true,
) => {
  // 1. Solar Conversion
  const solar = Solar.fromYmdHms(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    hasTime ? birthDate.getHours() : 12, // Default to noon if no time, just for safety
    hasTime ? birthDate.getMinutes() : 0,
    0,
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

  const analysis = calculateDMStrength(
    dayMaster,
    monthBranch,
    chartStems,
    chartBranches,
  );

  // 5. Generate Rules
  const rules = generateRules(
    analysis.dmElement,
    (analysis.strength || "Unknown") as "Strong" | "Weak" | "Unknown",
    dayBranch,
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
