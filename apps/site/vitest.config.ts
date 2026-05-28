import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
      "@global-trade/core": new URL("../../packages/core/src/index.ts", import.meta.url).pathname,
      "@global-trade/migrator": new URL("../../packages/migrator/src/index.ts", import.meta.url).pathname
    }
  }
});
