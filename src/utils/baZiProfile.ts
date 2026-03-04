// ==========================================
// COMPREHENSIVE BAZI PROFILE INTERFACE
// ==========================================

export interface IBaZiProfile {
  // ========== BASIC PERSONAL INFO ==========
  name: string;
  birthDate: Date; // Full birth date with time (for accurate calculation)
  birthYear: number; // Birth year (1987, 1990, etc.)
  birthMonth: number; // Birth month (1-12)
  birthDay: number; // Birth day (1-31)
  birthHour: number; // Birth hour (0-23, for hour pillar)
  birthMinute: number; // Birth minute (for precise calculation)
  gender: "male" | "female";

  // ========== FOUR PILLARS (四柱) ==========
  pillars: {
    // Year Pillar (年柱) - Ancestral/Foundation
    year: {
      stem: string; // Year Heavenly Stem (天干)
      branch: string; // Year Earthly Branch (地支)
      element: string; // Derived element (Wood, Fire, etc.)
      hiddenStems: string[]; // Hidden stems in the branch
    };

    // Month Pillar (月柱) - Parents/Career
    month: {
      stem: string;
      branch: string;
      element: string;
      hiddenStems: string[];
      solarTerm: string; // Critical: Solar term for the month
    };

    // Day Pillar (日柱) - Self/Spouse
    day: {
      stem: string; // Day Master (日主) - Most important
      branch: string;
      element: string;
      hiddenStems: string[];
    };

    // Hour Pillar (时柱) - Children/Career Later Life
    hour: {
      stem: string;
      branch: string;
      element: string;
      hiddenStems: string[];
    };
  };

  // ========== DAY MASTER ANALYSIS ==========
  dayMaster: {
    stem: string; // e.g., "Bing"
    element: string; // e.g., "Fire"
    polarity: "yang" | "yin"; // e.g., Bing is Yang
    strength: "Strong" | "Weak" | "Balanced";
    strengthScore: number; // 0-100 score
    rootScore: number; // Rooting strength (0-100)
    seasonality: string; // Born in season (旺), opposite season (囚), etc.
  };

  // ========== TEN GODS (十神) MAPPING ==========
  tenGods: {
    // For each pillar stem relative to Day Master
    yearStemGod: string; // e.g., "Direct Officer", "Eating God"
    monthStemGod: string;
    dayBranchGod: string; // From day branch hidden stems
    hourStemGod: string;

    // Summary
    usefulGods: string[]; // Favorable Ten Gods for this Day Master
    harmfulGods: string[]; // Unfavorable Ten Gods
  };

  // ========== LUCK PILLARS (大运) ==========
  luckPillars: Array<{
    startAge: number; // Age when this pillar starts
    endAge: number; // Age when it ends
    stem: string; // Luck Heavenly Stem
    branch: string; // Luck Earthly Branch
    element: string; // Combined element influence
    current: boolean; // Is this the current luck pillar?
  }>;

  // ========== ELEMENTAL BALANCE ==========
  elements: {
    woodCount: number; // Number of Wood elements in pillars
    fireCount: number;
    earthCount: number;
    metalCount: number;
    waterCount: number;

    // Deficiency/Excess analysis
    deficientElements: string[]; // Elements lacking
    excessElements: string[]; // Elements too strong
    balancedElements: string[]; // Elements in harmony
  };

  // ========== FAVORABLE/UNFAVORABLE ==========
  favorable: {
    elements: string[]; // Favorable elements based on strength
    stems: string[]; // Favorable Heavenly Stems
    branches: string[]; // Favorable Earthly Branches
    tenGods: string[]; // Favorable Ten God types

    // Specific categories
    wealthElements: string[];
    careerElements: string[];
    healthElements: string[];
    relationshipElements: string[];
  };

  unfavorable: {
    elements: string[];
    stems: string[];
    branches: string[];
    tenGods: string[];

    clashBranches: string[]; // Branches that clash with pillars
    punishmentBranches: string[]; // Punishment relationships
    harmBranches: string[]; // Harm relationships
  };

