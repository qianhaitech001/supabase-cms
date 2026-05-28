import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "../src/slug";

describe("slug helpers", () => {
  it("normalizes product names into stable URL slugs", () => {
    expect(slugify("Hot-Dip Galvanized Square Tube")).toBe("hot-dip-galvanized-square-tube");
    expect(slugify("Sink&Faucet")).toBe("sink-and-faucet");
  });

  it("creates unique slugs without mutating prior values", () => {
    const existing = new Set(["product"]);
    expect(uniqueSlug("Product", existing)).toBe("product-2");
    expect(uniqueSlug("Product", existing)).toBe("product-3");
  });
});
