// Clean Code & PEP8 Python Linter for student code quality feedback

export interface Pep8Violation {
  line: number;
  rule: string;
  message: string;
  severity: "info" | "warning";
}

export interface CodeQualityReport {
  score: number; // 0 - 100
  violations: Pep8Violation[];
  metrics: {
    cleanCode: number;
    modularity: number;
    logic: number;
    efficiency: number;
    errorHandling: number;
  };
  mentorFeedback: string[];
}

export function analyzePythonCleanCode(code: string): CodeQualityReport {
  const lines = code.split("\n");
  const violations: Pep8Violation[] = [];
  const mentorFeedback: string[] = [];

  let hasSingleLetterVars = false;
  let hasLongLines = false;
  let hasFunctions = false;
  let hasTryExcept = false;
  let hasGoodDocstring = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Check line length (PEP8 recommends <= 79 chars)
    if (line.length > 79) {
      hasLongLines = true;
      violations.push({
        line: lineNum,
        rule: "E501",
        message: `Baris ${lineNum} terlalu panjang (${line.length} karakter). Batas ideal PEP8 adalah 79 karakter.`,
        severity: "info",
      });
    }

    // Check single letter variable assignments (e.g. a = 10, x = "...")
    const singleVarMatch = trimmed.match(/^([a-z])\s*=\s*[^=]/);
    if (singleVarMatch && !["i", "j", "k"].includes(singleVarMatch[1])) {
      hasSingleLetterVars = true;
      violations.push({
        line: lineNum,
        rule: "N806",
        message: `Variabel '${singleVarMatch[1]}' dinamai 1 huruf. Tips Senior: Beri nama deskriptif seperti 'total_harga' atau 'nama_user'.`,
        severity: "warning",
      });
    }

    // Check function definitions
    if (trimmed.startsWith("def ")) {
      hasFunctions = true;
      if (/[A-Z]/.test(trimmed)) {
        violations.push({
          line: lineNum,
          rule: "N802",
          message: "Nama fungsi sebaiknya menggunakan huruf kecil dan snake_case (misal: 'hitung_total', bukan 'HitungTotal').",
          severity: "warning",
        });
      }
    }

    if (trimmed.startsWith("try:") || trimmed.startsWith("except")) {
      hasTryExcept = true;
    }

    if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      hasGoodDocstring = true;
    }
  });

  // Calculate skill dimensions (0 - 100)
  const cleanCode = Math.max(40, 100 - violations.length * 10);
  const modularity = hasFunctions ? 90 : 65;
  const logic = code.includes("if") || code.includes("for") || code.includes("while") ? 95 : 75;
  const efficiency = hasLongLines ? 75 : 90;
  const errorHandling = hasTryExcept ? 95 : 70;

  const totalScore = Math.round(
    (cleanCode + modularity + logic + efficiency + errorHandling) / 5
  );

  if (hasSingleLetterVars) {
    mentorFeedback.push("💡 Biasakan memberi nama variabel yang jelas maknanya agar rekan tim mudah membaca kodinganmu.");
  }
  if (hasFunctions) {
    mentorFeedback.push("🌟 Keren! Kamu sudah mulai membagi kode menjadi fungsi-fungsi modular.");
  }
  if (cleanCode >= 85) {
    mentorFeedback.push("🏆 Kode kamu sangat rapi dan mengikuti standar industri Python (PEP8)!");
  }

  return {
    score: totalScore,
    violations,
    metrics: {
      cleanCode,
      modularity,
      logic,
      efficiency,
      errorHandling,
    },
    mentorFeedback: mentorFeedback.length > 0 ? mentorFeedback : ["Kodinganmu rapi dan terstruktur dengan baik!"],
  };
}