  // ========== SPECIAL PATTERNS ==========
  patterns: {
    combinations: string[]; // e.g., "Dragon-Tiger Clash", "Rat-Ox Union"
    specialStars: string[]; // e.g., "Peach Blossom", "Academic Star"
    formations: string[]; // e.g., "Three Harmony", "Half Combination"

    // Key patterns
    hasWealthPattern: boolean;
    hasCareerPattern: boolean;
    hasRelationshipPattern: boolean;
    hasHealthPattern: boolean;
  };

  // ========== SCORING & ANALYSIS ==========
  scoring: {
    overallScore: number; // 0-100 overall favorable score
    careerScore: number; // Career potential (0-100)
    wealthScore: number; // Wealth potential (0-100)
    healthScore: number; // Health indication (0-100)
    relationshipScore: number; // Relationships (0-100)

    // Period scoring
    currentLuckScore: number; // Current 10-year luck score
    year2024Score: number; // Specific year score
    monthScore: number; // Current month score

    // Problem areas
    warningAreas: string[]; // e.g., ["Health: Weak Water", "Career: Clash detected"]
    opportunityAreas: string[]; // e.g., ["Wealth: Strong Metal support"]
  };

  // ========== DATE SELECTION PARAMS ==========
  dateSelection: {
    // For day scoring algorithm
    usefulGods: string[]; // Gods to seek in dates
    avoidGods: string[]; // Gods to avoid in dates

    // Element preferences
    seekElements: string[]; // Elements to strengthen
    avoidElements: string[]; // Elements to weaken

    // Branch preferences
    favorableBranches: string[]; // Branches that support
    clashBranches: string[]; // Branches that clash
  };

  rootAnalysis: {
    hasDirectRoot: boolean;
    hasSameElementRoot: boolean;
    hasResourceRoot: boolean;
    hasControlRoot: boolean;
    rootPillars: string[]; // Which pillars provide root
  };

  seasonAnalysis: {
    season: "Spring" | "Summer" | "Autumn" | "Winter";
    bornInGrowthSeason: boolean;
    bornInRestingSeason: boolean;
  };

  clashAnalysis: {
    pillarClashes: Array<{
      type: "Six Clash" | "Punishment" | "Harm";
      pillars: string[]; // Which pillars clash
      severity: "High" | "Medium" | "Low";
    }>;

    combinations: Array<{
      type: "Six Harmony" | "Three Harmony" | "Half Combination";
      pillars: string[];
      effect: "Positive" | "Negative";
    }>;
  };
}

// ==========================================
// CONSTANTS & DATA TABLES
// ==========================================

const STEMS = [
  "Jia",
  "Yi",
  "Bing",
  "Ding",
  "Wu",
  "Ji",
  "Geng",
  "Xin",
  "Ren",
  "Gui",
];
const BRANCHES = [
  "Rat",
  "Ox",
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
];

const STEM_ELEMENTS: Record<string, string> = {
  Jia: "Wood",
  Yi: "Wood",
  Bing: "Fire",
  Ding: "Fire",
  Wu: "Earth",
  Ji: "Earth",
  Geng: "Metal",
  Xin: "Metal",
  Ren: "Water",
  Gui: "Water",
};

const BRANCH_ELEMENTS: Record<string, string> = {
  Rat: "Water",
  Ox: "Earth",
  Tiger: "Wood",
  Rabbit: "Wood",
  Dragon: "Earth",
  Snake: "Fire",
  Horse: "Fire",
  Goat: "Earth",
  Monkey: "Metal",
  Rooster: "Metal",
  Dog: "Earth",
  Pig: "Water",
};

const STEM_POLARITY: Record<string, "yang" | "yin"> = {
  Jia: "yang",
  Yi: "yin",
  Bing: "yang",
  Ding: "yin",
  Wu: "yang",
  Ji: "yin",
  Geng: "yang",
  Xin: "yin",
  Ren: "yang",
  Gui: "yin",
};

