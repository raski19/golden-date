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
  Rat: "Water",
  Pig: "Water",
  Tiger: "Wood",
  Rabbit: "Wood",
  Snake: "Fire",
  Horse: "Fire",
  Monkey: "Metal",
  Rooster: "Metal",
  Ox: "Earth",
  Dragon: "Earth",
  Goat: "Earth",
  Dog: "Earth",
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

export const NINE_STARS: string[] = [
  "1 White (Noble)",
  "2 Black (Sickness)",
  "3 Jade (Conflict)",
  "4 Green (Wisdom)",
  "5 Yellow (Disaster)",
  "6 White (Authority)",
  "7 Red (Robbery)",
  "8 White (Wealth)",
  "9 Purple (Celebration)",
];

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
