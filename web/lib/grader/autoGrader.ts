import { runPythonCodeClient, ExecutionResult } from "../pyodide/pyodideRunner";

export interface TestCase {
  id: string;
  description?: string;
  inputs?: string[];
  expectedOutput: string | string[];
  isHidden?: boolean;
}

export interface StructuralRule {
  type: "contains_regex" | "forbidden_regex";
  pattern: string;
  errorMessage: string;
}

export interface GradingConfig {
  testCases: TestCase[];
  rules?: StructuralRule[];
  passPercentage?: number; // defaults to 100
}

export interface TestCaseResult {
  id: string;
  description?: string;
  passed: boolean;
  actualOutput: string[];
  expectedOutput: string | string[];
  error?: string;
  isHidden?: boolean;
}

export interface GradingResult {
  passed: boolean;
  scorePercentage: number;
  totalCases: number;
  passedCases: number;
  details: TestCaseResult[];
  ruleViolations: string[];
  executionTimeMs: number;
}

export async function gradeSubmission(
  code: string,
  config: GradingConfig
): Promise<GradingResult> {
  const startTime = performance.now();
  const ruleViolations: string[] = [];

  // 1. Check structural rules via regex / static analysis
  if (config.rules) {
    for (const rule of config.rules) {
      const regex = new RegExp(rule.pattern, "m");
      const matches = regex.test(code);

      if (rule.type === "contains_regex" && !matches) {
        ruleViolations.push(rule.errorMessage);
      } else if (rule.type === "forbidden_regex" && matches) {
        ruleViolations.push(rule.errorMessage);
      }
    }
  }

  const details: TestCaseResult[] = [];
  let passedCases = 0;

  // 2. Run test cases against code
  for (const tc of config.testCases) {
    const execRes: ExecutionResult = await runPythonCodeClient(code, tc.inputs || []);

    const actualStr = execRes.output.map((line) => line.trim()).join("\n").trim();
    const expectedArr = Array.isArray(tc.expectedOutput) ? tc.expectedOutput : [tc.expectedOutput];
    const expectedStr = expectedArr.map((line) => line.trim()).join("\n").trim();

    // Flexible match (exact or case-insensitive fallback if trimmed)
    const isOutputMatch =
      actualStr === expectedStr ||
      actualStr.toLowerCase() === expectedStr.toLowerCase() ||
      expectedArr.some((exp) => actualStr.includes(exp.trim()));

    const tcPassed = isOutputMatch && !execRes.error;

    if (tcPassed) passedCases++;

    details.push({
      id: tc.id,
      description: tc.description || `Test Case #${tc.id}`,
      passed: tcPassed,
      actualOutput: execRes.output,
      expectedOutput: tc.expectedOutput,
      error: execRes.error,
      isHidden: tc.isHidden || false,
    });
  }

  const totalCases = config.testCases.length;
  const rawScore = totalCases > 0 ? (passedCases / totalCases) * 100 : 100;

  // Rule violations penalize or automatically fail the submission
  const hasRuleViolations = ruleViolations.length > 0;
  const passThreshold = config.passPercentage ?? 100;
  const passed = rawScore >= passThreshold && !hasRuleViolations;

  const executionTimeMs = Math.round(performance.now() - startTime);

  return {
    passed,
    scorePercentage: hasRuleViolations ? 0 : Math.round(rawScore),
    totalCases,
    passedCases,
    details,
    ruleViolations,
    executionTimeMs,
  };
}
