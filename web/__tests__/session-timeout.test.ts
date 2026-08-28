import { describe, it, expect } from "vitest";
import { isSessionExpired, INACTIVITY_TIMEOUT_MS } from "@/lib/auth/useSessionTimeout";

describe("Session Timeout Guard (1-Hour Inactivity)", () => {
  it("uses 1 hour (3600000 ms) as the default inactivity timeout", () => {
    expect(INACTIVITY_TIMEOUT_MS).toBe(60 * 60 * 1000);
    expect(INACTIVITY_TIMEOUT_MS).toBe(3600000);
  });

  it("returns false if user was active recently (e.g. 5 minutes ago)", () => {
    const now = 1700000000000;
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const expired = isSessionExpired(fiveMinutesAgo, INACTIVITY_TIMEOUT_MS, now);
    expect(expired).toBe(false);
  });

  it("returns false if user was active 59 minutes ago", () => {
    const now = 1700000000000;
    const fiftyNineMinsAgo = now - 59 * 60 * 1000;
    const expired = isSessionExpired(fiftyNineMinsAgo, INACTIVITY_TIMEOUT_MS, now);
    expect(expired).toBe(false);
  });

  it("returns true if user was inactive for more than 1 hour (e.g. 61 minutes ago)", () => {
    const now = 1700000000000;
    const sixtyOneMinsAgo = now - 61 * 60 * 1000;
    const expired = isSessionExpired(sixtyOneMinsAgo, INACTIVITY_TIMEOUT_MS, now);
    expect(expired).toBe(true);
  });

  it("returns true if user was inactive for 24 hours", () => {
    const now = 1700000000000;
    const yesterday = now - 24 * 60 * 60 * 1000;
    const expired = isSessionExpired(yesterday, INACTIVITY_TIMEOUT_MS, now);
    expect(expired).toBe(true);
  });

  it("handles missing or invalid timestamp safely", () => {
    expect(isSessionExpired(0)).toBe(false);
    expect(isSessionExpired(NaN)).toBe(false);
  });
});
