"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";

// 1 Hour in milliseconds (60 minutes * 60 seconds * 1000 ms)
export const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;
export const ACTIVITY_STORAGE_KEY = "trpl_last_activity_time";
export const SESSION_EXPIRED_KEY = "trpl_session_expired_notice";

/**
 * Pure function to check if a timestamp has exceeded the maximum idle duration
 */
export function isSessionExpired(
  lastActiveTime: number,
  maxIdleMs: number = INACTIVITY_TIMEOUT_MS,
  currentTime: number = Date.now()
): boolean {
  if (!lastActiveTime || isNaN(lastActiveTime)) return false;
  return currentTime - lastActiveTime > maxIdleMs;
}

export function useSessionTimeout() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const lastRecordedRef = useRef<number>(Date.now());

  // Record activity with a throttle to prevent excessive storage writes
  const recordActivity = useCallback(() => {
    const now = Date.now();
    // Throttle updates to at most once every 15 seconds
    if (now - lastRecordedRef.current > 15000) {
      lastRecordedRef.current = now;
      try {
        localStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  const handleSessionExpiration = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_EXPIRED_KEY, "true");
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch {}
    logout();
    router.push("/login?reason=session_expired");
  }, [logout, router]);

  const checkSession = useCallback(() => {
    if (!user) return;

    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      const lastActive = stored ? parseInt(stored, 10) : lastRecordedRef.current;

      if (isSessionExpired(lastActive, INACTIVITY_TIMEOUT_MS)) {
        handleSessionExpiration();
      }
    } catch {
      // ignore
    }
  }, [user, handleSessionExpiration]);

  useEffect(() => {
    if (!user) return;

    // Initialize or verify current timestamp on mount
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        const lastActive = parseInt(stored, 10);
        if (isSessionExpired(lastActive, INACTIVITY_TIMEOUT_MS)) {
          handleSessionExpiration();
          return;
        }
      }
      localStorage.setItem(ACTIVITY_STORAGE_KEY, Date.now().toString());
    } catch {}

    // Attach user interaction listeners
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    const handleUserInteraction = () => {
      recordActivity();
    };

    events.forEach((ev) => {
      window.addEventListener(ev, handleUserInteraction, { passive: true });
    });

    // Check periodically (every 30 seconds)
    const interval = setInterval(checkSession, 30000);

    // Also check immediately when user refocuses or switches back to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
        recordActivity();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      events.forEach((ev) => {
        window.removeEventListener(ev, handleUserInteraction);
      });
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [user, recordActivity, checkSession, handleSessionExpiration]);
}
