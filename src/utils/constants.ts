import { YellowBlackBelt } from "../types";

// ==========================================
// CONSTANTS & DATA MAPS
// ==========================================

export const YANG_STEMS: string[] = ["Jia", "Bing", "Wu", "Geng", "Ren"];
export const YIN_STEMS: string[] = ["Yi", "Ding", "Ji", "Xin", "Gui"];

// Self-Punishment (刑) - Element amplifies itself negatively
export const SELF_PUNISHMENT: string[] = ["Dragon", "Horse", "Rooster", "Pig"];

// Element Map (Stems & Branches)
export const ELEMENT_MAP: Record<string, string> = {
  // Stems
  Jia: "Wood",
  Yi: "Wood",
  Bing: "Fire",
  Ding: "Fire",
  Wu: "Earth",
  Ji: "Earth",
  Geng: "Metal",
  Xin: "Metal",
  Ren: "Water",
  Gui: "Water",
  // Branches
  Tiger: "Wood",
  Rabbit: "Wood",
  Snake: "Fire",
  Horse: "Fire",
  Ox: "Earth",
  Dragon: "Earth",
  Goat: "Earth",
  Dog: "Earth",
  Monkey: "Metal",
  Rooster: "Metal",
  Pig: "Water",
  Rat: "Water",
};

export const STEM_ELEMENTS: Record<string, string> = {
  Jia: "Wood",
  Yi: "Wood",
  Bing: "Fire",
  Ding: "Fire",
  Wu: "Earth",
  Ji: "Earth",
  Geng: "Metal",
  Xin: "Metal",
  Ren: "Water",
  Gui: "Water",
};

export const BRANCH_MAP: Record<string, string> = {
  子: "Rat",
  丑: "Ox",
  寅: "Tiger",
  卯: "Rabbit",
  辰: "Dragon",
  巳: "Snake",
  午: "Horse",
  未: "Goat",
  申: "Monkey",
  酉: "Rooster",
  戌: "Dog",
  亥: "Pig",
};

export const BRANCH_ELEMENTS: Record<string, string> = {
  Tiger: "Wood",
  Rabbit: "Wood",
  Snake: "Fire",
  Horse: "Fire",
  Monkey: "Metal",
  Rooster: "Metal",
  Pig: "Water",
  Rat: "Water",
  Dragon: "Earth",
  Goat: "Earth",
  Dog: "Earth",
  Ox: "Earth",
};

export const ELEMENT_ORDER = ["Wood", "Fire", "Earth", "Metal", "Water"];

// Production Cycle (Mother -> Child)
export const PRODUCTION_CYCLE: Record<string, string> = {
  Wood: "Fire",
  Fire: "Earth",
  Earth: "Metal",
  Metal: "Water",
  Water: "Wood",
};

// Control Cycle (Controller -> Victim)
export const CONTROL_CYCLE: Record<string, string> = {
  Wood: "Earth",
  Earth: "Water",
  Water: "Fire",
  Fire: "Metal",
  Metal: "Wood",
};

// Reverse Lookup for Control (Victim -> Controller) - Used for finding Influence
export const INFLUENCE_ELEMENT: Record<string, string> = {
  Earth: "Wood",
  Water: "Earth",
  Fire: "Water",
  Metal: "Fire",
  Wood: "Metal",
};

// Reverse Lookup for Production (Child -> Mother) - Used for finding Resource
export const RESOURCE_ELEMENT: Record<string, string> = {
  Fire: "Wood",
  Earth: "Fire",
  Metal: "Earth",
  Water: "Metal",
  Wood: "Water",
};

export const ELEMENT_RELATIONSHIPS: Record<string, Record<string, string>> = {
  Wood: {
    Wood: "Companion",
    Fire: "Output",
    Earth: "Wealth",
    Metal: "Influence",
    Water: "Resource",
  },
  Fire: {
    Fire: "Companion",
    Earth: "Output",
    Metal: "Wealth",
    Water: "Influence",
    Wood: "Resource",
  },
  Earth: {
    Earth: "Companion",
    Metal: "Output",
    Water: "Wealth",
    Wood: "Influence",
    Fire: "Resource",
  },
  Metal: {
    Metal: "Companion",
    Water: "Output",
    Wood: "Wealth",
    Fire: "Influence",
    Earth: "Resource",
  },
  Water: {
    Water: "Companion",
    Wood: "Output",
    Fire: "Wealth",
    Earth: "Influence",
    Metal: "Resource",
  },
};

export const STEM_INFO: Record<
  string,
  { element: string; polarity: "Yang" | "Yin" }
> = {
  Jia: { element: "Wood", polarity: "Yang" },
  Yi: { element: "Wood", polarity: "Yin" },
  Bing: { element: "Fire", polarity: "Yang" },
  Ding: { element: "Fire", polarity: "Yin" },
  Wu: { element: "Earth", polarity: "Yang" },
  Ji: { element: "Earth", polarity: "Yin" },
  Geng: { element: "Metal", polarity: "Yang" },
  Xin: { element: "Metal", polarity: "Yin" },
  Ren: { element: "Water", polarity: "Yang" },
  Gui: { element: "Water", polarity: "Yin" },
};

export const HIDDEN_STEMS: Record<string, string[]> = {
  Rat: ["Gui"], // Water
  Ox: ["Ji", "Gui", "Xin"], // Earth, Water, Metal
  Tiger: ["Jia", "Bing", "Wu"], // Wood, Fire, Earth
  Rabbit: ["Yi"], // Wood
  Dragon: ["Wu", "Yi", "Gui"], // Earth, Wood, Water
  Snake: ["Bing", "Geng", "Wu"], // Fire, Metal, Earth
  Horse: ["Ding", "Ji"], // Fire, Earth
  Goat: ["Ji", "Yi", "Ding"], // Earth, Wood, Fire
  Monkey: ["Geng", "Ren", "Wu"], // Metal, Water, Earth
  Rooster: ["Xin"], // Metal
  Dog: ["Wu", "Xin", "Ding"], // Earth, Metal, Fire
  Pig: ["Ren", "Jia"], // Water, Wood
};

export const SEASON_BRANCHES: Record<string, string[]> = {
  Spring: ["Tiger", "Rabbit"], // Wood
  Summer: ["Snake", "Horse"], // Fire
  Autumn: ["Monkey", "Rooster"], // Metal
  Winter: ["Pig", "Rat"], // Water
  // Earth is associated with the last month of each season: Ox, Dragon, Goat, Dog
};

// These 5 pairs of stems attract and combine with each other.
export const STEM_COMBINATIONS: string[][] = [
  ["Jia", "Ji"], // Combine into Earth
  ["Yi", "Geng"], // Combine into Metal
  ["Bing", "Xin"], // Combine into Water
  ["Ding", "Ren"], // Combine into Wood
  ["Wu", "Gui"], // Combine into Fire
];

