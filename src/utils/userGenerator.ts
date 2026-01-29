import { IUser } from "../types";
import {
  BRANCHES_LIST,
  CLASH_PAIRS,
  CONTROL_CYCLE,
  ELEMENT_MAP,
  PRODUCTION_CYCLE,
  REVERSE_CONTROL_CYCLE,
  REVERSE_PRODUCTION_CYCLE,
  SELF_PUNISHMENT,
} from "./constants";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getElement = (name: string): string => ELEMENT_MAP[name] || "Unknown";
const getOutput = (el: string): string => PRODUCTION_CYCLE[el]; // Product (Output)
const getResource = (el: string): string => REVERSE_PRODUCTION_CYCLE[el]; // Mother (Resource)
const getWealth = (el: string): string => CONTROL_CYCLE[el]; // Object Controlled (Wealth)
const getInfluence = (el: string): string => REVERSE_CONTROL_CYCLE[el]; // Controller (Influence)

// Check if a branch supports the Day Master (Same element or produces it)
function branchSupportsDayMaster(
  branch: string,
  dayMaster: string,
  dayMasterElement: string,
): boolean {
  const branchElement = getElement(branch);
  return (
    branchElement === dayMasterElement ||
    branchElement === getResource(dayMasterElement)
  );
}

// Get all branches that belong to a list of elements
function getBranchesForElements(
  elements: string[],
  dayMaster: string,
  isStrong: boolean,
  monthBranch: string,
  existingBranches: string[] = [],
): string[] {
  // Define Seasonality
  const isWinterBorn = ["Pig", "Rat", "Ox"].includes(monthBranch);

  const allBranches = Object.keys(ELEMENT_MAP).filter((k) =>
    BRANCHES_LIST.includes(k),
  );

  return allBranches.filter((branch) => {
    const branchEl = getElement(branch);
    if (!elements.includes(branchEl)) return false;

    // --- 🛡️ SPECIAL LOGIC FILTERS 🛡️ ---

    // --- SPECIAL FIRE LOGIC (Strong Fire vs Earth) ---
    // If Day Master is Strong Fire, they dislike Dry Earth (Goat, Dog)
    // even though Earth (Output) is generally favorable.
    if (dayMaster === "Bing" || dayMaster === "Ding") {
      if (isStrong && (branch === "Goat" || branch === "Dog")) return false;
    }

    // --- SPECIAL XIN LOGIC (Buried Gold) ---
    // Strong Xin Metal dislikes Thick Earth (Dog, Dragon)
    // because it "buries" the metal.
    if (dayMaster === "Xin" && isStrong) {
      if (branch === "Dog" || branch === "Dragon") return false;
    }

    // --- SPECIAL GUI LOGIC (Blocked Flow) ---
    // Gui Water fears strong Yang Earth (Dog, Dragon).
    // Even if Earth is the Influence star (Career), these branches block the flow.
    if (dayMaster === "Gui") {
      if (branch === "Dog" || branch === "Dragon") return false;
    }

    // --- SPECIAL WINTER WOOD LOGIC (Hypothermia) ---
    // If born in Winter (Month = Pig/Rat/Ox), Wood cannot grow.
    // Filter OUT Water branches even if they are "Resource" (Good).
    if ((dayMaster === "Jia" || dayMaster === "Yi") && isWinterBorn) {
      if (branch === "Rat" || branch === "Pig") return false;
    }

    // --- SPECIAL WU EARTH LOGIC (Barren Mountain) ---
    // Strong Wu Earth dislikes more Dry Earth.
    if (dayMaster === "Wu" && isStrong) {
      if (branch === "Dog" || branch === "Goat") return false;
    }

    // --- CLASH CHECKING (All Pillars) ---
    for (const userBranch of existingBranches) {
      const clashPair = CLASH_PAIRS[userBranch];
      if (clashPair && clashPair.includes(branch)) {
        return false; // This branch is unfavorable due to clash
      }
    }

    return true;
  });
}

// ==========================================
// 4. GENERATOR FUNCTION (UPDATED WITH YEAR BRANCH)
// ==========================================

