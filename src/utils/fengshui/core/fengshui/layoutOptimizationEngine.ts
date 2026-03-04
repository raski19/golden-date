import { MultiOverlaySector, Sector } from "./xuanKongEngine";
import { calculateSectorScore } from "./riskEngine";

export interface LayoutRecommendation {
  bestWealthSector: Sector | null;
  bestOfficeSector: Sector | null;
  avoidSectors: Sector[];
  rankedSectors: {
    sector: Sector;
    score: number;
  }[];
}

export function optimizeLayout(
  overlay: Record<Sector, MultiOverlaySector>,
  period: number
): LayoutRecommendation {
  const ranking: {
    sector: Sector;
    score: number;
  }[] = [];

  Object.entries(overlay).forEach(([sector, data]) => {
    const score = calculateSectorScore(
      data.mountain,
      data.water,
      period,
      data.annual,
      data.monthly
    );

    ranking.push({
      sector: sector as Sector,
      score,
    });
  });

  ranking.sort((a, b) => b.score - a.score);

  const bestWealthSector = ranking.find((r) => r.score > 3)?.sector ?? null;

  const bestOfficeSector = ranking.find((r) => r.score > 1)?.sector ?? null;

  const avoidSectors = ranking.filter((r) => r.score < -3).map((r) => r.sector);

  return {
    bestWealthSector,
    bestOfficeSector,
    avoidSectors,
    rankedSectors: ranking,
  };
}
