import { describe, expect, it } from "vitest";
import { toPlainText } from "../src/text";

describe("toPlainText", () => {
  it("removes imported HTML while preserving readable content", () => {
    expect(
      toPlainText('<p id="we-element-3"><span data-slate-node="text">Upgrade &amp; Repair</span></p>')
    ).toBe("Upgrade & Repair");
  });

  it("normalizes escaped line breaks and HTML entities", () => {
    expect(toPlainText("LENGTH: 1000&#177;3mm\\nWIDTH: 333&#177;3mm&nbsp;INWIND")).toBe(
      "LENGTH: 1000±3mm WIDTH: 333±3mm INWIND"
    );
  });

  it("keeps ordinary plain text unchanged", () => {
    expect(toPlainText("Product details and specifications")).toBe("Product details and specifications");
  });
});
