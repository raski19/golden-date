import { IUser } from "../types";
import {
  STEM_NOBLEMAN,
  TRAVELING_HORSE,
  PEACH_BLOSSOM,
  ACADEMIC_STAR,
  ROBBING_SHA,
  DEATH_GOD,
  SOLITARY_STAR,
} from "./constants";

export interface ShenShaResult {
  nobleman: boolean;
  travelingHorse: boolean;
  peachBlossom: boolean;
  academic: boolean;
  robbingShaDay: boolean;
  robbingShaYear: boolean;
  deathGod: boolean;
  solitaryStar: boolean;
}

// 2. MAIN FUNCTION
export const calculateShenSha = (
  user: IUser,
  dayBranch: string,
): ShenShaResult => {
  const dm = user.dayMaster;
  const yearBranch = user.yearBranch; // Assuming this is the Year Branch (Animal)

  return {
    // Positive Stars
    nobleman: STEM_NOBLEMAN[dm]?.includes(dayBranch) || false,
    travelingHorse: TRAVELING_HORSE[yearBranch] === dayBranch,
    peachBlossom: PEACH_BLOSSOM[yearBranch] === dayBranch,
    academic: ACADEMIC_STAR[dm] === dayBranch,

    // Negative Stars
    robbingShaDay: ROBBING_SHA[dayBranch] === dayBranch,
    robbingShaYear: ROBBING_SHA[yearBranch] === dayBranch,
    deathGod: DEATH_GOD[yearBranch] === dayBranch,
    solitaryStar: SOLITARY_STAR[yearBranch] === dayBranch,
  };
};
