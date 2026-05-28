import { describe, expect, it } from "vitest";
import { extractWordPressMediaUrls, rewriteMediaUrls } from "../src/adapters/media";

describe("media adapter", () => {
  it("extracts and rewrites WordPress uploads URLs", () => {
    const html = '<img src="/wp-content/uploads/2025/hero.jpg"><a href="https://old.test/wp-content/uploads/file.pdf">PDF</a>';
    const urls = extractWordPressMediaUrls(html, "https://old.test");
    expect(urls).toEqual(["https://old.test/wp-content/uploads/2025/hero.jpg", "https://old.test/wp-content/uploads/file.pdf"]);

    const result = rewriteMediaUrls(
      html,
      new Map([["https://old.test/wp-content/uploads/2025/hero.jpg", "https://cdn.test/hero.jpg"]]),
      "https://old.test"
    );
    expect(result.html).toContain("https://cdn.test/hero.jpg");
    expect(result.urls).toEqual(["https://old.test/wp-content/uploads/file.pdf"]);
  });
});
