import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/main/schema.ts",
  out: "./src/main/assets/migrate"
});
