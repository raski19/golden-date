export const YANG_STEMS: string[] = ["Jia", "Bing", "Wu", "Geng", "Ren"];
export const YIN_STEMS: string[] = ["Yi", "Ding", "Ji", "Xin", "Gui"];

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

export const BRANCH_ELEMENTS: Record<string, string> = {
  Tiger: "Wood",
  Rabbit: "Wood",
  Snake: "Fire",
  Horse: "Fire",
  Dragon: "Earth",
  Dog: "Earth",
  Ox: "Earth",
  Goat: "Earth",
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

// 2. Interaction Maps
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

// 3. Shen Sha (Stars) Logic
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

// 1. Time & Logistics
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

// Inherently Auspicious Stars (Safe bets for Growth, Wealth, & Starts)
export const GOOD_STARS: string[] = [
  "Room", // (Shi) The "Multiplier". Best for new business & assets [1].
  "Wall", // (Bi) "Stability & Prosperity". Blocks negative energy [2].
  "Mound", // (Lou) "Guardian of Wealth". Always good news for business [3].
  "Stomach", // (Wei) "Storehouse". Good for fulfillment & promotions [4].
  "Horn", // (Jiao) "King of Stars". Increases wealth, good for marriage [5].
  "Tail", // (Wei) "Closing Deals". Excellent for negotiations & renovation [6].
  "Bow", // (Zhang) "Purely Positive". Great for launches & branding [7].
  "Carriage", // (Zhen) "Logistics". Fosters cooperation, sales, and returns [8].
  "Orion", // (Shen) "Achievement". Promotes recognition & business negotiation [9].
  "Basket", // (Ji) "Receipt of Monies". Good for debt collection & commerce [10].
];

// Inherently Inauspicious Stars (High Risk / Avoid for important events)
export const BAD_STARS: string[] = [
  "Pleiades", // (Mao) "The End". Signifies financial ruin & finality [11].
  "Ox", // (Niu) "Broken Promises". Disastrous for contracts & marriage [12].
  "Danger", // (Wei) "Misfortune". Bodily harm & looming danger [13].
  "Ghost", // (Gui) "Fear". Strong negative influence, withdrawal [14].
  "Willow", // (Liu) "Discord". Hinders progress, causes anxiety [15].
  "Beak", // (Zui) "Loss". Highly negative for Date Selection [16].
  "Wing", // (Yi) "Tides Change". Inauspicious for weddings/partnerships [17].
  "Heart", // (Xin) "Affliction". Risk of medical issues/disasters [18].
  "Neck", // (Kang) "Collapse". Scuppers investment & construction plans [19].
  "Void", // (Xu) "Emptiness". Darkness & grief [20].
  "Star", // (Xing) "Legal Troubles". Good for openings, but bad for harmony [21, 22].
];

interface YellowBlackBelt {
  name: string;
  type: "Yellow" | "Black";
  icon: string;
  desc: string;
}
export const YELLOW_BLACK_BELT: YellowBlackBelt[] = [
  {
    name: "Green Dragon",
    type: "Yellow",
    icon: "🐉",
    desc: "Supreme Auspicious. Great for everything.",
  },
  {
    name: "Bright Hall",
    type: "Yellow",
    icon: "✨",
    desc: "Noble help, success, and clarity.",
  },
  {
    name: "Heavenly Punishment",
    type: "Black",
    icon: "⚖️",
    desc: "Legal issues, conflict, punishment.",
  },
  {
    name: "Red Phoenix",
    type: "Black",
    icon: "🐦",
    desc: "Arguments, gossip, and noise.",
  },
  {
    name: "Golden Lock",
    type: "Yellow",
    icon: "🔒",
    desc: "Accumulating wealth, savings, stability.",
  },
  {
    name: "Precious Light",
    type: "Yellow",
    icon: "💎",
    desc: "Charisma, status, and recognition.",
  }, // (Heaven Virtue)
  {
    name: "White Tiger",
    type: "Black",
    icon: "🐯",
    desc: "Injury, blood, accidents, travel risks.",
  },
  {
    name: "Jade Hall",
    type: "Yellow",
    icon: "🏛️",
    desc: "Career advancement, study, academic success.",
  },
  {
    name: "Heavenly Jail",
    type: "Black",
    icon: "⛓️",
    desc: "Trapped, delays, feeling stuck.",
  },
  {
    name: "Black Tortoise",
    type: "Black",
    icon: "🐢",
    desc: "Theft, loss, hidden danger, deception.",
  }, // (Gen Wu)
  {
    name: "Life Governor",
    type: "Yellow",
    icon: "📜",
    desc: "Longevity, health, resolving problems.",
  }, // (Heaven Officer)
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
