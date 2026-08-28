// Client-side real-time Python linter & syntax helper

export interface LintWarning {
  line: number;
  message: string;
  severity: "warning" | "error" | "info";
  fixSuggestion: string;
}

export function lintPythonCode(code: string): LintWarning[] {
  const warnings: LintWarning[] = [];
  if (!code) return warnings;

  const lines = code.split("\n");

  // Track bracket stacks
  const brackets = { "(": ")", "[": "]", "{": "}" };
  const stack: { char: string; line: number }[] = [];

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const trimmed = rawLine.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) return;

    // 1. Check missing colon ':' on block headers
    const blockKeywords = ["if ", "elif ", "else", "for ", "while ", "def ", "class ", "try", "except"];
    const isBlockHeader = blockKeywords.some((kw) => {
      if (kw === "else" || kw === "try") {
        return trimmed === kw || trimmed.startsWith(kw + " ");
      }
      return trimmed.startsWith(kw);
    });

    if (isBlockHeader && !trimmed.endsWith(":") && !trimmed.endsWith("\\")) {
      warnings.push({
        line: lineNum,
        severity: "error",
        message: `Baris ${lineNum}: Blok '${trimmed.split(" ")[0]}' belum diakhiri tanda titik dua ':'`,
        fixSuggestion: "Tambahkan ':' di ujung baris ini.",
      });
    }

    // 2. Check assignment '=' instead of comparison '==' inside if / elif
    if (trimmed.startsWith("if ") || trimmed.startsWith("elif ")) {
      // Check if there's single '=' not preceded/followed by '=', '<', '>', '!'
      const conditionPart = trimmed.replace(/^(if|elif)\s+/, "").replace(/:$/, "").trim();
      const singleEqualsMatch = conditionPart.match(/(?<![=<>!])=(?![=])/);
      if (singleEqualsMatch) {
        warnings.push({
          line: lineNum,
          severity: "warning",
          message: `Baris ${lineNum}: Menggunakan '=' (penugasan) di dalam kondisi if/elif`,
          fixSuggestion: "Gunakan '==' untuk membandingkan kesamaan nilai.",
        });
      }
    }

    // 3. Simple bracket balance scanner
    let insideSingleQuote = false;
    let insideDoubleQuote = false;

    for (let i = 0; i < rawLine.length; i++) {
      const ch = rawLine[i];
      const prev = i > 0 ? rawLine[i - 1] : "";

      if (ch === "'" && prev !== "\\" && !insideDoubleQuote) {
        insideSingleQuote = !insideSingleQuote;
      } else if (ch === '"' && prev !== "\\" && !insideSingleQuote) {
        insideDoubleQuote = !insideDoubleQuote;
      } else if (!insideSingleQuote && !insideDoubleQuote) {
        if (ch === "(" || ch === "[" || ch === "{") {
          stack.push({ char: ch, line: lineNum });
        } else if (ch === ")" || ch === "]" || ch === "}") {
          if (stack.length === 0) {
            warnings.push({
              line: lineNum,
              severity: "error",
              message: `Baris ${lineNum}: Tanda kurung tutup '${ch}' tanpa pasangan buka`,
              fixSuggestion: "Periksa kembali kelengkapan tanda kurung kamu.",
            });
          } else {
            const last = stack.pop()!;
            const expectedClose = brackets[last.char as keyof typeof brackets];
            if (expectedClose !== ch) {
              warnings.push({
                line: lineNum,
                severity: "error",
                message: `Baris ${lineNum}: Tanda kurung '${last.char}' ditutup dengan '${ch}' yang tidak cocok`,
                fixSuggestion: `Tutup dengan tanda '${expectedClose}'.`,
              });
            }
          }
        }
      }
    }

    // Check unclosed string on same line (if not multi-line triple quotes)
    if (!trimmed.startsWith('"""') && !trimmed.startsWith("'''")) {
      if (insideSingleQuote || insideDoubleQuote) {
        warnings.push({
          line: lineNum,
          severity: "warning",
          message: `Baris ${lineNum}: Tanda petik string belum ditutup di baris ini`,
          fixSuggestion: "Pastikan tanda petik pembuka memiliki petik penutup yang sama.",
        });
      }
    }
  });

  // Check remaining unclosed open brackets
  while (stack.length > 0) {
    const unclosed = stack.pop()!;
    warnings.push({
      line: unclosed.line,
      severity: "error",
      message: `Baris ${unclosed.line}: Tanda kurung buka '${unclosed.char}' belum ditutup hingga akhir kode`,
      fixSuggestion: `Tambahkan tanda kurung tutup '${brackets[unclosed.char as keyof typeof brackets]}' yang sesuai.`,
    });
  }

  return warnings;
}
