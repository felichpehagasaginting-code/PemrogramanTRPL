"use client";

import React, { useMemo } from "react";
import { WarningCircle, Clock, CheckCircle, Flame, Users } from "@phosphor-icons/react";
import { UserProfile } from "@/lib/store/useUserStore";

export interface ModuleStruggleMetric {
  moduleId: string;
  moduleName: string;
  avgTimeMinutes: number;
  failureRatePercent: number;
  totalAttempts: number;
  struggleLevel: "low" | "medium" | "high";
}

const MODULE_DEFS = [
  { id: "M0", name: "Pre-Test & Orientasi", defaultMinutes: 10 },
  { id: "M1", name: "Dasar Komputer & Workspace", defaultMinutes: 15 },
  { id: "M2", name: "Logika & Algoritma", defaultMinutes: 15 },
  { id: "M3", name: "Variabel & Tipe Data", defaultMinutes: 20 },
  { id: "M4", name: "Percabangan (If-Else)", defaultMinutes: 25 },
  { id: "M5", name: "Perulangan (Loops)", defaultMinutes: 30 },
  { id: "M6", name: "Fungsi & Prosedur", defaultMinutes: 30 },
  { id: "M7", name: "Array & List Data", defaultMinutes: 25 },
  { id: "M8", name: "Mini Project Akhir", defaultMinutes: 40 },
];

export function calculateRealStruggleMetrics(users: UserProfile[]): ModuleStruggleMetric[] {
  const total = users.length;
  if (total === 0) {
    return MODULE_DEFS.map((m) => ({
      moduleId: m.id,
      moduleName: m.name,
      avgTimeMinutes: 0,
      failureRatePercent: 0,
      totalAttempts: 0,
      struggleLevel: "low" as const,
    }));
  }

  return MODULE_DEFS.map((m) => {
    const completedCount = users.filter((u) => u.progress?.[m.id]?.status === "completed").length;
    const activeCount = users.filter((u) => u.progress?.[m.id]?.status === "active").length;
    const attemptedCount = completedCount + activeCount;
    const notCompletedPercent = Math.round(((total - completedCount) / total) * 100);
    const struggleLevel = notCompletedPercent > 60 ? "high" : notCompletedPercent > 30 ? "medium" : "low";

    return {
      moduleId: m.id,
      moduleName: m.name,
      avgTimeMinutes: m.defaultMinutes,
      failureRatePercent: notCompletedPercent,
      totalAttempts: attemptedCount,
      struggleLevel,
    };
  });
}

export function StruggleHeatmap({
  users,
  metrics,
}: {
  users?: UserProfile[];
  metrics?: ModuleStruggleMetric[];
}) {
  const computedMetrics = useMemo(() => {
    if (metrics && metrics.length > 0) return metrics;
    if (users) return calculateRealStruggleMetrics(users);
    return calculateRealStruggleMetrics([]);
  }, [users, metrics]);

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
            Matriks Kesulitan Mahasiswa Real-Time
          </h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
            Dihitung langsung dari data progres nyata mahasiswa di Cloud Firestore.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#10B981" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} /> Mudah (&lt;30% blm selesai)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} /> Sedang (30-60%)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#EF4444" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }} /> Butuh Bimbingan (&gt;60%)
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
        {computedMetrics.map((m) => {
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
                    Belum Selesai: {m.failureRatePercent}%
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {m.moduleName}
                </h4>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-secondary)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={14} /> Estimasi {m.avgTimeMinutes} mnt
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={14} /> {m.totalAttempts} aktif/selesai
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
