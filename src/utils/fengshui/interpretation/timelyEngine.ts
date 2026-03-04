export function getTimelyWeight(star: number, period: number): number {
  if (star === period) return 3; // peak
  if (star === period + 1) return 2; // growing
  if (star === period - 1) return 1; // declining
  if (star === 5) return -3; // always negative
  return 0;
}
