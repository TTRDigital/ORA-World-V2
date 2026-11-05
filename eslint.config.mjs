import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".claude/**", ".next/**", "out/**", "node_modules/**", "reports/**", "test-results/**", "playwright-report/**"]),
]);
