// ============================================================
// XUAN KONG FLYING STAR ENGINE
// Period 8 & 9 | Li Chun | 24 Mountains | Natal + Annual + Monthly
// ============================================================

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

export type Sector =
  | "Center"
  | "Northwest"
  | "West"
  | "Northeast"
  | "South"
  | "North"
  | "Southwest"
  | "East"
  | "Southeast";

export type YinYang = "Yin" | "Yang";

export interface Mountain {
  name: string;
  start: number;
  end: number;
  yinYang: YinYang;
  sector: Sector;
}

export interface NatalChart {
  period: number;
  mountain: Mountain;
  baseChart: Record<Sector, number>;
  mountainStars: Record<Sector, number>;
  waterStars: Record<Sector, number>;
}

export interface MultiOverlaySector {
  base: number;
  mountain: number;
  water: number;
  annual?: number;
  monthly?: number;
}

export interface OverlayOptions {
  includeAnnual?: boolean;
  includeMonthly?: boolean;
}

// ------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------

const LUO_SHU_ORDER: Sector[] = [
  "Center",
  "Northwest",
  "West",
  "Northeast",
  "South",
  "North",
  "Southwest",
  "East",
  "Southeast",
];

const MOUNTAINS_24: Mountain[] = [
  { name: "N2", start: 0, end: 15, yinYang: "Yang", sector: "North" },
  { name: "N3", start: 15, end: 30, yinYang: "Yin", sector: "North" },
  { name: "NE1", start: 30, end: 45, yinYang: "Yang", sector: "Northeast" },
  { name: "NE2", start: 45, end: 60, yinYang: "Yin", sector: "Northeast" },
  { name: "NE3", start: 60, end: 75, yinYang: "Yang", sector: "Northeast" },
  { name: "E1", start: 75, end: 90, yinYang: "Yin", sector: "East" },
  { name: "E2", start: 90, end: 105, yinYang: "Yang", sector: "East" },
  { name: "E3", start: 105, end: 120, yinYang: "Yin", sector: "East" },
  { name: "SE1", start: 120, end: 135, yinYang: "Yang", sector: "Southeast" },
  { name: "SE2", start: 135, end: 150, yinYang: "Yin", sector: "Southeast" },
  { name: "SE3", start: 150, end: 165, yinYang: "Yang", sector: "Southeast" },
  { name: "S1", start: 165, end: 180, yinYang: "Yin", sector: "South" },
  { name: "S2", start: 180, end: 195, yinYang: "Yang", sector: "South" },
  { name: "S3", start: 195, end: 210, yinYang: "Yin", sector: "South" },
  { name: "SW1", start: 210, end: 225, yinYang: "Yang", sector: "Southwest" },
  { name: "SW2", start: 225, end: 240, yinYang: "Yin", sector: "Southwest" },
  { name: "SW3", start: 240, end: 255, yinYang: "Yang", sector: "Southwest" },
  { name: "W1", start: 255, end: 270, yinYang: "Yin", sector: "West" },
  { name: "W2", start: 270, end: 285, yinYang: "Yang", sector: "West" },
  { name: "W3", start: 285, end: 300, yinYang: "Yin", sector: "West" },
  { name: "NW1", start: 300, end: 315, yinYang: "Yang", sector: "Northwest" },
  { name: "NW2", start: 315, end: 330, yinYang: "Yin", sector: "Northwest" },
  { name: "NW3", start: 330, end: 345, yinYang: "Yang", sector: "Northwest" },
  { name: "N1", start: 345, end: 360, yinYang: "Yin", sector: "North" },
];

const YEAR_GROUPS = {
  GROUP_8: ["Rat", "Horse", "Rabbit", "Rooster"],
  GROUP_5: ["Dragon", "Dog", "Ox", "Goat"],
  GROUP_2: ["Tiger", "Monkey", "Snake", "Pig"],
};

// ------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------

const wrap9 = (n: number): number => ((((n - 1) % 9) + 9) % 9) + 1;

const digitalRoot = (year: number): number => {
  let sum = year;
  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  }
  return sum;
};

const normalizeDegree = (degree: number): number =>
  ((degree % 360) + 360) % 360;

