"use client";

import { useState } from "react";
import { Fire, ArrowClockwise, Sparkle, Lightning } from "@phosphor-icons/react";
import { soundFX } from "@/lib/audio";

const MEMES = [
  { text: "There are 10 types of people in the world: those who understand binary, and those who don't.", author: "Programming Proverb" },
  { text: "It's not a bug – it's an undocumented feature!", author: "Anonymous Senior Dev" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
];

interface DailyStreakWidgetProps {
  streak: number;
}

export function DailyStreakWidget({ streak = 1 }: DailyStreakWidgetProps) {
  const [memeIndex, setMemeIndex] = useState(0);

  const nextMeme = () => {
    soundFX.playClick();
    setMemeIndex((prev) => (prev + 1) % MEMES.length);
  };

  const meme = MEMES[memeIndex];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* Streak Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(255, 107, 0, 0.15))",
          border: "1px solid var(--error-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(239, 68, 68, 0.6)",
            }}
          >
            <Fire size={28} color="#FFF" weight="fill" />
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {streak} Hari Streak Belajar!
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              Tetap belajar setiap hari untuk mempertahankan kobaran api!
            </div>
          </div>
        </div>

        {/* Circular progress wheel (100% completed) */}
        <div style={{ width: "42px", height: "42px", borderRadius: "50%", border: "3px solid var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8125rem", color: "var(--primary-color)" }}>
          100%
        </div>
      </div>

      {/* Programming Meme Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-5)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-color)", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sparkle size={14} /> PROGRAMMING QUOTE / MEME
          </span>
          <button onClick={nextMeme} className="btn btn-sm btn-ghost" title="Meme Berikutnya">
            <ArrowClockwise size={14} /> Acak
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", fontStyle: "italic", color: "var(--text-primary)", margin: "0 0 6px 0", lineHeight: 1.5 }}>
          "{meme.text}"
        </p>
        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textAlign: "right" }}>
          — {meme.author}
        </div>
      </div>
    </div>
  );
}
