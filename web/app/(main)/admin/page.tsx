"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserStore, BADGES, LEVELS, isAdmin } from "@/lib/store/useUserStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ShieldCheck, Users, Trophy, WarningCircle, MagnifyingGlass,
  DownloadSimple, ArrowCounterClockwise, PlusCircle, X,
  Student, ChartBar, CheckCircle, LockKey,
} from "@phosphor-icons/react";

const MODULE_LABELS: Record<string, string> = {
  M0: "Pre-Test", M1: "Workspace", M2: "Logika",
  M3: "Variabel", M4: "Percabangan", M5: "Perulangan",
  M6: "Fungsi", M7: "Array", M8: "Mini Project",
};

export default function AdminPage() {
  const router = useRouter();
  const { user, leaderboard, allUsers, fetchLeaderboard, fetchAllUsers, resetUserProgress, awardXP } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [awardModal, setAwardModal] = useState<string | null>(null);
  const [awardAmount, setAwardAmount] = useState(50);

  useEffect(() => {
    if (user && !isAdmin(user)) router.push("/dashboard");
  }, [user, router]);

  useEffect(() => {
    Promise.all([fetchLeaderboard(), fetchAllUsers()]).finally(() => setLoading(false));
  }, [fetchLeaderboard, fetchAllUsers]);

  if (!user) return <LoadingSpinner text="Memverifikasi akses..." fullPage />;
  if (!isAdmin(user)) return null;
  if (loading) return <LoadingSpinner text="Memuat data admin..." fullPage />;

  const allModuleKeys = Object.keys(MODULE_LABELS);
  const totalStudents = allUsers.length;
  const totalXP = allUsers.reduce((s, u) => s + u.xp, 0);
  const avgXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  const completedAll = allUsers.filter((u) => u.level === "TRPL Legend").length;
  const avgStreak = totalStudents > 0 ? Math.round(allUsers.reduce((s, u) => s + (u.streak || 0), 0) / totalStudents) : 0;

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const moduleStats = allModuleKeys.map((key) => {
    const completed = allUsers.filter((u) => u.progress[key]?.status === "completed").length;
    return { module: key, label: MODULE_LABELS[key], completed, total: totalStudents, pct: totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0 };
  });

  const sorted = [...allUsers].sort((a, b) => b.xp - a.xp);

  const exportCSV = () => {
    const header = ["Nama", "Email", "XP", "Level", "Streak", "Badges", ...allModuleKeys.map((k) => MODULE_LABELS[k])];
    const rows = sorted.map((u) => [
      u.name, u.email, u.xp, u.level, u.streak || 0, u.badges.length,
      ...allModuleKeys.map((k) => u.progress[k]?.status || "locked"),
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "matrikulasi-progress.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const selectedUser = selectedUid ? allUsers.find((u) => u.uid === selectedUid) : null;

  return (
    <div className="section-container" style={{ paddingTop: "var(--space-4)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "var(--space-6)" }}>
        <div>
          <span className="badge badge-primary"><ShieldCheck size={12} weight="fill" /> ADMIN DASHBOARD</span>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px" }}>
            Monitoring Progress Mahasiswa
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Total {totalStudents} mahasiswa terdaftar di platform matrikulasi
          </p>
        </div>
        <button onClick={exportCSV} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <DownloadSimple size={16} /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        {[
          { label: "Total Mahasiswa", value: totalStudents, icon: <Users size={22} />, color: "#06B6D4" },
          { label: "Total XP Kelas", value: totalXP.toLocaleString(), icon: <Trophy size={22} />, color: "#FF6B00" },
          { label: "Rata-rata XP", value: avgXP.toLocaleString(), icon: <ChartBar size={22} />, color: "#FF9D00" },
          { label: "Lulus (Legend)", value: completedAll, icon: <ShieldCheck size={22} />, color: "#22C55E" },
          { label: "Rata-rata Streak", value: `${avgStreak} hari`, icon: <Student size={22} />, color: "#D45900" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "var(--space-5)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ color: stat.color, marginBottom: "6px" }}>{stat.icon}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{stat.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Module Completion Matrix */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", marginBottom: "var(--space-8)" }}>
        <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
          📊 Statistik Penyelesaian Per Modul
        </h3>
        <div style={{ display: "grid", gap: "10px" }}>
          {moduleStats.map((stat) => (
            <div key={stat.module}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem", marginBottom: "4px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {stat.module} — {stat.label}
                </span>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                  {stat.completed}/{stat.total} ({stat.pct}%)
                </span>
              </div>
              <div style={{ width: "100%", height: "10px", background: "var(--color-neutral-150)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <div style={{ width: `${stat.pct}%`, height: "100%", borderRadius: "var(--radius-full)", background: stat.pct >= 80 ? "#22C55E" : stat.pct >= 50 ? "#FF9D00" : "#EF4444" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: "var(--space-12)" }}>
        <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
            👥 Data Seluruh Mahasiswa
          </h3>
          <div style={{ position: "relative", width: "260px", maxWidth: "100%" }}>
            <MagnifyingGlass size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text" placeholder="Cari mahasiswa..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "var(--radius-full)", border: "1.5px solid var(--border-color)", background: "var(--bg-page)", fontSize: "0.85rem", color: "var(--text-primary)", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-page-alt)" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700 }}>#</th>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700 }}>Nama</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>XP</th>
                <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>Level</th>
                {allModuleKeys.map((k) => (
                  <th key={k} style={{ padding: "10px 6px", textAlign: "center", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.7rem" }} title={MODULE_LABELS[k]}>{k}</th>
                ))}
                <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={14} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Tidak ada data mahasiswa</td></tr>
              ) : (filteredUsers.map((u, i) => (
                <tr
                  key={u.uid}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    cursor: "pointer",
                    background: selectedUid === u.uid ? "rgba(255,107,0,0.06)" : "transparent",
                  }}
                  onClick={() => setSelectedUid(selectedUid === u.uid ? null : u.uid)}
                >
                  <td style={{ padding: "8px 12px", fontWeight: 800, color: i < 3 ? "#FFD93D" : "var(--text-muted)" }}>#{i + 1}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{u.name}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "var(--color-primary-600)" }}>{u.xp}</td>
                  <td style={{ padding: "8px 12px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.75rem" }}>{u.level}</td>
                  {allModuleKeys.map((k) => {
                    const status = u.progress[k]?.status || "locked";
                    return (
                      <td key={k} style={{ padding: "8px 6px", textAlign: "center" }}>
                        {status === "completed" ? <CheckCircle size={14} weight="fill" color="#22C55E" /> : status === "active" ? <span style={{ color: "#FF9D00", fontSize: "0.8rem" }}>●</span> : <LockKey size={12} color="var(--text-muted)" />}
                      </td>
                    );
                  })}
                  <td style={{ padding: "8px 12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "4px", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { setAwardModal(u.uid); setAwardAmount(50); }}
                        className="btn btn-sm"
                        style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(255,107,0,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-primary)" }}
                        title="Beri XP"
                      >
                        <PlusCircle size={12} /> XP
                      </button>
                      <button
                        onClick={async () => { if (confirm(`Reset progress ${u.name}?`)) await resetUserProgress(u.uid); }}
                        className="btn btn-sm"
                        style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(239,68,68,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#EF4444" }}
                        title="Reset Progress"
                      >
                        <ArrowCounterClockwise size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Student Detail Panel */}
        {selectedUser && (
          <div style={{ borderTop: "2px solid var(--color-primary-400)", background: "var(--bg-page-alt)", padding: "var(--space-6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h4 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem" }}>
                📋 Detail: {selectedUser.name}
              </h4>
              <button onClick={() => setSelectedUid(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
              <div style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>INFORMASI AKUN</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.875rem" }}>
                  <span><strong>Email:</strong> {selectedUser.email}</span>
                  <span><strong>XP:</strong> {selectedUser.xp}</span>
                  <span><strong>Level:</strong> {selectedUser.level}</span>
                  <span><strong>Streak:</strong> {selectedUser.streak || 0} hari</span>
                </div>
              </div>
              <div style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>PROGRESS PER MODUL</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {allModuleKeys.map((k) => {
                    const status = selectedUser.progress[k]?.status || "locked";
                    const subs = selectedUser.progress[k]?.completedSubModules || [];
                    return (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{k} - {MODULE_LABELS[k]}</span>
                        <span style={{ color: status === "completed" ? "#22C55E" : status === "active" ? "#FF9D00" : "var(--text-muted)", fontWeight: 600 }}>
                          {status === "completed" ? `✅ (${subs.length})` : status === "active" ? `🟡 (${subs.length})` : "🔒"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>
                BADGE ({selectedUser.badges.length}/{BADGES.length})
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {BADGES.map((b) => {
                  const earned = selectedUser.badges.includes(b.id);
                  return (
                    <span key={b.id} style={{ fontSize: "1.25rem", filter: earned ? "none" : "grayscale(100%) opacity(30%)", cursor: "pointer" }} title={`${b.name}: ${b.description}`}>
                      {b.emoji}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Award XP Modal */}
      {awardModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
          <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "360px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
            <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
              ✨ Award XP
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
              Masukkan jumlah XP untuk <strong>{allUsers.find((u) => u.uid === awardModal)?.name}</strong>
            </p>
            <input
              type="number" value={awardAmount} min={1} max={1000}
              onChange={(e) => setAwardAmount(parseInt(e.target.value) || 0)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", background: "var(--bg-page)", outline: "none", marginBottom: "var(--space-4)" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setAwardModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
              <button
                onClick={async () => {
                  await awardXP(awardModal, awardAmount);
                  setAwardModal(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Berikan XP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
