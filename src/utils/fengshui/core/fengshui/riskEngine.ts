import { DOUBLE_STAR_MATRIX } from "../../interpretation/doubleStarMatrix";
import { getTimelyWeight } from "../../interpretation/timelyEngine";

export function calculateSectorScore(
  mountain: number,
  water: number,
  period: number,
  annual?: number,
  monthly?: number
): number {
  const key = `${mountain}-${water}`;
  const profile = DOUBLE_STAR_MATRIX[key];

  let score = profile.baseScore;

  score += getTimelyWeight(mountain, period);
  score += getTimelyWeight(water, period);

  if (annual) score += getTimelyWeight(annual, period);
  if (monthly) score += getTimelyWeight(monthly, period);

  return score;
}

export function calculateHouseIndex(scores: number[]): number {
  const total = scores.reduce((a, b) => a + b, 0);
  const normalized = Math.max(0, Math.min(100, 50 + total));

  return normalized;
}
