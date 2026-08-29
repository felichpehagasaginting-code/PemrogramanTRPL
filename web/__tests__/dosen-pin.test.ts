import { describe, it, expect } from "vitest";
import { DOSEN_SECRET_PIN } from "@/components/auth/DosenPinDialpadModal";
import { useUserStore, isAdmin } from "@/lib/store/useUserStore";

describe("Dosen Penguji PIN Dial Pad & Access Gate", () => {
  it("has master PIN defined as 1213 (integer only)", () => {
    expect(DOSEN_SECRET_PIN).toBe("1213");
    expect(/^\d{4}$/.test(DOSEN_SECRET_PIN)).toBe(true);
  });

  it("fails authentication when wrong PIN is supplied", () => {
    const store = useUserStore.getState();
    const success = store.loginAsDosenPenguji("9999");
    expect(success).toBe(false);
  });

  it("authenticates as Dosen Penguji with full access and full progress matching creator", () => {
    const store = useUserStore.getState();
    const success = store.loginAsDosenPenguji("1213");
    expect(success).toBe(true);

    const currentUser = useUserStore.getState().user;
    expect(currentUser).not.toBeNull();
    expect(currentUser?.isDosenPenguji).toBe(true);
    expect(currentUser?.isCreator).toBe(true); // Full access like felich@mhs.cwe.ac.id
    expect(isAdmin(currentUser)).toBe(true); // Full admin access

    // Progress and stats match creator (felich@mhs.cwe.ac.id)
    expect(currentUser?.xp).toBe(1550);
    expect(currentUser?.level).toBe("TRPL Legend");
    expect(currentUser?.progress.M0.status).toBe("completed");
    expect(currentUser?.progress.M1.status).toBe("completed");
    expect(currentUser?.progress.M8.status).toBe("completed");
  });
});
