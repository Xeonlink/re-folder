import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/main/schema/latest.ts",
  out: "./src/main/assets/migrate"
});
