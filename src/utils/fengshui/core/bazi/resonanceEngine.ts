// ============================================================
// BaZi × Feng Shui Resonance Engine
// ============================================================

export type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface ResonanceInput {
  dayMaster: Element;
  favorableElements: Element[];
  houseDominantElement: Element;
  wealthSectorElement: Element;
  officeSectorElement: Element;
  currentAnnualElement?: Element;
  currentLuckPillarElement?: Element;
}

// ------------------------------------------------------------
// Five Element Relationships
// ------------------------------------------------------------

const PRODUCES: Record<Element, Element> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

const CONTROLS: Record<Element, Element> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

// Reverse lookup helpers
function produces(a: Element, b: Element): boolean {
  return PRODUCES[a] === b;
}

function controls(a: Element, b: Element): boolean {
  return CONTROLS[a] === b;
}

function isFavorable(element: Element, favorableElements: Element[]): boolean {
  return favorableElements.includes(element);
}

// ------------------------------------------------------------
// Core Resonance Logic
// ------------------------------------------------------------

export function calculateResonanceScore(input: ResonanceInput): number {
  let score = 50; // baseline neutral

  const {
    dayMaster,
    favorableElements,
    houseDominantElement,
    wealthSectorElement,
    officeSectorElement,
    currentAnnualElement,
    currentLuckPillarElement,
  } = input;

  // --------------------------------------------------------
  // HOUSE SUPPORT
  // --------------------------------------------------------

  if (isFavorable(houseDominantElement, favorableElements)) score += 10;

  if (produces(houseDominantElement, dayMaster)) score += 8;

  if (controls(houseDominantElement, dayMaster)) score -= 10;

  // --------------------------------------------------------
  // WEALTH SECTOR SUPPORT
  // --------------------------------------------------------

  if (produces(wealthSectorElement, dayMaster)) score += 8;

  if (controls(wealthSectorElement, dayMaster)) score -= 6;

  if (isFavorable(wealthSectorElement, favorableElements)) score += 5;

  // --------------------------------------------------------
  // OFFICE SECTOR SUPPORT
  // --------------------------------------------------------

  if (produces(officeSectorElement, dayMaster)) score += 6;

  if (controls(officeSectorElement, dayMaster)) score -= 6;

  if (isFavorable(officeSectorElement, favorableElements)) score += 4;

  // --------------------------------------------------------
  // ANNUAL INFLUENCE
  // --------------------------------------------------------

  if (currentAnnualElement) {
    if (produces(currentAnnualElement, dayMaster)) score += 5;

    if (controls(currentAnnualElement, dayMaster)) score -= 5;
  }

  // --------------------------------------------------------
  // LUCK PILLAR INFLUENCE
  // --------------------------------------------------------

  if (currentLuckPillarElement) {
    if (produces(currentLuckPillarElement, dayMaster)) score += 6;

    if (controls(currentLuckPillarElement, dayMaster)) score -= 6;
  }

  // Clamp to 0–100
  return Math.max(0, Math.min(100, score));
}
