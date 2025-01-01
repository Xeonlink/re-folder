/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: false,
  semi: true,
  printWidth: 120,
  trailingComma: "all",
  plugins: ["prettier-plugin-tailwindcss"],

  // prettier-plugin-tailwindcss options
  tailwindConfig: "./tailwind.config.ts",
  tailwindFunctions: ["clsx", "cva"],
};