const HIDDEN_STEMS: Record<string, string[]> = {
  Rat: ["Gui"],
  Ox: ["Ji", "Gui", "Xin"],
  Tiger: ["Jia", "Bing", "Wu"],
  Rabbit: ["Yi"],
  Dragon: ["Wu", "Yi", "Gui"],
  Snake: ["Bing", "Geng", "Wu"],
  Horse: ["Ding", "Ji"],
  Goat: ["Ji", "Yi", "Ding"],
  Monkey: ["Geng", "Ren", "Wu"],
  Rooster: ["Xin"],
  Dog: ["Wu", "Xin", "Ding"],
  Pig: ["Ren", "Jia"],
};

const SOLAR_TERMS = [
  { name: "立春", date: "02-04", branch: "Tiger" },
  { name: "雨水", date: "02-19", branch: "Tiger" },
  { name: "惊蛰", date: "03-06", branch: "Rabbit" },
  { name: "春分", date: "03-21", branch: "Rabbit" },
  { name: "清明", date: "04-05", branch: "Dragon" },
  { name: "谷雨", date: "04-20", branch: "Dragon" },
  { name: "立夏", date: "05-06", branch: "Snake" },
  { name: "小满", date: "05-21", branch: "Snake" },
  { name: "芒种", date: "06-06", branch: "Horse" },
  { name: "夏至", date: "06-21", branch: "Horse" },
  { name: "小暑", date: "07-07", branch: "Goat" },
  { name: "大暑", date: "07-23", branch: "Goat" },
  { name: "立秋", date: "08-08", branch: "Monkey" },
  { name: "处暑", date: "08-23", branch: "Monkey" },
  { name: "白露", date: "09-08", branch: "Rooster" },
  { name: "秋分", date: "09-23", branch: "Rooster" },
  { name: "寒露", date: "10-08", branch: "Dog" },
  { name: "霜降", date: "10-23", branch: "Dog" },
  { name: "立冬", date: "11-07", branch: "Pig" },
  { name: "小雪", date: "11-22", branch: "Pig" },
  { name: "大雪", date: "12-07", branch: "Rat" },
  { name: "冬至", date: "12-22", branch: "Rat" },
  { name: "小寒", date: "01-06", branch: "Ox" },
  { name: "大寒", date: "01-20", branch: "Ox" },
];

const CLASH_PAIRS: Record<string, string> = {
  Rat: "Horse",
  Horse: "Rat",
  Ox: "Goat",
  Goat: "Ox",
  Tiger: "Monkey",
  Monkey: "Tiger",
  Rabbit: "Rooster",
  Rooster: "Rabbit",
  Dragon: "Dog",
  Dog: "Dragon",
  Snake: "Pig",
  Pig: "Snake",
};

const THREE_HARMONIES = [
  ["Monkey", "Rat", "Dragon"],
  ["Snake", "Rooster", "Ox"],
  ["Tiger", "Horse", "Dog"],
  ["Pig", "Rabbit", "Goat"],
];

// ==========================================
// MAIN CALCULATION FUNCTIONS
// ==========================================

function getElement(name: string): string {
  return STEM_ELEMENTS[name] || BRANCH_ELEMENTS[name] || "Unknown";
}

function calculatePillarIndices(
  year: number,
  month: number,
  day: number,
  hour: number,
) {
  // Year pillar calculation (simplified - uses fixed start of 1984 as Jia Zi)
  const baseYear = 1984;
  const yearCycle = (year - baseYear) % 60;
  const yearStemIndex = yearCycle % 10;
  const yearBranchIndex = yearCycle % 12;

  // Month pillar calculation (requires solar term - simplified)
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 1) % 12; // Simplified

  // Day pillar calculation (simplified - in reality uses complex formula)
  const dayIndex = Math.floor((year * 12 + month + day) % 60);
  const dayStemIndex = dayIndex % 10;
  const dayBranchIndex = dayIndex % 12;

  // Hour pillar calculation
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;

  return {
    year: { stemIndex: yearStemIndex, branchIndex: yearBranchIndex },
    month: { stemIndex: monthStemIndex, branchIndex: monthBranchIndex },
    day: { stemIndex: dayStemIndex, branchIndex: dayBranchIndex },
    hour: { stemIndex: hourStemIndex, branchIndex: hourBranchIndex },
  };
}

