import { STEM_INFO, STEM_ORDER, BRANCH_ORDER } from "./constants";
import { IUser } from "../types";

export const getCurrentLuckPillar = (user: IUser, currentYear: number) => {
  // 1. Get Birth Data
  const { gender, yearStem, monthStem, monthBranch, birthYear } = user;

  // Prevents "Cannot read properties of undefined (reading 'toLowerCase')"
  if (!yearStem || !monthStem || !monthBranch || !birthYear || !gender) {
    return null;
  }

  // 2. Determine Direction
  const cleanYearStem = yearStem.split(" ")[0];
  const yearStemInfo = STEM_INFO[cleanYearStem];

  if (!yearStemInfo) return null;

  const isYangYear = yearStemInfo.polarity === "Yang";
  const isMale = gender.toLowerCase().startsWith("m");

  let direction = 1; // Default Forward

  if (isMale) {
    direction = isYangYear ? 1 : -1;
  } else {
    direction = isYangYear ? -1 : 1;
  }

  // Use Chinese Nominal Age (Age + 1)
  // BaZi cycles align with Chinese age.
  // Example: Age 39 (Western) = Age 40 (Chinese).
  // 40 / 10 = 4th Luck Pillar (Tiger).
  const chineseAge = currentYear - birthYear + 1;

  if (chineseAge < 1) return null;

  // We use floor because standard pillars are decades (10-19, 20-29)
  // Age 10 / 10 = 1 (1st Pillar)
  // Age 40 / 10 = 4 (4th Pillar)
  const steps = Math.floor(chineseAge / 10);

  // If steps is 0 (Age 1-9), return Month Pillar
  if (steps === 0) return { stem: monthStem, branch: monthBranch };

  // 4. Find Start Index
  const cleanMonthStem = monthStem.split(" ")[0];
  const startStemIndex = STEM_ORDER.indexOf(cleanMonthStem);
  const startBranchIndex = BRANCH_ORDER.indexOf(monthBranch);

  if (startStemIndex === -1 || startBranchIndex === -1) return null;

  // 5. Calculate New Indices
  let newStemIndex = (startStemIndex + steps * direction) % 10;
  let newBranchIndex = (startBranchIndex + steps * direction) % 12;

  // Handle negative modulo bug
  if (newStemIndex < 0) newStemIndex += 10;
  if (newBranchIndex < 0) newBranchIndex += 12;

  return {
    stem: STEM_ORDER[newStemIndex],
    branch: BRANCH_ORDER[newBranchIndex],
  };
};