export const ELEMENT_LOOKUP: Record<string, string> = {
  "Jia (Wood)": "Wood",
  "Yi (Wood)": "Wood",
  "Bing (Fire)": "Fire",
  "Ding (Fire)": "Fire",
  "Wu (Earth)": "Earth",
  "Ji (Earth)": "Earth",
  "Geng (Metal)": "Metal",
  "Xin (Metal)": "Metal",
  "Ren (Water)": "Water",
  "Gui (Water)": "Water",
};

export const BRANCH_HOURS: Record<string, string> = {
  Rat: "23:00 - 01:00",
  Ox: "01:00 - 03:00",
  Tiger: "03:00 - 05:00",
  Rabbit: "05:00 - 07:00",
  Dragon: "07:00 - 09:00",
  Snake: "09:00 - 11:00",
  Horse: "11:00 - 13:00",
  Goat: "13:00 - 15:00",
  Monkey: "15:00 - 17:00",
  Rooster: "17:00 - 19:00",
  Dog: "19:00 - 21:00",
  Pig: "21:00 - 23:00",
};

export const CHINESE_NUMBERS: Record<string, string> = {
  一: "1",
  二: "2",
  三: "3",
  四: "4",
  五: "5",
  六: "6",
  七: "7",
  八: "8",
  九: "9",
};

export const COMBO_PAIRS: Record<string, string> = {
  Rat: "Ox",
  Ox: "Rat",
  Tiger: "Pig",
  Pig: "Tiger",
  Rabbit: "Dog",
  Dog: "Rabbit",
  Dragon: "Rooster",
  Rooster: "Dragon",
  Snake: "Monkey",
  Monkey: "Snake",
  Horse: "Goat",
  Goat: "Horse",
};

export const CLASH_PAIRS: Record<string, string> = {
  Rat: "Horse",
  Horse: "Rat",
  Ox: "Goat",
  Goat: "Ox",
  Tiger: "Monkey",
  Monkey: "Tiger",
  Rabbit: "Rooster",
  Rooster: "Rabbit",
  Dragon: "Dog",
  Dog: "Dragon",
  Snake: "Pig",
  Pig: "Snake",
};

export const SIX_HARMONY: Record<string, string> = {
  Rat: "Ox",
  Ox: "Rat",
  Tiger: "Pig",
  Pig: "Tiger",
  Rabbit: "Dog",
  Dog: "Rabbit",
  Dragon: "Rooster",
  Rooster: "Dragon",
  Snake: "Monkey",
  Monkey: "Snake",
  Horse: "Goat",
  Goat: "Horse",
};

export const THREE_HARMONY: Record<string, string[]> = {
  Rat: ["Dragon", "Monkey"],
  Dragon: ["Rat", "Monkey"],
  Monkey: ["Rat", "Dragon"],
  Ox: ["Snake", "Rooster"],
  Snake: ["Ox", "Rooster"],
  Rooster: ["Ox", "Snake"],
  Tiger: ["Horse", "Dog"],
  Horse: ["Tiger", "Dog"],
  Dog: ["Tiger", "Horse"],
  Rabbit: ["Pig", "Goat"],
  Pig: ["Rabbit", "Goat"],
  Goat: ["Rabbit", "Pig"],
};

// Based on DM
export const STEM_NOBLEMAN: Record<string, string[]> = {
  Jia: ["Ox", "Goat"],
  Wu: ["Ox", "Goat"],
  Geng: ["Ox", "Goat"],
  Yi: ["Rat", "Monkey"],
  Ji: ["Rat", "Monkey"],
  Bing: ["Pig", "Rooster"],
  Ding: ["Pig", "Rooster"],
  Ren: ["Rabbit", "Snake"],
  Gui: ["Rabbit", "Snake"],
  Xin: ["Horse", "Tiger"],
};

// Based on Month Pillar
export const TRAVELING_HORSE: Record<string, string> = {
  Snake: "Pig",
  Rooster: "Pig",
  Ox: "Pig",
  Tiger: "Monkey",
  Horse: "Monkey",
  Dog: "Monkey",
  Pig: "Snake",
  Rabbit: "Snake",
  Goat: "Snake",
  Monkey: "Tiger",
  Rat: "Tiger",
  Dragon: "Tiger",
};

export const PEACH_BLOSSOM: Record<string, string> = {
  Snake: "Horse",
  Rooster: "Horse",
  Ox: "Horse",
  Tiger: "Rabbit",
  Horse: "Rabbit",
  Dog: "Rabbit",
  Pig: "Rat",
  Rabbit: "Rat",
  Goat: "Rat",
  Monkey: "Rooster",
  Rat: "Rooster",
  Dragon: "Rooster",
};

// Based on DM - Intelligence
export const ACADEMIC_STAR: Record<string, string> = {
  Jia: "Snake",
  Yi: "Horse",
  Bing: "Monkey",
  Ding: "Rooster",
  Wu: "Monkey",
  Ji: "Rooster",
  Geng: "Pig",
  Xin: "Rat",
  Ren: "Tiger",
  Gui: "Rabbit",
};

// ROBBING SHA (Jie Sha) - Based on Year/Day Branch (Trinity Group)
// "The Wealth Leak"
// Monkey/Rat/Dragon -> Snake
// Tiger/Horse/Dog -> Pig
// Snake/Rooster/Ox -> Tiger
// Pig/Rabbit/Goat -> Monkey
export const ROBBING_SHA: Record<string, string> = {
  Monkey: "Snake",
  Rat: "Snake",
  Dragon: "Snake",
  Tiger: "Pig",
  Horse: "Pig",
  Dog: "Pig",
  Snake: "Tiger",
  Rooster: "Tiger",
  Ox: "Tiger",
  Pig: "Monkey",
  Rabbit: "Monkey",
  Goat: "Monkey",
};

// SOLITARY STAR (Gu Chen) - Based on Year Branch
// "The Loner"
export const SOLITARY_STAR: Record<string, string> = {
  Pig: "Tiger",
  Rat: "Tiger",
  Ox: "Tiger", // Winter -> Tiger
  Tiger: "Snake",
  Rabbit: "Snake",
  Dragon: "Snake", // Spring -> Snake
  Snake: "Monkey",
  Horse: "Monkey",
  Goat: "Monkey", // Summer -> Monkey
  Monkey: "Pig",
  Rooster: "Pig",
  Dog: "Pig", // Autumn -> Pig
};