function calculateLuckPillars(
  yearStem: string,
  monthBranch: string,
  gender: "male" | "female",
  birthDate: Date,
): Array<{
  startAge: number;
  endAge: number;
  stem: string;
  branch: string;
  element: string;
  current: boolean;
}> {
  const isYangYear = STEM_POLARITY[yearStem] === "yang";
  const forward =
    (gender === "male" && isYangYear) || (gender === "female" && !isYangYear);

  const startIndex = BRANCHES.indexOf(monthBranch);
  const luckPillars = [];

  for (let i = 0; i < 8; i++) {
    // 8 pillars = 80 years
    const branchIndex = forward
      ? (startIndex + i + 1) % 12
      : (startIndex - i - 1 + 12) % 12;

    // Calculate stem based on year stem and direction
    const stemIndex = (STEMS.indexOf(yearStem) + (forward ? i : -i) + 12) % 10;

    luckPillars.push({
      startAge: i * 10,
      endAge: (i + 1) * 10,
      stem: STEMS[stemIndex],
      branch: BRANCHES[branchIndex],
      element: getElement(STEMS[stemIndex]),
      current: i === 0, // First one is current for simplicity
    });
  }

  return luckPillars;
}

function calculateTenGods(dayStem: string, pillars: any) {
  const dayElement = getElement(dayStem);
  const dayPolarity = STEM_POLARITY[dayStem];

  const getTenGod = (stem: string): string => {
    const element = getElement(stem);
    const polarity = STEM_POLARITY[stem];

    if (element === dayElement) {
      return polarity === dayPolarity ? "Rob Wealth" : "Friend";
    }

    // Production cycle relationships (simplified)
    if (
      (dayElement === "Wood" && element === "Water") ||
      (dayElement === "Fire" && element === "Wood") ||
      (dayElement === "Earth" && element === "Fire") ||
      (dayElement === "Metal" && element === "Earth") ||
      (dayElement === "Water" && element === "Metal")
    ) {
      return "Resource";
    }

    if (
      (dayElement === "Wood" && element === "Fire") ||
      (dayElement === "Fire" && element === "Earth") ||
      (dayElement === "Earth" && element === "Metal") ||
      (dayElement === "Metal" && element === "Water") ||
      (dayElement === "Water" && element === "Wood")
    ) {
      return "Output";
    }

    if (
      (dayElement === "Wood" && element === "Metal") ||
      (dayElement === "Fire" && element === "Water") ||
      (dayElement === "Earth" && element === "Wood") ||
      (dayElement === "Metal" && element === "Fire") ||
      (dayElement === "Water" && element === "Earth")
    ) {
      return "Influence";
    }

    return "Wealth";
  };

  return {
    yearStemGod: getTenGod(pillars.year.stem),
    monthStemGod: getTenGod(pillars.month.stem),
    dayBranchGod: getTenGod(HIDDEN_STEMS[pillars.day.branch][0]),
    hourStemGod: getTenGod(pillars.hour.stem),
    usefulGods: ["Resource", "Wealth"], // Simplified
    harmfulGods: ["Influence", "Rob Wealth"],
  };
}

function analyzeDayMasterStrength(pillars: any, dayStem: string) {
  const dayElement = getElement(dayStem);
  let supportCount = 0;
  let rootScore = 0;

  // Check all pillars for support
  const allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour];
  allPillars.forEach((pillar) => {
    // Direct root check
    if (pillar.hiddenStems.includes(dayStem)) rootScore += 25;

    // Element support check
    if (pillar.element === dayElement) supportCount++;
    if (
      pillar.hiddenStems.some((stem: string) => getElement(stem) === dayElement)
    )
      supportCount++;
  });

  const strengthScore = Math.min(100, supportCount * 25);
  const isStrong = supportCount >= 2;

  return {
    stem: dayStem,
    element: dayElement,
    polarity: STEM_POLARITY[dayStem],
    strength: isStrong ? "Strong" : "Weak",
    strengthScore,
    rootScore,
    seasonality: getSeasonality(pillars.month.branch, dayElement),
  };
}

