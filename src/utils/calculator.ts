import { IUser, DayInfo, ScoreResult, MonthAnalysis } from "../types";
import { calculateShenSha } from "./shenSha";
import {
  CLASH_PAIRS,
  SIX_HARMONY,
  THREE_HARMONY,
  ELEMENT_MAP,
  STEM_NOBLEMAN,
  SAN_SHA_RULES,
  GOAT_BLADE_RULES,
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
  SCORING,
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
  // =================================================================
  // PHASE 0: SETUP & CLEANING
  // =================================================================
  let score = SCORING.BASE_NEUTRAL;
  let log: string[] = [];
  let flags: Set<string> = new Set();
  let tags: Set<string> = new Set();
  let specificActions: { action: string; icon: string; desc: string }[] = [];

  const rules = user.rules;

  const dayBranch = (dayData.dayBranch || "").split(" ")[0];
  const dayStemClean = (dayData.stem || "").split(" ")[0];
  const monthBranch = (dayData.monthBranch || "").split(" ")[0];
  const yearBranch = (dayData.yearBranch || "").split(" ")[0];
  const officerName = (dayData.officer || "").trim();

  const userDmClean = (user.dayMaster || "").split(" ")[0];
  const userDayBranch = (user.dayBranch || "").split(" ")[0];
  const userYearBranch = (user.yearBranch || "").split(" ")[0];
  const userMonthBranch = (user.monthBranch || "").split(" ")[0];

  const getRole = (element: string) => {
    if (rules.wealthElements?.includes(element)) return "Wealth (Profit)";
    if (rules.careerElements?.includes(element)) return "Career (Action)";
    if (rules.healthElements?.includes(element)) return "Health (Balance)";
    return "Support";
  };

  // =================================================================
  // PHASE 1: DIAGNOSTICS
  // =================================================================

  // 1.1 Element Analysis
  const dayElement = dayData.element;
  const isWealthEl = rules.wealthElements?.includes(dayElement);
  const isCareerEl = rules.careerElements?.includes(dayElement);
  const isHealthEl = rules.healthElements?.includes(dayElement);
  const isAvoidEl = rules.avoidElements?.includes(dayElement);

  // 1.2 Ten God Calculation
  let tenGodName = "Friend";
  let dayType = "Companion";

  const userDm = STEM_INFO[userDmClean];
  const dayStem = STEM_INFO[dayStemClean];
  if (userDm && dayStem) {
    const relationship = ELEMENT_RELATIONSHIPS[userDm.element][dayStem.element];
    const polarity = userDm.polarity === dayStem.polarity ? "Same" : "Diff";

    if (relationship && TEN_GODS[relationship])
      tenGodName = TEN_GODS[relationship][polarity];

    if (relationship === "Power") dayType = "Influence";
    else if (relationship === "Same") dayType = "Companion";
    else dayType = relationship;
  }
  const guide = TEN_GOD_ACTIONS[tenGodName] || TEN_GOD_ACTIONS["Friend"];

  // 1.3 Shen Sha (Stars)
  const stars = calculateShenSha(user, dayBranch);

  // 1.4 Pillar Strength
  const rootInfo = calculateRootStrengthCached(dayStemClean, dayBranch);
  const pillarScore = rootInfo.score;

  // 1.5 Clashes & Harmonies
  const isPersonalClash = CLASH_PAIRS[userDayBranch] === dayBranch;
  const isYearClash = CLASH_PAIRS[userYearBranch] === dayBranch;
  const isMonthClash = CLASH_PAIRS[userMonthBranch] === dayBranch;
  const isGeneralYearClash = CLASH_PAIRS[yearBranch] === dayBranch;
  const isGeneralMonthClash = CLASH_PAIRS[monthBranch] === dayBranch;

  const is6Harmony = SIX_HARMONY[userDayBranch] === dayBranch;
  const is3Harmony = THREE_HARMONY[userDayBranch]?.includes(dayBranch);
  const isSelfPunish = dayBranch === rules.selfPunishment;

  // 1.6 Luck Pillar
  const currentLuck = getCurrentLuckPillar(user, year);
  const isLuckClash =
    currentLuck && dayBranch === CLASH_PAIRS[currentLuck.branch];

  // 1.7 Goat Blade
  const bladeBranch = GOAT_BLADE_RULES[userDmClean];
  const isGoatBlade = bladeBranch === dayBranch;

  // =================================================================
  // PHASE 2: BASE SCORING
  // =================================================================

  // 2.1 Officer
  const officerDef = OFFICER_DATA[officerName];
  if (officerDef) {
    score += officerDef.baseScore;
    if (officerDef.baseScore > 0)
      log.push(`✅ OFFICER: ${officerName} adds positive energy.`);
    else if (officerDef.baseScore < 0)
      log.push(`⚠️ OFFICER: ${officerName} is generally unstable/restrictive.`);
  }

  // 2.2 Constellation
  const starName = dayData.constellation;
  let finalIsStarAvoid = false;

  if (starName && CONSTELLATION_DATA[starName]) {
    const starData = CONSTELLATION_DATA[starName];

    if (starData.quality === "Good") {
      score += SCORING.CONSTELLATION_GOOD;
      log.push(`⭐ STAR: ${starName} is auspicious.`);
      finalIsStarAvoid = false;

      if (isAvoidEl) {
        score -= 2;
      }
    } else if (starData.quality === "Bad") {
      score += SCORING.CONSTELLATION_BAD;
      log.push(`⛔ STAR: ${starName} is unfavorable.`);
      finalIsStarAvoid = true;
    } else {
      if (isAvoidEl) {
        score -= 5;
        log.push(`⛔ STAR: ${starName} conflicts with element.`);
        finalIsStarAvoid = true;
      } else if (isWealthEl || isCareerEl || isHealthEl) {
        score += 5;
        log.push(`✨ STAR: ${starName} matches useful elements.`);
        finalIsStarAvoid = false;
      }
    }
  }

  // 2.3 Nine Stars
  const nineStar = dayData.nineStar || "";
  if (nineStar.includes("9 Purple")) {
    score += SCORING.NINE_STAR_WEALTH;
    tags.add("WEALTH");
    log.push(`🔥 9 Purple: Supreme Wealth Star.`);
  } else if (nineStar.includes("1 White")) {
    score += SCORING.NINE_STAR_NOBLE;
    log.push(`🌊 1 White: Noble People.`);
  } else if (nineStar.includes("5 Yellow")) {
    score += SCORING.NINE_STAR_BAD;
    flags.add("5 Yellow");
    log.push(`☣️ 5 Yellow: Emperor of Calamity.`);
  } else if (nineStar.includes("2 Black")) {
    score += -15;
    flags.add("2 Black");
    log.push(`💊 2 Black: Illness Star.`);
  }

  // 2.4 Yellow/Black Belt
  const spiritName = dayData.yellowBlackBelt?.name || "";
  const badSpirits = [
    "Heavenly Punishment",
    "Red Phoenix",
    "White Tiger",
    "Heavenly Jail",
    "Black Tortoise",
    "Grappling Hook",
  ];
  const goodSpirits = [
    "Green Dragon",
    "Bright Hall",
    "Golden Lock",
    "Precious Light",
    "Jade Hall",
    "Life Governor",
  ];

  if (badSpirits.includes(spiritName)) {
    score += SCORING.SPIRIT_BLACK;
    log.push(`🌑 SPIRIT: ${spiritName} brings hidden negativity.`);
    flags.add("Black Spirit");
  } else if (goodSpirits.includes(spiritName)) {
    score += SCORING.SPIRIT_YELLOW;
    log.push(`☀️ SPIRIT: ${spiritName} is auspicious.`);
  }

  // =================================================================
  // PHASE 3: PERSONALIZATION
  // =================================================================

  // 3.1 Boosts
  if (stars.nobleman) {
    score += SCORING.NOBLEMAN;
    flags.add("Nobleman");
    log.push(`🌟 Nobleman: Great help available from powerful people.`);
  }

  if (rules.favorableBranches?.includes(dayBranch)) {
    score += SCORING.USEFUL_GOD;
    const branchElem = ELEMENT_MAP[dayBranch] || "Unknown";
    const role = getRole(branchElem);
    log.push(`🔥 Great Branch (Useful God): ${dayBranch} provides ${role}.`);
  }

  if (stars.academic) {
    score += SCORING.ACADEMIC;
    flags.add("Intellect");
    tags.add("CAREER");
    log.push(`🎓 Academic Star: Excellent for strategy & learning.`);
  }
  if (stars.travelingHorse) {
    score += SCORING.TRAVEL_HORSE;
    flags.add("Travel");
    log.push(`🐴 Sky Horse: Good for travel and expansion.`);
  }
  if (stars.peachBlossom) {
    score += SCORING.PEACH_BLOSSOM;
    flags.add("Social");
    tags.add("PEOPLE");
    log.push(`🌸 Peach Blossom: High likability & social charisma.`);
  }

  if (is6Harmony) {
    score += SCORING.HARMONY_6;
    flags.add("6-Harmony");
    tags.add("PEOPLE");
    log.push(`✨ Six Harmony: ${dayBranch} is your Secret Friend.`);
  }

  if (is3Harmony) {
    score += SCORING.HARMONY_3;
    flags.add("3-Harmony");
    tags.add("PEOPLE");
    log.push(`🤝 Three Harmony: ${dayBranch} boosts Social Luck.`);
  }

  // 3.3 Elements
  if (isWealthEl) {
    score += SCORING.FAVORABLE_ELEMENT;
    tags.add("WEALTH");
    log.push(
      isPersonalClash
        ? `💸 WEALTH TRAP: ${dayElement} is Wealth, but day is broken.`
        : `💰 ELEMENT: ${dayElement} supports Wealth.`,
    );
  } else if (isCareerEl) {
    score += SCORING.FAVORABLE_ELEMENT;
    tags.add("CAREER");
    log.push(
      isPersonalClash
        ? `⚠️ CAREER RISK: ${dayElement} is Output, but day is broken.`
        : `🚀 ELEMENT: ${dayElement} supports Career.`,
    );
  } else if (isHealthEl) {
    score += 10;
    tags.add("HEALTH");
    log.push(`🧘 ELEMENT: ${dayElement} supports Health.`);
  } else if (isAvoidEl) {
    score += SCORING.UNFAVORABLE_ELEMENT;
    log.push(`⛔ ELEMENT: ${dayElement} is unfavorable.`);
  }

  // 3.4 General Breaks
  if (isGeneralYearClash) {
    score += SCORING.CLASH_YEAR;
    flags.add("YEAR BREAKER");
    log.push(`⚠️ General Year Breaker: Date is unstable (Year vs Day).`);
  }
  if (isGeneralMonthClash) {
    score += SCORING.CLASH_MONTH;
    flags.add("MONTH BREAKER");
    log.push(`⚠️ General Month Breaker: Date is unstable (Month vs Day).`);
  }

  // 3.5 Personal Negatives
  if (isYearClash) {
    score += SCORING.CLASH_YEAR;
    flags.add("Social Clash");
    log.push(
      `🎭 Year Clash: ${dayBranch} clashes with your Year. Avoid networking.`,
    );
  }
  if (isMonthClash) {
    score += SCORING.CLASH_MONTH;
    flags.add("Career Clash");
    tags.add("CAREER CLASH");
    log.push(
      `🏢 Month Clash: ${dayBranch} clashes with your Month. Expect work friction.`,
    );
  }
  if (isLuckClash) {
    score += SCORING.CLASH_LUCK;
    flags.add("Luck Clash");
    log.push(`☁️ Luck Pillar Clash: ${dayBranch} clashes with Luck Pillar.`);
  }
  if (isSelfPunish) {
    score += SCORING.SELF_PUNISH;
    flags.add("Self Punishment");
    log.push(
      `⚠️ Self Punishment: ${dayBranch} triggers self-sabotage/mistakes.`,
    );
  }

  // 3.6 Shen Sha Risks
  if (stars.robbingShaDay) {
    score += SCORING.ROBBING_SHA;
    flags.add("Robbing Sha");
    log.push("💸 Self-Sabotage (Robbing Sha): Impulse buying/wasting time.");
  }
  if (stars.robbingShaYear) {
    score += SCORING.ROBBING_SHA;
    flags.add("Robbing Sha (Y)");
    log.push("🛡️ External Risk (Robbing Sha): Fraud/Theft risk.");
  }
  if (stars.deathGod) {
    score += SCORING.DEATH_GOD;
    flags.add("Death God");
    log.push("⚖️ Death God: Legal risks.");
  }
  if (stars.solitaryStar) {
    score += SCORING.SOLITARY;
    flags.add("Solitary");
    log.push("🥀 Solitary Star: Inner isolation.");
  }

  // 3.7 Goat Blade
  if (isGoatBlade) {
    flags.add("Goat Blade");
    if (goal === "Career") {
      score += 15;
      log.push(`⚔️ Goat Blade: Competitive Edge! Good for sales/debates.`);
    } else if (goal === "Love") {
      score -= 30;
      log.push(`💔 Goat Blade: High risk of conflict in relationships.`);
    } else {
      score -= 10;
      log.push(`🔪 Goat Blade: Intense, aggressive energy.`);
    }
  }

  // 3.8 Void Day
  const userVoidBranches = getVoidStatus(
    userDmClean,
    userDayBranch,
    dayBranch,
    [yearBranch, monthBranch],
  );
  const isVoidDay =
    userVoidBranches.isVoid && userVoidBranches.type === "True Void";
  if (isVoidDay) {
    score += SCORING.VOID_DAY;
    flags.add("VOID");
    log.push("🌌 Void Day (Kong Wang): Results are slippery.");
  }

  // 3.9 Manual Avoid
  if (rules.badBranches?.includes(dayBranch)) {
    if (!isLuckClash) {
      score += SCORING.BAD_BRANCH;
      log.push(`⚠️ Avoid: ${dayBranch} is in light conflict with your chart.`);
    }
  }

  // =================================================================
  // PHASE 4: GOAL-BASED WEIGHTING
  // =================================================================
  if (goal !== "General") {
    // --- WEALTH ---
    if (goal === "Wealth") {
      if (isWealthEl) score += 20;
      if (tenGodName === "Rob Wealth") score -= 25;
      if (stars.robbingShaDay || stars.robbingShaYear) score -= 20;
      if (nineStar.includes("9 Purple")) score += 15;
    }
    // --- CAREER ---
    else if (goal === "Career") {
      if (isCareerEl) score += 20;
      if (stars.nobleman || stars.academic) score += 15;
      if (officerName === "Destruction") score -= 15;
    }
    // --- LOVE (Dating / Romance) ---
    else if (goal === "Love") {
      if (stars.peachBlossom) score += 30;
      if (is6Harmony) score += 25;
      if (stars.solitaryStar) score -= 25;
      if (isPersonalClash) score -= 30;
    }
    // --- HEALTH ---
    else if (goal === "Health") {
      if (isHealthEl) score += 20;
      if (officerName === "Remove" || officerName === "Balance") score += 15;
      if (nineStar.includes("2 Black") || nineStar.includes("5 Yellow"))
        score -= 30;
    }
    // --- WEDDING (High-Stakes Partnership) ---
    else if (goal === "Wedding") {
      if (is6Harmony || is3Harmony) {
        score += 30;
        log.push("💍 GOAL: Harmony brings perfect union energy.");
      }
      if (stars.nobleman) {
        score += 20;
        log.push("🕊️ GOAL: Nobleman brings blessings to the marriage.");
      }
      if (stars.solitaryStar || isGoatBlade) {
        score -= 40;
        log.push("💔 GOAL: Solitary/Blade energy is toxic for weddings.");
      }
      if (isVoidDay) {
        score -= 30;
        log.push("⚠️ GOAL: Void Day creates an empty foundation for marriage.");
      }
      if (isPersonalClash) {
        score -= 50;
        log.push("🛑 GOAL: NEVER marry on a Personal Clash day.");
      }
    }
    // --- PRODUCT LAUNCH (Visibility & Market Share) ---
    else if (goal === "Product Launch") {
      if (isCareerEl || isWealthEl) {
        score += 25;
        log.push("🚀 GOAL: Output/Wealth elements fuel a successful launch.");
      }
      if (stars.nobleman) {
        score += 20;
        log.push("🌟 GOAL: Nobleman attracts VIPs and strong early adopters.");
      }
      if (nineStar.includes("9 Purple")) {
        score += 20;
        log.push("🔥 GOAL: 9 Purple star brings maximum visibility and fame.");
      }
      if (tenGodName === "Rob Wealth" || stars.robbingShaDay) {
        score -= 30;
        log.push(
          "🚫 GOAL: Rob Wealth/Sha risks lost sales or fierce competition.",
        );
      }
      if (officerName === "Destruction" || officerName === "Close") {
        score -= 25;
        log.push("🛑 GOAL: Destructive/Closed officer stalls momentum.");
      }
      if (isVoidDay) {
        score -= 20;
        log.push("🌌 GOAL: Void Day launches often fail to gain traction.");
      }
    }
  }

  // =================================================================
  // PHASE 5: SAFETY CAPS & VETOS
  // =================================================================

  // 5.1 SAN SHA FORGIVENESS
  const monthBadBranches: string[] = SAN_SHA_RULES[monthBranch] || [];
  if (monthBadBranches.includes(dayBranch)) {
    if (score >= 80 || stars.nobleman) {
      flags.add("Weak San Sha");
      log.push(`🛡️ Nobleman dissolves San Sha.`);
    } else {
      score -= 15;
      flags.add("San Sha");
      log.push(`🗡️ Three Killings: ${dayBranch} opposes the Month.`);
    }
  }

  // 5.2 PERSONAL CLASH (Hard Veto - Day)
  if (isPersonalClash) {
    score += SCORING.PENALTY_PERSONAL_CLASH;
    flags.add("PERSONAL BREAKER");
    log.push(
      `💀 PERSONAL BREAKER: ${dayBranch} clashes with Day Branch. Risk of conflict/injury.`,
    );

    if (score > SCORING.CAP_PERSONAL_BREAKER) {
      score = SCORING.CAP_PERSONAL_BREAKER;
      log.push(`🛑 SCORE CAPPED: Personal Clash overrides positive stars.`);
    }
  }

  // 5.3 MONTH BREAKER (Soft Veto)
  if (isGeneralMonthClash) {
    if (score > SCORING.CAP_MONTH_BREAKER) {
      score = SCORING.CAP_MONTH_BREAKER;
      log.push(`⚠️ SCORE CAPPED: Month Breaker instability limits potential.`);
    }
  }

  // 5.4 LUCK CLASH (New Soft Veto)
  // Fixes the issue where Luck Clashes scored "Golden"
  if (isLuckClash) {
    // Use the same cap as Month Breaker (55 - Caution)
    if (score > SCORING.CAP_MONTH_BREAKER) {
      score = SCORING.CAP_MONTH_BREAKER;
      log.push(
        `☁️ SCORE CAPPED: Luck Pillar Clash creates background friction.`,
      );
    }
  }

  // 5.5 Weak Root Cap
  if (pillarScore <= 20 && score > 75) {
    score = 75;
    log.push("⚠️ Score Capped: Day structure is too weak.");
  }

  // 5.6 Flawed Day Cap (Black Spirit / Bad Stars)
  if (
    flags.has("Black Spirit") ||
    finalIsStarAvoid ||
    flags.has("5 Yellow") ||
    flags.has("2 Black")
  ) {
    if (score > SCORING.CAP_FLAWED_DAY) {
      score = SCORING.CAP_FLAWED_DAY;
      log.push(`🌑 SCORE CAPPED: Flawed Stars prevent Golden status.`);
    }
  }

  // =================================================================
  // PHASE 6: FINAL OUTPUT
  // =================================================================

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

  if (flags.has("PERSONAL BREAKER") || score <= 20) {
    verdictText = "DANGEROUS";
    cssClass = "dangerous";
  }

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

  const unstableOfficers = ["Destruction", "Danger", "Close", "Remove"];
  const isUnstableDay =
    unstableOfficers.includes(officerName) || flags.has("PERSONAL BREAKER");

  if (score > 60 && !isUnstableDay) {
    STANDARD_RULES.forEach((rule) => {
      if (!rule.officers.includes(officerName)) return;
      let matches = false;
      const dayEl = dayData.element;
      if (rule.type === "wealth" && rules.wealthElements?.includes(dayEl))
        matches = true;
      if (rule.type === "career" && rules.careerElements?.includes(dayEl))
        matches = true;
      if (rule.type === "health" && rules.healthElements?.includes(dayEl))
        matches = true;
      if (
        rule.type === "love" &&
        (is6Harmony || is3Harmony || stars.peachBlossom)
      )
        matches = true;

      if (matches) {
        specificActions.push({
          action: rule.action,
          icon: rule.icon,
          desc: rule.description,
        });
      }
    });
  }

  const officerRec = OFFICER_RECOMMENDATIONS[officerName] || {
    action: "Proceed",
    icon: "⚠️",
    desc: "Proceed with caution.",
    reality: "The energy is unstable.",
  };

  return {
    score,
    pillarScore,
    verdict: verdictText,
    cssClass,
    pillarNote: rootInfo.description,
    pillarIcon: rootInfo.icon,
    flags: Array.from(flags),
    tags: Array.from(tags),
    log,
    specificActions,
    hours,

    dayType,
    tenGodName,

    actionTitle: guide.title,
    actionTagline: guide.tagline,
    suitableActions: guide.best,
    cautionAction: guide.caution,
    actionKeywords: guide.keywords,
    officerRec,
    starQuality:
      starName && CONSTELLATION_DATA[starName]
        ? CONSTELLATION_DATA[starName].quality
        : "Mixed",
    isStarFavorable: isWealthEl || isCareerEl || isHealthEl,
    isStarAvoid: finalIsStarAvoid,
    isAvoidElement: isAvoidEl,
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
