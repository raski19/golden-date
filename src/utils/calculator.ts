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

  // --- 1. OFFICER SCORE & RECOMMENDATION ---
  const officerRec = OFFICER_RECOMMENDATIONS[officerName] || {
    action: "Proceed",
    icon: "⚠️",
    desc: "Proceed with caution.",
    reality: "The energy is unstable and unsupported.",
  };

  const officerDef = OFFICER_DATA[officerName];
  if (officerDef) {
    score += officerDef.baseScore;
    if (officerDef.baseScore > 0) {
      log.push(`✅ OFFICER: ${officerName} adds positive energy.`);
    } else if (officerDef.baseScore < 0) {
      log.push(`⚠️ OFFICER: ${officerName} is generally unstable/restrictive.`);
    }
  }

  // --- 2. CALCULATE DAY TYPE (Ten God Category) ---
  const dmElement = ELEMENT_MAP[userDmClean];
  const dayStemElement = ELEMENT_MAP[dayStemClean];
  let dayType = "Unknown";

  if (dmElement && dayStemElement) {
    if (ELEMENT_RELATIONSHIPS[dmElement]) {
      dayType = ELEMENT_RELATIONSHIPS[dmElement][dayStemElement] || "Unknown";
    }
  }

  // Determine Ten God Name
  const userDm = STEM_INFO[userDmClean];
  const dayStem = STEM_INFO[dayStemClean];
  let tenGodName = "Friend";

  if (userDm && dayStem) {
    const relationship = ELEMENT_RELATIONSHIPS[userDm.element][dayStem.element];
    const polarity = userDm.polarity === dayStem.polarity ? "Same" : "Diff";
    if (relationship && TEN_GODS[relationship]) {
      tenGodName = TEN_GODS[relationship][polarity];
    }
  }

  const guide = TEN_GOD_ACTIONS[tenGodName] || TEN_GOD_ACTIONS["Friend"];

  // --- 3. PILLAR STRENGTH ---
  const rootInfo = calculateRootStrengthCached(dayStemClean, dayBranch);
  const pillarNote = rootInfo.description;
  const pillarIcon = rootInfo.icon;
  const pillarScore = rootInfo.score;

  // =================================================================
  // CLASH HIERARCHY
  // =================================================================

  // A. GENERAL BREAKERS (The Date Clashing with Itself)
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

  // B. PERSONAL CLASHES (The Date Clashing with YOU)
  // 1. DAY BRANCH CLASH (Critical / Fatal)
  if (userDayBranch && dayBranch === CLASH_PAIRS[userDayBranch]) {
    score = -50;
    flags.push("PERSONAL BREAKER");
    log.push(
      `💀 PERSONAL BREAKER: ${dayBranch} clashes with your Day Branch (${userDayBranch}). Risk of health / injury / relationship conflict.`,
    );
    log.push(
      "⚔️ TROJAN HORSE TIP: Use this aggressive energy to break a bad habit (smoking, sugar) or end a toxic relationship.",
    );
  }

  // 2. YEAR BRANCH CLASH (High Priority)
  if (userYearBranch && dayBranch === CLASH_PAIRS[userYearBranch]) {
    score -= 30;
    flags.push("Social Clash");
    log.push(
      `🎭 Year Clash: ${dayBranch} clashes with your Year (${userYearBranch}). Avoid public events, networking, or weddings.`,
    );
  }

  // 3. MONTH BRANCH CLASH (Context Specific)
  if (userMonthBranch && dayBranch === CLASH_PAIRS[userMonthBranch]) {
    score -= 20;
    flags.push("Career Clash");
    log.push(
      `🏢 Month Clash: ${dayBranch} clashes with your Month (${userMonthBranch}). Expect friction at work or with parents.`,
    );
    tags.push("CAREER CLASH");
  }

  // 4. LUCK BRANCH CLASH
  const currentLuck = getCurrentLuckPillar(user, year);
  if (currentLuck) {
    const luckBranch = currentLuck.branch;
    const clashWithLuck = CLASH_PAIRS[luckBranch];

    if (dayBranch === clashWithLuck) {
      score -= 30;
      flags.push("Luck Clash");
      log.push(
        `☁️ Luck Pillar Clash: ${dayBranch} clashes with your current Luck Pillar (${luckBranch}). Expect external / environmental changes.`,
      );
    }
  }

  // MANUAL AVOID FALLBACK
  if (
    rules.badBranches?.includes(dayBranch) &&
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
    flags.includes("YEAR BREAKER") ||
    flags.includes("MONTH BREAKER") ||
    flags.includes("PERSONAL BREAKER") ||
    flags.includes("Luck Clash") ||
    flags.includes("Self Punishment") ||
    dayBranch === rules.breaker;

  // =================================================================
  // ELEMENTAL ANALYSIS
  // =================================================================

  const dayElement = dayData.element;

  // A. TAGGING
  if (!isBrokenDay) {
    if (rules.wealthElements?.includes(dayElement)) tags.push("WEALTH");
    if (rules.careerElements?.includes(dayElement)) tags.push("CAREER");
    if (rules.healthElements?.includes(dayElement)) tags.push("HEALTH");
  }

  // B. SCORING & LOGGING
  if (rules.avoidElements?.includes(dayElement)) {
    score -= 15;
    log.push(`⛔ ELEMENT: ${dayElement} is unfavorable for you.`);
  } else {
    if (rules.wealthElements?.includes(dayElement)) {
      score += 15;
      log.push(
        isBrokenDay
          ? `💸 WEALTH TRAP: ${dayElement} is Wealth, but the day is broken.`
          : `💰 ELEMENT: ${dayElement} supports your Wealth.`,
      );
    } else if (rules.careerElements?.includes(dayElement)) {
      score += 15;
      log.push(
        isBrokenDay
          ? `⚠️ CAREER RISK: ${dayElement} is Output, but the day is broken.`
          : `🚀 ELEMENT: ${dayElement} supports your Career.`,
      );
    } else if (rules.healthElements?.includes(dayElement)) {
      score += 10;
      log.push(`🧘 ELEMENT: ${dayElement} supports your Health.`);
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

    if (starQuality === "Bad") {
      isStarAvoid = true;
    } else if (starQuality === "Mixed" && isAvoidElement) {
      isStarAvoid = true;
    } else if (starQuality === "Good" && isAvoidElement) {
      isStarAvoid = isBrokenDay;
    }

    if (isStarAvoid) {
      score -= 10;
      let reason = "Negative Star Quality";
      if (starQuality === "Good") reason = "Good star corrupted by Breaker Day";
      else if (isAvoidElement)
        reason = `Clash with Avoid Element (${starElement})`;
      log.push(`⛔ CONSTELLATION: ${starName} is unfavorable. (${reason})`);
    } else if (isStarFavorable) {
      score += 10;
      log.push(
        `✨ CONSTELLATION: ${starName} (${starElement}) matches your useful elements.`,
      );
    } else if (starQuality === "Good") {
      score += 2;
      log.push(`⭐ CONSTELLATION: ${starName} is generally positive.`);
    }
  }

  // =================================================================
  // HARMONIES & BRANCH POWER
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
    const branchElem = ELEMENT_MAP[dayBranch] || "Unknown";
    const role = getRole(branchElem);
    log.push(`Great Branch: ${dayBranch} provides ${role}.`);
  }

  // =================================================================
  // ACTIONS (SMARTER FILTER)
  // =================================================================

  const unstableOfficers = ["Destruction", "Danger", "Close", "Remove"];
  const isUnstableDay =
    unstableOfficers.includes(officerName) ||
    flags.some((f) => f.includes("BREAKER"));

  if (score > 50 && !isUnstableDay) {
    const stemElem = dayData.element;
    const branchElem = ELEMENT_MAP[dayBranch] || "";
    let bonusApplied = false;

    STANDARD_RULES.forEach((rule) => {
      if (!rule.officers.includes(officerName)) return;

      let targetElements: string[] = [];
      if (rule.type === "wealth") targetElements = rules.wealthElements || [];
      else if (rule.type === "career")
        targetElements = rules.careerElements || [];
      else if (rule.type === "health")
        targetElements = rules.healthElements || [];

      if (
        targetElements.includes(stemElem) ||
        targetElements.includes(branchElem)
      ) {
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
  } else if (isUnstableDay) {
    log.push("⚠️ Day Energy is too unstable for major actions.");
  }

  // =================================================================
  // NINE STAR CHECKS (Period 9 Optimized)
  // =================================================================

  const nineStar = dayData.nineStar || "";

  if (nineStar.includes("9 Purple")) {
    score += 20;
    tags.push("WEALTH", "FAME");
    log.push(`🔥 9 Purple: The Supreme Wealth Star (Period 9).`);
  } else if (nineStar.includes("1 White")) {
    score += 10;
    log.push(`🌊 1 White: Noble People & Future Wealth.`);
  } else if (nineStar.includes("8 White")) {
    score += 5;
    log.push(`💰 8 White: Fading Wealth (Stable).`);
  } else if (nineStar.includes("6 White")) {
    score += 5;
    log.push(`⚙️ 6 White: Authority & Execution.`);
  }

  if (nineStar.includes("5 Yellow")) {
    score -= 20;
    flags.push("5 Yellow");
    log.push(`☣️ 5 Yellow: Emperor of Calamity. Avoid risks.`);
  } else if (nineStar.includes("2 Black")) {
    score -= 10;
    if (rules.healthElements?.length)
      log.push(`💊 2 Black: Strong Illness Energy.`);
    else log.push(`🧱 2 Black: Sickness Star (Good for Land, Bad for Body).`);
  } else if (nineStar.includes("3 Jade") || nineStar.includes("7 Red")) {
    score -= 5;
    log.push(`⚔️ Conflict/Robbery: Risk of disputes.`);
  }

  // =================================================================
  // --- SAN SHA & GOAT BLADE ---
  // =================================================================

  const monthBadBranches: string[] = SAN_SHA_RULES[monthBranch] || [];
  if (monthBadBranches.includes(dayBranch)) {
    flags.push("San Sha");
    score -= 10;
    log.push(`🗡️ Three Killings: ${dayBranch} opposes the Month.`);
  }

  const bladeBranch = GOAT_BLADE_RULES[userDmClean];
  if (bladeBranch === dayBranch) {
    score -= 15;
    flags.push("Goat Blade");
    const isYang = YANG_STEMS.includes(userDmClean);
    log.push(
      isYang
        ? `🔪 Goat Blade: Intense aggressive energy.`
        : `🗡️ Goat Blade: Stubborn energy, mental pressure.`,
    );
  }

  // =================================================================
  // --- SHEN SHA ---
  // =================================================================

  const stars = calculateShenSha(user, dayBranch);
  if (stars.nobleman) {
    score += 25;
    log.push(`🌟 Nobleman: Great for seeking help and mentorship.`);
    flags.push("Nobleman");
  }
  if (stars.travelingHorse) {
    score += 10;
    log.push(`🐴 Sky Horse: Good for travel.`);
    flags.push("Travel");
  }
  if (stars.peachBlossom) {
    score += 15;
    log.push(`🌸 Peach Blossom: High likability and networking luck.`);
    flags.push("Social");
    tags.push("PEOPLE");
  }
  if (stars.academic) {
    score += 15;
    log.push(`🎓 Academic Star: Good for strategy and contracts.`);
    flags.push("Intellect");
    tags.push("CAREER");
  }

  if (stars.robbingShaDay) {
    score -= 10;
    flags.push("Robbing Sha (P)");
    log.push(
      "💸 Robbing Sha: Impulse buying, losing your own wallet, overspending on hobbies, or your spouse spending your money.",
    );
  }
  if (stars.robbingShaYear) {
    score -= 10;
    flags.push("Robbing Sha (Y)");
    log.push(
      "💸 Robbing Sha: Theft, fraud, bad investments, or people taking credit for your work at the office.",
    );
  }
  if (stars.deathGod) {
    score -= 10;
    flags.push("Death God");
    log.push(
      "⚖️ Death God: Prone to negligence or legal loops. Check fine print.",
    );
  }
  if (stars.solitaryStar) {
    score -= 5;
    flags.push("Solitary");
    log.push("🥀 Solitary Star: Inner isolation. Better for solo work.");
  }

  // =================================================================
  // --- VOID DAYS ---
  // =================================================================

  const contextBranches = [yearBranch, monthBranch];
  const userVoidBranches = getVoidStatus(
    userDmClean,
    userDayBranch,
    dayBranch,
    contextBranches,
  );
  const isVoidDay =
    userVoidBranches.isVoid && userVoidBranches.type === "True Void";

  if (isVoidDay) {
    flags.push("VOID");
    log.push("🌌 Void Day (Kong Wang): Material results are slippery today.");
    log.push(
      "💡 VOID TIP: Excellent for coding, meditation, and strategy. The world can't see you.",
    );
  }

  // =================================================================
  // 7. HOURLY BREAKDOWN
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

    const tags: string[] = [];

    if (userNobleBranches.includes(branch)) tags.push("User Nobleman");
    if (userAcademicBranch === branch) tags.push("Academic");
    if (userHorseBranch === branch) tags.push("Travel Star");
    if (userClashBranch === branch) tags.push("Personal Clash");
    if (userPeachYear === branch) tags.push("Social Peach");
    if (userPeachDay === branch) tags.push("Romance Peach");

    if (dayNobleBranches.includes(branch)) tags.push("Day Nobleman");
    if (day6HarmonyBranch === branch) tags.push("6 Harmony");
    if (day3HarmonyBranch.includes(branch)) tags.push("3 Harmony");
    if (dayClashBranch === branch) tags.push("Day Breaker");

    return { branch, time: timeLabel, tags };
  });

  // =================================================================
  // --- HARD CAPS & VERDICT ---
  // =================================================================

  if (pillarScore <= 20) {
    if (score > 75) {
      score = 75;
      log.push("⚠️ Score Capped: Day structure is too weak.");
    }
  } else if (pillarScore <= 40) {
    if (score > 80) score = 80;
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