// DEATH GOD (Wang Shen) - The "Legal/Focus Trap"
// Calculation: Derived from Year Branch (Trinity)
export const DEATH_GOD: Record<string, string> = {
  Monkey: "Pig",
  Rat: "Pig",
  Dragon: "Pig",
  Tiger: "Snake",
  Horse: "Snake",
  Dog: "Snake",
  Snake: "Monkey",
  Rooster: "Monkey",
  Ox: "Monkey",
  Pig: "Tiger",
  Rabbit: "Tiger",
  Goat: "Tiger",
};

export const BRANCH_START_TIMES: Record<string, number> = {
  Ox: 1,
  Tiger: 3,
  Rabbit: 5,
  Dragon: 7,
  Snake: 9,
  Horse: 11,
  Goat: 13,
  Monkey: 15,
  Rooster: 17,
  Dog: 19,
  Pig: 21,
  Rat: 23,
};

// The 10 Stems in order (Critical for index calculation)
// prettier-ignore
export const STEM_ORDER: string[] = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];

// The 12 Branches in order
// prettier-ignore
export const BRANCH_ORDER: string[] = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

export const STEM_MAP: Record<string, string> = {
  甲: "Jia",
  乙: "Yi",
  丙: "Bing",
  丁: "Ding",
  戊: "Wu",
  己: "Ji",
  庚: "Geng",
  辛: "Xin",
  壬: "Ren",
  癸: "Gui",
};

export const STEMS: Record<string, string> = {
  甲: "Jia (Wood)",
  乙: "Yi (Wood)",
  丙: "Bing (Fire)",
  丁: "Ding (Fire)",
  戊: "Wu (Earth)",
  己: "Ji (Earth)",
  庚: "Geng (Metal)",
  辛: "Xin (Metal)",
  壬: "Ren (Water)",
  癸: "Gui (Water)",
};

export const BRANCHES: Record<string, string> = {
  子: "Rat",
  丑: "Ox",
  寅: "Tiger",
  卯: "Rabbit",
  辰: "Dragon",
  巳: "Snake",
  午: "Horse",
  未: "Goat",
  申: "Monkey",
  酉: "Rooster",
  戌: "Dog",
  亥: "Pig",
};

export const STEMS_LIST: string[] = [
  "Jia",
  "Yi",
  "Bing",
  "Ding",
  "Wu",
  "Ji",
  "Geng",
  "Xin",
  "Ren",
  "Gui",
];

export const BRANCHES_LIST: string[] = [
  "Rat",
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
];

export const OFFICERS: Record<string, string> = {
  建: "Establish",
  除: "Remove",
  满: "Full",
  平: "Balance",
  定: "Stable",
  执: "Initiate",
  破: "Destruction",
  危: "Danger",
  成: "Success",
  收: "Receive",
  开: "Open",
  闭: "Close",
};

export interface OfficerDefinition {
  name: string;
  quality: "Auspicious" | "Neutral" | "Mixed" | "Inauspicious";
  baseScore: number; // The starting "luck value" before personal elements apply
  description: string;
}
export const OFFICER_DATA: Record<string, OfficerDefinition> = {
  // --- TIER 1: GENERALLY EXCELLENT ---
  Success: {
    name: "Success",
    quality: "Auspicious",
    baseScore: 15, // High Boost
    description:
      "The most auspicious day. Great for almost every positive activity.",
  },
  Open: {
    name: "Open",
    quality: "Auspicious",
    baseScore: 10,
    description: "Good for opening shop, networking, and housewarming.",
  },
  Stable: {
    name: "Stable",
    quality: "Auspicious",
    baseScore: 10,
    description:
      "Great for long-term activities, marriage, and medical treatments.",
  },
  Full: {
    name: "Full",
    quality: "Auspicious",
    baseScore: 10,
    description: "Good for abundance, signing contracts, and collecting debt.",
  },

  // --- TIER 2: GOOD / CONTEXTUAL ---
  Establish: {
    name: "Establish",
    quality: "Auspicious",
    baseScore: 8,
    description:
      "Good for starting new jobs, proposing marriage, or business deals.",
  },
  Remove: {
    name: "Remove",
    quality: "Mixed",
    baseScore: 5, // Positive for cleansing, negative for acquisition
    description: "Excellent for detox and cleaning. Bad for signing contracts.",
  },
  Balance: {
    name: "Balance",
    quality: "Neutral",
    baseScore: 5,
    description:
      "Good for negotiations and marriage. Bad for legal disputes (wins become ties).",
  },
  Initiate: {
    name: "Initiate",
    quality: "Neutral",
    baseScore: 2,
    description: "Good for renovations and groundwork. Often mild energy.",
  },
  Receive: {
    name: "Receive",
    quality: "Mixed",
    baseScore: 0, // Neutral because it can mean 'receiving illness' too
    description: "Good for getting rewards/education. Avoid visiting the sick.",
  },

  // --- TIER 3: RISKY / SPECIALIST ---
  Danger: {
    name: "Danger",
    quality: "Mixed",
    baseScore: -5, // Negative baseline, but not terrible
    description:
      "Unstable energy. Good for religious acts/bed positioning. Bad for travel/risk.",
  },
  Destruction: {
    name: "Destruction",
    quality: "Inauspicious",
    baseScore: -10, // Harsh energy
    description:
      "Good only for demolition or surgery. Bad for everything else.",
  },
  Close: {
    name: "Close",
    quality: "Inauspicious",
    baseScore: -15, // Stagnant energy
    description:
      "Qi is still. Good for burial or saving money. Bad for everything else.",
  },
};

export interface StandardRule {
  officers: string[];
  type: "wealth" | "career" | "health";
  action: string;
  icon: string;
  description: string;
}
export const STANDARD_RULES: StandardRule[] = [
  // --- WEALTH ---
  {
    officers: ["Success"],
    type: "wealth",
    action: "Sign Contracts",
    icon: "📝",
    description:
      "The #1 day for closing deals, financial agreements, and binding contracts.",
  },
  {
    officers: ["Open", "Full"],
    type: "wealth",
    action: "Networking & Sales",
    icon: "🥂",
    description: "Launch projects, host events, or network with crowds.",
  },
  {
    officers: ["Receive"],
    type: "wealth",
    action: "Ask for Favors",
    icon: "🤲",
    description: "Collect debts, ask for funding, or seek mentorship.",
  },
  {
    officers: ["Full"],
    type: "wealth",
    action: "Branding & Visibility",
    icon: "🌟",
    description:
      "Maximize returns, debt collection, and high-visibility marketing.",
  },
  // --- CAREER ---
  {
    officers: ["Stable"],
    type: "career",
    action: "Acquire Assets",
    icon: "🏦",
    description:
      "Buy property, hire key staff, or lock in long-term investments.",
  },
  {
    officers: ["Establish"],
    type: "career",
    action: "Start New Role",
    icon: "🏗️",
    description: "Begin a new job, lay groundwork, or discuss future strategy.",
  },
  {
    officers: ["Remove"],
    type: "career",
    action: "Fix Problems",
    icon: "🧹",
    description:
      "Remove obstacles, fire bad clients, or solve technical issues.",
  },
  {
    officers: ["Balance"],
    type: "career",
    action: "Negotiations",
    icon: "⚖️",
    description: "Resolve conflicts or negotiate terms with partners.",
  },
  // --- HEALTH ---
  {
    officers: ["Remove", "Destruction"],
    type: "health",
    action: "Health & Reset",
    icon: "🧘‍♀️",
    description:
      "Best day to remove illness, start a detox, have surgery, or break bad habits.",
  },
  {
    officers: ["Balance"],
    type: "health",
    action: "Adjustment/Therapy",
    icon: "🧘",
    description:
      "Ideal for alignment (chiropractic), therapy, or balancing diet.",
  },
  {
    officers: ["Stable"],
    type: "health",
    action: "Start Long-term Treatment",
    icon: "💊",
    description: "Begin a long course of medication or a new fitness regime.",
  },
];

