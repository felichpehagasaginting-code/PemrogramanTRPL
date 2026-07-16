"use client";

import { useEffect, useState, useMemo } from "react";
import { useUserStore, BADGES, LEVELS } from "@/lib/store/useUserStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ShieldCheck, Users, Trophy, WarningCircle, MagnifyingGlass,
  DownloadSimple, ArrowCounterClockwise, PlusCircle, X,
  Student, ChartBar, CheckCircle, LockKey, SignOut, Code,
  PencilSimpleLine, TrashSimple, UserPlus,
} from "@phosphor-icons/react";

const MODULE_LABELS: Record<string, string> = {
  M0: "Pre-Test", M1: "Workspace", M2: "Logika",
  M3: "Variabel", M4: "Percabangan", M5: "Perulangan",
  M6: "Fungsi", M7: "Array", M8: "Mini Project",
};

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

const INITIAL_FORM = { name: "", email: "", xp: 0 };

export default function AdminPage() {
  const { leaderboard, allUsers, fetchLeaderboard, fetchAllUsers, resetUserProgress, awardXP, addUser, updateUser, deleteUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [awardModal, setAwardModal] = useState<string | null>(null);
  const [awardAmount, setAwardAmount] = useState(50);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    Promise.all([fetchLeaderboard(), fetchAllUsers()]).finally(() => setLoading(false));
  }, [fetchLeaderboard, fetchAllUsers]);

  useEffect(() => {
    if (authenticated) {
      document.documentElement.classList.add("dark");
      return () => document.documentElement.classList.remove("dark");
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const resetForm = () => setFormData(INITIAL_FORM);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    await addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      xp: formData.xp || 0,
    });
    resetForm();
    setAddModal(false);
  };

  const handleEdit = async () => {
    if (!editUser || !formData.name.trim() || !formData.email.trim()) return;
    const target = allUsers.find((u) => u.uid === editUser);
    if (!target) return;
    const delta: Record<string, any> = {};
    if (formData.name.trim() !== target.name) delta.name = formData.name.trim();
    if (formData.email.trim() !== target.email) delta.email = formData.email.trim();
    if (formData.xp !== target.xp) {
      delta.xp = formData.xp;
      delta.level = (LEVELS.find((l) => formData.xp >= l.minXP && formData.xp <= l.maxXP) || LEVELS[0]).name;
    }
    if (Object.keys(delta).length > 0) await updateUser(editUser, delta);
    setEditUser(null);
    resetForm();
  };

  const handleDelete = async (uid: string, name: string) => {
    if (!confirm(`Hapus mahasiswa "${name}"? Data akan dihapus permanen.`)) return;
    await deleteUser(uid);
    if (selectedUid === uid) setSelectedUid(null);
  };

  const openEdit = (uid: string) => {
    const target = allUsers.find((u) => u.uid === uid);
    if (!target) return;
    setFormData({ name: target.name, email: target.email, xp: target.xp });
    setEditUser(uid);
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-page)", padding: "20px",
      }}>
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)", padding: "var(--space-8)",
          maxWidth: "380px", width: "100%", textAlign: "center",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "var(--gradient-hero)", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 16px", boxShadow: "var(--shadow-glow-soft)",
          }}>
            <ShieldCheck size={28} color="white" weight="fill" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
            Admin Panel
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-6)" }}>
            Masukkan password admin untuk melanjutkan
          </p>
          <input
            type="password" placeholder="Password admin..." value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
            autoFocus
            style={{
              width: "100%", padding: "12px 16px", borderRadius: "var(--radius-md)",
              border: `1.5px solid ${passwordError ? "#EF4444" : "var(--border-color)"}`,
              fontSize: "1rem", color: "var(--text-primary)", background: "var(--bg-page)",
              outline: "none", marginBottom: "var(--space-4)", textAlign: "center",
            }}
          />
          {passwordError && (
            <p style={{ fontSize: "0.8rem", color: "#EF4444", fontWeight: 600, marginBottom: "var(--space-3)" }}>
              Password salah!
            </p>
          )}
          <button onClick={handleLogin} className="btn btn-primary" style={{ width: "100%" }}>
            Masuk Admin Panel
          </button>
        </div>
      </div>
    );
  }

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
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      {/* Mini Navbar */}
      <header style={{
        borderBottom: "1px solid var(--border-color)", background: "var(--bg-navbar)",
        backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 90,
      }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-hero)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={16} color="white" weight="fill" />
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              Admin <span className="gradient-text">Panel</span>
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {totalStudents} mahasiswa
          </div>
        </div>
      </header>

      <div className="section-container" style={{ paddingTop: "var(--space-4)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "var(--space-6)" }}>
          <div>
            <span className="badge badge-primary"><ShieldCheck size={12} weight="fill" /> MONITORING</span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px" }}>
              Progress Mahasiswa
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Total {totalStudents} mahasiswa terdaftar
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => { resetForm(); setAddModal(true); }} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <UserPlus size={16} /> Tambah Mahasiswa
            </button>
            <button onClick={exportCSV} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <DownloadSimple size={16} /> Export CSV
            </button>
          </div>
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
            Statistik Penyelesaian Per Modul
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
              Data Seluruh Mahasiswa
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
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700 }}>Email</th>
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
                  <tr><td colSpan={15} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Tidak ada data mahasiswa</td></tr>
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
                    <td style={{ padding: "8px 12px", color: "var(--text-secondary)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{u.email}</td>
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
                          onClick={() => openEdit(u.uid)}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(6,182,212,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#06B6D4" }}
                          title="Edit"
                        >
                          <PencilSimpleLine size={12} />
                        </button>
                        <button
                          onClick={async () => { if (confirm(`Reset progress ${u.name}?`)) await resetUserProgress(u.uid); }}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(239,68,68,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#FF9D00" }}
                          title="Reset Progress"
                        >
                          <ArrowCounterClockwise size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.uid, u.name)}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(239,68,68,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#EF4444" }}
                          title="Hapus"
                        >
                          <TrashSimple size={12} />
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
                  Detail: {selectedUser.name}
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
                            {status === "completed" ? `(${subs.length})` : status === "active" ? `(${subs.length})` : "Locked"}
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

        {/* Add Modal */}
        {addModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "380px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                <UserPlus size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} /> Tambah Mahasiswa
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "var(--space-4)" }}>
                <input
                  type="text" placeholder="Nama lengkap" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="email" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="number" placeholder="XP awal (0)" value={formData.xp}
                  min={0} max={9999}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setAddModal(false); resetForm(); }} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button
                  onClick={handleAdd}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editUser && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "380px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                <PencilSimpleLine size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} /> Edit Mahasiswa
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "var(--space-4)" }}>
                <input
                  type="text" placeholder="Nama lengkap" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="email" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="number" placeholder="XP" value={formData.xp}
                  min={0} max={9999}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setEditUser(null); resetForm(); }} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button
                  onClick={handleEdit}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Award XP Modal */}
        {awardModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "360px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                Award XP
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
                Jumlah XP untuk <strong>{allUsers.find((u) => u.uid === awardModal)?.name}</strong>
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
    </div>
  );
}
