import { TenGodsResult } from "../types";

interface StemData {
  element: string;
  polarity: "+" | "-";
}

const STEM_INFO: Record<string, StemData> = {
  Jia: { element: "Wood", polarity: "+" },
  Yi: { element: "Wood", polarity: "-" },
  Bing: { element: "Fire", polarity: "+" },
  Ding: { element: "Fire", polarity: "-" },
  Wu: { element: "Earth", polarity: "+" },
  Ji: { element: "Earth", polarity: "-" },
  Geng: { element: "Metal", polarity: "+" },
  Xin: { element: "Metal", polarity: "-" },
  Ren: { element: "Water", polarity: "+" },
  Gui: { element: "Water", polarity: "-" },
};

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

  const produces: Record<string, string> = {
    Wood: "Fire",
    Fire: "Earth",
    Earth: "Metal",
    Metal: "Water",
    Water: "Wood",
  };
  if (produces[dm.element] === target.element)
    return samePolarity ? "EG" : "HO";

  const controls: Record<string, string> = {
    Wood: "Earth",
    Fire: "Metal",
    Earth: "Water",
    Metal: "Wood",
    Water: "Fire",
  };
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
