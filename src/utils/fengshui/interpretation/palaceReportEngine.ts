import { MultiOverlaySector, Sector } from "../core/fengshui/xuanKongEngine";
import { DOUBLE_STAR_MATRIX } from "./doubleStarMatrix";
import { calculateSectorScore } from "../core/fengshui/riskEngine";
import { generateMitigation } from "./mitigationEngine";

export function generatePalaceReport(
  sector: Sector,
  data: MultiOverlaySector,
  period: number
): string {
  const comboKey = `${data.mountain}-${data.water}`;
  const combo = DOUBLE_STAR_MATRIX[comboKey];

  const score = calculateSectorScore(
    data.mountain,
    data.water,
    period,
    data.annual,
    data.monthly
  );

  const mitigation = generateMitigation(
    data.mountain,
    data.water,
    data.annual,
    data.monthly
  );

  const wealthPotential =
    data.water === period || data.water === 9
      ? "strong wealth-generating"
      : "moderate financial";

  const healthImpact =
    data.mountain === 2 || data.mountain === 5
      ? "requires health caution"
      : "stable health support";

  return `
  The ${sector} sector carries a Mountain ${data.mountain}
  and Water ${data.water} configuration. 

  The combination is classified as: ${combo.description}

  In Period ${period}, this palace scores ${score}, indicating
  ${
    score > 3
      ? "favorable energy flow"
      : score > 0
      ? "moderate balance"
      : "energetic instability"
  }.

  Wealth Outlook:
  This sector shows ${wealthPotential} characteristics.

  Health & Stability:
  The Mountain influence suggests it ${healthImpact}.

  Dynamic Influences:
  ${data.annual ? `Annual star ${data.annual} modifies this pattern.` : ""}
  ${
    data.monthly
      ? `Monthly star ${data.monthly} adds short-term fluctuation.`
      : ""
  }

  Recommended Usage:
  ${
    score > 4
      ? "Ideal for office desk, financial planning, or main activity."
      : score > 0
      ? "Suitable for light usage or secondary activity."
      : "Avoid major disturbance and renovation."
  }

  Mitigation Strategy:
  ${mitigation.advice.join(" ")}
  `;
}
