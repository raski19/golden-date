import { IUser, DayInfo, MonthAnalysis, ScoreResult } from "../types";
import { calculateShenSha } from "./shenSha";
import {
  CLASH_PAIRS,
  SIX_HARMONY,
  THREE_HARMONY,
  ELEMENT_MAP,
  STEM_NOBLEMAN,
  SAN_SHA_RULES,
  GOAT_BLADE_RULES,
  YANG_STEMS,
  ELEMENT_RELATIONSHIPS,
  STEM_INFO,
  TEN_GODS,
  TEN_GOD_ACTIONS,
  OFFICER_RECOMMENDATIONS,
  OFFICER_DATA,
  STANDARD_RULES,
  CONSTELLATION_DATA,
  ACADEMIC_STAR,
  TRAVELING_HORSE,
  PEACH_BLOSSOM,
  BRANCHES_LIST,
} from "./constants";
import { calculateRootStrengthCached } from "./rootStrength";
import { getCurrentLuckPillar } from "./calculateLuckPillar";
import { getVoidStatus } from "./shenSha";

export const calculateScore = (
  user: IUser,
  dayData: DayInfo,
  year: number,
  goal: string = "General",
): ScoreResult => {
  let score = 50; // Start Neutral
  let log: string[] = [];
  let flags: string[] = [];
  let tags: string[] = [];
  let specificActions: { action: string; icon: string; desc: string }[] = [];

  const rules = user.rules;

  // =================================================================
  // 0. CLEAN ALL STRINGS GLOBALLY
  // =================================================================
  const dayBranch = (dayData.dayBranch || "").split(" ")[0];
  const monthBranch = (dayData.monthBranch || "").split(" ")[0];
  const yearBranch = (dayData.yearBranch || "").split(" ")[0];
  const officerName = (dayData.officer || "").trim();
  const dayStemClean = (dayData.stem || "").split(" ")[0];

  const userDmClean = (user.dayMaster || "").split(" ")[0];
  const userDayBranch = (user.dayBranch || "").split(" ")[0];
  const userMonthBranch = (user.monthBranch || "").split(" ")[0];
  const userYearBranch = (user.yearBranch || "").split(" ")[0];

  // Helper: Determine Element Role
  const getRole = (element: string) => {
    if (rules.wealthElements?.includes(element)) return "Wealth (Profit)";
    if (rules.careerElements?.includes(element))
      return "Career (Output/Action)";
    if (rules.healthElements?.includes(element)) return "Health (Balance)";
    if (
      [
        ...rules.wealthElements,
        ...rules.careerElements,
        ...rules.healthElements,
      ].includes(element)
    )
      return "Favorable Support";
    return "Unfavorable";
  };

  // --- 1. OFFICER SCORE ---
  const officerRec = OFFICER_RECOMMENDATIONS[officerName] || {
    action: "Proceed",
    icon: "⚠️",
    desc: "Proceed with caution.",
    reality: "The energy is unstable.",
  };

  const officerDef = OFFICER_DATA[officerName];
  if (officerDef) {
    score += officerDef.baseScore;
    if (officerDef.baseScore > 0)
      log.push(`✅ OFFICER: ${officerName} adds positive energy.`);
    else if (officerDef.baseScore < 0)
      log.push(`⚠️ OFFICER: ${officerName} is generally unstable/restrictive.`);
  }

  // --- 2. CALCULATE DAY TYPE (Ten God) ---
  const dmElement = ELEMENT_MAP[userDmClean];
  const dayStemElement = ELEMENT_MAP[dayStemClean];
  let dayType = "Unknown";
  if (dmElement && dayStemElement && ELEMENT_RELATIONSHIPS[dmElement]) {
    dayType = ELEMENT_RELATIONSHIPS[dmElement][dayStemElement] || "Unknown";
  }

  const userDm = STEM_INFO[userDmClean];
  const dayStem = STEM_INFO[dayStemClean];
  let tenGodName = "Friend";
  if (userDm && dayStem) {
    const relationship = ELEMENT_RELATIONSHIPS[userDm.element][dayStem.element];
    const polarity = userDm.polarity === dayStem.polarity ? "Same" : "Diff";
    if (relationship && TEN_GODS[relationship])
      tenGodName = TEN_GODS[relationship][polarity];
  }

  const guide = TEN_GOD_ACTIONS[tenGodName] || TEN_GOD_ACTIONS["Friend"];

  // --- 3. PILLAR STRENGTH ---
  const rootInfo = calculateRootStrengthCached(dayStemClean, dayBranch);
  const pillarNote = rootInfo.description;
  const pillarIcon = rootInfo.icon;
  const pillarScore = rootInfo.score;

  // =================================================================
  // CLASH HIERARCHY (THE BREAKERS)
  // =================================================================

  // A. GENERAL BREAKERS
  if (CLASH_PAIRS[yearBranch] === dayBranch) {
    score -= 20;
    flags.push("YEAR BREAKER");
    log.push(`⚠️ General Year Breaker: Date is unstable (Year vs Day).`);
  }
  if (CLASH_PAIRS[monthBranch] === dayBranch) {
    score -= 15;
    flags.push("MONTH BREAKER");
    log.push(`⚠️ General Month Breaker: Date is unstable (Month vs Day).`);
  }

  // B. PERSONAL BREAKERS
  if (userDayBranch && dayBranch === CLASH_PAIRS[userDayBranch]) {
    score = -50; // Hard Reset
    flags.push("PERSONAL BREAKER");
    log.push(
      `💀 PERSONAL BREAKER: ${dayBranch} clashes with Day Branch. Risk of conflict/injury.`,
    );

    // --- THE TROJAN HORSE TIP ---
    log.push(
      "⚔️ TROJAN HORSE TIP: Use this aggressive energy to break a bad habit (smoking, sugar) or end a toxic relationship.",
    );
  }

  if (userYearBranch && dayBranch === CLASH_PAIRS[userYearBranch]) {
    score -= 30;
    flags.push("Social Clash");
    log.push(
      `🎭 Year Clash: ${dayBranch} clashes with your Year. Avoid networking.`,
    );
  }

  if (userMonthBranch && dayBranch === CLASH_PAIRS[userMonthBranch]) {
    score -= 20;
    flags.push("Career Clash");
    log.push(
      `🏢 Month Clash: ${dayBranch} clashes with your Month. Expect work friction.`,
    );
    tags.push("CAREER CLASH");
  }

  const currentLuck = getCurrentLuckPillar(user, year);
  if (currentLuck && dayBranch === CLASH_PAIRS[currentLuck.branch]) {
    score -= 30;
    flags.push("Luck Clash");
    log.push(`☁️ Luck Pillar Clash: ${dayBranch} clashes with Luck Pillar.`);
  }

  // MANUAL AVOID FALLBACK (The Safety Net)
  // Catches branches that aren't Clashes but are marked "bad" in the user's rules
  if (
    rules.badBranches?.includes(dayBranch) &&
    // Ensure we don't double-penalize if it was already caught as a Luck Clash
    (!currentLuck || CLASH_PAIRS[currentLuck.branch] !== dayBranch)
  ) {
    score -= 20;
    log.push(`⚠️ Avoid: ${dayBranch} is in light conflict with your chart.`);
  }

  // SELF PUNISHMENT
  if (dayBranch === rules.selfPunishment) {
    score -= 30;
    flags.push("Self Punishment");
    log.push(
      `⚠️ Self Punishment: ${dayBranch} triggers self-sabotage/mistakes.`,
    );
  }

  const isBrokenDay =
    flags.some(
      (f) =>
        f.includes("BREAKER") ||
        f.includes("Clash") ||
        f.includes("Punishment"),
    ) || dayBranch === rules.breaker;

  // =================================================================
  // ELEMENTAL ANALYSIS
  // =================================================================
  const dayElement = dayData.element;

  // Tagging
  if (!isBrokenDay) {
    if (rules.wealthElements?.includes(dayElement)) tags.push("WEALTH");
    if (rules.careerElements?.includes(dayElement)) tags.push("CAREER");
    if (rules.healthElements?.includes(dayElement)) tags.push("HEALTH");
  }

  // Scoring
  if (rules.avoidElements?.includes(dayElement)) {
    score -= 15;
    log.push(`⛔ ELEMENT: ${dayElement} is unfavorable.`);
  } else {
    if (rules.wealthElements?.includes(dayElement)) {
      score += 15;
      log.push(
        isBrokenDay
          ? `💸 WEALTH TRAP: ${dayElement} is Wealth, but day is broken.`
          : `💰 ELEMENT: ${dayElement} supports Wealth.`,
      );
    } else if (rules.careerElements?.includes(dayElement)) {
      score += 15;
      log.push(
        isBrokenDay
          ? `⚠️ CAREER RISK: ${dayElement} is Output, but day is broken.`
          : `🚀 ELEMENT: ${dayElement} supports Career.`,
      );
    } else if (rules.healthElements?.includes(dayElement)) {
      score += 10;
      log.push(`🧘 ELEMENT: ${dayElement} supports Health.`);
    }
  }

  // =================================================================
  // CONSTELLATION CHECK
  // =================================================================
  const starName = dayData.constellation;
  let starQuality: "Good" | "Bad" | "Mixed" = "Mixed";
  let isStarFavorable = false;
  let isStarAvoid = false;
  let isAvoidElement = false;

  if (starName && CONSTELLATION_DATA[starName]) {
    const starData = CONSTELLATION_DATA[starName];
    const starElement = starData.element;
    starQuality = starData.quality;
    const allUseful = [
      ...(rules.wealthElements || []),
      ...(rules.careerElements || []),
      ...(rules.healthElements || []),
    ];

    if (allUseful.includes(starElement)) isStarFavorable = true;
    isAvoidElement = (rules.avoidElements || []).includes(starElement);

    if (starQuality === "Bad") isStarAvoid = true;
    else if (starQuality === "Mixed" && isAvoidElement) isStarAvoid = true;
    else if (starQuality === "Good" && isAvoidElement)
      isStarAvoid = isBrokenDay;

    if (isStarAvoid) {
      score -= 10;
      log.push(`⛔ CONSTELLATION: ${starName} is unfavorable.`);
    } else if (isStarFavorable) {
      score += 10;
      log.push(`✨ CONSTELLATION: ${starName} matches useful elements.`);
    } else if (starQuality === "Good") {
      score += 2;
      log.push(`⭐ CONSTELLATION: ${starName} is generally positive.`);
    }
  }

  // =================================================================
  // HARMONIES
  // =================================================================
  if (userDayBranch) {
    if (SIX_HARMONY[userDayBranch] === dayBranch) {
      score += 20;
      log.push(`✨ Six Harmony: ${dayBranch} is your Secret Friend.`);
      flags.push("6-Harmony");
      tags.push("PEOPLE");
    }
    if (THREE_HARMONY[userDayBranch]?.includes(dayBranch)) {
      score += 10;
      log.push(`🤝 Three Harmony: ${dayBranch} boosts Social Luck.`);
      flags.push("3-Harmony");
      tags.push("PEOPLE");
    }
  }

  if (rules.favorableBranches?.includes(dayBranch)) {
    score += 20;
    log.push(`Great Branch: ${dayBranch} provides favorable support.`);
  }

  // =================================================================
  // ACTIONS FILTER
  // =================================================================
  const unstableOfficers = ["Destruction", "Danger", "Close", "Remove"];
  const isUnstableDay =
    unstableOfficers.includes(officerName) ||
    flags.some((f) => f.includes("BREAKER"));

  if (score > 50 && !isUnstableDay) {
    let bonusApplied = false;
    STANDARD_RULES.forEach((rule) => {
      if (!rule.officers.includes(officerName)) return;
      // Check if element supports this action type
      let matches = false;
      const dayEl = dayData.element;
      if (rule.type === "wealth" && rules.wealthElements?.includes(dayEl))
        matches = true;
      if (rule.type === "career" && rules.careerElements?.includes(dayEl))
        matches = true;
      if (rule.type === "health" && rules.healthElements?.includes(dayEl))
        matches = true;

      if (matches) {
        specificActions.push({
          action: rule.action,
          icon: rule.icon,
          desc: rule.description,
        });
        if (!bonusApplied) {
          score += 15;
          bonusApplied = true;
          log.push(`🎯 MATCH: Perfect day for ${rule.action}.`);
        }
      }
    });
  }

  // =================================================================
  // 9 STARS & SAN SHA
  // =================================================================
  const nineStar = dayData.nineStar || "";
  if (nineStar.includes("9 Purple")) {
    score += 20;
    tags.push("WEALTH");
    log.push(`🔥 9 Purple: Supreme Wealth Star.`);
  } else if (nineStar.includes("1 White")) {
    score += 10;
    log.push(`🌊 1 White: Noble People.`);
  } else if (nineStar.includes("5 Yellow")) {
    score -= 20;
    flags.push("5 Yellow");
    log.push(`☣️ 5 Yellow: Emperor of Calamity.`);
  } else if (nineStar.includes("2 Black")) {
    score -= 10;
    log.push(`💊 2 Black: Illness Energy.`);
  }

  const monthBadBranches: string[] = SAN_SHA_RULES[monthBranch] || [];
  if (monthBadBranches.includes(dayBranch)) {
    flags.push("San Sha");
    score -= 10;
    log.push(`🗡️ Three Killings: ${dayBranch} opposes the Month.`);
  }

  // =================================================================
  // GOAT BLADE (Context Aware)
  // =================================================================
  const bladeBranch = GOAT_BLADE_RULES[userDmClean];
  if (bladeBranch === dayBranch) {
    flags.push("Goat Blade");

    // Base penalty
    let bladeScore = -15;
    let bladeMsg = `🔪 Goat Blade: Intense, aggressive energy.`;

    // Contextual Adjustment
    if (goal === "Career") {
      bladeScore = 5; // Positive for career aggression
      bladeMsg = `⚔️ Goat Blade: Competitive Edge! Good for sales/debates.`;
    } else if (goal === "Love") {
      bladeScore = -30; // Fatal for love
      bladeMsg = `💔 Goat Blade: High risk of conflict in relationships.`;
    }

    score += bladeScore;
    log.push(bladeMsg);
  }

  // =================================================================
  // SHEN SHA
  // =================================================================
  const stars = calculateShenSha(user, dayBranch);
  if (stars.nobleman) {
    score += 25;
    log.push(`🌟 Nobleman: Mentorship & Help.`);
    flags.push("Nobleman");
  }
  if (stars.travelingHorse) {
    score += 10;
    log.push(`🐴 Sky Horse: Travel Luck.`);
    flags.push("Travel");
  }
  if (stars.peachBlossom) {
    score += 15;
    log.push(`🌸 Peach Blossom: Social/Romance.`);
    flags.push("Social");
    tags.push("PEOPLE");
  }
  if (stars.academic) {
    score += 15;
    log.push(`🎓 Academic Star: Strategy.`);
    flags.push("Intellect");
  }

  // ROBBING SHA (Day - Internal/Mindset)
  if (stars.robbingShaDay) {
    score -= 10;
    flags.push("Robbing Sha (Int)"); // Int = Internal
    log.push(
      "💸 Self-Sabotage (Robbing Sha): You are prone to impulse buying, wasting time, or misplacing items today.",
    );
  }
  // ROBBING SHA (Year - External/Social)
  if (stars.robbingShaYear) {
    score -= 10;
    flags.push("Robbing Sha (Ext)"); // Ext = External
    log.push(
      "🛡️ External Risk (Robbing Sha): Watch out for fraud, theft, or people taking credit for your work.",
    );
  }

  if (stars.deathGod) {
    score -= 10;
    flags.push("Death God");
    log.push("⚖️ Death God: Legal risks.");
  }
  if (stars.solitaryStar) {
    score -= 5;
    flags.push("Solitary");
    log.push("🥀 Solitary Star: Inner isolation.");
  }

  // =================================================================
  // 🆕 GOAL-BASED WEIGHTING
  // =================================================================
  if (goal !== "General") {
    // --- WEALTH ---
    if (goal === "Wealth") {
      if (rules.wealthElements?.includes(dayElement)) {
        score += 20;
        log.push("🎯 GOAL: Wealth Element Boost.");
      }
      if (nineStar.includes("9 Purple")) {
        score += 15;
        log.push("🔥 GOAL: 9 Purple Wealth.");
      }
      if (tenGodName === "Rob Wealth") {
        score -= 25;
        log.push("🚫 GOAL: Rob Wealth risk.");
      }
      if (stars.robbingShaDay || stars.robbingShaYear) {
        score -= 20;
        log.push("🚫 GOAL: Robbing Sha risk.");
      }
    }

    // --- CAREER ---
    else if (goal === "Career") {
      if (rules.careerElements?.includes(dayElement)) {
        score += 20;
        log.push("🎯 GOAL: Output Element Boost.");
      }
      if (stars.nobleman || stars.academic) {
        score += 15;
        log.push("🚀 GOAL: Nobleman/Academic help.");
      }
      if (officerName === "Destruction") {
        score -= 15;
        log.push("🛑 GOAL: Destruction Officer.");
      }
    }

    // --- LOVE ---
    else if (goal === "Love") {
      if (stars.peachBlossom) {
        score += 30;
        log.push("❤️ GOAL: Peach Blossom Romance.");
      }
      if (SIX_HARMONY[userDayBranch] === dayBranch) {
        score += 25;
        log.push("💞 GOAL: 6 Harmony Connection.");
      }
      if (stars.solitaryStar) {
        score -= 25;
        log.push("❄️ GOAL: Solitary Star cools love.");
      }
      if (flags.includes("Personal Clash")) {
        score -= 30;
        log.push("💔 GOAL: Clash guarantees conflict.");
      }
    }

    // --- HEALTH ---
    else if (goal === "Health") {
      if (rules.healthElements?.includes(dayElement)) {
        score += 20;
        log.push("🧘 GOAL: Health Element Boost.");
      }
      if (officerName === "Remove" || officerName === "Balance") {
        score += 15;
        log.push("🩺 GOAL: Detox/Healing Officer.");
      }
      if (nineStar.includes("2 Black") || nineStar.includes("5 Yellow")) {
        score -= 30;
        log.push("☣️ GOAL: Illness Star.");
      }
    }
  }

  // =================================================================
  // VOID DAYS
  // =================================================================
  const userVoidBranches = getVoidStatus(
    userDmClean,
    userDayBranch,
    dayBranch,
    [yearBranch, monthBranch],
  );
  const isVoidDay =
    userVoidBranches.isVoid && userVoidBranches.type === "True Void";
  if (isVoidDay) {
    flags.push("VOID");
    log.push("🌌 Void Day (Kong Wang): Results are slippery.");
  }

  // =================================================================
  // HOURLY BREAKDOWN
  // =================================================================
  const userNobleBranches = STEM_NOBLEMAN[userDmClean] || [];
  const userAcademicBranch = ACADEMIC_STAR[userDmClean];
  const userHorseBranch = TRAVELING_HORSE[userYearBranch];
  const userPeachYear = PEACH_BLOSSOM[userYearBranch];
  const userPeachDay = PEACH_BLOSSOM[userDayBranch];

  const dayNobleBranches = STEM_NOBLEMAN[dayStemClean] || [];
  const day6HarmonyBranch = SIX_HARMONY[dayBranch];
  const day3HarmonyBranch = THREE_HARMONY[dayBranch] || [];
  const dayClashBranch = CLASH_PAIRS[dayBranch];
  const userClashBranch = CLASH_PAIRS[userDayBranch];

  const hours = BRANCHES_LIST.map((branch, index) => {
    const start = index === 0 ? 23 : index * 2 - 1;
    const end = index === 0 ? 1 : index * 2 + 1;
    const timeLabel = `${String(start).padStart(2, "0")}:00 - ${String(end).padStart(2, "0")}:00`;
    const hTags: string[] = [];

    if (userNobleBranches.includes(branch)) hTags.push("User Nobleman");
    if (userAcademicBranch === branch) hTags.push("Academic");
    if (userHorseBranch === branch) hTags.push("Travel Star");
    if (userClashBranch === branch) hTags.push("Personal Clash");
    if (userPeachYear === branch) hTags.push("Social Peach");
    if (userPeachDay === branch) hTags.push("Romance Peach");

    if (dayNobleBranches.includes(branch)) hTags.push("Day Nobleman");
    if (day6HarmonyBranch === branch) hTags.push("6 Harmony");
    if (day3HarmonyBranch.includes(branch)) hTags.push("3 Harmony");
    if (dayClashBranch === branch) hTags.push("Day Breaker");

    return { branch, time: timeLabel, tags: hTags };
  });

  // =================================================================
  // FINAL VERDICT
  // =================================================================
  if (pillarScore <= 20 && score > 75) {
    score = 75;
    log.push("⚠️ Score Capped: Day structure is too weak.");
  }

  score = Math.min(100, Math.max(0, score));

  let verdictText = "NEUTRAL";
  let cssClass = "neutral";
  if (score >= 90) {
    verdictText = "GOLDEN DATE";
    cssClass = "golden";
  } else if (score >= 75) {
    verdictText = "EXCELLENT";
    cssClass = "excellent";
  } else if (score >= 60) {
    verdictText = "GOOD";
    cssClass = "good";
  } else if (score < 40) {
    verdictText = "AVOID";
    cssClass = "avoid";
  }
  if (score <= 0) {
    verdictText = "DANGEROUS";
    cssClass = "dangerous";
  }

  return {
    dayType,
    pillarNote,
    pillarIcon,
    pillarScore,
    score,
    verdict: verdictText,
    cssClass,
    flags,
    tags: [...new Set(tags)],
    log,
    specificActions,
    hours,
    tenGodName,
    actionTitle: guide.title,
    actionTagline: guide.tagline,
    suitableActions: guide.best,
    cautionAction: guide.caution,
    actionKeywords: guide.keywords,
    officerRec,
    starQuality,
    isStarFavorable,
    isStarAvoid,
    isAvoidElement,
    isVoidDay,
  };
};

