import { OverlaySector, Sector } from "../core/xuanKongEngine";
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

function getScoreColor(score: number): string {
  if (score <= -3) return "#ffe5e5";
  if (score < 0) return "#fff5f5";
  if (score >= 5) return "#e6ffed";
  return "#f0fff4";
}

export function buildFengShuiHtml(
  overlay: Record<Sector, OverlaySector>,
  period: number
): string {
  const cellsHtml = GRID_ORDER.map((sector) => {
    const data = overlay[sector];

    const combo = evaluateCombination(data.mountain, data.water, period);

    const remedy = getRemedy(data.annual);

    return `
      <div style="
        border:1px solid #ccc;
        padding:12px;
        border-radius:8px;
        background:${getScoreColor(combo.score)};
        font-family:Arial, sans-serif;
        font-size:13px;
      ">
        <h3 style="margin:0 0 8px 0; font-size:14px;">
          ${sector}
        </h3>

        <div>Base: <strong>${data.base}</strong></div>
        <div>Mountain: <strong>${data.mountain}</strong></div>
        <div>Water: <strong>${data.water}</strong></div>
        <div>Annual: <strong>${data.annual}</strong></div>

        <div style="margin-top:8px;">
          <strong>Score:</strong> ${combo.score}
        </div>

        <div style="margin-top:5px; font-size:12px;">
          ${combo.description}
        </div>

        <div style="
          margin-top:8px;
          padding:6px;
          background:#f8f9fa;
          border-radius:4px;
          font-size:12px;
        ">
          <strong>Remedy:</strong> ${remedy}
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="
      display:grid;
      grid-template-columns:repeat(3, 1fr);
      gap:12px;
      max-width:900px;
    ">
      ${cellsHtml}
    </div>
  `;
}
