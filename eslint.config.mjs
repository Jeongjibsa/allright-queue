import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { prettier } from "eslint-config-prettier";
import {
  configs as TanstackQueryConfigs,
  rules as TanstackQueryRules,
} from "@tanstack/eslint-plugin-query";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    plugins: {
      "@tanstack/eslint-plugin-query": { rules: TanstackQueryRules, configs: TanstackQueryConfigs },
    },
    rules: {
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/no-deprecated-options": "error",
      "@tanstack/query/prefer-query-object-syntax": "error",
      "@tanstack/query/stable-query-client": "error",
    },
    extends: ["plugin:@tanstack/eslint-plugin-query/recommended"],
  },
  prettier,
];

export default eslintConfig;
