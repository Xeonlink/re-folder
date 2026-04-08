import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/main/schema/v1.0.0.ts",
  out: "./src/main/assets/migrate",
});
