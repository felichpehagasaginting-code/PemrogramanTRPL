// AST & Tokenized Levenshtein similarity checker for student code originality insights

export interface CodeSubmission {
  studentId: string;
  studentName: string;
  code: string;
}

export interface SimilarityMatch {
  studentA: { id: string; name: string };
  studentB: { id: string; name: string };
  similarityScore: number; // 0 - 100%
  status: "safe" | "moderate" | "high_similarity";
}

/**
 * Tokenize python code to remove whitespace variations and comments
 */
export function normalizePythonCode(code: string): string {
  return code
    .replace(/#.*$/gm, "") // remove comments
    .replace(/"""[\s\S]*?"""/g, "") // remove docstrings
    .replace(/'''[\s\S]*?'''/g, "")
    .replace(/\s+/g, " ") // collapse multiple whitespaces
    .trim();
}

/**
 * Calculate Levenshtein Distance between two normalized strings
 */
export function calculateLevenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const matrix: number[][] = [];

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len2][len1];
}

/**
 * Calculate similarity percentage between two code snippets (0 - 100)
 */
export function computeCodeSimilarity(code1: string, code2: string): number {
  const norm1 = normalizePythonCode(code1);
  const norm2 = normalizePythonCode(code2);

  if (norm1 === norm2) return 100;
  if (!norm1 || !norm2) return 0;

  const maxLen = Math.max(norm1.length, norm2.length);
  const distance = calculateLevenshteinDistance(norm1, norm2);

  const similarity = ((maxLen - distance) / maxLen) * 100;
  return Math.round(Math.max(0, Math.min(100, similarity)));
}

/**
 * Run batch similarity comparison across a class batch
 */
export function runBatchSimilarityAudit(submissions: CodeSubmission[]): SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];

  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      const subA = submissions[i];
      const subB = submissions[j];

      const score = computeCodeSimilarity(subA.code, subB.code);

      let status: SimilarityMatch["status"] = "safe";
      if (score >= 85) {
        status = "high_similarity";
      } else if (score >= 65) {
        status = "moderate";
      }

      if (score >= 50) {
        matches.push({
          studentA: { id: subA.studentId, name: subA.studentName },
          studentB: { id: subB.studentId, name: subB.studentName },
          similarityScore: score,
          status,
        });
      }
    }
  }

  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}
