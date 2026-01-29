import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types";

// Mongoose needs to know that this Schema matches the IUser interface
interface IUserModel extends Omit<IUser, "_id">, Document {}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  baZiProfile: String,
  dayMaster: { type: String, required: true },
  monthStem: { type: String, required: true },
  yearStem: { type: String, required: true },
  baZiBranch: { type: String, required: true },
  monthBranch: { type: String, required: true },
  yearBranch: { type: String, required: true },
  luckBranch: { type: String, required: true },
  birthYear: { type: Number, required: true },
  gender: { type: String, required: true },
  description: String,
  rules: {
    breaker: String,
    selfPunishment: String,
    favorableBranches: [String],
    badBranches: [String],
    wealthElements: [String],
    careerElements: [String],
    healthElements: [String],
    avoidElements: [String],
  },
});

export default mongoose.model<IUserModel>("User", UserSchema);
