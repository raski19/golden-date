import { MultiOverlaySector, Sector } from "../core/fengshui/xuanKongEngine";
import { evaluateCombination } from "../interpretation/combinationEngine";
import { getRemedy } from "../interpretation/remedyEngine";

const GRID_ORDER: Sector[] = [
  "Southeast",
  "South",
  "Southwest",
  "East",
  "Center",
  "West",
  "Northeast",
  "North",
  "Northwest",
];

export function buildFengShuiHtml(
  overlay: Record<Sector, MultiOverlaySector>,
  period: number
): string {
  const cells = GRID_ORDER.map((sector) => {
    const data = overlay[sector];

    const combo = evaluateCombination(data.mountain, data.water, period);

    const dynamicStar = data.monthly ?? data.annual ?? 0;

    const remedy = dynamicStar
      ? getRemedy(dynamicStar)
      : "No dynamic influence.";

    return `
      <div style="
        border:1px solid #ccc;
        padding:12px;
        border-radius:8px;
        font-size:13px;
        background:${combo.score < 0 ? "#fff5f5" : "#f0fff4"};
      ">
        <h3>${sector}</h3>

        <div>Base: ${data.base}</div>
        <div>Mountain: ${data.mountain}</div>
        <div>Water: ${data.water}</div>

        ${data.annual ? `<div>Annual: ${data.annual}</div>` : ""}
        ${data.monthly ? `<div>Monthly: ${data.monthly}</div>` : ""}

        <div style="margin-top:6px;">
          Score: ${combo.score}
        </div>

        <div style="margin-top:6px;">
          <strong>Remedy:</strong> ${remedy}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
      ${cells}
    </div>
  `;
}
