"use client";

import React from "react";
import { WarningCircle, Clock, CheckCircle, Flame, Users } from "@phosphor-icons/react";

export interface ModuleStruggleMetric {
  moduleId: string;
  moduleName: string;
  avgTimeMinutes: number;
  failureRatePercent: number;
  totalAttempts: number;
  struggleLevel: "low" | "medium" | "high";
}

const DEFAULT_METRICS: ModuleStruggleMetric[] = [
  { moduleId: "M0", moduleName: "Pre-Test & Orientasi", avgTimeMinutes: 12, failureRatePercent: 5, totalAttempts: 120, struggleLevel: "low" },
  { moduleId: "M1", moduleName: "Dasar Komputer & Workspace", avgTimeMinutes: 24, failureRatePercent: 12, totalAttempts: 118, struggleLevel: "low" },
  { moduleId: "M2", moduleName: "Logika & Algoritma", avgTimeMinutes: 38, failureRatePercent: 28, totalAttempts: 115, struggleLevel: "medium" },
  { moduleId: "M3", moduleName: "Variabel & Tipe Data", avgTimeMinutes: 42, failureRatePercent: 34, totalAttempts: 110, struggleLevel: "medium" },
  { moduleId: "M4", moduleName: "Percabangan (If-Else)", avgTimeMinutes: 48, failureRatePercent: 41, totalAttempts: 104, struggleLevel: "medium" },
  { moduleId: "M5", moduleName: "Perulangan (Loops)", avgTimeMinutes: 65, failureRatePercent: 62, totalAttempts: 98, struggleLevel: "high" },
  { moduleId: "M6", moduleName: "Fungsi & Prosedur", avgTimeMinutes: 72, failureRatePercent: 58, totalAttempts: 92, struggleLevel: "high" },
  { moduleId: "M7", moduleName: "Array & List Data", avgTimeMinutes: 60, failureRatePercent: 49, totalAttempts: 88, struggleLevel: "medium" },
  { moduleId: "M8", moduleName: "Mini Project Akhir", avgTimeMinutes: 95, failureRatePercent: 35, totalAttempts: 76, struggleLevel: "medium" },
];

export function StruggleHeatmap({ metrics = DEFAULT_METRICS }: { metrics?: ModuleStruggleMetric[] }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <Flame size={22} color="#EF4444" weight="fill" />
            Matriks Kesulitan Mahasiswa (Struggle Heatmap)
          </h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
            Memantau modul dan materi kuliah yang membutuhkan review tambahan dari tim dosen.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#10B981" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} /> Mudah (&lt;30%)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} /> Sedang (30-50%)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#EF4444" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }} /> Butuh Bimbingan (&gt;50%)
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
        {metrics.map((m) => {
          const bg =
            m.struggleLevel === "high"
              ? "rgba(239, 68, 68, 0.12)"
              : m.struggleLevel === "medium"
              ? "rgba(245, 158, 11, 0.1)"
              : "rgba(16, 185, 129, 0.08)";

          const border =
            m.struggleLevel === "high"
              ? "rgba(239, 68, 68, 0.4)"
              : m.struggleLevel === "medium"
              ? "rgba(245, 158, 11, 0.3)"
              : "rgba(16, 185, 129, 0.25)";

          const tagColor =
            m.struggleLevel === "high" ? "#EF4444" : m.struggleLevel === "medium" ? "#F59E0B" : "#10B981";

          return (
            <div
              key={m.moduleId}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: tagColor }}>{m.moduleId}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: tagColor, background: "rgba(0,0,0,0.2)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                    Tingkat Kesulitan: {m.failureRatePercent}%
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {m.moduleName}
                </h4>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={14} /> {m.avgTimeMinutes} menit avg
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={14} /> {m.totalAttempts} maba
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
