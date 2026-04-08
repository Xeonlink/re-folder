/**
 * @type {import('prettier').Config}
 */
const config = {
  trailingComma: "all",
  plugins: [
    "prettier-plugin-curly",
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss-canonical-classes",
    "prettier-plugin-tailwindcss",
    "@xeonlink/prettier-plugin-organize-attributes",
    await import("./src/scripts/format-linear.mjs").then(
      (module) => module.default,
    ),
  ],
};

export default config;
