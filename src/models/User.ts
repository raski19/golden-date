import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types";

// Mongoose needs to know that this Schema matches the IUser interface
interface IUserModel extends Omit<IUser, "_id">, Document {}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  baZiProfile: String,
  dayMaster: { type: String, required: true },
  baZiBranch: { type: String, required: true },
  description: String,

  actionRules: [
    {
      officers: [String],
      elements: [String],
      action: String,
      icon: String,
      description: String,
    },
  ],

  rules: {
    breaker: String,
    selfPunishment: String,
    badBranches: [String],
    wealthElements: [String],
    careerElements: [String],
    healthElements: [String],
    favorableBranches: [String],
    favorableElements: [String],
    avoidElements: [String],
    favorableOfficers: [String],
  },
});

export default mongoose.model<IUserModel>("User", UserSchema);
