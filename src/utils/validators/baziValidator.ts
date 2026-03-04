import { IUser } from "../../types";

export function hasFullBaZiData(
  user: IUser
): user is Required<
  Pick<
    IUser,
    | "dayMaster"
    | "monthBranch"
    | "yearStem"
    | "monthStem"
    | "hourStem"
    | "yearBranch"
    | "dayBranch"
    | "hourBranch"
  >
> &
  IUser {
  return Boolean(
    user.dayMaster &&
      user.monthBranch &&
      user.yearStem &&
      user.monthStem &&
      user.hourStem &&
      user.yearBranch &&
      user.dayBranch &&
      user.hourBranch
  );
}
