/** @type {import("prettier").Config} */
const config = {
  printWidth: 110,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/globals.css",
};
export default config;