export function generateUserProfile(
  name: string,
  dayMaster: string, // e.g. "Bing"
  dayBranch: string, // e.g. "Horse"
  monthBranch: string, // e.g. "Snake"
  yearBranch: string, // e.g. "Rabbit"
): IUser {
  // Get elements
  const dmElement = getElement(dayMaster);
  const monthElement = getElement(monthBranch);
  const yearElement = getElement(yearBranch);
  const dayBranchElement = getElement(dayBranch);

  // ==========================================
  // ENHANCED STRENGTH CALCULATION (Year + Month + Day)
  // ==========================================
  // Count how many pillars support the Day Master
  let supportCount = 0;
  const totalPillars = 3; // Year, Month, Day (we don't have hour)

  // Check Year pillar support
  if (yearElement === dmElement || yearElement === getResource(dmElement)) {
    supportCount++;
  }

  // Check Month pillar support
  if (monthElement === dmElement || monthElement === getResource(dmElement)) {
    supportCount++;
  }

  // Check Day Branch support (different from Day Master!)
  if (
    dayBranchElement === dmElement ||
    dayBranchElement === getResource(dmElement)
  ) {
    supportCount++;
  }

  // Determine strength: Strong if majority of pillars support
  // You can adjust this threshold as needed
  const isStrong = supportCount >= Math.ceil(totalPillars / 2); // At least 2 out of 3

  const profileName = `${isStrong ? "Strong" : "Weak"} ${dayMaster} ${dmElement}`;

  // Calculate Favorable Elements
  let wealthEl: string[],
    careerEl: string[],
    healthEl: string[],
    avoidEl: string[];

  // Define logic variables
  const output = getOutput(dmElement);
  const wealth = getWealth(dmElement);
  const influence = getInfluence(dmElement);
  const resource = getResource(dmElement);
  const companion = dmElement;

  if (isStrong) {
    // === STRONG CHART ===
    // Needs to Release (Output), Control (Wealth), or be Disciplined (Influence).
    // Avoids Resource (Too much strength) and Companion (Rivalry).

    wealthEl = [wealth]; // e.g. Fire controls Metal

    // Career uses Output (Action) and Influence (Status)
    careerEl = [output, influence];

    // Health usually needs Balance (Influence controls the excess) or Output (venting)
    healthEl = [influence, output];

    avoidEl = [resource, companion];
  } else {
    // === WEAK CHART ===
    // Needs Support (Resource) and Friends (Companion).
    // Avoids draining energy via Output, Wealth, or Influence.

    // For Weak charts, Wealth is found through Resource (support to hold wealth)
    wealthEl = [resource, companion];

    // Career is built on networking (Companion) and planning (Resource)
    careerEl = [resource, companion];

    // Health needs strength
    healthEl = [resource];

    avoidEl = [output, wealth, influence];
  }

  // Map Elements to Branches
  const favorableElements = [
    ...new Set([...wealthEl, ...careerEl, ...healthEl]),
  ];

  // Include ALL branches for clash checking
  const allUserBranches = [yearBranch, monthBranch, dayBranch];

  const favorableBranches = getBranchesForElements(
    favorableElements,
    dayMaster,
    isStrong,
    monthBranch,
    allUserBranches, // Pass all branches for clash checking
  );

  const badBranches = getBranchesForElements(
    avoidEl,
    dayMaster,
    isStrong,
    monthBranch,
    allUserBranches, // Also check clashes for bad branches
  );

  // Construct Description with strength details
  const supportDescription = `${supportCount}/${totalPillars} pillars support`;
  const desc = isStrong
    ? `The Creator (${supportDescription}). Needs execution (${output}) and results (${wealth}).`
    : `The Strategist (${supportDescription}). Needs support (${resource}) and connection (${companion}).`;

  return {
    name: name,
    baZiProfile: profileName,
    dayMaster: dayMaster,
    baZiBranch: dayBranch,
    monthBranch: monthBranch,
    yearBranch: yearBranch,
    description: desc,
    rules: {
      breaker: CLASH_PAIRS[dayBranch] || "Unknown",
      selfPunishment: SELF_PUNISHMENT.includes(dayBranch) ? dayBranch : "",

      wealthElements: wealthEl,
      careerElements: careerEl,
      healthElements: healthEl,
      avoidElements: avoidEl,

      badBranches: badBranches,
      favorableBranches: favorableBranches,
    },
  };
}

// ==========================================
// 5. EXAMPLE USAGE
// ==========================================

// Example Usage with all four parameters
// prettier-ignore
const user1 = generateUserProfile("Zoran", "Bing", "Horse", "Horse", "Rabbit");
// prettier-ignore
const user2 = generateUserProfile("Natalija", "Bing", "Monkey", "Dragon", "Rabbit");
// prettier-ignore
const user3 = generateUserProfile("Miroslav", "Xin", "Rooster", "Snake", "Dragon");

console.log(JSON.stringify(user1, null, 2));
console.log(JSON.stringify(user2, null, 2));
console.log(JSON.stringify(user3, null, 2));
