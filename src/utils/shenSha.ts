import { IUser } from "../types";
import {
  STEM_NOBLEMAN,
  TRAVELING_HORSE,
  PEACH_BLOSSOM,
  ACADEMIC_STAR,
} from "./constants";

export interface ShenShaResult {
  nobleman: boolean;
  travelingHorse: boolean;
  peachBlossom: boolean;
  academic: boolean;
}

// 2. MAIN FUNCTION
export const calculateShenSha = (
  user: IUser,
  dayBranch: string,
): ShenShaResult => {
  const dm = user.dayMaster; // e.g. "Bing"
  const yearBranch = user.baZiBranch;

  return {
    nobleman: STEM_NOBLEMAN[dm]?.includes(dayBranch) || false,
    travelingHorse: TRAVELING_HORSE[yearBranch] === dayBranch,
    peachBlossom: PEACH_BLOSSOM[yearBranch] === dayBranch,
    academic: ACADEMIC_STAR[dm] === dayBranch,
  };
};
