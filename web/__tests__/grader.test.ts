import { describe, it, expect } from "vitest";
import { explainPythonError, generateHint } from "../lib/ai/errorExplainer";

describe("AI Error Explainer Utility", () => {
  it("should correctly translate IndentationError", () => {
    const raw = "IndentationError: unexpected indent (line 4)";
    const res = explainPythonError(raw);
    expect(res.title).toContain("Indentasi");
    expect(res.icon).toBe("📐");
  });

  it("should correctly translate SyntaxError for missing colon", () => {
    const raw = "SyntaxError: expected ':'";
    const res = explainPythonError(raw);
    expect(res.title).toContain("SyntaxError");
    expect(res.explanation).toContain("titik dua");
  });

  it("should correctly translate NameError for undefined variable", () => {
    const raw = "NameError: name 'total_harga' is not defined";
    const res = explainPythonError(raw);
    expect(res.title).toContain("total_harga");
    expect(res.icon).toBe("❓");
  });

  it("should generate hint for loop exercises if for loop is missing", () => {
    const code = "x = 10\nprint(x)";
    const hint = generateHint(code, "Buatlah perulangan untuk mencetak 1 sampai 5");
    expect(hint).toContain("for");
  });
});
