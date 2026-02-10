import { IUser, DayInfo, MonthAnalysis, ScoreResult } from "../types";
import { calculateShenSha } from "./shenSha";
import {
  CLASH_PAIRS, SIX_HARMONY, THREE_HARMONY, ELEMENT_MAP, BRANCH_HOURS,
  STEM_NOBLEMAN, BRANCH_START_TIMES, SAN_SHA_RULES, GOAT_BLADE_RULES,
  YANG_STEMS, ELEMENT_RELATIONSHIPS, STEM_INFO, TEN_GODS, TEN_GOD_ACTIONS,
  OFFICER_RECOMMENDATIONS, OFFICER_DATA, STANDARD_RULES, CONSTELLATION_DATA,
  ACADEMIC_STAR, TRAVELING_HORSE, BRANCHES_LIST,
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
  const { dayBranch, monthBranch, yearBranch } = dayData;
  const officerName = (dayData.officer || "").trim();

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
  const userDmClean = user.dayMaster.split(" ")[0]; // "Bing"
  const dayStemClean = dayData.stem.split(" ")[0]; // "Jia"
  const dmElement = ELEMENT_MAP[userDmClean]; // "Fire"
  const dayStemElement = ELEMENT_MAP[dayStemClean]; // "Wood"
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
  // const rootInfo = calculateRootStrength(dayStemClean, dayData.dayBranch);
  const rootInfo = calculateRootStrengthCached(dayStemClean, dayData.dayBranch);
  const pillarNote = rootInfo.description;
  const pillarIcon = rootInfo.icon;
  const pillarScore = rootInfo.score;

  // =================================================================
  // CLASH HIERARCHY (Updated)
  // =================================================================

  // A. GENERAL BREAKERS (The Date Clashing with Itself)
  // These are bad for everyone, regardless of user chart.
  if (CLASH_PAIRS[yearBranch] === dayBranch) {
    score -= 20; // Lowered penalty to prioritize Personal Clashes
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
  // Target: The "Self", Body, and Spouse.
  if (dayBranch === CLASH_PAIRS[user.baZiBranch]) {
    // Clash with Day Pillar
    score = -50; // Immediate Fail
    flags.push("PERSONAL BREAKER");
    log.push(
      `💀 PERSONAL BREAKER: ${dayBranch} clashes with your Day Branch (${user.baZiBranch}). Risk of health / injury / relationship conflict.`,
    );
    log.push(
      "⚔️ TROJAN HORSE TIP: Use this aggressive energy to break a bad habit (smoking, sugar) or end a toxic relationship.",
    );
  }
  // 2. YEAR BRANCH CLASH (High Priority)
  // Target: Social Status, Public Appearance.
  if (user.yearBranch && dayBranch === CLASH_PAIRS[user.yearBranch]) {
    score -= 30;
    flags.push("Social Clash");
    log.push(
      `🎭 Year Clash: ${dayBranch} clashes with your Year (${user.yearBranch}). Avoid public events, networking, or weddings.`,
    );
    log.push(
      "⚔️ TROJAN HORSE TIP: Use this to disrupt a stalemate negotiation or challenge the status quo.",
    );
  }
  // 3. MONTH BRANCH CLASH (Context Specific)
  // Target: Career, Parents, Authority.
  if (user.monthBranch && dayBranch === CLASH_PAIRS[user.monthBranch]) {
    score -= 20;
    flags.push("Career Clash");
    log.push(
      `🏢 Month Clash: ${dayBranch} clashes with your Month (${user.monthBranch}). Expect friction at work or with parents.`,
    );
    // We add a specific tag so the frontend can show a warning badge if desired
    tags.push("CAREER CLASH");
  }
  // 4. LUCK BRANCH CLASH
  const currentLuck = getCurrentLuckPillar(user, year); // Pass current calendar year
  // const currentLuck = { branch: user.luckBranch };

  if (currentLuck) {
    const luckBranch = currentLuck.branch;
    const clashWithLuck = CLASH_PAIRS[luckBranch];

    if (dayBranch === clashWithLuck) {
      score -= 30; // Significant penalty
      flags.push("Luck Clash");
      log.push(
        `☁️ Luck Pillar Clash: ${dayBranch} clashes with your current Luck Pillar (${luckBranch}). Expect external / environmental changes.`,
      );

      // Optional: Add to badHours if you want to block that hour too
      // badHours.push(`${dayBranch} Hour`);
    }
  }

  // (Optional) KEEP THE OLD MANUAL CHECK AS FALLBACK
  // Only if it's NOT the dynamic clash we just found
  if (
    rules.badBranches.includes(dayBranch) &&
    (!currentLuck || CLASH_PAIRS[currentLuck.branch] !== dayBranch)
  ) {
    score -= 20; // Lower penalty for manual entry
    log.push(`⚠️ Avoid: ${dayBranch} is in light conflict with your chart.`);
  }

  if (dayBranch === rules.selfPunishment) {
    score -= 30;
    flags.push("Self Punishment");
    log.push(
      `⚠️ Self Punishment: ${dayBranch} triggers self-sabotage/mistakes.`,
    );
  }

  // =================================================================
  // ELEMENTAL ANALYSIS
  // =================================================================

  const dayElement = dayData.element;

  // A. TAGGING (Check ALL independently so filters work)
  if (rules.wealthElements.includes(dayElement)) tags.push("WEALTH");
  if (rules.careerElements.includes(dayElement)) tags.push("CAREER");
  if (rules.healthElements.includes(dayElement)) tags.push("HEALTH");

  // B. SCORING & LOGGING (Priority based to prevent score inflation)
  // We check Avoid first, then the positives.
  if (rules.avoidElements.includes(dayElement)) {
    score -= 15;
    log.push(`⛔ ELEMENT: ${dayElement} is unfavorable for you.`);
  } else {
    // Determine the primary benefit for the Log
    if (rules.wealthElements.includes(dayElement)) {
      score += 15;
      log.push(`💰 ELEMENT: ${dayElement} supports your Wealth.`);
    } else if (rules.careerElements.includes(dayElement)) {
      score += 15;
      log.push(`🚀 ELEMENT: ${dayElement} supports your Career.`);
    } else if (rules.healthElements.includes(dayElement)) {
      score += 10;
      log.push(`🧘 ELEMENT: ${dayElement} supports your Health.`);
    }
  }

  // =================================================================
  // CONSTELLATION CHECK (Runtime Logic)
  // =================================================================

  const starName = dayData.constellation;

  // Initialize defaults
  let starQuality: "Good" | "Bad" | "Mixed" = "Mixed";
  let isStarFavorable = false;
  let isStarAvoid = false;
  let isAvoidElement = false;

  // 1. Check for Day Instability (Breakers)
  // (We check flags we calculated earlier in the function)
  const isBrokenDay =
    flags.includes("YEAR BREAKER") ||
    flags.includes("MONTH BREAKER") ||
    flags.includes("PERSONAL BREAKER") ||
    dayBranch === rules.breaker;

  if (starName && CONSTELLATION_DATA[starName]) {
    const starData = CONSTELLATION_DATA[starName];
    const starElement = starData.element;

    starQuality = starData.quality;

    // 2. Determine User Relation
    const allUseful = [
      ...rules.wealthElements,
      ...rules.careerElements,
      ...rules.healthElements,
    ];

    if (allUseful.includes(starElement)) isStarFavorable = true;

    // 3. SMART AVOID LOGIC (The Fix)
    isAvoidElement = rules.avoidElements.includes(starElement);

    if (starQuality === "Bad") {
      // Bad stars are always avoided
      isStarAvoid = true;
    } else if (starQuality === "Mixed" && isAvoidElement) {
      // Mixed stars turn Bad if element conflicts
      isStarAvoid = true;
    } else if (starQuality === "Good" && isAvoidElement) {
      // ✨ THE EXCEPTION: Good stars (like Tail) generally OVERRIDE element clashes...
      // ...UNLESS the day itself is broken.
      isStarAvoid = isBrokenDay;
    }

    // 4. SCORING
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

  if (user.baZiBranch) {
    if (SIX_HARMONY[user.baZiBranch] === dayBranch) {
      score += 20;
      log.push(`✨ Six Harmony: ${dayBranch} is your Secret Friend.`);
      flags.push("6-Harmony");
      tags.push("PEOPLE");
    }
    if (THREE_HARMONY[user.baZiBranch]?.includes(dayBranch)) {
      score += 10;
      log.push(`🤝 Three Harmony: ${dayBranch} boosts Social Luck.`);
      flags.push("3-Harmony");
      tags.push("PEOPLE");
    }
  }

  if (rules.favorableBranches.includes(dayBranch)) {
    score += 20;
    const branchElem = ELEMENT_MAP[dayBranch] || "Unknown";
    const role = getRole(branchElem);
    log.push(`Great Branch: ${dayBranch} provides ${role}.`);
  }

  // =================================================================
  // ACTIONS (SMARTER FILTER)
  // =================================================================

  // Define "Unstable Officers" where constructive actions usually fail
  const unstableOfficers = [
    "Destruction", // (Po) - Energy clashes. Things break. Good for demolition, bad for building.
    "Danger",      // (Wei) - Energy is precarious. High risk of accidents or failure.
    "Close",       // (Bi) - Energy is stagnant/blocked. Nothing moves forward.
    "Remove"       // (Chu) - Energy is depleting. Good for cleaning/divorce, bad for starting.
  ];
  const isUnstableDay =
    unstableOfficers.includes(dayData.officer) ||
    flags.some((f) => f.includes("BREAKER"));

  // Only check for specific actions if the day is STABLE and decent (Score > 50)
  // If it's a "Destruction" day, we skip this entire block so you don't get mixed signals.
  if (score > 50 && !isUnstableDay) {
    const dayOfficer = officerName;
    const stemElem = dayData.element;
    const branchElem = ELEMENT_MAP[dayBranch] || "";
    let bonusApplied = false;

    STANDARD_RULES.forEach((rule) => {
      // 1. Check if the Day Officer allows this action
      if (!rule.officers.includes(dayOfficer)) return;

      // 2. Check if the User's Elements match this action
      let targetElements: string[] = [];
      if (rule.type === "wealth") targetElements = rules.wealthElements;
      else if (rule.type === "career") targetElements = rules.careerElements;
      else if (rule.type === "health") targetElements = rules.healthElements;

      if (
        targetElements.includes(stemElem) ||
        targetElements.includes(branchElem)
      ) {
        specificActions.push({
          action: rule.action,
          icon: rule.icon,
          desc: rule.description,
        });

        // Add score bonus only once per day
        if (!bonusApplied) {
          score += 15;
          bonusApplied = true;
          log.push(`🎯 MATCH: Perfect day for ${rule.action}.`);
        }
      }
    });
  } else if (isUnstableDay) {
    // Optional: Add a log explaining why no actions are suggested despite good elements
    log.push("⚠️ Day Energy is too unstable for major actions.");
  }

  // =================================================================
  // NINE STAR CHECKS (Period 9 Optimized)
  // =================================================================

  const nineStar = dayData.nineStar;

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

  // Bad 9 Stars
  if (nineStar.includes("5 Yellow")) {
    score -= 20;
    flags.push("5 Yellow");
    log.push(`☣️ 5 Yellow: Emperor of Calamity. Avoid risks.`);
  } else if (nineStar.includes("2 Black")) {
    score -= 10;
    if (rules.healthElements) log.push(`💊 2 Black: Strong Illness Energy.`);
    else log.push(`🧱 2 Black: Sickness Star (Good for Land, Bad for Body).`);
  } else if (nineStar.includes("3 Jade") || nineStar.includes("7 Red")) {
    score -= 5;
    log.push(`⚔️ Conflict/Robbery: Risk of disputes.`);
  }

  // =================================================================
  // --- SAN SHA & GOAT BLADE ---
  // =================================================================

  // Month Sha
  const monthBadBranches: string[] = SAN_SHA_RULES[monthBranch] || [];
  if (monthBadBranches.includes(dayBranch)) {
    flags.push("San Sha");
    score -= 10;
    log.push(`🗡️ Three Killings: ${dayBranch} opposes the Month.`);
  }

  // Goat Blade
  const bladeBranch = GOAT_BLADE_RULES[user.dayMaster];
  if (bladeBranch === dayBranch) {
    score -= 15;
    flags.push("Goat Blade");
    const isYang = YANG_STEMS.includes(user.dayMaster);
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
      "💸 Robbing Sha: Theft, fraud, bad investments, or people taking credit for your work at the office. Don't trust 'too good to be true' offers today.",
    );
  }
  if (stars.deathGod) {
    score -= 10;
    flags.push("Death God");
    log.push(
      "⚖️ Death God: Prone to negligence or legal loops. Check fine print. Good day for isolation and strategic thinking, the world won't bother you.",
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

  // 1. Check for VOID (Kong Wang)
  // We check the USER'S Day Pillar (user.dayMaster, user.baZiBranch)
  const contextBranches = [yearBranch, monthBranch];
  const userVoidBranches = getVoidStatus(
    user.dayMaster,
    user.baZiBranch,
    dayBranch,
    contextBranches,
  );
  const isVoidDay =
    userVoidBranches.isVoid && userVoidBranches.type === "True Void";

  if (isVoidDay) {
    // Standard interpretation: Bad for material success
    // Architect interpretation: Good for spiritual/deep work
    flags.push("VOID");

    // We do NOT deduct points if the goal is "Planning" or "Deep Work"
    // But generally, we add a nuanced log
    log.push("🌌 Void Day (Kong Wang): Material results are slippery today.");
    log.push(
      "💡 VOID TIP: Excellent for coding, meditation, and strategy. The world can't see you.",
    );
  }

// =================================================================
  // HOURLY BREAKDOWN (Now with Personalization)
  // =================================================================

  // 1. Get Personal Hour Criteria
  const userNobleBranches = STEM_NOBLEMAN[user.dayMaster] || [];
  const userAcademicBranch = ACADEMIC_STAR[user.dayMaster];
  const userHorseBranch = TRAVELING_HORSE[user.yearBranch]; // Ensure yearBranch is valid!
  const userClashBranch = CLASH_PAIRS[user.baZiBranch]; // Clashes User's Day (Spouse/Health)

  const hours = BRANCHES_LIST.map((branch, index) => {
    // Standard Time Mapping (Rat = 23:00-01:00, etc.)
    // Note: Index 0 is Rat. In 24h format, Rat is 23:00-01:00.
    // Simple display mapping:
    const start = index === 0 ? 23 : (index * 2) - 1;
    const end = index === 0 ? 1 : (index * 2) + 1;
    const timeLabel = `${String(start).padStart(2, '0')}:00 - ${String(end).padStart(2, '0')}:00`;

    const rating = "Neutral"; // Default (You can keep your existing logic for Good/Bad here)

    // NEW: Personal Tags
    const tags: string[] = [];

    // A. Nobleman (Help / Rescue)
    if (userNobleBranches.includes(branch)) {
      tags.push("Nobleman");
    }

    // B. Academic (Deep Work / Strategy)
    if (userAcademicBranch === branch) {
      tags.push("Academic");
    }

    // C. Traveling Horse (Movement / Sales / Remote Work)
    if (userHorseBranch === branch) {
      tags.push("Horse");
    }

    // D. Personal Breaker (Clash) - DANGER
    if (userClashBranch === branch) {
      tags.push("Clash");
    }

    // E. General Day Clash (Day Breaker) - DANGER
    if (CLASH_PAIRS[dayBranch] === branch) {
      tags.push("DayBreaker");
    }

    return {
      branch,
      time: timeLabel,
      rating,
      tags
    };
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

  // Determine Verdict Text
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

  // Golden Hours
  const hourMap: Record<string, { label: string[]; time: number }> = {};
  const userBadBranches = rules.badBranches || [];
  const addHour = (branch: string, label: string) => {
    if (userBadBranches.includes(branch) || !BRANCH_HOURS[branch]) return;
    if (!hourMap[branch]) {
      hourMap[branch] = { label: [label], time: BRANCH_START_TIMES[branch] };
    } else if (!hourMap[branch].label.includes(label)) {
      hourMap[branch].label.push(label);
    }
  };

  (STEM_NOBLEMAN[dayStemClean] || []).forEach((b) => addHour(b, "🌟 Nobleman"));
  if (SIX_HARMONY[dayBranch]) addHour(SIX_HARMONY[dayBranch], "✨ Harmony");
  (THREE_HARMONY[dayBranch] || []).forEach((b) => addHour(b, "🤝 Teamwork"));

  const goodHours = Object.keys(hourMap)
    .map((b) => ({ branch: b, ...hourMap[b] }))
    .sort((a, b) => a.time - b.time)
    .map(
      (h) =>
        `<strong>${h.branch}</strong> (${BRANCH_HOURS[h.branch]}) - ${h.label.join(" / ")}`,
    );

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
  const userBranch = user.baZiBranch;

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
