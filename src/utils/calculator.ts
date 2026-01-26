import { IUser, DayInfo, MonthAnalysis, ScoreResult } from "../types";
import { calculateShenSha } from "./shenSha";
import {
  CLASH_PAIRS,
  SIX_HARMONY,
  THREE_HARMONY,
  BRANCH_ELEMENTS,
  BRANCH_HOURS,
  STEM_NOBLEMAN,
  BRANCH_START_TIMES,
  OFFICER_ADVICE,
  BAD_STARS,
  GOOD_STARS,
  SAN_SHA_RULES,
} from "./constants";

export const calculateScore = (user: IUser, dayData: DayInfo): ScoreResult => {
  let score = 50;
  let log: string[] = [];
  let flags: string[] = [];
  let tags: string[] = [];
  let specificActions: { action: string; icon: string; desc: string }[] = [];

  const rules = user.rules;
  const { dayBranch, monthBranch, yearBranch } = dayData;
  const advice = OFFICER_ADVICE[dayData.officer] || { good: [], bad: [] };

  const getRole = (element: string) => {
    if (rules.wealthElements?.includes(element)) return "Wealth (Profit)";
    if (rules.careerElements?.includes(element))
      return "Career (Output/Action)";
    if (rules.favorableElements?.includes(element)) return "Favorable Support";
    return "Unfavorable";
  };

  const allFavorableElements = [
    ...(rules.wealthElements || []),
    ...(rules.careerElements || []),
    ...(rules.favorableElements || []),
  ];

  if (CLASH_PAIRS[yearBranch] === dayBranch) {
    score -= 50;
    flags.push("YEAR BREAKER");
    log.push(`Year Breaker: ${dayBranch} clashes with Year ${yearBranch}.`);
  }

  if (CLASH_PAIRS[monthBranch] === dayBranch) {
    score -= 40;
    flags.push("MONTH BREAKER");
    log.push(`Month Breaker: ${dayBranch} clashes with Month ${monthBranch}.`);
  }

  // Safety Checks
  if (dayBranch === rules.breaker) {
    flags.push("PERSONAL BREAKER");
    // We still return badHours even for dangerous days
    const clash = CLASH_PAIRS[dayBranch];
    return {
      score: 0,
      verdict: "DANGEROUS",
      cssClass: "dangerous",
      flags,
      tags: [],
      log: [...log, `DANGER: ${dayBranch} clashes with your Day Master.`],
      specificActions: [],
      badHours: clash ? [`${clash} Hour (${BRANCH_HOURS[clash]})`] : [],
      goodHours: [],
      generalAdvice: advice,
    };
  }

  if (rules.badBranches.includes(dayBranch)) {
    score -= 30;
    flags.push("Luck Clash");
    log.push(`Avoid: ${dayBranch} harms your Luck Pillar.`);
  }

  if (dayBranch === rules.selfPunishment) {
    score -= 30;
    flags.push("Self Punishment");
    log.push(`Warning: ${dayBranch} triggers self-punishment.`);
  }

  if (rules.avoidElements.includes(dayData.element)) {
    score -= 15;
    log.push(`Element ${dayData.element} is unfavorable.`);
  }

  // --- GLOBAL STAR CHECK ---
  if (BAD_STARS.includes(dayData.constellation)) {
    score -= 15;
    log.push(
      `☁️ Gloomy Star: '${dayData.constellation}' is generally inauspicious.`,
    );
  } else if (GOOD_STARS.includes(dayData.constellation)) {
    score += 5; // Small universal bonus
    log.push(
      `🌟 Lucky Star: '${dayData.constellation}' is generally auspicious.`,
    );
  }

  // --- PERSONAL STAR CHECK (Overrules or Adds to Global) ---
  // User explicitly hates this star (e.g., it's Fire and they hate Fire)
  if ((rules.avoidConstellations || []).includes(dayData.constellation)) {
    score -= 20;
    flags.push("Bad Star");
    log.push(
      `⛔ Personal Clash: Star '${dayData.constellation}' conflicts with your chart.`,
    );
  }

  // User explicitly loves this star (e.g., it's Water and they need Water)
  if (rules.favorableConstellations.includes(dayData.constellation)) {
    score += 15;
    flags.push("Good Star");
    log.push(
      `✨ Personal Noble: Star '${dayData.constellation}' supports your useful god.`,
    );
  }

  // Harmony
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

  // Power Boosts
  if (rules.favorableBranches.includes(dayBranch)) {
    score += 20;
    const branchElem = BRANCH_ELEMENTS[dayBranch] || "Unknown";
    const role = getRole(branchElem);
    log.push(`Great Branch: ${dayBranch} provides ${role}.`);
  }

  if (allFavorableElements.includes(dayData.element)) {
    score += 20;
    const role = getRole(dayData.element);
    log.push(`Great Element: ${dayData.element} provides ${role}.`);
  }

  if (rules.favorableOfficers.some((off) => dayData.officer.includes(off))) {
    score += 15;
    log.push(`Officer '${dayData.officer}' is good for action.`);
  }

  if (rules.favorableConstellations.includes(dayData.constellation)) {
    score += 15;
    flags.push("Good Star");
    log.push(`Star '${dayData.constellation}' increases asset value.`);
  }

  // Action Rules
  if (user.actionRules && score > 0) {
    const dayOfficer = dayData.officer;
    const stemElem = dayData.element;
    const branchElem = BRANCH_ELEMENTS[dayBranch] || "Unknown";

    let bonusApplied = false;

    user.actionRules.forEach((rule) => {
      const officerMatch = rule.officers.includes(dayOfficer);
      const elementMatch =
        rule.elements.includes(stemElem) || rule.elements.includes(branchElem);

      if (officerMatch && elementMatch) {
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

  // --- SAN SHA CHECK  ---
  // Check Month Sha (Immediate effect)
  const monthBadBranches: string[] = SAN_SHA_RULES[monthBranch] || [];
  if (monthBadBranches.includes(dayBranch)) {
    score -= 20; // Big penalty
    flags.push("San Sha");
    log.push(
      `🗡️ Three Killings: ${dayBranch} opposes the Month's flow. Risk of obstacles/loss.`,
    );
  }

  // Check Year Sha (General effect - optional, maybe smaller penalty)
  const yearBadBranches: string[] = SAN_SHA_RULES[yearBranch] || [];
  if (yearBadBranches.includes(dayBranch)) {
    score -= 10;
    log.push(`⚔️ Year Sha: Mild obstacle due to year opposition.`);
  }

  // Tagging
  const stemElement = dayData.element;
  const branchElement = BRANCH_ELEMENTS[dayBranch] || "Unknown";

  if (score > 40) {
    if (
      rules.wealthElements.includes(stemElement) ||
      rules.wealthElements.includes(branchElement)
    ) {
      tags.push("WEALTH");
    }
    if (
      rules.careerElements.includes(stemElement) ||
      rules.careerElements.includes(branchElement)
    ) {
      tags.push("CAREER");
    }
    if (
      (rules.healthElements || []).includes(stemElement) ||
      (rules.healthElements || []).includes(branchElement)
    ) {
      tags.push("HEALTH");
    }
  }

  // Special stars (Shen Sha)
  const stars = calculateShenSha(user, dayBranch);

  if (stars.nobleman) {
    score += 25; // Huge Bonus (can save a bad day)
    log.push(`🌟 Nobleman: Great for seeking help and mentorship.`);
    flags.push("Nobleman");
  }
  if (stars.travelingHorse) {
    score += 10;
    log.push(`🐴 Sky Horse: Good for travel, moving, and speed.`);
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

  // Verdict
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

  if (
    flags.includes("PERSONAL BREAKER") ||
    flags.includes("YEAR BREAKER") ||
    score <= 0
  ) {
    verdictText = "DANGEROUS";
    cssClass = "dangerous";
  }

  // Bad Hours Calculation
  const dayClash = CLASH_PAIRS[dayBranch];
  const badHours = [];
  if (dayClash) {
    badHours.push(`${dayClash} Hour (${BRANCH_HOURS[dayClash]})`);
  }

  // =========================================================
  // GOLDEN HOURS
  // =========================================================
  const hourMap: Record<string, { label: string[]; time: number }> = {};
  const cleanStem = dayData.stem.split(" ")[0];
  const userBadBranches = user.rules.badBranches || [];

  const addHour = (branch: string, label: string) => {
    // Safety Filter
    if (userBadBranches.includes(branch) || !BRANCH_HOURS[branch]) return;

    if (!hourMap[branch]) {
      // New Entry
      hourMap[branch] = {
        label: [label],
        time: BRANCH_START_TIMES[branch],
      };
    } else {
      // Existing Entry: Just append the new reason (e.g. "Nobleman / Harmony")
      if (!hourMap[branch].label.includes(label)) {
        hourMap[branch].label.push(label);
      }
    }
  };

  // 1. Day Nobleman
  (STEM_NOBLEMAN[cleanStem] || []).forEach((branch) =>
    addHour(branch, "🌟 Nobleman"),
  );

  // 2. Six Harmony
  const sixHarmony = SIX_HARMONY[dayBranch];
  if (sixHarmony) addHour(sixHarmony, "✨ Harmony");

  // 3. Three Harmony
  const threeHarmony = THREE_HARMONY[dayBranch];
  if (threeHarmony)
    threeHarmony.forEach((branch) => addHour(branch, "🤝 Teamwork"));

  // 4. CONVERT TO ARRAY & SORT
  const goodHours = Object.keys(hourMap)
    .map((branch) => ({
      branch,
      ...hourMap[branch],
    }))
    .sort((a, b) => a.time - b.time) // Sort by start time (1 -> 23)
    .map(
      (h) =>
        `<strong>${h.branch}</strong> (${BRANCH_HOURS[h.branch]}) - ${h.label.join(" / ")}`,
    );

  return {
    score,
    verdict: verdictText,
    cssClass,
    flags,
    tags,
    log,
    specificActions,
    badHours,
    goodHours,
    generalAdvice: advice,
  };
};

export const analyzeMonth = (
  user: IUser,
  monthBranch: string,
): MonthAnalysis => {
  const userBranch = user.baZiBranch;

  // 1. CHECK CLASH (Most Important)
  if (CLASH_PAIRS[userBranch] === monthBranch) {
    return {
      verdict: "DANGEROUS",
      title: `⚠️ Personal Breaker Month (${monthBranch})`,
      description: `This month clashes with your <strong>${userBranch}</strong>. The energy is turbulent. Avoid major risks, signing long-term contracts, or high-stakes launches.`,
      cssClass: "warn-banner",
    };
  }

  // 2. CHECK HARMONY (Support)
  if (SIX_HARMONY[userBranch] === monthBranch) {
    return {
      verdict: "EXCELLENT",
      title: `🌟 Noble Month (${monthBranch})`,
      description: `This month is your Secret Friend! You have hidden support and things will go smoother than usual.`,
      cssClass: "good-banner",
    };
  }

  // 3. CHECK BAD BRANCHES (General Luck)
  if (user.rules.badBranches.includes(monthBranch)) {
    return {
      verdict: "CAUTION",
      title: `🌧️ Unfavorable Month (${monthBranch})`,
      description: `The energy of the ${monthBranch} weakens your chart. Conserve resources and stick to routine.`,
      cssClass: "neutral-banner",
    };
  }

  // 4. CHECK FAVORABLE BRANCHES
  if (user.rules.favorableBranches.includes(monthBranch)) {
    return {
      verdict: "GOOD",
      title: `🚀 Strong Month (${monthBranch})`,
      description: `The ${monthBranch} supports your goals. It is a great time to push forward.`,
      cssClass: "good-banner",
    };
  }

  // 5. DEFAULT
  return {
    verdict: "NEUTRAL",
    title: `⚖️ Balanced Month (${monthBranch})`,
    description: `Energy is neutral. Your results depend entirely on your specific daily actions.`,
    cssClass: "neutral-banner",
  };
};
