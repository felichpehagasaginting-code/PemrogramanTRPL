"use client";

import { useMemo } from "react";
import { Check, X, Sparkle } from "@phosphor-icons/react";

interface CodeDiffViewerProps {
  userCode: string;
  solutionCode: string;
}

export function CodeDiffViewer({ userCode, solutionCode }: CodeDiffViewerProps) {
  const diffLines = useMemo(() => {
    const userLines = userCode.split("\n");
    const solLines = solutionCode.split("\n");
    const maxLen = Math.max(userLines.length, solLines.length);

    const result: Array<{ type: "same" | "diff"; user: string; sol: string }> = [];

    for (let i = 0; i < maxLen; i++) {
      const u = userLines[i] || "";
      const s = solLines[i] || "";

      if (u.trim() === s.trim()) {
        result.push({ type: "same", user: u, sol: s });
      } else {
        result.push({ type: "diff", user: u, sol: s });
      }
    }

    return result;
  }, [userCode, solutionCode]);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
        fontFamily: "monospace",
        fontSize: "0.8125rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", color: "var(--primary-color)", fontWeight: 700 }}>
        <Sparkle size={16} /> Perbandingan Sintaksis (Code Diff Hint)
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {/* User Code Column */}
        <div style={{ background: "#1E1E1E", borderRadius: "var(--radius-md)", padding: "10px", color: "#D4D4D4" }}>
          <div style={{ fontSize: "0.75rem", color: "#AAA", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "8px", fontWeight: 700 }}>
            Kode Kamu Saat Ini
          </div>
          {diffLines.map((line, idx) => (
            <div
              key={idx}
              style={{
                background: line.type === "diff" ? "rgba(239, 68, 68, 0.2)" : "transparent",
                color: line.type === "diff" ? "#FCA5A5" : "#D4D4D4",
                padding: "2px 4px",
                borderRadius: "2px",
              }}
            >
              {line.user || <span style={{ opacity: 0.3 }}>(kosong)</span>}
            </div>
          ))}
        </div>

        {/* Recommended Solution Column */}
        <div style={{ background: "#1E1E1E", borderRadius: "var(--radius-md)", padding: "10px", color: "#D4D4D4" }}>
          <div style={{ fontSize: "0.75rem", color: "#AAA", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "8px", fontWeight: 700 }}>
            Rekomendasi Sintaksis Ideal
          </div>
          {diffLines.map((line, idx) => (
            <div
              key={idx}
              style={{
                background: line.type === "diff" ? "rgba(34, 197, 94, 0.2)" : "transparent",
                color: line.type === "diff" ? "#86EFAC" : "#D4D4D4",
                padding: "2px 4px",
                borderRadius: "2px",
              }}
            >
              {line.sol || <span style={{ opacity: 0.3 }}>(kosong)</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
