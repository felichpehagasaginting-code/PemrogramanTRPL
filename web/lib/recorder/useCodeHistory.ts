"use client";

import { useState, useEffect, useCallback } from "react";

export interface CodeRevision {
  id: string;
  timestamp: number;
  code: string;
  label?: string;
  charCount: number;
}

const MAX_REVISIONS = 15;

export function useCodeHistory(contextKey: string) {
  const storageKey = `trpl_history_${contextKey}`;

  const [history, setHistory] = useState<CodeRevision[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback empty
    }
    return [];
  });

  // Re-sync if contextKey changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          return;
        }
      }
      setHistory([]);
    } catch {
      setHistory([]);
    }
  }, [storageKey]);

  // Save new revision snapshot
  const saveRevision = useCallback(
    (code: string, label?: string) => {
      if (typeof window === "undefined" || !code.trim()) return;

      setHistory((prev) => {
        // Do not add if identical to the latest snapshot
        if (prev.length > 0 && prev[0].code.trim() === code.trim()) {
          return prev;
        }

        const newRevision: CodeRevision = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
          code,
          label: label || `Revisi ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`,
          charCount: code.length,
        };

        const updated = [newRevision, ...prev].slice(0, MAX_REVISIONS);
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
        return updated;
      });
    },
    [storageKey]
  );

  // Delete specific revision
  const deleteRevision = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const updated = prev.filter((rev) => rev.id !== id);
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    },
    [storageKey]
  );

  // Clear all revisions
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setHistory([]);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return {
    history,
    saveRevision,
    deleteRevision,
    clearHistory,
  };
}
