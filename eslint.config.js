import eslintConfigPrettier from "@electron-toolkit/eslint-config-prettier";
import eslintConfigTs from "@electron-toolkit/eslint-config-ts";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  reactPlugin.configs.recommended,
  eslintConfigPrettier,
  eslintConfigTs,
  {
    rules: {
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
