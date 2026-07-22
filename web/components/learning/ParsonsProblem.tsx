"use client";

import { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkle,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { triggerConfetti } from "@/lib/confetti";

export interface ParsonsBlock {
  id: string;
  code: string;
  indent: number; // 0, 1, 2 (number of 4-space indents)
}

interface ParsonsProblemProps {
  title?: string;
  description: string;
  solutionBlocks: ParsonsBlock[];
  onSuccess?: () => void;
}

export function ParsonsProblem({
  title = "Code Puzzle (Parsons Problem)",
  description,
  solutionBlocks,
  onSuccess,
}: ParsonsProblemProps) {
  // Scramble blocks for initial state
  const [userBlocks, setUserBlocks] = useState<ParsonsBlock[]>([]);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  useEffect(() => {
    // Shuffle initial blocks
    const shuffled = [...solutionBlocks]
      .map((b) => ({ ...b, indent: 0 }))
      .sort(() => Math.random() - 0.5);
    setUserBlocks(shuffled);
  }, [solutionBlocks]);

  const moveBlock = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= userBlocks.length) return;
    const updated = [...userBlocks];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setUserBlocks(updated);
    setFeedback(null);
  };

  const changeIndent = (index: number, delta: number) => {
    const updated = [...userBlocks];
    const newIndent = Math.max(0, Math.min(3, updated[index].indent + delta));
    updated[index] = { ...updated[index], indent: newIndent };
    setUserBlocks(updated);
    setFeedback(null);
  };

  const resetPuzzle = () => {
    const shuffled = [...solutionBlocks]
      .map((b) => ({ ...b, indent: 0 }))
      .sort(() => Math.random() - 0.5);
    setUserBlocks(shuffled);
    setFeedback(null);
  };

  const checkSolution = () => {
    let isMatch = true;
    if (userBlocks.length !== solutionBlocks.length) {
      isMatch = false;
    } else {
      for (let i = 0; i < solutionBlocks.length; i++) {
        if (
          userBlocks[i].id !== solutionBlocks[i].id ||
          userBlocks[i].indent !== solutionBlocks[i].indent
        ) {
          isMatch = false;
          break;
        }
      }
    }

    if (isMatch) {
      setFeedback({
        passed: true,
        message: "🎉 Luar biasa! Urutan dan indentasi kode kamu 100% benar!",
      });
      triggerConfetti();
      if (onSuccess) onSuccess();
    } else {
      setFeedback({
        passed: false,
        message: "❌ Urutan atau indentasi belum tepat. Periksa kembali alur kodenya!",
      });
    }
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Sparkle size={24} color="var(--primary-color)" />
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>{title}</h3>
      </div>

      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>{description}</p>

      {/* Instructions */}
      <div
        style={{
          background: "var(--bg-secondary)",
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          fontSize: "0.8125rem",
          color: "var(--text-secondary)",
        }}
      >
        💡 <strong>Petunjuk:</strong> Gunakan tombol ↑ ↓ untuk menyusun urutan baris kode, dan tombol ➔ ⬅
        untuk mengatur indentasi (spasi ke dalam).
      </div>

      {/* Code Blocks list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {userBlocks.map((block, idx) => (
          <div
            key={block.id + idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#1E1E1E",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "8px 12px",
              marginLeft: `${block.indent * 24}px`,
              transition: "all 0.2s ease",
            }}
          >
            {/* Indent buttons */}
            <button
              onClick={() => changeIndent(idx, -1)}
              disabled={block.indent === 0}
              className="btn btn-sm btn-ghost"
              style={{ padding: "4px", color: "#AAA" }}
              title="Kurangi Indentasi (Shift+Tab)"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => changeIndent(idx, 1)}
              disabled={block.indent >= 3}
              className="btn btn-sm btn-ghost"
              style={{ padding: "4px", color: "#AAA" }}
              title="Tambah Indentasi (Tab)"
            >
              <ArrowRight size={14} />
            </button>

            {/* Code Content */}
            <code
              style={{
                flex: 1,
                fontFamily: "monospace",
                fontSize: "0.875rem",
                color: "#9CDCFE",
              }}
            >
              {block.code}
            </code>

            {/* Move Up / Down */}
            <button
              onClick={() => moveBlock(idx, idx - 1)}
              disabled={idx === 0}
              className="btn btn-sm btn-ghost"
              style={{ padding: "4px", color: "#AAA" }}
              title="Pindah ke Atas"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => moveBlock(idx, idx + 1)}
              disabled={idx === userBlocks.length - 1}
              className="btn btn-sm btn-ghost"
              style={{ padding: "4px", color: "#AAA" }}
              title="Pindah ke Bawah"
            >
              <ArrowDown size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Action & Feedback */}
      {feedback && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: feedback.passed ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${feedback.passed ? "var(--success-color)" : "var(--error-color)"}`,
            color: feedback.passed ? "var(--success-color)" : "var(--error-color)",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {feedback.passed ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {feedback.message}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", marginTop: "var(--space-2)" }}>
        <button onClick={checkSolution} className="btn btn-primary" style={{ flex: 1 }}>
          Periksa Susunan Kode
        </button>
        <button onClick={resetPuzzle} className="btn btn-secondary" title="Acak Ulang">
          <ArrowClockwise size={16} /> Acak
        </button>
      </div>
    </div>
  );
}