export const OFFICER_RECOMMENDATIONS: Record<
  string,
  { action: string; icon: string; desc: string; reality: string }
> = {
  Establish: {
    action: "Launch",
    icon: "🚀",
    desc: "Start new jobs, propose marriage, business opening.",
    reality:
      "Foundations laid today will likely crumble. Do not start what you cannot finish.",
  },
  Remove: {
    action: "Cleanse",
    icon: "🧹",
    desc: "Medical procedures, decluttering, ending bad habits.",
    reality:
      "High risk of removing the wrong thing or medical complications. Postpone procedures.",
  },
  Full: {
    action: "Sign",
    icon: "✍️",
    desc: "Signatures, events, gatherings. Avoid legal disputes.",
    reality:
      "You may sign a contract that burdens rather than benefits you. Abundance turns into clutter.",
  },
  Balance: {
    action: "Negotiate",
    icon: "⚖️",
    desc: "Resolve conflicts, therapy, marriage, leveling.",
    reality:
      "The scales will likely tip against you. Negotiations will end in unfair terms.",
  },
  Stable: {
    action: "Build",
    icon: "🏗️",
    desc: "Long-term activities, hiring employees, buying assets.",
    reality:
      "You are locking yourself into a stagnant or problematic situation with no easy exit.",
  },
  Initiate: {
    action: "Act",
    icon: "⚡",
    desc: "Starting fast projects, swift actions. Avoid travel.",
    reality:
      "Rushing today invites accidents or immediate pushback. Speed kills.",
  },
  Destruction: {
    action: "Demolish",
    icon: "💣",
    desc: "Tearing down buildings, breaking up, analyzing data.",
    reality:
      "Destructive energy may spiral out of control. Avoid risky physical activities.",
  },
  Danger: {
    action: "Pray",
    icon: "🙏",
    desc: "Religious worship only. High risk generally.",
    reality:
      "The inherent danger of this day is amplified by your lack of support. Stay safe.",
  },
  Success: {
    action: "Succeed",
    icon: "🌟",
    desc: "The best general day. Everything goes smoothly.",
    reality:
      "Even a 'Success' day fails if your personal chart clashes. Expect unexpected blockers.",
  },
  Receive: {
    action: "Collect",
    icon: "📥",
    desc: "Collecting debts, asking for a raise, education.",
    reality:
      "You are more likely to lose resources than receive them. Do not ask for favors.",
  },
  Open: {
    action: "Welcome",
    icon: "🎉",
    desc: "Grand openings, housewarming, welcoming guests.",
    reality:
      "Public exposure today invites criticism or visible failure. Keep a low profile.",
  },
  Close: {
    action: "Store",
    icon: "🔒",
    desc: "Storing assets, burying, closing deals. Bad for new starts.",
    reality:
      "Energy is stagnant. You risk being trapped in a bad deal with no exit strategy.",
  },
};

export const STARS: Record<string, string> = {
  角: "Horn",
  亢: "Neck",
  氐: "Foundation",
  房: "House",
  心: "Heart",
  尾: "Tail",
  箕: "Basket",
  斗: "Dipper",
  牛: "Ox",
  女: "Weaving Maiden",
  虚: "Void",
  危: "Danger",
  室: "Room",
  壁: "Wall",
  奎: "Astride",
  娄: "Mound",
  胃: "Stomach",
  昴: "Pleiades",
  毕: "Net",
  觜: "Beak",
  参: "Orion",
  井: "Well",
  鬼: "Ghost",
  柳: "Willow",
  星: "Star",
  张: "Bow",
  翼: "Wing",
  轸: "Carriage",
};

