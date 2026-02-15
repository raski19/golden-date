import { RESOURCE_ELEMENT } from "./constants";

export interface RootStrengthResult {
  level: "High" | "Medium" | "Low" | "None" | "Resource";
  description: string;
  icon: string;
  score: number;
}

export const calculateRootStrength = (
  stem: string,
  branch: string,
): RootStrengthResult => {
  const s = stem.trim();
  const b = branch.trim();

  // =========================================================
  // 1. PRIMARY EXCEPTIONS (Higher priority overrides)
  // =========================================================

  // Special cases organized by branch-stem combination
  // prettier-ignore
  const specialCases: Record<string, RootStrengthResult> = {
    // Wu Earth special cases
    "Wu-Tiger": { level: "Low", description: "False Root (Overpowered)", icon: "🥀", score: 15 },
    "Wu-Monkey": { level: "Low", description: "False Root (Overpowered)", icon: "🥀", score: 15 },

    // Geng Metal special cases
    "Geng-Snake": { level: "High", description: "Growth Root (Long Life)", icon: "🌱🌳", score: 85 },
    "Geng-Dog": { level: "Medium", description: "Dry Earth (Forging)", icon: "🛡️", score: 65 },
    "Geng-Rat": { level: "None", description: "Exhausting to Branch", icon: "⚔️💧", score: 5 },

    // Xin Metal special cases
    "Xin-Snake": { level: "Low", description: "Trapped/Melted", icon: "🫠", score: 25 },
    "Xin-Ox": { level: "High", description: "Wet Earth (Nourishing)", icon: "💎", score: 85 },

    // Ren Water special cases
    "Ren-Monkey": { level: "High", description: "Superior Growth Root", icon: "🌊", score: 95 },
    "Ren-Tiger": { level: "None", description: "Exhausting to Branch", icon: "🌊🌲", score: 5 },

    // Bing Fire special cases
    "Bing-Tiger": { level: "High", description: "Superior Growth Root", icon: "🔥✨", score: 95 },

    // Ding Fire special cases
    "Ding-Ox": { level: "None", description: "Threatened by Hidden Water", icon: "🔥💧", score: 10 },

    // Jia Wood special cases
    "Jia-Pig": { level: "High", description: "Superior Growth Root", icon: "🌲", score: 95 },

    // Gui Water special cases
    "Gui-Ox": { level: "High", description: "Winter Season Root", icon: "❄️", score: 85 },
    "Gui-Dragon": { level: "Medium", description: "Storage (Restricted)", icon: "💧", score: 60 },
    "Gui-Rabbit": { level: "Low", description: "Nourishes Branch (Not Rooted)", icon: "💧🌱", score: 15 },
    "Gui-Goat": { level: "Low", description: "Controlled by Earth, Exhausted by Wood", icon: "🌊⛰️", score: 15 },

    // Yi Wood special cases
    "Yi-Dragon": { level: "Low", description: "Graveyard Root (Weak)", icon: "🥀", score: 35 },
    "Yi-Goat": { level: "Low", description: "Graveyard Root (Weak)", icon: "🥀", score: 35 },
    "Yi-Snake": { level: "Low", description: "Exhausted by Fire, Cut by Metal", icon: "🪵🔥✂️", score: 15 },
  };

  // Check special cases first
  const key = `${s}-${b}`;
  if (specialCases[key]) {
    return specialCases[key];
  }

  // =========================================================
  // 2. HIDDEN STEMS ANALYSIS (Core Logic)
  // =========================================================

  // Hidden stems for each branch (Main, Secondary, Tertiary)
  const hiddenStems: Record<string, string[]> = {
    Rat: ["Gui"], // 100% Water
    Ox: ["Ji", "Gui", "Xin"], // Earth, Water, Metal
    Tiger: ["Jia", "Bing", "Wu"], // Wood, Fire, Earth
    Rabbit: ["Yi"], // 100% Wood
    Dragon: ["Wu", "Yi", "Gui"], // Earth, Wood, Water
    Snake: ["Bing", "Geng", "Wu"], // Fire, Metal, Earth
    Horse: ["Ding", "Ji"], // Fire, Earth
    Goat: ["Ji", "Yi", "Ding"], // Earth, Wood, Fire
    Monkey: ["Geng", "Ren", "Wu"], // Metal, Water, Earth
    Rooster: ["Xin"], // 100% Metal
    Dog: ["Wu", "Xin", "Ding"], // Earth, Metal, Fire
    Pig: ["Ren", "Jia"], // Water, Wood
  };

  // Element mapping
  const stemElement: Record<string, string> = {
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

  // =========================================================
  // 3. ROOT STRENGTH CALCULATION
  // =========================================================

  const element = stemElement[s];
  const hidden = hiddenStems[b];

  if (!hidden) {
    return {
      level: "None",
      description: "Invalid Branch",
      icon: "❌",
      score: 0,
    };
  }

  // Check for direct root (same stem in hidden stems)
  if (hidden.includes(s)) {
    const position = hidden.indexOf(s);

    if (position === 0) {
      return {
        level: "High",
        description: "Direct Root (Main Qi)",
        icon: getElementIcon(element),
        score: 100,
      };
    } else if (position === 1) {
      return {
        level: "Medium",
        description: "Direct Root (Secondary)",
        icon: getElementIcon(element),
        score: 70,
      };
    } else {
      return {
        level: "Low",
        description: "Direct Root (Tertiary)",
        icon: getElementIcon(element),
        score: 50,
      };
    }
  }

  // Check for same element but different yin/yang
  const sameElementStems = Object.keys(stemElement).filter(
    (key) => stemElement[key] === element && key !== s,
  );

  for (const sameElementStem of sameElementStems) {
    if (hidden.includes(sameElementStem)) {
      const position = hidden.indexOf(sameElementStem);

      if (position === 0) {
        return {
          level: "High",
          description: "Same Element Root",
          icon: getElementIcon(element),
          score: 80,
        };
      } else if (position === 1) {
        return {
          level: "Medium",
          description: "Same Element Root (Secondary)",
          icon: getElementIcon(element),
          score: 60,
        };
      } else {
        return {
          level: "Low",
          description: "Same Element Root (Tertiary)",
          icon: getElementIcon(element),
          score: 40,
        };
      }
    }
  }

  // 1️⃣ What produces the Day Stem?
  const resourceElement = RESOURCE_ELEMENT[s];

  // 2️⃣ Which stems belong to that element?
  const resourceStems = Object.keys(stemElement).filter(
    (stem) => stemElement[stem] === resourceElement,
  );

  // 3️⃣ Check hidden stems by position (root strength)
  for (let i = 0; i < hidden.length; i++) {
    const hiddenStem = hidden[i];

    if (resourceStems.includes(hiddenStem)) {
      if (i === 0) {
        return {
          level: "Resource",
          description: "Strong Resource Root",
          icon: getElementIcon(resourceElement),
          score: 70,
        };
      } else if (i === 1) {
        return {
          level: "Resource",
          description: "Moderate Resource Root",
          icon: getElementIcon(resourceElement),
          score: 50,
        };
      } else {
        return {
          level: "Low",
          description: "Weak Resource Root",
          icon: getElementIcon(resourceElement),
          score: 30,
        };
      }
    }
  }

  // =========================================================
  // 4. SEASONAL CONSIDERATIONS (Fallback)
  // =========================================================

  // Seasonal branches (Main Qi)
  const seasonalBranches: Record<string, string[]> = {
    Wood: ["Tiger", "Rabbit"],
    Fire: ["Snake", "Horse"],
    Earth: ["Dragon", "Dog", "Ox", "Goat"],
    Metal: ["Monkey", "Rooster"],
    Water: ["Pig", "Rat"],
  };

  if (seasonalBranches[element]?.includes(b)) {
    return {
      level: "Medium",
      description: "Seasonal Association",
      icon: getElementIcon(element),
      score: 65,
    };
  }

  // Check if there's any indirect support
  const allHiddenElements = hidden.map((st) => stemElement[st]);
  const elementSupport: Record<string, string[]> = {
    Wood: ["Water"], // Water supports Wood
    Fire: ["Wood"], // Wood supports Fire
    Earth: ["Fire"], // Fire supports Earth
    Metal: ["Earth"], // Earth supports Metal
    Water: ["Metal"], // Metal supports Water
  };

  const hasIndirectSupport = allHiddenElements.some((el) =>
    elementSupport[element]?.includes(el),
  );

  if (hasIndirectSupport) {
    return {
      level: "Low",
      description: "Indirect Support",
      icon: "💨",
      score: 20,
    };
  }

  return {
    level: "None",
    description: "Floating (No Root)",
    icon: "🍃",
    score: 5,
  };
};

// =========================================================
// 5. OPTIONAL: CACHE MECHANISM FOR PERFORMANCE
// =========================================================

const rootStrengthCache = new Map<string, RootStrengthResult>();

export const calculateRootStrengthCached = (
  stem: string,
  branch: string,
): RootStrengthResult => {
  const key = `${stem}-${branch}`;

  if (rootStrengthCache.has(key)) {
    return rootStrengthCache.get(key)!;
  }

  const result = calculateRootStrength(stem, branch);
  rootStrengthCache.set(key, result);
  return result;
};

// Helper function for icons
const getElementIcon = (element: string): string => {
  const icons: Record<string, string> = {
    Wood: "🌲",
    Fire: "🔥",
    Earth: "⛰️",
    Metal: "⚔️",
    Water: "🌊",
  };
  return icons[element] || "✨";
};
