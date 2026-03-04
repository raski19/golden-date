// =====================================================
// Personal Sector Matching Engine
// =====================================================

import { MultiOverlaySector } from "../core/fengshui/xuanKongEngine";
import { calculateResonanceScore } from "../core/bazi/resonanceEngine";

type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

const STAR_ELEMENTS: Record<number, Element> = {
  1: "Water",
  2: "Earth",
  3: "Wood",
  4: "Wood",
  5: "Earth",
  6: "Metal",
  7: "Metal",
  8: "Earth",
  9: "Fire",
};

export function matchPersonalSectors(
  overlay: Record<string, MultiOverlaySector>,
  dayMaster: Element,
  favorableElements: Element[]
) {
  const results = Object.entries(overlay).map(([sector, data]) => {
    const mountainElement = STAR_ELEMENTS[data.mountain];
    const waterElement = STAR_ELEMENTS[data.water];

    const sleepScore = calculateResonanceScore({
      dayMaster,
      favorableElements,
      houseDominantElement: mountainElement,
      wealthSectorElement: mountainElement,
      officeSectorElement: mountainElement,
    });

    const deskScore = calculateResonanceScore({
      dayMaster,
      favorableElements,
      houseDominantElement: waterElement,
      wealthSectorElement: waterElement,
      officeSectorElement: waterElement,
    });

    return {
      sector,
      sleepScore,
      deskScore,
    };
  });

  const bestSleep = [...results].sort((a, b) => b.sleepScore - a.sleepScore)[0];

  const bestDesk = [...results].sort((a, b) => b.deskScore - a.deskScore)[0];

  return {
    bestSleepingDirection: bestSleep.sector,
    bestDeskDirection: bestDesk.sector,
    ranking: results,
  };
}
