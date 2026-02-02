import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
}

// Helper: Throws error if a variable is missing.
// This ensures we fail FAST at startup, not at runtime.
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
};

// We export a single object with verified values
export const config: Config = {
  port: parseInt(getEnv("APP_PORT"), 10),
  mongoUri: getEnv("MONGO_URI"),
  jwtSecret: getEnv("JWT_SECRET"),
};
