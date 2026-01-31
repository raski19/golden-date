import { IUser } from "../types";
import {
  STEM_NOBLEMAN,
  TRAVELING_HORSE,
  PEACH_BLOSSOM,
  ACADEMIC_STAR,
  ROBBING_SHA,
  DEATH_GOD,
  SOLITARY_STAR,
  STEMS_LIST,
  BRANCHES_LIST,
  YELLOW_BLACK_BELT,
  CLASH_PAIRS,
  COMBO_PAIRS,
} from "./constants";

export interface ShenShaResult {
  nobleman: boolean;
  travelingHorse: boolean;
  peachBlossom: boolean;
  academic: boolean;
  robbingShaDay: boolean;
  robbingShaYear: boolean;
  deathGod: boolean;
  solitaryStar: boolean;
}

// 2. MAIN FUNCTION
export const calculateShenSha = (
  user: IUser,
  dayBranch: string,
): ShenShaResult => {
  const dm = user.dayMaster;
  const yearBranch = user.yearBranch; // Assuming this is the Year Branch (Animal)

  return {
    // Positive Stars
    nobleman: STEM_NOBLEMAN[dm]?.includes(dayBranch) || false,
    travelingHorse: TRAVELING_HORSE[yearBranch] === dayBranch,
    peachBlossom: PEACH_BLOSSOM[yearBranch] === dayBranch,
    academic: ACADEMIC_STAR[dm] === dayBranch,

    // Negative Stars
    robbingShaDay: ROBBING_SHA[user.baZiBranch] === dayBranch,
    robbingShaYear: ROBBING_SHA[yearBranch] === dayBranch,
    deathGod: DEATH_GOD[yearBranch] === dayBranch,
    solitaryStar: SOLITARY_STAR[yearBranch] === dayBranch,
  };
};

export const getVoidStatus = (
  refStem: string,
  refBranch: string,
  branchToCheck: string,
  contextBranches: string[] = [],
): {
  isVoid: boolean;
  type: "None" | "True Void" | "Canceled Void";
  message: string;
} => {
  const sIdx = STEMS_LIST.indexOf(refStem);
  const bIdx = BRANCHES_LIST.indexOf(refBranch);

  if (sIdx === -1 || bIdx === -1)
    return { isVoid: false, type: "None", message: "" };

  let diff = bIdx - sIdx;
  if (diff < 0) diff += 12;

  // FIX: Use BRANCHES_LIST to access by index
  const voidBranch1 = BRANCHES_LIST[(diff + 10) % 12];
  const voidBranch2 = BRANCHES_LIST[(diff + 11) % 12];

  const isTechnicallyVoid =
    branchToCheck === voidBranch1 || branchToCheck === voidBranch2;

  if (!isTechnicallyVoid) {
    return { isVoid: false, type: "None", message: "" };
  }

  // Check for Cancellation
  const saviorClash = CLASH_PAIRS[branchToCheck];
  const saviorCombo = COMBO_PAIRS[branchToCheck];

  const isClashed = contextBranches.includes(saviorClash);
  const isCombined = contextBranches.includes(saviorCombo);

  if (isClashed) {
    return {
      isVoid: true,
      type: "Canceled Void",
      message: `Void Canceled by Clash with ${saviorClash}.`,
    };
  }

  if (isCombined) {
    return {
      isVoid: true,
      type: "Canceled Void",
      message: `Void Filled by Combination with ${saviorCombo}.`,
    };
  }

  return {
    isVoid: true,
    type: "True Void",
    message: "Energy is hollow.",
  };
};

// --- HELPER: Calculate Yellow/Black Belt (Dong Gong) ---
export function getYellowBlackBelt(monthBranch: string, dayBranch: string) {
  // Branch Order: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig
  // const branchList = Object.values(BRANCHES); // Ensure this matches constant order

  let startOffset = 0;

  // Dong Gong Starting Offsets for "Green Dragon"
  switch (monthBranch) {
    case "Tiger":
    case "Monkey":
      startOffset = 0;
      break; // Starts on Rat
    case "Rabbit":
    case "Rooster":
      startOffset = 2;
      break; // Starts on Tiger
    case "Dragon":
    case "Dog":
      startOffset = 4;
      break; // Starts on Dragon
    case "Snake":
    case "Pig":
      startOffset = 6;
      break; // Starts on Horse
    case "Rat":
    case "Horse":
      startOffset = 8;
      break; // Starts on Monkey
    case "Ox":
    case "Goat":
      startOffset = 10;
      break; // Starts on Dog
  }

  // Find index of the day
  // Note: We need to match the English string "Rat" to the index 0
  const dayIndex = BRANCHES_LIST.indexOf(dayBranch);

  // Formula: (Day - Start + 12) % 12
  const ybIndex = (dayIndex - startOffset + 12) % 12;

  return YELLOW_BLACK_BELT[ybIndex];
}

// HELPER: Get Year Branch (Animal) from a Date
const getYearBranchFromDate = (dateString: Date | string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  // 0=Monkey, 1=Rooster... (Standard sequence relative to 0 AD or any 12-year cycle start)
  // 1900 was Rat. 1900 % 12 = 4.
  // Actually, easiest way:
  // Array aligned with year % 12
  const animals = [
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
  ];
  return animals[year % 12];
};
