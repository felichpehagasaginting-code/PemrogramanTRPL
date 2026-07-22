"use client";

import { useMemo } from "react";
import { UserProfile, BADGES } from "@/lib/store/useUserStore";
import {
  ChartBar,
  DownloadSimple,
  Printer,
  Users,
  Trophy,
  CheckCircle,
  Warning,
  TrendUp,
} from "@phosphor-icons/react";

interface AnalyticsDashboardProps {
  users: UserProfile[];
}

const MODULE_KEYS = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];
const MODULE_NAMES: Record<string, string> = {
  M0: "Pre-Test & Orientasi",
  M1: "Workspace Setup",
  M2: "Logika & Algoritma",
  M3: "Variabel & Tipe Data",
  M4: "Percabangan",
  M5: "Perulangan",
  M6: "Fungsi & Prosedur",
  M7: "Array & List",
  M8: "Mini Project Akhir",
};

export function AnalyticsDashboard({ users }: AnalyticsDashboardProps) {
  // 1. Calculate KPIs
  const totalStudents = users.length;
  const avgXP = useMemo(() => {
    if (totalStudents === 0) return 0;
    const sum = users.reduce((acc, u) => acc + (u.xp || 0), 0);
    return Math.round(sum / totalStudents);
  }, [users, totalStudents]);

  const moduleStats = useMemo(() => {
    return MODULE_KEYS.map((mId) => {
      let completedCount = 0;
      let activeCount = 0;
      let lockedCount = 0;

      users.forEach((u) => {
        const status = u.progress?.[mId]?.status || "locked";
        if (status === "completed") completedCount++;
        else if (status === "active") activeCount++;
        else lockedCount++;
      });

      const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
      const stuckRate = totalStudents > 0 ? Math.round((activeCount / totalStudents) * 100) : 0;

      return {
        id: mId,
        name: MODULE_NAMES[mId] || mId,
        completedCount,
        activeCount,
        lockedCount,
        completionRate,
        stuckRate,
      };
    });
  }, [users, totalStudents]);

  const levelDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    users.forEach((u) => {
      const lv = u.level || "Script Kiddie";
      dist[lv] = (dist[lv] || 0) + 1;
    });
    return dist;
  }, [users]);

  // CSV Export Handler
  const exportToCSV = () => {
    if (users.length === 0) return;

    const headers = ["UID", "Nama", "Email", "XP", "Level", "Jumlah Badge", "Progress Status"];
    const rows = users.map((u) => {
      const completedModules = Object.keys(u.progress || {}).filter(
        (m) => u.progress[m]?.status === "completed"
      ).length;
      return [
        `"${u.uid}"`,
        `"${u.name}"`,
        `"${u.email}"`,
        u.xp || 0,
        `"${u.level || 'Script Kiddie'}"`,
        (u.badges || []).length,
        `"${completedModules}/${MODULE_KEYS.length} Modul Completed"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Matrikulasi_TRPL_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF Report Handler
  const printPDFReport = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Action Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>📊 Dashboard Analytics & Laporan Dosen</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Ringkasan performa dan tingkat penyelesaian modul mahasiswa matrikulasi TRPL.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={exportToCSV} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <DownloadSimple size={16} /> Ekspor CSV
          </button>
          <button onClick={printPDFReport} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Printer size={16} /> Cetak Laporan PDF
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary-color)" }}>
            <Users size={24} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Total Mahasiswa Terdaftar</span>
          </div>
          <h2 style={{ margin: "12px 0 0 0", fontSize: "1.75rem", fontWeight: 800 }}>{totalStudents} Maba</h2>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-accent)" }}>
            <Trophy size={24} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Rata-Rata XP Kelas</span>
          </div>
          <h2 style={{ margin: "12px 0 0 0", fontSize: "1.75rem", fontWeight: 800 }}>{avgXP} XP</h2>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--success-color)" }}>
            <CheckCircle size={24} />
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Penyelesaian Pre-Test (M0)</span>
          </div>
          <h2 style={{ margin: "12px 0 0 0", fontSize: "1.75rem", fontWeight: 800 }}>
            {moduleStats[0]?.completionRate || 0}%
          </h2>
        </div>
      </div>

      {/* Module Completion Breakdown Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: 700 }}>📌 Status Penyelesaian Modul (M0 - M8)</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", textAlign: "left" }}>
                <th style={{ padding: "10px 14px" }}>Kode Modul</th>
                <th style={{ padding: "10px 14px" }}>Nama Modul</th>
                <th style={{ padding: "10px 14px" }}>Selesai</th>
                <th style={{ padding: "10px 14px" }}>Sedang Dikerjakan</th>
                <th style={{ padding: "10px 14px" }}>Completion Rate</th>
                <th style={{ padding: "10px 14px" }}>Stuck Rate</th>
              </tr>
            </thead>
            <tbody>
              {moduleStats.map((m) => (
                <tr key={m.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--primary-color)" }}>{m.id}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: "10px 14px", color: "var(--success-color)", fontWeight: 700 }}>{m.completedCount} maba</td>
                  <td style={{ padding: "10px 14px", color: "var(--primary-color)" }}>{m.activeCount} maba</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ flex: 1, height: "8px", background: "var(--bg-secondary)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${m.completionRate}%`, height: "100%", background: "var(--success-color)" }} />
                      </div>
                      <span style={{ fontWeight: 700, width: "36px" }}>{m.completionRate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", color: m.stuckRate > 30 ? "var(--error-color)" : "var(--text-secondary)" }}>
                    {m.stuckRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Level Distribution Chart */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: 700 }}>🏆 Distribusi Level Mahasiswa</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          {Object.entries(levelDistribution).map(([level, count]) => (
            <div key={level} style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{level}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-color)", marginTop: "4px" }}>
                {count} Maba
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
