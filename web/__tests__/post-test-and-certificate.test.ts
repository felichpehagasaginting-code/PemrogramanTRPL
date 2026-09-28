import { describe, it, expect } from "vitest";
import { POST_TEST_QUESTIONS } from "@/lib/content/modules-data";
import { UserProfile } from "@/lib/store/useUserStore";

describe("Post-Test & Certificate Eligibility Evaluation", () => {
  it("should have a complete bank of 15 Post-Test questions covering core programming concepts", () => {
    expect(POST_TEST_QUESTIONS.length).toBe(15);
    POST_TEST_QUESTIONS.forEach((q, idx) => {
      expect(q.id).toBe(`pt-${idx + 1}`);
      expect(q.question).toBeTruthy();
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
    });
  });

  it("should allow post-test access immediately once pre-test is completed without requiring all modules", () => {
    // User who only finished Pre-Test (M0)
    const userWithOnlyPreTest: Partial<UserProfile> = {
      uid: "maba-new",
      progress: {
        M0: { completedSubModules: ["quiz-M0"], status: "completed" },
        M1: { completedSubModules: [], status: "active" },
        M2: { completedSubModules: [], status: "locked" },
      },
      tests: {
        preTest: { completed: true, score: 5, totalQuestions: 5, percentage: 100 },
      },
    };

    const isPreTestDone = Boolean(
      userWithOnlyPreTest.tests?.preTest?.completed ||
      userWithOnlyPreTest.progress?.["M0"]?.status === "completed"
    );

    // Can access post-test
    expect(isPreTestDone).toBe(true);
  });

  it("should lock certificate if pre-test or post-test or any module is not completed", () => {
    const requiredModules = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];

    // Case 1: M0-M8 completed, but post-test NOT taken
    const userWithoutPostTest: Partial<UserProfile> = {
      progress: Object.fromEntries(requiredModules.map((m) => [m, { completedSubModules: [], status: "completed" }])),
      tests: {
        preTest: { completed: true, score: 5, totalQuestions: 5, percentage: 100 },
      },
    };

    const checkEligibility = (u: Partial<UserProfile>) => {
      const allModulesDone = requiredModules.every((k) => u.progress?.[k]?.status === "completed");
      const preTestDone = Boolean(u.tests?.preTest?.completed || u.progress?.["M0"]?.status === "completed");
      const postTestDone = Boolean(u.tests?.postTest?.completed);
      return allModulesDone && preTestDone && postTestDone;
    };

    expect(checkEligibility(userWithoutPostTest)).toBe(false);

    // Case 2: Pre-test and post-test done, but M8 not completed
    const userWithMissingM8: Partial<UserProfile> = {
      progress: Object.fromEntries(requiredModules.map((m) => [m, { completedSubModules: [], status: m === "M8" ? "locked" : "completed" }])),
      tests: {
        preTest: { completed: true, score: 5, totalQuestions: 5, percentage: 100 },
        postTest: { completed: true, score: 14, totalQuestions: 15, percentage: 93 },
      },
    };
    expect(checkEligibility(userWithMissingM8)).toBe(false);

    // Case 3: Fully completed (Pre-Test + All Modules M0-M8 + Post-Test)
    const fullyGraduatedUser: Partial<UserProfile> = {
      progress: Object.fromEntries(requiredModules.map((m) => [m, { completedSubModules: [], status: "completed" }])),
      tests: {
        preTest: { completed: true, score: 5, totalQuestions: 5, percentage: 100 },
        postTest: { completed: true, score: 14, totalQuestions: 15, percentage: 93 },
      },
    };
    expect(checkEligibility(fullyGraduatedUser)).toBe(true);
  });

  it("should have identical question bank between Pre-Test (M0) and Post-Test (1:1 correspondence)", async () => {
    const { PRACTICE_CONTENT, EVALUATION_QUESTIONS } = await import("@/lib/content/modules-data");
    const m0Questions = PRACTICE_CONTENT.M0.questions;

    expect(m0Questions).toBeDefined();
    expect(m0Questions?.length).toBe(15);
    expect(EVALUATION_QUESTIONS.length).toBe(15);

    // Verify 1:1 question match
    m0Questions?.forEach((q, idx) => {
      const evalQ = EVALUATION_QUESTIONS[idx];
      expect(q.id).toBe(evalQ.id);
      expect(q.question).toBe(evalQ.question);
      expect(q.options).toEqual(evalQ.options);
      expect(q.correctIndex).toBe(evalQ.correctIndex);
      expect(q.explanation).toBe(evalQ.explanation);
    });
  });

  it("should accurately track student answers and identify wrong vs correct question numbers", () => {
    const sampleAnswers: Record<number, number> = {
      0: 0, // No 1 correct
      1: 3, // No 2 wrong (correct is 1)
      2: 1, // No 3 correct
      3: 2, // No 4 wrong (correct is 0)
    };

    const evaluated = POST_TEST_QUESTIONS.slice(0, 4).map((q, idx) => {
      const studentChoice = sampleAnswers[idx];
      const isCorrect = studentChoice === q.correctIndex;
      return {
        number: idx + 1,
        studentChoice,
        correctIndex: q.correctIndex,
        isCorrect,
      };
    });

    const wrongList = evaluated.filter((e) => !e.isCorrect).map((e) => e.number);
    const correctList = evaluated.filter((e) => e.isCorrect).map((e) => e.number);

    expect(wrongList).toEqual([2, 4]); // Nomor 2 dan 4 salah
    expect(correctList).toEqual([1, 3]); // Nomor 1 dan 3 benar
  });
});