export interface Constellation {
  name: string;
  chineseName: string;
  pinyin: string;
  group: "East" | "South" | "West" | "North";
  element: "Wood" | "Fire" | "Earth" | "Metal" | "Water";
  quality: "Good" | "Bad" | "Mixed";
  keywords: string[];
  description: string;
}
export const CONSTELLATION_DATA: Record<string, Constellation> = {
  // --- GREEN DRAGON (EAST) ---
  Horn: {
    name: "Horn",
    chineseName: "角",
    pinyin: "Jiao",
    group: "East",
    element: "Wood", // [1]
    quality: "Good",
    keywords: ["Wealth", "Assets", "Marriage", "Travel"],
    description:
      "The King of Stars. Excellent for increasing wealth, ground-breaking, and marriage. Avoid funerals.",
  },
  Neck: {
    name: "Neck",
    chineseName: "亢",
    pinyin: "Kang",
    group: "East",
    element: "Metal", // [2]
    quality: "Bad",
    keywords: ["Loss", "Divorce", "Scuppered Plans"],
    description:
      "Generally causes loss or failure in business and marriage. Only good for divorce or ending abusive relationships.",
  },
  Foundation: {
    name: "Foundation",
    chineseName: "氐",
    pinyin: "Di",
    group: "East",
    element: "Earth", // [3]
    quality: "Mixed",
    keywords: ["Public Speaking", "Property", "Injury"],
    description:
      "Good for public events and property investment. Bad for construction (risk of fire) or travel.",
  },
  House: {
    name: "House",
    chineseName: "房",
    pinyin: "Fang",
    group: "East",
    element: "Fire", // [4]
    quality: "Good",
    keywords: ["Prosperity", "Multiplier", "Container"],
    description:
      "The Rabbit Star. Great for wealth accumulation, marriage, and long-distance travel. Contains energy.",
  },
  Heart: {
    name: "Heart",
    chineseName: "心",
    pinyin: "Xin",
    group: "East",
    element: "Fire", // [5] but associated with Fire star
    quality: "Bad",
    keywords: ["Disaster", "Plague", "Affliction"],
    description:
      "Inauspicious in most contexts. Risk of medical issues, legal troubles, and disasters. Avoid.",
  },
  Tail: {
    name: "Tail",
    chineseName: "尾",
    pinyin: "Wei",
    group: "East",
    element: "Fire", // [6]
    quality: "Good",
    keywords: ["Negotiation", "Closing Deals", "Renovation"],
    description:
      "Excellent for finalising contracts, weddings, and construction. Amplifies good fortune.",
  },
  Basket: {
    name: "Basket",
    chineseName: "箕",
    pinyin: "Ji",
    group: "East",
    element: "Water", // [7]
    quality: "Good",
    keywords: ["Collections", "Feng Shui", "Business"],
    description:
      "The Star of Commerce. Best for debt collection, receiving money, and Feng Shui water placement.",
  },

  // --- RED PHOENIX (SOUTH) ---
  Well: {
    name: "Well",
    chineseName: "井",
    pinyin: "Jing",
    group: "South",
    element: "Wood", // [8]
    quality: "Mixed",
    keywords: ["Planning", "Legal", "Obstacles"],
    description:
      "Good for planning and legal work, but generally difficult progress. Avoid for marriage.",
  },
  Ghost: {
    name: "Ghost",
    chineseName: "鬼",
    pinyin: "Gui",
    group: "South",
    element: "Metal", // [9]
    quality: "Bad",
    keywords: ["Fear", "Withdrawal", "Negative Influence"],
    description:
      "Associated with spirit realm and fear. Avoid for important personal or business activities.",
  },
  Willow: {
    name: "Willow",
    chineseName: "柳",
    pinyin: "Liu",
    group: "South",
    element: "Earth", // [10]
    quality: "Bad",
    keywords: ["Discord", "Anxiety", "Tantrums"],
    description:
      "Aggressive energy. Hinders progress and causes relationship disharmony.",
  },
  Star: {
    name: "Star",
    chineseName: "星",
    pinyin: "Xing",
    group: "South",
    element: "Fire", // [11]
    quality: "Mixed",
    keywords: ["Negotiation", "Openings", "Loneliness"],
    description:
      "Good for business openings and negotiations. Bad for marriage and funerals.",
  },
  Bow: {
    name: "Bow",
    chineseName: "張",
    pinyin: "Zhang",
    group: "South",
    element: "Fire", // [12]
    quality: "Good",
    keywords: ["Launches", "Branding", "Reunion"],
    description:
      "Purely positive. Great for branding, launches, and mending relationships.",
  },
  Wing: {
    name: "Wing",
    chineseName: "翼",
    pinyin: "Yi",
    group: "South",
    element: "Fire", // [13]
    quality: "Bad",
    keywords: ["Treachery", "Change of Tides", "Separation"],
    description:
      "Inauspicious. Represents betrayal or sudden negative changes. Avoid for partnerships.",
  },
  Carriage: {
    name: "Carriage",
    chineseName: "軫",
    pinyin: "Zhen",
    group: "South",
    element: "Water", // [14]
    quality: "Good",
    keywords: ["Transport", "Sales", "Return on Investment"],
    description:
      "Great for travel, logistics, and business travel. Fosters cooperation and sales.",
  },

  // --- WHITE TIGER (WEST) ---
  Astride: {
    name: "Astride",
    chineseName: "奎",
    pinyin: "Kui",
    group: "West",
    element: "Wood", // [15]
    quality: "Good",
    keywords: ["Renovation", "Travel", "Unity"],
    description:
      "The Treasure of the Sky. Good for construction and travel. Bad for opening ceremonies (legal risk).",
  },
  Mound: {
    name: "Mound",
    chineseName: "婁",
    pinyin: "Lou",
    group: "West",
    element: "Metal", // [16] (Arietis/Metal)
    quality: "Good",
    keywords: ["Health", "Wealth Guardian", "Medicine"],
    description:
      "Guardian of Wealth. Excellent for seeking medical treatment and long-term asset accumulation.",
  },
  Stomach: {
    name: "Stomach",
    chineseName: "胃",
    pinyin: "Wei",
    group: "West",
    element: "Earth", // [17]
    quality: "Good",
    keywords: ["Storage", "Savings", "Value"],
    description:
      "Good for long-term savings, storage, and value retention. Stable energy.",
  },
  Pleiades: {
    name: "Pleiades",
    chineseName: "昴",
    pinyin: "Mao",
    group: "West",
    element: "Fire", // [18] (Sun/Fire)
    quality: "Bad",
    keywords: ["Endings", "Gossip", "Financial Ruin"],
    description:
      "Represents finality and the closing of gates. Avoid for all new beginnings.",
  },
  Net: {
    name: "Net",
    chineseName: "畢",
    pinyin: "Bi",
    group: "West",
    element: "Metal", // [19] associated with Moon/Metal
    quality: "Mixed",
    keywords: ["Capture", "Construction", "Hunting"],
    description:
      "Good for construction and hunting/capturing. Bad for freedom/release.",
  },
  Beak: {
    name: "Beak",
    chineseName: "觜",
    pinyin: "Zui",
    group: "West",
    element: "Fire", // [20]
    quality: "Bad",
    keywords: ["Arguments", "Legal issues", "Loss"],
    description:
      "Highly negative for date selection. Risk of conflict and legal trouble.",
  },
  Orion: {
    name: "Orion",
    chineseName: "參",
    pinyin: "Shen",
    group: "West",
    element: "Water", // [21]
    quality: "Mixed",
    keywords: ["Business", "Promotion", "Construction"],
    description:
      "Excellent for business and construction (Three Generals). Bad for marriage (fidelity issues).",
  },

  // --- BLACK TORTOISE (NORTH) ---
  Dipper: {
    name: "Dipper",
    chineseName: "斗",
    pinyin: "Dou",
    group: "North",
    element: "Water", // [22]
    quality: "Good",
    keywords: ["Ambition", "Career", "Feng Shui"],
    description:
      "The Temple of Heaven. Great for career advancement, Feng Shui, and commercial activities.",
  },
  Ox: {
    name: "Ox",
    chineseName: "牛",
    pinyin: "Niu",
    group: "North",
    element: "Metal", // [23]
    quality: "Bad",
    keywords: ["Broken Promises", "Loss", "Disaster"],
    description:
      "Disastrous for contracts and marriage. Symbolises labour with no reward.",
  },
  "Weaving Maiden": {
    name: "Weaving Maiden",
    chineseName: "女",
    pinyin: "Nu",
    group: "North",
    element: "Earth", // [24]
    quality: "Mixed",
    keywords: ["Disputes", "Construction", "Learning"],
    description:
      "Good for academic pursuits and construction. Bad for relationships and legal matters.",
  },
  Void: {
    name: "Void",
    chineseName: "虛",
    pinyin: "Xu",
    group: "North",
    element: "Fire", // [25]
    quality: "Bad",
    keywords: ["Emptiness", "Illness", "Grief"],
    description:
      "Exclusively negative for Date Selection. Associated with illness and sadness.",
  },
  Danger: {
    name: "Danger",
    chineseName: "危",
    pinyin: "Wei",
    group: "North",
    element: "Fire", // [26]
    quality: "Bad",
    keywords: ["Danger", "Bodily Harm", "Extreme Risk"],
    description:
      "Represents looming danger. Avoid for travel and physical activities.",
  },
  Room: {
    name: "Room",
    chineseName: "室",
    pinyin: "Shi",
    group: "North",
    element: "Water", // [27]
    quality: "Good",
    keywords: ["Multiplier", "Real Estate", "Marriage"],
    description:
      "The Room of accumulation. Excellent for marriage, real estate, and multiplying wealth.",
  },
  Wall: {
    name: "Wall",
    chineseName: "壁",
    pinyin: "Bi",
    group: "North",
    element: "Water", // [28]
    quality: "Good",
    keywords: ["Stability", "Protection", "Contracts"],
    description:
      "Blocks negative energy. Good for signing contracts, archives, and official openings.",
  },
};

