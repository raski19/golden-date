// engine/strategyPlanner.ts

import {
  NatalChart,
  getMonthlyStars,
  overlayWithOptions,
} from "../core/fengshui/xuanKongEngine";

import { optimizeLayout } from "../core/fengshui/layoutOptimizationEngine";

export function generateSixMonthPlan(
  natal: NatalChart,
  startMonthIndex: number,
  yearBranch: string
) {
  const plan = [];

  for (let i = 0; i < 6; i++) {
    const monthIndex = startMonthIndex + i;

    const monthly = getMonthlyStars(yearBranch, monthIndex);

    const overlay = overlayWithOptions(natal, null, monthly, {
      includeMonthly: true,
    });

    const layout = optimizeLayout(overlay, natal.period);

    plan.push({
      monthOffset: i,
      wealthFocus: layout.bestWealthSector,
      avoid: layout.avoidSectors,
    });
  }

  return plan;
}
