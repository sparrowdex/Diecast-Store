// prisma.config.ts
import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// Manually load .env.local if it exists, since default `dotenv/config` does not.
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath });
}

// Load .env for any defaults.
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  },
});