// Dictionary for the 28 Constellations
export const STAR_DEFINITIONS: Record<string, string> = {
  // --- EAST (Wood / Green Dragon) ---
  Horn: "Excellent for marriage, travel, and construction. Represents new growth.",
  Neck: "Negative for marriage and construction. Good for divorce or separating.",
  Foundation:
    "Good for public speaking and property. Bad for construction (Fire risk).",
  House:
    "Great for marriage and travel. Increases wealth. The 'Rabbit' of the East.",
  Heart:
    "Bad for most activities, especially medical/surgery. Risk of Frauds. Good for travel.",
  Tail: "Strong auspicious star. Good for closing deals, renovation, and marriage.",
  Basket:
    "Good for finance and debt collection. Associated with wind and gossip.",

  // --- NORTH (Water / Black Tortoise) ---
  Dipper:
    "The 'Temple of Heaven'. Excellent for commercial alignment and goals.",
  Ox: "Disastrous for marriage and contracts. Broken promises and stagnation.",
  "Weaving Maiden": "Good for construction and study. A star of gratitude.",
  Void: "Darkness and emptiness. Bad for almost all personal and financial actions.",
  Danger: "Bodily harm and misfortune. AVOID construction and extreme sports.",
  Room: "The 'Great Wealth' star. Multiplies Wealth. Excellent for marriage, assets, and accumulation. BAD for Burial/Medical/Divorce (Multiplies the bad thing)",
  Wall: "Protects Wealth. Stability and growth. Good for documents, signing, and intellectual work.",

  // --- WEST (Metal / White Tiger) ---
  Astride:
    "Good for travel and renovation. Avoid opening new businesses (legal issues).",
  Mound:
    "The Guardian of Wealth. Stores Wealth. Excellent for trading, family, and gathering.",
  Stomach: "The Storehouse. Good for savings and long-term storage.",
  Pleiades:
    "The End. Highly negative. Represents closure, death, or judicial trouble.",
  Net: "Good for construction and 'catching'. Beneficial for military/police.",
  Beak: "Highly Negative. Avoid important activities. Risk of doubt and loss.",
  Orion: "Good for travel and trade. Volatile for marriage or burials.",

  // --- SOUTH (Fire / Red Phoenix) ---
  Well: "Good for planning and legal appeals. Avoid medical procedures.",
  Ghost:
    "Negative for most public events. Good for funerals or spiritual detachment.",
  Willow: "Cruelty and anxiety. Bad for social events; prone to discord.",
  Star: "Creativity and negotiation. Good for openings, bad for funerals.",
  Bow: "Purely positive. Launches Wealth. The 'Reformed' star. Great for new endeavors and marriage.", // Correction: Source says Auspicious
  Wing: "The 'Changer of Tides'. Unstable. Bad for marriage, good for escaping trouble.",
  Carriage:
    "Moves/Transports Wealth. Good for business expansion, transport, and seeking assistance.",
};

export const YELLOW_BLACK_BELT: YellowBlackBelt[] = [
  // 1. Qing Long (Green Dragon)
  {
    name: "Green Dragon",
    type: "Yellow",
    icon: "🐉",
    desc: "Supreme Auspicious. Great for everything.",
  },
  // 2. Ming Tang (Bright Hall)
  {
    name: "Bright Hall",
    type: "Yellow",
    icon: "✨",
    desc: "Noble help, success, and clarity.",
  },
  // 3. Tian Xing (Heavenly Punishment)
  {
    name: "Heavenly Punishment",
    type: "Black",
    icon: "⚖️",
    desc: "Legal issues, conflict, punishment.",
  },
  // 4. Zhu Que (Red Phoenix)
  {
    name: "Red Phoenix",
    type: "Black",
    icon: "🐦",
    desc: "Arguments, gossip, and noise.",
  },
  // 5. Jin Kui (Golden Lock)
  {
    name: "Golden Lock",
    type: "Yellow",
    icon: "🔒",
    desc: "Accumulating wealth, savings, stability.",
  },
  // 6. Tian De (Precious Light / Heaven Virtue)
  {
    name: "Precious Light",
    type: "Yellow",
    icon: "💎",
    desc: "Charisma, status, and recognition.",
  },
  // 7. Bai Hu (White Tiger)
  {
    name: "White Tiger",
    type: "Black",
    icon: "🐯",
    desc: "Injury, blood, accidents, travel risks.",
  },
  // 8. Yu Tang (Jade Hall)
  {
    name: "Jade Hall",
    type: "Yellow",
    icon: "🏛️",
    desc: "Career advancement, study, academic success.",
  },
  // 9. Tian Lao (Heavenly Jail)
  {
    name: "Heavenly Jail",
    type: "Black",
    icon: "⛓️",
    desc: "Trapped, delays, feeling stuck.",
  },
  // 10. Xuan Wu (Black Tortoise)
  {
    name: "Black Tortoise",
    type: "Black",
    icon: "🐢",
    desc: "Theft, loss, hidden danger, deception.",
  },
  // 11. Si Ming (Life Governor)
  {
    name: "Life Governor",
    type: "Yellow",
    icon: "📜",
    desc: "Longevity, health, resolving problems.",
  },
  // 12. Gou Chen (Grappling Hook)
  {
    name: "Grappling Hook",
    type: "Black",
    icon: "🪝",
    desc: "Entanglements, complications, hard to leave.",
  },
];

