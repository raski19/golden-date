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
} from "./constants";

export const calculateScore = (user: IUser, dayData: DayInfo): ScoreResult => {
  let score = 50;
  let log: string[] = [];
  let flags: string[] = [];
  let tags: string[] = [];
  let specificActions: { action: string; icon: string; desc: string }[] = [];

  const rules = user.rules;

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

  if (CLASH_PAIRS[dayData.yearBranch] === dayData.branch) {
    score -= 50;
    flags.push("YEAR BREAKER");
    log.push(
      `Year Breaker: ${dayData.branch} clashes with Year ${dayData.yearBranch}.`,
    );
  }

  if (CLASH_PAIRS[dayData.monthBranch] === dayData.branch) {
    score -= 40;
    flags.push("MONTH BREAKER");
    log.push(
      `Month Breaker: ${dayData.branch} clashes with Month ${dayData.monthBranch}.`,
    );
  }

  // Safety Checks
  if (dayData.branch === rules.breaker) {
    flags.push("PERSONAL BREAKER");
    // We still return badHours even for dangerous days
    const clash = CLASH_PAIRS[dayData.branch];
    return {
      score: 0,
      verdict: "DANGEROUS",
      cssClass: "dangerous",
      flags,
      tags: [],
      log: [...log, `DANGER: ${dayData.branch} clashes with your Day Master.`],
      specificActions: [],
      badHours: clash ? [`${clash} Hour (${BRANCH_HOURS[clash]})`] : [],
      goodHours: [],
    };
  }

  if (rules.badBranches.includes(dayData.branch)) {
    score -= 30;
    flags.push("Luck Clash");
    log.push(`Avoid: ${dayData.branch} harms your Luck Pillar.`);
  }

  if (dayData.branch === rules.selfPunishment) {
    score -= 30;
    flags.push("Self Punishment");
    log.push(`Warning: ${dayData.branch} triggers self-punishment.`);
  }

  if (rules.avoidElements.includes(dayData.element)) {
    score -= 15;
    log.push(`Element ${dayData.element} is unfavorable.`);
  }

  if ((rules.avoidConstellations || []).includes(dayData.constellation)) {
    score -= 25;
    flags.push("Bad Star");
    log.push(`Avoid: Star '${dayData.constellation}' is negative.`);
  }

  // Harmony
  if (user.baZiBranch) {
    if (SIX_HARMONY[user.baZiBranch] === dayData.branch) {
      score += 20;
      log.push(`✨ Six Harmony: ${dayData.branch} is your Secret Friend.`);
      flags.push("6-Harmony");
      tags.push("PEOPLE");
    }
    if (THREE_HARMONY[user.baZiBranch]?.includes(dayData.branch)) {
      score += 10;
      log.push(`🤝 Three Harmony: ${dayData.branch} boosts Social Luck.`);
      flags.push("3-Harmony");
      tags.push("PEOPLE");
    }
  }

  // Power Boosts
  if (rules.favorableBranches.includes(dayData.branch)) {
    score += 20;
    const branchElem = BRANCH_ELEMENTS[dayData.branch] || "Unknown";
    const role = getRole(branchElem);
    log.push(`Great Branch: ${dayData.branch} provides ${role}.`);
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
    const branchElem = BRANCH_ELEMENTS[dayData.branch] || "Unknown";

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

  // Tagging
  const stemElement = dayData.element;
  const branchElement = BRANCH_ELEMENTS[dayData.branch] || "Unknown";

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
  }

  // Special stars (Shen Sha)
  const stars = calculateShenSha(user, dayData.branch);

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
  const dayClash = CLASH_PAIRS[dayData.branch];
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
  const sixHarmony = SIX_HARMONY[dayData.branch];
  if (sixHarmony) addHour(sixHarmony, "✨ Harmony");

  // 3. Three Harmony
  const threeHarmony = THREE_HARMONY[dayData.branch];
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
