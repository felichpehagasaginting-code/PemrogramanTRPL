"use client";

import { useState } from "react";
import { Lightning, Trophy, Sparkle, Clock, Target, CalendarCheck } from "@phosphor-icons/react";
import { soundFX } from "@/lib/audio";

export function XPCalculator() {
  const [minutesPerDay, setMinutesPerDay] = useState(30);

  const calculateProjection = (mins: number) => {
    if (mins <= 15) {
      return { daysToFinish: 14, estimatedXP: 650, level: "Developer Muda", badgeCount: 6, paceLabel: "Santai & Bertahap" };
    } else if (mins <= 30) {
      return { daysToFinish: 7, estimatedXP: 1100, level: "Algorithm Master", badgeCount: 10, paceLabel: "Ideal & Konsisten" };
    } else {
      return { daysToFinish: 3, estimatedXP: 1450, level: "TRPL Legend", badgeCount: 16, paceLabel: "Speed Runner Mode" };
    }
  };

  const projection = calculateProjection(minutesPerDay);

  return (
    <div className="section-container">
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          boxShadow: "var(--shadow-card)",
          maxWidth: "720px",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "var(--gradient-hero)" }} />

        {/* Section Header inside card */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "var(--space-2)" }}>
            <span className="badge badge-primary">
              <Sparkle size={12} weight="fill" />
              Simulasi Interaktif
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "var(--text-primary)" }}>
            Kalkulator Waktu Belajar & XP
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "var(--space-2)", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
            Tentukan komitmen waktu harianmu dan lihat estimasi percepatan level serta total XP yang akan kamu kumpulkan!
          </p>
        </div>

        {/* Slider control */}
        <div
          style={{
            background: "var(--bg-page-alt)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-5)",
            marginBottom: "var(--space-6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} color="var(--color-primary-500)" weight="fill" />
              Alokasi Waktu Harian
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.125rem",
                fontWeight: 800,
                color: "var(--color-primary-500)",
                background: "rgba(255,107,0,0.1)",
                padding: "2px 10px",
                borderRadius: "var(--radius-full)",
              }}
            >
              {minutesPerDay} Menit / Hari
            </span>
          </div>

          <input
            type="range"
            min={15}
            max={60}
            step={15}
            value={minutesPerDay}
            aria-label="Waktu belajar per hari dalam menit"
            onChange={(e) => {
              try { soundFX.playClick(); } catch {}
              setMinutesPerDay(Number(e.target.value));
            }}
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "4px",
              accentColor: "var(--color-primary-500)",
              cursor: "pointer",
              marginBottom: "8px",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
            <span>15 mnt (Santai)</span>
            <span>30 mnt (Direkomendasikan)</span>
            <span>60 mnt (Intensif)</span>
          </div>
        </div>

        {/* Projection Results Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              background: "var(--bg-page-alt)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,107,0,0.12)",
                color: "var(--color-primary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "6px",
              }}
            >
              <CalendarCheck size={20} weight="fill" />
            </div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              ~{projection.daysToFinish} Hari
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>
              Target Selesai Modul
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-page-alt)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255,157,0,0.12)",
                color: "var(--color-secondary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "6px",
              }}
            >
              <Lightning size={20} weight="fill" />
            </div>
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              +{projection.estimatedXP} XP
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>
              Potensi Perolehan XP
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-page-alt)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(34,197,94,0.12)",
                color: "var(--success-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "6px",
              }}
            >
              <Trophy size={20} weight="fill" />
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--success-color)", fontFamily: "var(--font-heading)", whiteSpace: "nowrap" }}>
              {projection.level}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>
              Gelar & Level Akhir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

