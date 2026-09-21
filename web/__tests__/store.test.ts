import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore, LEVELS, BADGES } from "@/lib/store/useUserStore";

describe("useUserStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      leaderboard: [],
      badgePopup: { isOpen: false, badge: null },
      levelUpPopup: { isOpen: false, oldLevel: "", newLevel: "" },
      memePopup: { isOpen: false, memeUrl: "", caption: "" },
    });
  });

  it("should start with no user logged in", () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
  });

  it("should have correct level definitions", () => {
    expect(LEVELS).toHaveLength(6);
    expect(LEVELS[0].name).toBe("Script Kiddie");
    expect(LEVELS[LEVELS.length - 1].name).toBe("TRPL Legend");
  });

  it("should have 16 badges defined", () => {
    expect(BADGES).toHaveLength(16);
    expect(BADGES[0].id).toBe("langkah_pertama");
    expect(BADGES[BADGES.length - 1].id).toBe("perfect_streak_7");
  });

  it("should create mock user on login", async () => {
    const { login } = useUserStore.getState();
    await login("Test User", "test@example.com");

    const { user } = useUserStore.getState();
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Test User");
    expect(user?.email).toBe("test@example.com");
    expect(user?.xp).toBe(0);
    expect(user?.level).toBe("Script Kiddie");
    expect(user?.progress.M0.status).toBe("active");
    expect(user?.progress.M1.status).toBe("locked");
  });

  it("should add XP and update level", async () => {
    const { login } = useUserStore.getState();
    await login("Test User", "test@example.com");

    const { addXP } = useUserStore.getState();
    await addXP(100);

    const { user } = useUserStore.getState();
    expect(user?.xp).toBe(100);
    expect(user?.level).toBe("Code Padawan");
  });

  it("should complete sub-module and award XP", async () => {
    const { login } = useUserStore.getState();
    await login("Test User", "test@example.com");

    const { completeSubModule, user: userBefore } = useUserStore.getState();
    const xpBefore = userBefore?.xp || 0;

    await completeSubModule("M0", "sub-0.1");

    const { user } = useUserStore.getState();
    expect(user?.progress.M0.completedSubModules).toContain("sub-0.1");
    expect(user?.xp).toBe(xpBefore + 15);
  });

  it("should complete module and unlock next", async () => {
    const { login } = useUserStore.getState();
    await login("Test User", "test@example.com");

    const { completeModule } = useUserStore.getState();
    await completeModule("M0");

    const { user } = useUserStore.getState();
    expect(user?.progress.M0.status).toBe("completed");
    expect(user?.progress.M1.status).toBe("active");
  });

  it("should unlock badge and award bonus XP on module completion", async () => {
    const { login } = useUserStore.getState();
    await login("Test User", "test@example.com");

    const xpBefore = useUserStore.getState().user?.xp || 0;
    const { completeModule } = useUserStore.getState();
    await completeModule("M1");

    const { user } = useUserStore.getState();
    expect(user?.badges).toContain("workspace_master");
    // completeModule gives +50 XP, and unlockBadge("workspace_master") gives another +50 XP = +100 XP total
    expect(user?.xp).toBe(xpBefore + 100);
  });

  it("should set isUserReady on login and isLeaderboardReady on fetchLeaderboard", async () => {
    useUserStore.setState({ isUserReady: false, isLeaderboardReady: false });
    expect(useUserStore.getState().isUserReady).toBe(false);

    const { login, fetchLeaderboard } = useUserStore.getState();
    await login("Maba Test", "maba@test.com");
    expect(useUserStore.getState().isUserReady).toBe(true);

    await fetchLeaderboard();
    expect(useUserStore.getState().isLeaderboardReady).toBe(true);
  });
});

