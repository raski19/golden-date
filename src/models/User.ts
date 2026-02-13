import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types";

// Mongoose needs to know that this Schema matches the IUser interface
interface IUserModel extends Omit<IUser, "_id">, Document {}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },

  // --- ANALYSIS DATA (New) ---
  dayMasterElement: { type: String, required: true }, // e.g. "Fire"
  strength: { type: String, required: true }, // e.g. "Strong"

  // --- THE FOUR PILLARS ---
  dayMaster: { type: String, required: true },
  dayBranch: { type: String, required: true },

  monthStem: { type: String, required: true },
  monthBranch: { type: String, required: true },

  yearStem: { type: String, required: true },
  yearBranch: { type: String, required: true },

  hourStem: { type: String, required: false },
  hourBranch: { type: String, required: false },

  // --- LIFE CYCLE ---
  luckBranch: { type: String, required: true },
  birthYear: { type: Number, required: true },
  gender: { type: String, required: true }, // "male" | "female"
  description: String,

  // --- GENERATED RULES ---
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
