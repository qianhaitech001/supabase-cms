import { describe, expect, it } from "vitest";
import { siteConfig } from "../lib/site-config";

describe("site config", () => {
  it("defines the minimum public site metadata", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.defaultSeo.title).toContain("Global Trade");
  });

  it("does not expose the admin entry in public navigation", () => {
    expect(siteConfig.navigation.some((item) => item.href.startsWith("/admin"))).toBe(false);
  });
});
