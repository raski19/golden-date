import {
  buildNatalChart,
  getAnnualStars,
  getMonthlyStars,
  overlayWithOptions,
} from "../core/fengshui/xuanKongEngine";

import { optimizeLayout } from "../core/fengshui/layoutOptimizationEngine";
import { calculateHouseIndex } from "../core/fengshui/riskEngine";
import { calculateResonanceScore } from "../core/bazi/resonanceEngine";

export interface LifeDashboardInput {
  constructionDate: string;
  facingDegree: number;
  yearBranch: string;
  monthIndex: number;

  dayMasterElement: string;
  favorableElements: string[];
}

export function generateLifeDashboard(input: LifeDashboardInput) {
  const natal = buildNatalChart(
    new Date(input.constructionDate),
    input.facingDegree
  );

  const annual = getAnnualStars(new Date());
  const monthly = getMonthlyStars(input.yearBranch, input.monthIndex);

  const overlay = overlayWithOptions(natal, annual, monthly, {
    includeAnnual: true,
    includeMonthly: true,
  });

  const layout = optimizeLayout(overlay, natal.period);

  const sectorScores = layout.rankedSectors.map((r) => r.score);
  const houseIndex = calculateHouseIndex(sectorScores);

  const resonanceScore = calculateResonanceScore({
    dayMaster: input.dayMasterElement as any,
    favorableElements: input.favorableElements as any,
    houseDominantElement: "Earth",
    wealthSectorElement: "Water",
    officeSectorElement: "Metal",
  });

  const lifeAlignment = houseIndex * 0.5 + resonanceScore * 0.3 + 70 * 0.2; // placeholder BaZi base score

  return {
    natal,
    overlay,
    layout,
    houseIndex,
    resonanceScore,
    lifeAlignment: Math.round(lifeAlignment),
  };
}
