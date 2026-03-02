import { STAR_PROFILES } from "./starMeanings";

const ELEMENT_CYCLE = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

export function getRemedy(star: number) {
  if (star === 5 || star === 2) {
    return "Use strong Metal cure (6-rod metal wind chime, brass object). Avoid fire.";
  }

  if (star === 3) {
    return "Use red color or Fire element to reduce conflict.";
  }

  if (star === 7) {
    return "Use Water element (blue decor) to weaken Metal.";
  }

  return "No major remedy required. Activate with light and movement.";
}
