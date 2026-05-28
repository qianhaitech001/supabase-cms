import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@global-trade/core": new URL("../core/src/index.ts", import.meta.url).pathname
    }
  }
});
