import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore, LEVELS, BADGES, isStaff, isCreator, isTester } from "@/lib/store/useUserStore";

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

  it("should update profile name and set hasCustomizedName to true", async () => {
    const { login, updateProfileName } = useUserStore.getState();
    await login("Maba TRPL 2026", "maba@student.polsri.ac.id");

    const success = await updateProfileName("Rian Pratama S.Tr.Kom");
    expect(success).toBe(true);

    const { user } = useUserStore.getState();
    expect(user?.name).toBe("Rian Pratama S.Tr.Kom");
    expect(user?.hasCustomizedName).toBe(true);
  });

  it("should reject invalid profile names (too short or no letters)", async () => {
    const { login, updateProfileName } = useUserStore.getState();
    await login("Maba TRPL 2026", "maba@student.polsri.ac.id");

    const tooShort = await updateProfileName("ab");
    expect(tooShort).toBe(false);

    const noLetters = await updateProfileName("12345");
    expect(noLetters).toBe(false);

    const onlySpaces = await updateProfileName("   ");
    expect(onlySpaces).toBe(false);

    // Name should remain unchanged
    const { user } = useUserStore.getState();
    expect(user?.name).toBe("Maba TRPL 2026");
  });

  it("should sync updated name to existing leaderboard entry", async () => {
    const { login, updateProfileName } = useUserStore.getState();
    await login("Old Name", "user@test.com");

    const currentUid = useUserStore.getState().user?.uid || "";
    useUserStore.setState({
      leaderboard: [
        { uid: currentUid, name: "Old Name", avatar: "avatar_default", xp: 100, level: "Code Padawan" },
        { uid: "other-user", name: "Other Student", avatar: "avatar_default", xp: 50, level: "Script Kiddie" },
      ],
    });

    await updateProfileName("New Official Name");

    const { leaderboard } = useUserStore.getState();
    const updatedEntry = leaderboard.find((u) => u.uid === currentUid);
    expect(updatedEntry?.name).toBe("New Official Name");
  });

  describe("Role & Batch Discrimination Helpers", () => {
    it("should correctly identify creator accounts", () => {
      expect(isCreator({ email: "felich@mhs.cwe.ac.id" })).toBe(true);
      expect(isCreator({ email: "felichpehagasa@gmail.com" })).toBe(true);
      expect(isCreator({ email: "berkah1hsanul@gmail.com" })).toBe(false);
      expect(isCreator({ email: "random@mhs.cwe.ac.id" })).toBe(false);
    });

    it("should correctly identify staff accounts", () => {
      expect(isStaff({ email: "berkah1hsanul@gmail.com" })).toBe(true);
      expect(isStaff({ email: "khairoummh0828@gmail.com" })).toBe(true);
      expect(isStaff({ email: "felichpehagasa@gmail.com" })).toBe(false);
      expect(isStaff({ email: "maba2026@gmail.com" })).toBe(false);
    });

    it("should correctly identify Angkatan 2025 tester accounts", () => {
      // Tester in tester emails list
      expect(isTester({ email: "vitobima@mhs.cwe.ac.id" })).toBe(true);
      expect(isTester({ email: "myaaprilia@mhs.cwe.ac.id" })).toBe(true);
      expect(isTester({ email: "sukronyusuf089@gmail.com" })).toBe(true);

      // Explicit flag or batch
      expect(isTester({ email: "user1@example.com", isTester: true })).toBe(true);
      expect(isTester({ email: "user2@example.com", batch: "2025" })).toBe(true);

      // Creator and staff must NEVER be classified as testers
      expect(isTester({ email: "felichpehagasa@gmail.com", batch: "2025" })).toBe(false);
      expect(isTester({ email: "felich@mhs.cwe.ac.id" })).toBe(false);
      expect(isTester({ email: "berkah1hsanul@gmail.com", batch: "2025" })).toBe(false);
      expect(isTester({ email: "khairoummh0828@gmail.com" })).toBe(false);

      // New Maba 2026 should not be classified as tester
      expect(isTester({ email: "maba2026baru@mhs.cwe.ac.id" })).toBe(false);
    });
  });
});

