import mongoose, { Schema, Document } from "mongoose";

export interface IVisit extends Document {
  ip: string;
  country: string;
  lastVisit: Date;
  visitCount: number;
}

const visitSchema: Schema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  country: { type: String, default: "Unknown" },
  lastVisit: { type: Date, default: Date.now },
  visitCount: { type: Number, default: 1 },
});

export default mongoose.model<IVisit>("Visit", visitSchema);
