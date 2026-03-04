import { MultiOverlaySector, Sector } from "../core/fengshui/xuanKongEngine";
import { evaluateCombination } from "./combinationEngine";

export function generateConsultantSummary(
  overlay: Record<Sector, MultiOverlaySector>,
  period: number
): string {
  let totalScore = 0;
  let fiveCount = 0;
  let prosperityZones: Sector[] = [];
  let riskZones: Sector[] = [];

  Object.entries(overlay).forEach(([sector, data]) => {
    const combo = evaluateCombination(data.mountain, data.water, period);

    totalScore += combo.score;

    if (data.annual === 5 || data.monthly === 5) {
      fiveCount++;
      riskZones.push(sector as Sector);
    }

    if (
      data.annual === 8 ||
      data.annual === 9 ||
      data.monthly === 8 ||
      data.monthly === 9
    ) {
      prosperityZones.push(sector as Sector);
    }
  });

  const overall =
    totalScore > 10
      ? "strong and supportive"
      : totalScore > 0
      ? "moderately balanced"
      : "energetically unstable";

  return `
    This property is currently ${overall} under Period ${period}.
    ${
      fiveCount > 0
        ? `Caution is required in ${riskZones.join(
            ", "
          )} due to Five Yellow activation.`
        : `No major destructive stars dominate this period.`
    }
    Wealth and expansion opportunities are strongest in ${
      prosperityZones.join(", ") || "neutral sectors"
    }.
    Strategic activation and controlled renovation planning are advised.
  `;
}

export function generateProfessionalSummary(
  houseIndex: number,
  period: number
): string {
  let status = "";

  if (houseIndex > 75) status = "exceptionally strong";
  else if (houseIndex > 60) status = "supportive and stable";
  else if (houseIndex > 45) status = "moderately balanced";
  else status = "energetically unstable";

  return `
    Under Period ${period}, this property is ${status}.
    Strategic activation and proper mitigation will significantly
    influence the outcome over the next 12–24 months.
  `;
}
