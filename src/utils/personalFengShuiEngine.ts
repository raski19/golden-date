import { IUser } from "../types";
import {
  buildNatalChart,
  getAnnualStars,
  overlayWithOptions,
} from "./fengshui/core/fengshui/xuanKongEngine";
import { optimizeLayout } from "./fengshui/core/fengshui/layoutOptimizationEngine";
import { calculateHouseIndex } from "./fengshui/core/fengshui/riskEngine";
import { calculateResonanceScore } from "./fengshui/core/bazi/resonanceEngine";
import { calculateDMStrength } from "./baziHelper";
import { detectHouseDominantElement } from "./fengshui/interpretation/houseElementEngine";
import { matchPersonalSectors } from "./fengshui/interpretation/personalSectorEngine";

type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export function analyzePersonalFengShui(
  user: IUser,
  constructionDate: Date,
  facingDegree: number
) {
  // ---------------------------------------------------------
  // 1️⃣ Recalculate BaZi Strength
  // ---------------------------------------------------------

  const dmResult = calculateDMStrength(
    user.dayMaster,
    user.monthBranch,
    [user.yearStem, user.monthStem, user.hourStem].filter((v): v is string =>
      Boolean(v)
    ),
    { year: user.yearBranch, day: user.dayBranch, hour: user.hourBranch ?? "" }
  );

  const personalStrengthScore = dmResult.score;

  // ---------------------------------------------------------
  // 2️⃣ Build House Chart
  // ---------------------------------------------------------

  const natal = buildNatalChart(constructionDate, facingDegree);
  const annual = getAnnualStars(new Date());

  const overlay = overlayWithOptions(natal, annual, null, {
    includeAnnual: true,
  });

  const layout = optimizeLayout(overlay, natal.period);
  const sectorScores = layout.rankedSectors.map((r) => r.score);
  const houseIndex = calculateHouseIndex(sectorScores);

  // ---------------------------------------------------------
  // 3️⃣ Automatic House Dominant Element + Personal Matching
  // ---------------------------------------------------------

  const houseDominant = detectHouseDominantElement(overlay);

  // Calculate resonance using detected house dominant element
  const resonanceScore = calculateResonanceScore({
    dayMaster: dmResult.dmElement as Element,
    favorableElements: user.rules.wealthElements as Element[],
    houseDominantElement: houseDominant,
    wealthSectorElement: houseDominant,
    officeSectorElement: houseDominant,
  });

  // Match best sleeping & desk sectors
  const personalSectors = matchPersonalSectors(
    overlay,
    dmResult.dmElement as Element,
    user.rules.wealthElements as Element[]
  );

  // ---------------------------------------------------------
  // 4️⃣ Life Alignment Score
  // ---------------------------------------------------------

  const lifeAlignment =
    personalStrengthScore * 0.4 + houseIndex * 0.3 + resonanceScore * 0.3;

  return {
    period: natal.period,
    personalStrength: dmResult,
    houseDominantElement: houseDominant,
    houseIndex,
    resonanceScore,
    lifeAlignment: Math.round(lifeAlignment),
    layout,
    personalDirections: personalSectors,
  };
}
