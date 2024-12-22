/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  trailingComma: "all",
  plugins: [
    //
    "prettier-plugin-tailwindcss",
    "prettier-plugin-sort-json",
    "@trivago/prettier-plugin-sort-imports",
  ],

  tailwindConfig: "./tailwind.config.ts",
  tailwindFunctions: ["clsx", "cva"],

  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
