export interface RootStrengthResult {
  level: "High" | "Medium" | "Low" | "None" | "Resource";
  description: string;
  icon: string;
  score: number; // Added for algorithmic weighting if needed later
}

export const calculateRootStrength = (
  stem: string,
  branch: string,
): RootStrengthResult => {
  // Normalize inputs
  const s = stem.trim();
  const b = branch.trim();

  // =========================================================
  // 1. CRITICAL EXCEPTIONS (Source: 60 Pillars & Qualifying 10 Gods)
  // =========================================================

  // [A] The "False Root" Exception (Wu Earth)
  // Wu Earth contains Fire/Earth Qi, but Tiger/Monkey seasonal Qi overpowers it.
  if (s === "Wu" && ["Tiger", "Monkey"].includes(b)) {
    return {
      level: "Low",
      description: "False Root (Overpowered)",
      icon: "🥀",
      score: 10,
    };
  }

  // [B] The "Hot Root" Nuance (Metal on Snake)
  // Snake is Fire, but it is the "Birth Place" of Metal.
  if (b === "Snake") {
    if (s === "Geng") {
      // Geng on Snake is "Long Life" (Growth). Very strong but volatile.
      return {
        level: "High",
        description: "Growth Root (Volatile)",
        icon: "🌋",
        score: 80,
      };
    }
    if (s === "Xin") {
      // Xin is jewelry; Snake Fire melts it. It is trapped.
      return {
        level: "Low",
        description: "Trapped / Melted",
        icon: "🫠",
        score: 30,
      };
    }
  }

  // [C] The "Superior Growth" Roots (Yang Stems)
  // Yang Stems sitting on their "Birth" branch get massive support.
  if (s === "Ren" && b === "Monkey")
    return {
      level: "High",
      description: "Superior Growth Root",
      icon: "🌊",
      score: 95,
    };
  if (s === "Bing" && b === "Tiger")
    return {
      level: "High",
      description: "Superior Growth Root",
      icon: "🔥",
      score: 95,
    };
  if (s === "Jia" && b === "Pig")
    return {
      level: "High",
      description: "Superior Growth Root",
      icon: "🌲",
      score: 95,
    };

  // [D] Gui Water Specifics (Dragon vs. Ox)
  if (s === "Gui") {
    if (b === "Ox")
      return {
        level: "High",
        description: "Winter Season Root",
        icon: "❄️",
        score: 85,
      }; // Ox is part of Winter
    if (b === "Dragon")
      return {
        level: "Medium",
        description: "Storage (Restricted)",
        icon: "💧",
        score: 60,
      }; // Grave of Water
  }

  // =========================================================
  // 2. ELEMENTAL LOGIC
  // =========================================================

  // 🌲 WOOD STEMS (Jia / Yi)
  if (["Jia", "Yi"].includes(s)) {
    // Main Qi (Season)
    if (["Tiger", "Rabbit"].includes(b)) {
      return {
        level: "High",
        description: "Rooted (Main Qi)",
        icon: "🌲",
        score: 100,
      };
    }
    // Growth / Birthplace (Pig)
    if (b === "Pig") {
      return {
        level: "High",
        description: "Growth Root (Alive)",
        icon: "🌱",
        score: 85,
      };
    }
    // Graveyard / Storage (Dragon / Goat)
    if (["Dragon", "Goat"].includes(b)) {
      if (s === "Jia")
        return {
          level: "Medium",
          description: "Rooted in Earth",
          icon: "🪵",
          score: 65,
        };
      if (s === "Yi")
        return {
          level: "Low",
          description: "Graveyard Root (Weak)",
          icon: "🥀",
          score: 40,
        }; // Yi dislikes the grave
    }
    // Resource (Rat)
    if (b === "Rat")
      return {
        level: "Medium",
        description: "Resource (Floating)",
        icon: "💧",
        score: 55,
      };
  }

  // 🔥 FIRE STEMS (Bing / Ding)
  if (["Bing", "Ding"].includes(s)) {
    // Main Qi (Season)
    if (["Snake", "Horse"].includes(b)) {
      return {
        level: "High",
        description: "Rooted (Main Qi)",
        icon: "🔥",
        score: 100,
      };
    }
    // Summer Qi (Goat)
    if (b === "Goat") {
      return {
        level: "High",
        description: "Rooted (Summer Qi)",
        icon: "🏜️",
        score: 85,
      };
    }
    // Growth / Storage
    if (b === "Tiger")
      return {
        level: "High",
        description: "Growth Root",
        icon: "🔥",
        score: 90,
      }; // Bing loves Tiger
    if (b === "Dog")
      return {
        level: "Medium",
        description: "Storage Root",
        icon: "🕯️",
        score: 65,
      };
    if (b === "Rabbit")
      return {
        level: "Resource",
        description: "Feeding (Wood)",
        icon: "🪵",
        score: 50,
      };
  }

  // ⛰️ EARTH STEMS (Wu / Ji)
  if (["Wu", "Ji"].includes(s)) {
    // Main Qi (Four Earths)
    if (["Dragon", "Dog", "Ox", "Goat"].includes(b)) {
      return {
        level: "High",
        description: "Rooted (Main Qi)",
        icon: "⛰️",
        score: 95,
      };
    }
    // Fire Roots (Mother produces Child)
    if (["Snake", "Horse"].includes(b)) {
      return {
        level: "High",
        description: "Fire Root (Resource)",
        icon: "🔥",
        score: 85,
      };
    }
  }

  // ⚔️ METAL STEMS (Geng / Xin)
  if (["Geng", "Xin"].includes(s)) {
    // Main Qi
    if (["Monkey", "Rooster"].includes(b)) {
      return {
        level: "High",
        description: "Rooted (Main Qi)",
        icon: "⚔️",
        score: 100,
      };
    }
    // Storage Roots (Dog / Ox)
    if (["Dog", "Ox"].includes(b)) {
      // Xin loves Ox (Wet Earth nourishes), Geng prefers Dog (Dry Earth forges)
      if (s === "Xin" && b === "Ox")
        return {
          level: "High",
          description: "Wet Earth (Nourishing)",
          icon: "💎",
          score: 85,
        };
      if (s === "Geng" && b === "Dog")
        return {
          level: "Medium",
          description: "Dry Earth (Forging)",
          icon: "🛡️",
          score: 70,
        };
      return {
        level: "Medium",
        description: "Storage Root",
        icon: "🧱",
        score: 60,
      };
    }
  }

  // 🌊 WATER STEMS (Ren / Gui)
  if (["Ren", "Gui"].includes(s)) {
    // Main Qi
    if (["Pig", "Rat"].includes(b)) {
      return {
        level: "High",
        description: "Rooted (Main Qi)",
        icon: "🌊",
        score: 100,
      };
    }
    // Growth (Monkey)
    if (b === "Monkey") {
      return {
        level: "High",
        description: "Growth Root (Source)",
        icon: "🐵",
        score: 90,
      };
    }
    // Storage (Dragon)
    if (b === "Dragon") {
      return {
        level: "Medium",
        description: "Water Storage",
        icon: "🛑",
        score: 70,
      };
    }
    // Resource (Rooster)
    if (b === "Rooster")
      return {
        level: "Resource",
        description: "Pure Resource",
        icon: "🪙",
        score: 55,
      };
  }

  // Default Fallback
  return {
    level: "None",
    description: "Floating (No Root)",
    icon: "🍃",
    score: 10,
  };
};