// --- THE 9 LUMINARIES (7 Planets + 2 Nodes) ---
interface Luminaries {
  name: string;
  element: string;
  icon: string;
  color: string;
}
export const NINE_LUMINARIES: Luminaries[] = [
  { name: "Sun", element: "Fire", icon: "☀️", color: "#e67e22" }, // 1
  { name: "Moon", element: "Water", icon: "🌙", color: "#3498db" }, // 2
  { name: "Wood", element: "Wood", icon: "🌲", color: "#27ae60" }, // 3 (Jupiter)
  { name: "Water", element: "Water", icon: "💧", color: "#2980b9" }, // 4 (Mercury)
  { name: "Metal", element: "Metal", icon: "⚔️", color: "#f1c40f" }, // 5 (Venus)
  { name: "Fire", element: "Fire", icon: "🔥", color: "#c0392b" }, // 6 (Mars)
  { name: "Earth", element: "Earth", icon: "🏔️", color: "#7f8c8d" }, // 7 (Saturn)
  { name: "Black Node", element: "Earth", icon: "🌑", color: "#2c3e50" }, // 8 (Rahu)
  { name: "Scarlet Node", element: "Fire", icon: "☄️", color: "#8e44ad" }, // 9 (Ketu)
];

export const NINE_STARS: Record<string, string> = {
  "1": "1 White (Noble)",
  "2": "2 Black (Sickness)",
  "3": "3 Jade (Conflict)",
  "4": "4 Green (Wisdom)",
  "5": "5 Yellow (Disaster)",
  "6": "6 White (Authority)",
  "7": "7 Red (Robbery)",
  "8": "8 White (Asset/Slow)", // Updated from "Wealth"
  "9": "9 Purple (King/Wealth)", // Updated from "Celebration"
};
export const NINE_STAR_DEFINITIONS: Record<string, string> = {
  "1 White (Noble)":
    "Future Wealth & Noble People. Excellent for networking, reputation, and wisdom.",
  "2 Black (Sickness)":
    "The Illness Star. Risk of fatigue and abdominal issues. Avoid medical procedures. Good for land accumulation (long term) only.",
  "3 Jade (Conflict)":
    "The Quarrel Star. High risk of arguments, lawsuits, and theft. Keep a low profile.",
  "4 Green (Wisdom)":
    "Academic & Romance Star. Excellent for study, writing, and courtship. (Warning: Can cause relationship scandals if misused).",
  "5 Yellow (Disaster)":
    "The Five Yellow. Highly unstable. Risk of total calamity, financial loss, and accidents. AVOID ALL IMPORTANT ACTIVITY.",
  "6 White (Authority)":
    "The Military Star. Good for execution, discipline, and authority. Favors blue-collar or technical work.",
  "7 Red (Robbery)":
    "The Broken Soldier. Risk of theft, betrayal, and injury by metal. Watch your words and your belongings.",
  "8 White (Asset/Slow)":
    "The Fading Wealth. Good for salary, savings, and stability. Too slow for investments or launches.",
  "9 Purple (King/Wealth)":
    "The Supreme Wealth Star (Period 9). The strongest energy for Money, Fame, Launches, and Visibility.",
};

export interface Advice {
  good: string[];
  bad: string[];
}
export const OFFICER_ADVICE: Record<string, Advice> = {
  Establish: {
    good: [
      "Start New Job",
      "Business Negotiations",
      "Travel",
      "Medical Treatment",
    ],
    bad: ["Funeral", "Digging Earth"],
  },
  Remove: {
    good: [
      "Cleaning",
      "Medical Procedures",
      "Ending Relationships",
      "Demolition",
    ],
    bad: ["Marriage", "Adoption", "Opening Business"],
  },
  Full: {
    good: ["Signing Contracts", "Marriage", "Installing Equipment", "Parties"],
    bad: ["Legal Disputes", "Demolition"],
  },
  Balance: {
    good: ["Marriage", "Construction", "Planning", "Negotiation"],
    bad: ["Lawsuits", "Inheritance"],
  },
  Stable: {
    good: ["Marriage", "Trading", "Hiring Employees", "Medical"],
    bad: ["Moving House", "Lawsuits", "Travel"],
  },
  Initiate: {
    good: ["Start Construction", "Renovation"],
    bad: ["Travel", "Moving House", "Marriage"],
  },
  Destruction: {
    good: ["Demolition", "Punishing Criminals"],
    bad: ["Marriage", "Opening Business", "Signing Contracts", "Travel"],
  },
  Danger: {
    good: ["Religious Activities", "Positioning Bed"],
    bad: ["Extreme Sports", "Travel by Sea", "Construction (High Places)"],
  },
  Success: {
    good: ["Everything! (Marriage, Contracts, Travel, Business)"],
    bad: ["Litigation", "Conflict"],
  },
  Receive: {
    good: ["Collecting Debts", "Closing a Deal", "Saving Money"],
    bad: ["Medical Treatment", "Funeral", "Sending Money"],
  },
  Open: {
    good: ["Opening Business", "Marriage", "House Warming", "Sign Contracts"],
    bad: ["Burial", "Digging Earth"],
  },
  Close: {
    good: ["Burial", "Storing Assets", "Setting Monuments"],
    bad: ["Eye Surgery", "Opening Business", "Medical Treatment"],
  },
};

export const SAN_SHA_RULES: Record<string, string[]> = {
  // Water Frame (Shen-Zi-Chen)
  Monkey: ["Snake", "Horse", "Goat"],
  Rat: ["Snake", "Horse", "Goat"],
  Dragon: ["Snake", "Horse", "Goat"],

  // Fire Frame (Yin-Wu-Xu)
  Tiger: ["Pig", "Rat", "Ox"],
  Horse: ["Pig", "Rat", "Ox"],
  Dog: ["Pig", "Rat", "Ox"],

  // Metal Frame (Si-You-Chou)
  Snake: ["Tiger", "Rabbit", "Dragon"],
  Rooster: ["Tiger", "Rabbit", "Dragon"],
  Ox: ["Tiger", "Rabbit", "Dragon"],

  // Wood Frame (Hai-Mao-Wei)
  Pig: ["Monkey", "Rooster", "Dog"],
  Rabbit: ["Monkey", "Rooster", "Dog"],
  Goat: ["Monkey", "Rooster", "Dog"],
};

export const GOAT_BLADE_RULES: Record<string, string> = {
  // YANG STEMS (True Blade - High Danger)
  Jia: "Rabbit",
  Bing: "Horse",
  Wu: "Horse",
  Geng: "Rooster",
  Ren: "Rat",

  // YIN STEMS (Secondary Blade - Moderate Danger)
  Yi: "Dragon",
  Ding: "Snake",
  Ji: "Snake",
  Xin: "Dog",
  Gui: "Pig",
};

