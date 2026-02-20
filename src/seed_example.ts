import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import mongoose from "mongoose";
import User from "./models/User";
import { calculateBaZiProfile } from "./utils/baziHelper";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/";

console.log("Resolved __dirname:", __dirname);
console.log("MONGO_URI loaded as:", MONGO_URI.substring(0, 20) + "..."); // Masked for security

const users = [
  calculateBaZiProfile("Your Name1", new Date("1987-04-26T12:25:00"), "male"),
  calculateBaZiProfile("Your Name2", new Date("1987-01-16T11:10:00"), "female"),
];

async function seedDB() {
  try {
    mongoose.connection.on("connecting", () =>
      console.log("Mongo connecting..."),
    );
    mongoose.connection.on("connected", () => console.log("Mongo connected!"));
    mongoose.connection.on("error", (e) => console.error("Mongo error:", e));
    mongoose.connection.on("disconnected", () =>
      console.log("Mongo disconnected!"),
    );

    await mongoose.connect(MONGO_URI, {
      dbName: "GoldenDate",
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Seeding...");

    await User.deleteMany({});
    const inserted = await User.insertMany(users, { ordered: false });

    console.log(`Inserted ${inserted.length} users.`);
    console.log("Database seeded successfully.");

    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  }
}

seedDB();
