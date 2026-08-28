import { describe, it, expect } from "vitest";
import { lintPythonCode } from "@/lib/linter/simplePythonLinter";

describe("Simple Python Linter", () => {
  it("detects missing colon on if/for/while/def block headers", () => {
    const code = `
if x > 10
    print("Besar")
for i in range(5)
    print(i)
def halo(nama)
    return "Halo " + nama
`;
    const warnings = lintPythonCode(code);
    expect(warnings.length).toBeGreaterThanOrEqual(3);
    expect(warnings[0].message).toContain("titik dua");
  });

  it("detects single equals in if statement", () => {
    const code = `
if x = 10:
    print("Sama")
`;
    const warnings = lintPythonCode(code);
    expect(warnings.some((w) => w.message.includes("penugasan"))).toBe(true);
  });

  it("detects unclosed brackets", () => {
    const code = `
angka = [1, 2, 3
print("Done")
`;
    const warnings = lintPythonCode(code);
    expect(warnings.some((w) => w.message.includes("Tanda kurung"))).toBe(true);
  });

  it("returns no warnings for valid python syntax", () => {
    const code = `
def hitung_total(harga, jumlah):
    total = harga * jumlah
    if total >= 50000:
        return total * 0.9
    return total

print(hitung_total(25000, 3))
`;
    const warnings = lintPythonCode(code);
    expect(warnings.length).toBe(0);
  });
});
