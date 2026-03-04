export interface DoubleStarProfile {
  mountain: number;
  water: number;
  baseScore: number; // -10 to +10
  category: "prosperity" | "conflict" | "illness" | "neutral" | "authority";
  description: string;
  sensitiveToActivation: boolean;
}

export const DOUBLE_STAR_MATRIX: Record<string, DoubleStarProfile> = {};

function key(m: number, w: number) {
  return `${m}-${w}`;
}

// Generate all 81 combinations with baseline neutral profile
for (let m = 1; m <= 9; m++) {
  for (let w = 1; w <= 9; w++) {
    DOUBLE_STAR_MATRIX[key(m, w)] = {
      mountain: m,
      water: w,
      baseScore: 0,
      category: "neutral",
      description: "Neutral combination.",
      sensitiveToActivation: false,
    };
  }
}

// Define major known classical patterns

DOUBLE_STAR_MATRIX[key(8, 8)] = {
  mountain: 8,
  water: 8,
  baseScore: 8,
  category: "prosperity",
  description: "Double Eight wealth formation (Period 8 peak).",
  sensitiveToActivation: true,
};

DOUBLE_STAR_MATRIX[key(9, 9)] = {
  mountain: 9,
  water: 9,
  baseScore: 9,
  category: "prosperity",
  description: "Period 9 prosperity alignment.",
  sensitiveToActivation: true,
};

DOUBLE_STAR_MATRIX[key(2, 5)] = {
  mountain: 2,
  water: 5,
  baseScore: -9,
  category: "illness",
  description: "Severe illness and accident formation.",
  sensitiveToActivation: true,
};

DOUBLE_STAR_MATRIX[key(3, 7)] = {
  mountain: 3,
  water: 7,
  baseScore: -6,
  category: "conflict",
  description: "Legal disputes, robbery, arguments.",
  sensitiveToActivation: true,
};