export const analyzeMonth = (
  user: IUser,
  monthBranch: string,
): MonthAnalysis => {
  const userBranch = user.dayBranch;

  if (CLASH_PAIRS[userBranch] === monthBranch) {
    return {
      verdict: "DANGEROUS",
      title: `⚠️ Personal Breaker Month (${monthBranch})`,
      description: `Clashes with your <strong>${userBranch}</strong>. Energy is turbulent.`,
      cssClass: "warn-banner",
    };
  }
  if (SIX_HARMONY[userBranch] === monthBranch) {
    return {
      verdict: "EXCELLENT",
      title: `🌟 Noble Month (${monthBranch})`,
      description: `Secret Friend month! Hidden support available.`,
      cssClass: "good-banner",
    };
  }
  if (user.rules.badBranches.includes(monthBranch)) {
    return {
      verdict: "CAUTION",
      title: `🌧️ Unfavorable Month (${monthBranch})`,
      description: `Energy weakens your chart. Conserve resources.`,
      cssClass: "neutral-banner",
    };
  }
  if (user.rules.favorableBranches.includes(monthBranch)) {
    return {
      verdict: "GOOD",
      title: `🚀 Strong Month (${monthBranch})`,
      description: `Supports your goals. Great time to push forward.`,
      cssClass: "good-banner",
    };
  }

  return {
    verdict: "NEUTRAL",
    title: `⚖️ Balanced Month (${monthBranch})`,
    description: `Neutral energy. Results depend on daily actions.`,
    cssClass: "neutral-banner",
  };
};
