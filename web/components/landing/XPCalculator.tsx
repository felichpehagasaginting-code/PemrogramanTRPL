"use client";

import { useState } from "react";
import { Lightning, Trophy, Sparkle, Clock } from "@phosphor-icons/react";
import { soundFX } from "@/lib/audio";

export function XPCalculator() {
  const [minutesPerDay, setMinutesPerDay] = useState(30);

  const calculateProjection = (mins: number) => {
    if (mins <= 15) {
      return { daysToFinish: 14, estimatedXP: 650, level: "Developer Muda", badgeCount: 6 };
    } else if (mins <= 30) {
      return { daysToFinish: 7, estimatedXP: 1100, level: "Algorithm Master", badgeCount: 10 };
    } else {
      return { daysToFinish: 3, estimatedXP: 1450, level: "TRPL Legend", badgeCount: 16 };
    }
  };

  const projection = calculateProjection(minutesPerDay);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        boxShadow: "var(--shadow-card)",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-4)" }}>
        <Sparkle size={24} color="var(--primary-color)" />
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
          📊 Kalkulator Proyeksi Belajar & XP
        </h3>
      </div>

      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
        Berapa menit kamu bisa meluangkan waktu belajar per hari? Geser slider untuk melihat estimasi level & XP yang akan kamu raih!
      </p>

      {/* Slider */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: 700, marginBottom: "8px" }}>
          <span>⏱️ Waktu Belajar Per Hari</span>
          <span style={{ color: "var(--primary-color)", fontSize: "1.125rem" }}>{minutesPerDay} Menit / Hari</span>
        </div>
        <input
          type="range"
          min={15}
          max={60}
          step={15}
          value={minutesPerDay}
          onChange={(e) => {
            soundFX.playClick();
            setMinutesPerDay(Number(e.target.value));
          }}
          style={{
            width: "100%",
            accentColor: "var(--primary-color)",
            cursor: "pointer",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
          <span>15 Menit (Santai)</span>
          <span>30 Menit (Ideal)</span>
          <span>60 Menit (Speed Runner)</span>
        </div>
      </div>

      {/* Projection Results Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
        <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
          <Clock size={20} color="var(--primary-color)" />
          <div style={{ fontSize: "1.25rem", fontWeight: 800, margin: "4px 0 2px" }}>{projection.daysToFinish} Hari</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Target Selesai</div>
        </div>

        <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
          <Lightning size={20} color="var(--color-accent)" />
          <div style={{ fontSize: "1.25rem", fontWeight: 800, margin: "4px 0 2px" }}>+{projection.estimatedXP} XP</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Total Perolehan XP</div>
        </div>

        <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
          <Trophy size={20} color="var(--success-color)" />
          <div style={{ fontSize: "1rem", fontWeight: 800, margin: "4px 0 2px", color: "var(--success-color)" }}>{projection.level}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Estimasi Level</div>
        </div>
      </div>
    </div>
  );
}
