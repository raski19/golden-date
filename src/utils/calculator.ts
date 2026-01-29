import { IUser, DayInfo, MonthAnalysis, ScoreResult } from "../types";
import { calculateShenSha } from "./shenSha";
import {
  CLASH_PAIRS,
  SIX_HARMONY,
  THREE_HARMONY,
  ELEMENT_MAP,
  BRANCH_HOURS,
  STEM_NOBLEMAN,
  BRANCH_START_TIMES,
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
} from "./constants";
import { calculateRootStrengthCached } from "./rootStrength";
import { getCurrentLuckPillar } from "./calculateLuckPillar";

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
  // 4. CLASH HIERARCHY (Updated)
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
    score = -100; // Immediate Fail
    flags.push("PERSONAL BREAKER");
    log.push(
      `💀 PERSONAL BREAKER: ${dayBranch} clashes with your Day Branch (${user.baZiBranch}). Risk of health/injury/relationship conflict.`,
    );

    // Return early because this day is unusable
    return {
      dayType,
      pillarNote,
      pillarIcon,
      pillarScore,
      score: 0,
      verdict: "DANGEROUS",
      cssClass: "dangerous",
      flags,
      tags,
      log,
      specificActions: [],
      badHours: [],
      goodHours: [],
      tenGodName,
      actionTitle: guide.title,
      actionTagline: guide.tagline,
      suitableActions: [],
      cautionAction: "Avoid all major activities.",
      actionKeywords: "",
      officerRec,
      starQuality: "Bad",
      isStarFavorable: false,
      isStarAvoid: true,
      isAvoidElement: true,
    };
  }

  // 2. YEAR BRANCH CLASH (High Priority)
  // Target: Social Status, Public Appearance.
  // Note: Ensure user.yearBranch exists. If not, this check is skipped.
  if (user.yearBranch && dayBranch === CLASH_PAIRS[user.yearBranch]) {
    score -= 50;
    flags.push("Social Clash");
    log.push(
      `🎭 Year Clash: ${dayBranch} clashes with your Year (${user.yearBranch}). Avoid public events, networking, or weddings.`,
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
        `☁️ Luck Pillar Clash: ${dayBranch} clashes with your current Luck Pillar (${luckBranch}). Expect external/environmental changes.`,
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
    log.push(`⚠️ Avoid: ${dayBranch} is in your manual avoid list.`);
  }

  if (dayBranch === rules.selfPunishment) {
    score -= 30;
    flags.push("Self Punishment");
    log.push(
      `⚠️ Self Punishment: ${dayBranch} triggers self-sabotage/mistakes.`,
    );
  }

  // --- 5. ELEMENTAL ANALYSIS ---
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
    // (We use a flag to ensure we only add the score bonus once)
    let bonusApplied = false;

    if (rules.wealthElements.includes(dayElement)) {
      score += 15;
      log.push(`💰 ELEMENT: ${dayElement} supports your Wealth.`);
      bonusApplied = true;
    } else if (rules.careerElements.includes(dayElement)) {
      score += 15;
      log.push(`🚀 ELEMENT: ${dayElement} supports your Career.`);
      bonusApplied = true;
    } else if (rules.healthElements.includes(dayElement)) {
      score += 10;
      log.push(`🧘 ELEMENT: ${dayElement} supports your Health.`);
      bonusApplied = true;
    }
  }

  // =================================================================
  // 6. CONSTELLATION CHECK (Runtime Logic)
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

  // --- 7. HARMONIES & BRANCH POWER ---
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

  // --- 8. ACTION RULES ---
  if (score > 40) {
    const dayOfficer = officerName;
    const stemElem = dayData.element;
    const branchElem = ELEMENT_MAP[dayBranch] || "Unknown";
    let bonusApplied = false;

    STANDARD_RULES.forEach((rule) => {
      if (!rule.officers.includes(dayOfficer)) return;

      let targetElements: string[] = [];
      if (rule.type === "wealth") targetElements = rules.wealthElements;
      else if (rule.type === "career") targetElements = rules.careerElements;
      else if (rule.type === "health") targetElements = rules.healthElements;

      // 3. Check Element Match
      const elementMatch =
        targetElements.includes(stemElem) ||
        targetElements.includes(branchElem);

      // 4. If Both Match -> Add to Specific Actions
      if (elementMatch) {
        specificActions.push({
          action: rule.action,
          icon: rule.icon,
          desc: rule.description,
        });

        // Apply Bonus (Once per day)
        if (!bonusApplied) {
          score += 15;
          bonusApplied = true;
          log.push(`🎯 MATCH: Perfect day for ${rule.action} (${rule.type}).`);
        }
      }
    });
  }

  // --- 9. NINE STAR CHECKS (Period 9 Optimized) ---
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

  // --- 10. SAN SHA & GOAT BLADE ---
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

  // --- 11. SHEN SHA ---
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

  // --- 12. HARD CAPS & VERDICT ---
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

  // Bad Hours (Clash)
  const dayClash = CLASH_PAIRS[dayBranch];
  const badHours = dayClash
    ? [`${dayClash} Hour (${BRANCH_HOURS[dayClash]})`]
    : [];

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
    badHours,
    goodHours,
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
