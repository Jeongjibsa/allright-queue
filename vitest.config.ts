import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.ts?(x)"],
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    coverage: {
      enabled: false,
    },
  },
});