// ------------------------------------------------------------
// LI CHUN LOGIC
// ------------------------------------------------------------

export function getSolarYear(date: Date): number {
  const liChun = new Date(date.getFullYear(), 1, 4);
  return date < liChun ? date.getFullYear() - 1 : date.getFullYear();
}

// ------------------------------------------------------------
// FULL SAN YUAN PERIOD DETECTION (All 9 Periods)
// ------------------------------------------------------------

export function getPeriod(date: Date): number {
  const solarYear = getSolarYear(date);

  const baseYear = 1864; // Start of Period 1 (San Yuan cycle)

  if (solarYear < baseYear) {
    throw new Error("Date before start of Xuan Kong cycle (1864)");
  }

  const yearsSinceBase = solarYear - baseYear;

  const periodIndex = Math.floor(yearsSinceBase / 20);

  // There are 9 periods (1–9), then cycle repeats
  const period = (periodIndex % 9) + 1;

  return period;
}

// ------------------------------------------------------------
// 24 MOUNTAIN RESOLUTION
// ------------------------------------------------------------

export function resolveMountain(degree: number): Mountain {
  const normalized = normalizeDegree(degree);

  const mountain = MOUNTAINS_24.find(
    (m) => normalized >= m.start && normalized < m.end
  );

  if (!mountain) {
    throw new Error("Invalid facing degree");
  }

  return mountain;
}

// ------------------------------------------------------------
// FLYING ALGORITHM
// ------------------------------------------------------------

function fly(centerStar: number, reverse = false): Record<Sector, number> {
  const chart = {} as Record<Sector, number>;

  LUO_SHU_ORDER.forEach((sector, index) => {
    chart[sector] = reverse
      ? wrap9(centerStar - index)
      : wrap9(centerStar + index);
  });

  return chart;
}

// ------------------------------------------------------------
// NATAL CHART
// ------------------------------------------------------------

export function buildNatalChart(
  constructionDate: Date,
  facingDegree: number
): NatalChart {
  const period = getPeriod(constructionDate);
  const mountain = resolveMountain(facingDegree);

  const baseChart = fly(period);

  const forward = mountain.yinYang === "Yang";
  const facingStar = baseChart[mountain.sector];

  const mountainStars = fly(facingStar, !forward);
  const waterStars = fly(facingStar, forward);

  return {
    period,
    mountain,
    baseChart,
    mountainStars,
    waterStars,
  };
}

// ------------------------------------------------------------
// ANNUAL STARS
// ------------------------------------------------------------

export function getAnnualStars(date: Date): Record<Sector, number> {
  const solarYear = getSolarYear(date);
  let star = 9 - digitalRoot(solarYear);

  if (star <= 0) star = 9;

  return fly(star);
}

// ------------------------------------------------------------
// MONTHLY STARS
// ------------------------------------------------------------

export function getMonthlyStars(
  yearBranch: string,
  monthIndex: number
): Record<Sector, number> {
  let base: number;

  if (YEAR_GROUPS.GROUP_8.includes(yearBranch)) base = 8;
  else if (YEAR_GROUPS.GROUP_5.includes(yearBranch)) base = 5;
  else if (YEAR_GROUPS.GROUP_2.includes(yearBranch)) base = 2;
  else throw new Error("Invalid year branch");

  const center = wrap9(base - (monthIndex - 1));

  return fly(center);
}

// ------------------------------------------------------------
// MULTI-LAYER OVERLAY
// ------------------------------------------------------------

export function overlayWithOptions(
  natal: NatalChart,
  annual: Record<Sector, number> | null,
  monthly: Record<Sector, number> | null,
  options: OverlayOptions
): Record<Sector, MultiOverlaySector> {
  const result = {} as Record<Sector, MultiOverlaySector>;

  LUO_SHU_ORDER.forEach((sector) => {
    result[sector] = {
      base: natal.baseChart[sector],
      mountain: natal.mountainStars[sector],
      water: natal.waterStars[sector],
      ...(options.includeAnnual && annual ? { annual: annual[sector] } : {}),
      ...(options.includeMonthly && monthly
        ? { monthly: monthly[sector] }
        : {}),
    };
  });

  return result;
}
