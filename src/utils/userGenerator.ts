import { IUser } from "../types";
import {
  BRANCHES_LIST,
  CLASH_PAIRS,
  CONSTELLATION_DATA,
  CONTROL_CYCLE,
  ELEMENT_MAP,
  PRODUCTION_CYCLE,
  REVERSE_CONTROL_CYCLE,
  REVERSE_PRODUCTION_CYCLE,
  SELF_PUNISHMENT,
} from "./constants";

// ==========================================
// CONSTANTS & DATA MAPS
// ==========================================

const STANDARD_FAVORABLE_STARS: string[] = [
  "Room",
  "Wall",
  "Mound",
  "Bow",
  "Carriage",
  "Stomach",
  "Star",
];
const STANDARD_AVOID_STARS: string[] = [
  "Pleiades",
  "Ox",
  "Willow",
  "Ghost",
  "Neck",
  "Wing",
  "Beak",
  "Danger",
  "Heart",
  "Void",
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getElement = (name: string): string => ELEMENT_MAP[name] || "Unknown";
const getOutput = (el: string): string => PRODUCTION_CYCLE[el]; // Product (Output)
const getResource = (el: string): string => REVERSE_PRODUCTION_CYCLE[el]; // Mother (Resource)
const getWealth = (el: string): string => CONTROL_CYCLE[el]; // Object Controlled (Wealth)
const getInfluence = (el: string): string => REVERSE_CONTROL_CYCLE[el]; // Controller (Influence)

// Get all branches that belong to a list of elements
function getBranchesForElements(
  elements: string[],
  dayMaster: string,
  isStrong: boolean,
  monthBranch: string,
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

    return true;
  });
}

// ==========================================
// 4. GENERATOR FUNCTION
// ==========================================

export function generateUserProfile(
  name: string,
  dayMaster: string, // e.g. "Bing"
  dayBranch: string, // e.g. "Horse"
  monthBranch: string, // e.g. "Snake" (Used to determine strength)
): IUser {
  const dmElement = getElement(dayMaster);
  const monthElement = getElement(monthBranch);

  // Determine Strength (Simplified Logic)
  // If Month is same element (Companion) or produces DM (Resource) -> STRONG
  const isStrong =
    monthElement === dmElement || monthElement === getResource(dmElement);
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
  const favorableBranches = getBranchesForElements(
    favorableElements,
    dayMaster,
    isStrong,
    monthBranch,
  );
  const badBranches = getBranchesForElements(
    avoidEl,
    dayMaster,
    isStrong,
    monthBranch,
  );

  // Construct Description
  const desc = isStrong
    ? `The Creator. Needs execution (${output}) and results (${wealth}).`
    : `The Strategist. Needs support (${resource}) and connection (${companion}).`;

  return {
    name: name,
    baZiProfile: profileName,
    dayMaster: dayMaster,
    baZiBranch: dayBranch,
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

// Example Usage
// name, dayMaster, dayBranch, monthBranch
const zoran = generateUserProfile("Zoran", "Bing", "Horse", "Horse");
console.log(JSON.stringify(zoran, null, 2));

/* Expected Output for Zoran (Strong Fire):
   - Wealth: Metal
   - Career: Earth (Output), Water (Influence)
   - Health: Water, Earth
   - Favorable Branches: Monkey, Rooster (Metal), Ox, Dragon (Wet Earth), Pig, Rat (Water)
   - Bad Branches: Snake, Horse (Fire), Tiger, Rabbit (Wood), Goat, Dog (Dry Earth - Filtered out)
*/
