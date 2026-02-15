import { TenGodsResult } from "../types";
import { STEM_INFO, CONTROL_CYCLE, PRODUCTION_CYCLE } from "./constants";

const BRANCH_MAIN_QI: Record<string, string> = {
  Rat: "Gui",
  Ox: "Ji",
  Tiger: "Jia",
  Rabbit: "Yi",
  Dragon: "Wu",
  Snake: "Bing",
  Horse: "Ding",
  Goat: "Ji",
  Monkey: "Geng",
  Rooster: "Xin",
  Dog: "Wu",
  Pig: "Ren",
};

function getGod(dayMaster: string, targetStem: string): string {
  if (
    !dayMaster ||
    !targetStem ||
    !STEM_INFO[dayMaster] ||
    !STEM_INFO[targetStem]
  )
    return "?";

  const dm = STEM_INFO[dayMaster];
  const target = STEM_INFO[targetStem];
  const samePolarity = dm.polarity === target.polarity;

  if (dm.element === target.element) return samePolarity ? "F" : "RW";

  const produces: Record<string, string> = PRODUCTION_CYCLE;
  if (produces[dm.element] === target.element)
    return samePolarity ? "EG" : "HO";

  const controls: Record<string, string> = CONTROL_CYCLE;
  if (controls[dm.element] === target.element)
    return samePolarity ? "IW" : "DW";

  if (controls[target.element] === dm.element)
    return samePolarity ? "7K" : "DO";

  if (produces[target.element] === dm.element)
    return samePolarity ? "IR" : "DR";

  return "?";
}

export const calculateTenGods = (
  userDayMaster: string,
  dayStem: string,
  dayBranch: string,
): TenGodsResult => {
  const stemGod = getGod(userDayMaster, dayStem);
  const branchHiddenStem = BRANCH_MAIN_QI[dayBranch] || "Unknown";
  const branchGod = getGod(userDayMaster, branchHiddenStem);
  return { stemGod, branchGod };
};
