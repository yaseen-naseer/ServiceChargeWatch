import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Relax rules for production build
      "react/no-unescaped-entities": "warn", // Allow apostrophes in text
      "@typescript-eslint/no-explicit-any": "warn", // Allow any for API responses
      "@typescript-eslint/no-unused-vars": "warn", // Allow unused vars (may be used later)
      "react-hooks/exhaustive-deps": "warn", // Allow flexible hook dependencies
    },
  },
];

export default eslintConfig;
