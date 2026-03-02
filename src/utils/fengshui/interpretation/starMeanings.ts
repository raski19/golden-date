export interface StarProfile {
  element: string;
  nature: "auspicious" | "inauspicious" | "neutral";
  meaning: string;
  timelyPeriods: number[];
}

export const STAR_PROFILES: Record<number, StarProfile> = {
  1: {
    element: "Water",
    nature: "neutral",
    meaning: "career and communication",
    timelyPeriods: [1],
  },
  2: {
    element: "Earth",
    nature: "inauspicious",
    meaning: "illness and weakness",
    timelyPeriods: [2],
  },
  3: {
    element: "Wood",
    nature: "inauspicious",
    meaning: "conflict and lawsuits",
    timelyPeriods: [3],
  },
  4: {
    element: "Wood",
    nature: "neutral",
    meaning: "romance and studies",
    timelyPeriods: [4],
  },
  5: {
    element: "Earth",
    nature: "inauspicious",
    meaning: "major misfortune",
    timelyPeriods: [],
  },
  6: {
    element: "Metal",
    nature: "neutral",
    meaning: "authority and power",
    timelyPeriods: [6],
  },
  7: {
    element: "Metal",
    nature: "inauspicious",
    meaning: "robbery and betrayal",
    timelyPeriods: [7],
  },
  8: {
    element: "Earth",
    nature: "auspicious",
    meaning: "wealth and property",
    timelyPeriods: [8],
  },
  9: {
    element: "Fire",
    nature: "auspicious",
    meaning: "future prosperity and visibility",
    timelyPeriods: [9],
  },
};

export function isTimely(star: number, period: number) {
  return STAR_PROFILES[star].timelyPeriods.includes(period);
}
