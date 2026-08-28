import { describe, it, expect } from "vitest";
import {
  computeCodeSimilarity,
  normalizePythonCode,
  runBatchSimilarityAudit,
  CodeSubmission,
} from "@/lib/admin/similarityChecker";

describe("Admin Plagiarism & Similarity Checker", () => {
  it("normalizes comments and whitespace properly", () => {
    const raw = `
# Ini komentar maba
nama = "TRPL"   
"""Docstring panjang"""
print(nama)
`;
    const normalized = normalizePythonCode(raw);
    expect(normalized).not.toContain("#");
    expect(normalized).not.toContain("Docstring");
    expect(normalized).toContain("nama = \"TRPL\" print(nama)");
  });

  it("calculates high similarity for nearly identical code", () => {
    const codeA = `
menu = {'kopi': 5000, 'mie': 10000}
total = 0
for k, v in menu.items():
    total += v
print(total)
`;
    const codeB = `
# Kasir warkop
menu = {'kopi': 5000, 'mie': 10000}
total = 0
for k, v in menu.items():
    total += v
print(total)
`;
    const score = computeCodeSimilarity(codeA, codeB);
    expect(score).toBeGreaterThanOrEqual(95);
  });

  it("calculates low similarity for completely different code", () => {
    const codeA = `
def hitung_luas_lingkaran(r):
    return 3.14 * r * r
print(hitung_luas_lingkaran(7))
`;
    const codeB = `
angka = [1, 2, 3, 4, 5]
for x in angka:
    if x % 2 == 0:
        print("Genap:", x)
`;
    const score = computeCodeSimilarity(codeA, codeB);
    expect(score).toBeLessThan(50);
  });

  it("runs batch similarity audit and identifies suspicious pairs", () => {
    const submissions: CodeSubmission[] = [
      {
        studentId: "u1",
        studentName: "Budi",
        code: "x = 10\ny = 20\nprint(x + y)",
      },
      {
        studentId: "u2",
        studentName: "Andi",
        code: "# Kode Andi\nx = 10\ny = 20\nprint(x + y)",
      },
      {
        studentId: "u3",
        studentName: "Citra",
        code: "def sapa(): return 'Halo dunia'\nprint(sapa())",
      },
    ];

    const matches = runBatchSimilarityAudit(submissions);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].studentA.name).toBe("Budi");
    expect(matches[0].studentB.name).toBe("Andi");
    expect(matches[0].similarityScore).toBeGreaterThanOrEqual(90);
  });
});
