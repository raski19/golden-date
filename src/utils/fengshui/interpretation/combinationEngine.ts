export interface ComboResult {
  score: number;
  description: string;
}

export function evaluateCombination(
  mountain: number,
  water: number,
  period: number
): ComboResult {
  let score = 0;
  let description = "";

  if (mountain === water) {
    score += 2;
    description += "Double star formation. ";
  }

  if (mountain === 8 && water === 8 && period === 8) {
    score += 5;
    description += "Period 8 super wealth formation. ";
  }

  if (mountain === 9 && water === 9 && period === 9) {
    score += 5;
    description += "Period 9 prosperity alignment. ";
  }

  if (mountain === 5 || water === 5) {
    score -= 5;
    description += "Five Yellow influence. ";
  }

  return { score, description };
}