function getSeasonality(monthBranch: string, dayElement: string): string {
  const monthElement = BRANCH_ELEMENTS[monthBranch];

  // Simplified seasonality logic
  if (monthElement === dayElement) return "Prosperous";
  if (
    (dayElement === "Wood" && monthElement === "Fire") ||
    (dayElement === "Fire" && monthElement === "Earth") ||
    (dayElement === "Earth" && monthElement === "Metal") ||
    (dayElement === "Metal" && monthElement === "Water") ||
    (dayElement === "Water" && monthElement === "Wood")
  ) {
    return "Growth";
  }

  return "Resting";
}

// ==========================================
// MAIN GENERATOR FUNCTION
// ==========================================

export function generateBaZiProfile(
  name: string,
  birthDateTime: Date,
  gender: "male" | "female",
): IBaZiProfile {
  const year = birthDateTime.getFullYear();
  const month = birthDateTime.getMonth() + 1;
  const day = birthDateTime.getDate();
  const hour = birthDateTime.getHours();
  const minute = birthDateTime.getMinutes();

  // 1. Calculate pillar indices
  const indices = calculatePillarIndices(year, month, day, hour);

  // 2. Create pillar objects
  const pillars = {
    year: {
      stem: STEMS[indices.year.stemIndex],
      branch: BRANCHES[indices.year.branchIndex],
      element: getElement(STEMS[indices.year.stemIndex]),
      hiddenStems: HIDDEN_STEMS[BRANCHES[indices.year.branchIndex]] || [],
    },
    month: {
      stem: STEMS[indices.month.stemIndex],
      branch: BRANCHES[indices.month.branchIndex],
      element: getElement(STEMS[indices.month.stemIndex]),
      hiddenStems: HIDDEN_STEMS[BRANCHES[indices.month.branchIndex]] || [],
      solarTerm: "立春", // Simplified - should calculate actual solar term
    },
    day: {
      stem: STEMS[indices.day.stemIndex],
      branch: BRANCHES[indices.day.branchIndex],
      element: getElement(STEMS[indices.day.stemIndex]),
      hiddenStems: HIDDEN_STEMS[BRANCHES[indices.day.branchIndex]] || [],
    },
    hour: {
      stem: STEMS[indices.hour.stemIndex],
      branch: BRANCHES[indices.hour.branchIndex],
      element: getElement(STEMS[indices.hour.stemIndex]),
      hiddenStems: HIDDEN_STEMS[BRANCHES[indices.hour.branchIndex]] || [],
    },
  };

  // 3. Calculate Day Master analysis
  const dayMaster = analyzeDayMasterStrength(pillars, pillars.day.stem);

  // 4. Calculate Ten Gods
  const tenGods = calculateTenGods(pillars.day.stem, pillars);

  // 5. Calculate Luck Pillars
  const luckPillars = calculateLuckPillars(
    pillars.year.stem,
    pillars.month.branch,
    gender,
    birthDateTime,
  );

  // 6. Analyze elements
  const allElements = [
    pillars.year.element,
    pillars.month.element,
    pillars.day.element,
    pillars.hour.element,
  ];

  const elementCounts = {
    woodCount: allElements.filter((e) => e === "Wood").length,
    fireCount: allElements.filter((e) => e === "Fire").length,
    earthCount: allElements.filter((e) => e === "Earth").length,
    metalCount: allElements.filter((e) => e === "Metal").length,
    waterCount: allElements.filter((e) => e === "Water").length,
  };

  // 7. Calculate favorable/unfavorable
  const favorableElements =
    dayMaster.strength === "Strong"
      ? ["Metal", "Earth", "Water"] // Simplified for Strong Fire
      : ["Wood", "Fire"];

  const unfavorableElements =
    dayMaster.strength === "Strong"
      ? ["Wood", "Fire"]
      : ["Metal", "Earth", "Water"];

  // 8. Calculate patterns
  const patterns = {
    combinations: [],
    specialStars: [],
    formations: [],
    hasWealthPattern: favorableElements.includes("Metal"),
    hasCareerPattern: favorableElements.includes("Earth"),
    hasRelationshipPattern: false,
    hasHealthPattern: favorableElements.includes("Water"),
  };

  // 9. Calculate scores
  const scoring = {
    overallScore: dayMaster.strengthScore,
    careerScore: Math.floor(dayMaster.strengthScore * 0.8),
    wealthScore: Math.floor(dayMaster.strengthScore * 0.7),
    healthScore: Math.floor(dayMaster.strengthScore * 0.9),
    relationshipScore: Math.floor(dayMaster.strengthScore * 0.6),
    currentLuckScore: 70,
    year2024Score: 65,
    monthScore: 60,
    warningAreas:
      dayMaster.strength === "Weak" ? ["Weak Day Master needs support"] : [],
    opportunityAreas:
      dayMaster.strength === "Strong" ? ["Strong foundation for action"] : [],
  };

  // 10. Date selection parameters
  const dateSelection = {
    usefulGods: tenGods.usefulGods,
    avoidGods: tenGods.harmfulGods,
    seekElements: favorableElements,
    avoidElements: unfavorableElements,
    favorableBranches: [],
    clashBranches: [CLASH_PAIRS[pillars.day.branch]].filter(Boolean),
  };

  // Return complete profile
  return {
    name,
    birthDate: birthDateTime,
    birthYear: year,
    birthMonth: month,
    birthDay: day,
    birthHour: hour,
    birthMinute: minute,
    gender,
    pillars,
    dayMaster,
    tenGods,
    luckPillars,
    elements: {
      ...elementCounts,
      deficientElements: [],
      excessElements: [],
      balancedElements: [],
    },
    favorable: {
      elements: favorableElements,
      stems: [],
      branches: [],
      tenGods: tenGods.usefulGods,
      wealthElements: favorableElements.includes("Metal") ? ["Metal"] : [],
      careerElements: favorableElements.includes("Earth") ? ["Earth"] : [],
      healthElements: favorableElements.includes("Water") ? ["Water"] : [],
      relationshipElements: [],
    },
    unfavorable: {
      elements: unfavorableElements,
      stems: [],
      branches: [],
      tenGods: tenGods.harmfulGods,
      clashBranches: [CLASH_PAIRS[pillars.day.branch]].filter(Boolean),
      punishmentBranches: [],
      harmBranches: [],
    },
    patterns,
    scoring,
    dateSelection,
  };
}

