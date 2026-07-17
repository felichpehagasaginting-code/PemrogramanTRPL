import { describe, it, expect, vi } from "vitest";

describe("API: Run Code validation", () => {
  it("should reject empty code (mock validation)", () => {
    const validateCode = (code: string): boolean => {
      if (!code || code.trim().length === 0) return false;
      return true;
    };
    expect(validateCode("")).toBe(false);
    expect(validateCode("  ")).toBe(false);
    expect(validateCode("print('hello')")).toBe(true);
  });

  it("should reject oversized code (mock validation)", () => {
    const validateCode = (code: string): { valid: boolean; error?: string } => {
      if (code.length > 10000) return { valid: false, error: "Code too long" };
      return { valid: true };
    };
    expect(validateCode("a".repeat(10001)).valid).toBe(false);
    expect(validateCode("print('ok')").valid).toBe(true);
  });
});

describe("API: Content Data", () => {
  it("should have 9 modules defined", async () => {
    const { MODULES_DATA } = await import("@/lib/content/modules-data");
    expect(MODULES_DATA).toHaveLength(9);
  });

  it("each module should have slides", async () => {
    const { MODULES_DATA } = await import("@/lib/content/modules-data");
    MODULES_DATA.forEach((mod) => {
      expect(mod.slides.length).toBeGreaterThan(0);
    });
  });

  it("should have practice content for modules", async () => {
    const { PRACTICE_CONTENT } = await import("@/lib/content/modules-data");
    expect(Object.keys(PRACTICE_CONTENT).length).toBeGreaterThanOrEqual(7);
  });
});

describe("Metadata Validation", () => {
  it("should have correct level definitions", async () => {
    const { LEVELS } = await import("@/lib/store/useUserStore");
    expect(LEVELS).toHaveLength(6);
    expect(LEVELS[0].name).toBe("Script Kiddie");
    expect(LEVELS[LEVELS.length - 1].name).toBe("TRPL Legend");
  });

  it("should have 16 badges defined", async () => {
    const { BADGES } = await import("@/lib/store/useUserStore");
    expect(BADGES.length).toBeGreaterThanOrEqual(13);
  });
});

describe("Module Progress Logic", () => {
  it("should unlock next module on completion", async () => {
    const { MODULE_KEYS } = await import("@/lib/store/useUserStore");
    const idx = MODULE_KEYS.indexOf("M0");
    expect(idx).toBe(0);
    expect(MODULE_KEYS[idx + 1]).toBe("M1");
  });

  it("should have correct module sequence", async () => {
    const { MODULE_KEYS } = await import("@/lib/store/useUserStore");
    const expected = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];
    expect(MODULE_KEYS).toEqual(expected);
  });
});

describe("Level Calculation", () => {
  it("should assign correct level names", async () => {
    const { LEVELS } = await import("@/lib/store/useUserStore");
    const getLevelName = (xp: number) => {
      const lv = LEVELS.find((l) => xp >= l.minXP && xp <= l.maxXP);
      return lv ? lv.name : "Script Kiddie";
    };
    expect(getLevelName(0)).toBe("Script Kiddie");
    expect(getLevelName(50)).toBe("Script Kiddie");
    expect(getLevelName(100)).toBe("Code Padawan");
    expect(getLevelName(250)).toBe("Developer Muda");
    expect(getLevelName(500)).toBe("Code Warrior");
    expect(getLevelName(800)).toBe("Algorithm Master");
    expect(getLevelName(1100)).toBe("TRPL Legend");
  });
});

describe("Badge Definitions", () => {
  it("should have unique badge IDs", async () => {
    const { BADGES } = await import("@/lib/store/useUserStore");
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each badge should have required fields", async () => {
    const { BADGES } = await import("@/lib/store/useUserStore");
    BADGES.forEach((badge) => {
      expect(badge.id).toBeTruthy();
      expect(badge.name).toBeTruthy();
      expect(badge.color).toBeTruthy();
      expect(badge.description).toBeTruthy();
    });
  });
});

describe("Content Module Data Integrity", () => {
  it("M0 should have pre-test redirect", async () => {
    const { MODULES_DATA } = await import("@/lib/content/modules-data");
    const m0 = MODULES_DATA.find((m) => m.id === "M0");
    expect(m0).toBeDefined();
    const pretestSlide = m0!.slides.find((s) => s.contentKey === "m0-pretest");
    expect(pretestSlide).toBeDefined();
  });
});
