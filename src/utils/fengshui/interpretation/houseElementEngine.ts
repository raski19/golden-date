// =====================================================
// House Dominant Element Detection Engine
// =====================================================

import { MultiOverlaySector } from "../core/fengshui/xuanKongEngine";

type Element = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

// Flying Star to Element Map
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

export function detectHouseDominantElement(
  overlay: Record<string, MultiOverlaySector>
): Element {
  const counter: Record<Element, number> = {
    Wood: 0,
    Fire: 0,
    Earth: 0,
    Metal: 0,
    Water: 0,
  };

  Object.values(overlay).forEach((sector) => {
    const mElement = STAR_ELEMENTS[sector.mountain];
    const wElement = STAR_ELEMENTS[sector.water];

    counter[mElement] += 1.5; // Mountain slightly heavier
    counter[wElement] += 1;

    if (sector.annual) counter[STAR_ELEMENTS[sector.annual]] += 0.5;
  });

  const dominant = Object.entries(counter).sort((a, b) => b[1] - a[1])[0][0];

  return dominant as Element;
}