// ==========================================
// EXAMPLE USAGE
// ==========================================

// Example 1: Zoran
const zoranProfile = generateBaZiProfile(
  "Zoran",
  new Date(1987, 4, 15, 14, 30), // May 15, 1987, 2:30 PM
  "male",
);

console.log("=== ZORAN'S BAZI PROFILE ===");
console.log(`Name: ${zoranProfile.name}`);
console.log(`Birth: ${zoranProfile.birthDate.toDateString()}`);
console.log(`Gender: ${zoranProfile.gender}`);
console.log("\n--- FOUR PILLARS ---");
console.log(
  `Year: ${zoranProfile.pillars.year.stem} ${zoranProfile.pillars.year.branch} (${zoranProfile.pillars.year.element})`,
);
console.log(
  `Month: ${zoranProfile.pillars.month.stem} ${zoranProfile.pillars.month.branch} (${zoranProfile.pillars.month.element})`,
);
console.log(
  `Day: ${zoranProfile.pillars.day.stem} ${zoranProfile.pillars.day.branch} (${zoranProfile.pillars.day.element}) - DAY MASTER`,
);
console.log(
  `Hour: ${zoranProfile.pillars.hour.stem} ${zoranProfile.pillars.hour.branch} (${zoranProfile.pillars.hour.element})`,
);
console.log("\n--- DAY MASTER ANALYSIS ---");
console.log(
  `Day Master: ${zoranProfile.dayMaster.stem} ${zoranProfile.dayMaster.element}`,
);
console.log(
  `Strength: ${zoranProfile.dayMaster.strength} (${zoranProfile.dayMaster.strengthScore}/100)`,
);
console.log(`Root Score: ${zoranProfile.dayMaster.rootScore}/100`);
console.log(`Seasonality: ${zoranProfile.dayMaster.seasonality}`);
console.log("\n--- TEN GODS ---");
console.log(`Year Stem: ${zoranProfile.tenGods.yearStemGod}`);
console.log(`Month Stem: ${zoranProfile.tenGods.monthStemGod}`);
console.log(`Day Branch: ${zoranProfile.tenGods.dayBranchGod}`);
console.log(`Hour Stem: ${zoranProfile.tenGods.hourStemGod}`);
console.log(`Useful Gods: ${zoranProfile.tenGods.usefulGods.join(", ")}`);
console.log("\n--- LUCK PILLARS (First 3) ---");
zoranProfile.luckPillars.slice(0, 3).forEach((pillar, i) => {
  console.log(
    `${pillar.startAge}-${pillar.endAge}: ${pillar.stem} ${pillar.branch} (${pillar.element}) ${pillar.current ? "← CURRENT" : ""}`,
  );
});
console.log("\n--- ELEMENT BALANCE ---");
console.log(
  `Wood: ${zoranProfile.elements.woodCount}, Fire: ${zoranProfile.elements.fireCount}, Earth: ${zoranProfile.elements.earthCount}`,
);
console.log(
  `Metal: ${zoranProfile.elements.metalCount}, Water: ${zoranProfile.elements.waterCount}`,
);
console.log("\n--- FAVORABLE ELEMENTS ---");
console.log(`Seek: ${zoranProfile.favorable.elements.join(", ")}`);
console.log(`Avoid: ${zoranProfile.unfavorable.elements.join(", ")}`);
console.log("\n--- SCORES ---");
console.log(`Overall: ${zoranProfile.scoring.overallScore}/100`);
console.log(`Career: ${zoranProfile.scoring.careerScore}/100`);
console.log(`Wealth: ${zoranProfile.scoring.wealthScore}/100`);
console.log(`Health: ${zoranProfile.scoring.healthScore}/100`);
console.log("\n--- DATE SELECTION PARAMS ---");
console.log(`Useful Gods: ${zoranProfile.dateSelection.usefulGods.join(", ")}`);
console.log(`Avoid Gods: ${zoranProfile.dateSelection.avoidGods.join(", ")}`);
console.log(
  `Clash with: ${zoranProfile.dateSelection.clashBranches.join(", ")}`,
);

// Example 2: Natalija
const natalijaProfile = generateBaZiProfile(
  "Natalija",
  new Date(1990, 7, 25, 8, 15), // August 25, 1990, 8:15 AM
  "female",
);

console.log("\n\n=== NATALIJA'S BAZI PROFILE ===");
console.log(
  `Day Master: ${natalijaProfile.pillars.day.stem} ${natalijaProfile.pillars.day.element}`,
);
console.log(`Strength: ${natalijaProfile.dayMaster.strength}`);
console.log(`Useful Gods: ${natalijaProfile.tenGods.usefulGods.join(", ")}`);

// Example 3: Miroslav
const miroslavProfile = generateBaZiProfile(
  "Miroslav",
  new Date(1985, 2, 10, 22, 45), // March 10, 1985, 10:45 PM
  "male",
);

console.log("\n\n=== MIROSLAV'S BAZI PROFILE ===");
console.log(
  `Day Master: ${miroslavProfile.pillars.day.stem} ${miroslavProfile.pillars.day.element}`,
);
console.log(`Strength: ${miroslavProfile.dayMaster.strength}`);
console.log(
  `Favorable Elements: ${miroslavProfile.favorable.elements.join(", ")}`,
);