export const TEN_GODS: Record<string, Record<string, string>> = {
  Companion: {
    Same: "Friend", // Bi Jian (Self)
    Diff: "Rob Wealth", // Jie Cai (Competitor)
  },
  Output: {
    Same: "Eating God", // Shi Shen (Artist)
    Diff: "Hurting Officer", // Shang Guan (Rebel)
  },
  Wealth: {
    Same: "Indirect Wealth", // Pian Cai (Entrepreneur)
    Diff: "Direct Wealth", // Zheng Cai (Employee/Manager)
  },
  Influence: {
    Same: "7 Killings", // Qi Sha (General)
    Diff: "Direct Officer", // Zheng Guan (Official)
  },
  Resource: {
    Same: "Indirect Resource", // Pian Yin (Mystic)
    Diff: "Direct Resource", // Zheng Yin (Sage)
  },
};

export const TEN_GOD_ACTIONS: Record<
  string,
  {
    title: string;
    tagline: string;
    best: string[];
    caution: string;
    keywords: string;
  }
> = {
  // 🟢 COMPANION
  Friend: {
    title: "The Mirror",
    tagline: "Connecting with equals.",
    best: [
      "Consolidation: Strengthening existing partnerships.",
      "Networking: Meeting peers, colleagues, or people of similar status.",
      "Self-Reliance: Working solo on personal projects; focusing on confidence.",
      "Negotiation: Signing 'Win-Win' deals where both sides are equal.",
    ],
    caution: "Stubbornness. Avoid arguments where you refuse to compromise.",
    keywords: "Partnership, Equality, Confidence",
  },
  "Rob Wealth": {
    title: "The Competitor",
    tagline: "Social magnetism and spending.",
    best: [
      "Socializing: Parties, gatherings, and building a 'tribe'.",
      "Team Building: Rallying people toward a cause.",
      "Intentional Spending: Investing money in marketing or treating clients.",
      "Public Speaking: Engaging a crowd with charisma.",
    ],
    caution:
      "Financial loss. Do NOT gamble, lend money, or sign financial guarantees today.",
    keywords: "Charisma, Spending, Crowds",
  },

  // 🟠 OUTPUT
  "Eating God": {
    title: "The Artist",
    tagline: "Refined, long-term, gentle expression.",
    best: [
      "Strategy: Deep thinking, writing business plans, brainstorming.",
      "Enjoyment: Fine dining, wine tasting, relaxing, spa days.",
      "Soft Skills: Teaching, mentoring, or gentle persuasion.",
      "Creativity: Writing, designing, or artistic hobbies.",
    ],
    caution: "Procrastination. You might feel too lazy to do 'hard labor'.",
    keywords: "Pleasure, Strategy, Creativity",
  },
  "Hurting Officer": {
    title: "The Performer",
    tagline: "Loud, flashy, fast, rebellious.",
    best: [
      "Sales & Pitching: Aggressive marketing, loud presentations, 'Show & Tell'.",
      "Debate: Winning arguments, legal disputes, or critiquing others.",
      "Breaking Rules: Disrupting the status quo, innovating, changing systems.",
      "Performance: Being on stage, public speaking, going viral.",
    ],
    caution:
      "Offending authority. Avoid talking to your boss or the police today.",
    keywords: "Attention, Disruption, Sales",
  },

  // 🟢 WEALTH
  "Direct Wealth": {
    title: "The Manager",
    tagline: "Steady, earned, hard work.",
    best: [
      "Budgeting: Financial planning, auditing, cutting costs.",
      "Hard Work: Grinding through tasks, putting in overtime.",
      "Asset Management: Organizing files, inventory, or property.",
      "Routine Income: Salary negotiations, signing standard contracts.",
    ],
    caution: "Greed. Don't look for shortcuts; they won't work today.",
    keywords: "Savings, Diligence, Stability",
  },
  "Indirect Wealth": {
    title: "The Entrepreneur",
    tagline: "Risky, fast, big picture.",
    best: [
      "Trading: Stock market, crypto, or high-risk investments.",
      "Side Hustles: Launching a new revenue stream or project.",
      "Sales Closings: Closing big, commission-based deals.",
      "Windfalls: Buying a lottery ticket (if lucky stars align).",
    ],
    caution: "Recklessness. High risk of losing money if you are emotional.",
    keywords: "Opportunity, Risk, Cash Flow",
  },

  // 🔵 INFLUENCE
  "Direct Officer": {
    title: "The Commander",
    tagline: "Law, order, reputation.",
    best: [
      "Official Business: Applying for permits, visas, or dealing with government.",
      "SOPs: Creating rules, systems, and organizing workflows.",
      "Discipline: Sticking to a strict diet or gym routine.",
      "Status: Seeking promotion, meeting with bosses, wearing a suit.",
    ],
    caution: "Rigidity. Not a day for creativity or bending the rules.",
    keywords: "Rules, Authority, Reputation",
  },
  "7 Killings": {
    title: "The General",
    tagline: "Crisis, intensity, extreme action.",
    best: [
      "Problem Solving: Handling emergencies or crises effectively.",
      "Extreme Action: Surgery, invasive medical procedures, extreme sports.",
      "Execution: Forcing a difficult decision, firing someone, or aggressive takeovers.",
      "Discipline: High-intensity interval training (HIIT), fasting.",
    ],
    caution:
      "Stress & Injury. High risk of accidents or burnout. Do not provoke enemies.",
    keywords: "Pressure, Action, Survival",
  },

  // 🟣 RESOURCE
  "Direct Resource": {
    title: "The Sage",
    tagline: "Conventional knowledge, health, comfort.",
    best: [
      "Learning: Studying textbooks, attending formal classes.",
      "Health: Doctor visits, rest, recuperation, taking medicine.",
      "Seeking Help: Asking mentors, teachers, or noble people for advice.",
      "Planning: Analyzing data and preparing for the future.",
    ],
    caution: "Over-thinking. You might analyze too much and take zero action.",
    keywords: "Knowledge, Health, Mentors",
  },
  "Indirect Resource": {
    title: "The Mystic",
    tagline: "Intuition, unconventional, mystery.",
    best: [
      "Niche Study: Researching metaphysics, crypto, or obscure topics.",
      "Intuition: Trusting your gut feeling; meditation, spiritual practice.",
      "Innovation: Finding a 'hack' or unconventional solution to a problem.",
      "Solitude: Withdrawing from the world to think deeply.",
    ],
    caution: "Isolation. You may feel lonely, paranoid, or misunderstood.",
    keywords: "Intuition, Mystery, Unconventional",
  },
};
