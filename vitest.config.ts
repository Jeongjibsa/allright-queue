import { defineConfig } from "vitest/config";

export default defineConfig({
  css: { postcss: { plugins: [] } },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.ts"],
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    coverage: {
      enabled: false,
    },
  },
});
