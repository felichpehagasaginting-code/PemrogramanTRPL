"use client";

import { useEffect } from "react";
import { useUserStore, BADGES, UserProgress } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  FolderOpen,
  Brain,
  SquaresFour,
  GitBranch,
  ArrowsClockwise,
  Function,
  ListNumbers,
  Rocket,
  LockKey,
  CheckCircle,
  Lightning,
  Trophy,
} from "@phosphor-icons/react";

const MODULES_META = [
  { id: "M0", code: "M0", title: "Pre-Test & Orientasi", duration: "30 mnt", icon: <Star size={22} weight="fill" />, color: "#FF9D00" },
  { id: "M1", code: "M1", title: "Dasar Komputer & Workspace", duration: "90 mnt", icon: <FolderOpen size={22} weight="fill" />, color: "#FF8C42" },
  { id: "M2", code: "M2", title: "Logika & Algoritma", duration: "2 jam", icon: <Brain size={22} weight="fill" />, color: "#FF6B00" },
  { id: "M3", code: "M3", title: "Variabel & Tipe Data", duration: "2 jam", icon: <SquaresFour size={22} weight="fill" />, color: "#06B6D4" },
  { id: "M4", code: "M4", title: "Percabangan", duration: "2.5 jam", icon: <GitBranch size={22} weight="fill" />, color: "#EF4444" },
  { id: "M5", code: "M5", title: "Perulangan", duration: "2.5 jam", icon: <ArrowsClockwise size={22} weight="fill" />, color: "#22C55E" },
  { id: "M6", code: "M6", title: "Fungsi & Prosedur", duration: "2.5 jam", icon: <Function size={22} weight="fill" />, color: "#D45900" },
  { id: "M7", code: "M7", title: "Array & List", duration: "2 jam", icon: <ListNumbers size={22} weight="fill" />, color: "#FF8C42" },
  { id: "M8", code: "M8", title: "Mini Project", duration: "3 jam", icon: <Rocket size={22} weight="fill" />, color: "#FF6B00" },
];

export default function DashboardPage() {
  const { user, leaderboard, fetchLeaderboard } = useUserStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (!user) return null;

  // Calculate completed modules percentage
  const moduleKeys = Object.keys(user.progress);
  const completedCount = moduleKeys.filter(
    (key) => user.progress[key]?.status === "completed"
  ).length;
  const percentage = Math.round((completedCount / moduleKeys.length) * 100);

  // Find user rank
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);
  const userRankIndex = sortedLeaderboard.findIndex((u) => u.uid === user.uid);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : leaderboard.length + 1;

  return (
    <div className="section-container" style={{ paddingTop: "var(--space-4)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr",
          gap: "var(--space-8)",
        }}
        className="dashboard-grid"
      >
        {/* Left: Main Progress and Modules */}
        <div>
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "var(--gradient-hero)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6)",
              color: "white",
              boxShadow: "var(--shadow-card)",
              marginBottom: "var(--space-8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                👋 Selamat Datang
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.875rem",
                  fontWeight: 800,
                  color: "#FFF8F2",
                  margin: "8px 0 4px",
                }}
              >
                Halo, {user.name}!
              </h2>
              <p style={{ color: "rgba(255, 250, 246, 0.8)", fontSize: "0.9375rem" }}>
                Saatnya melanjutkan petualangan kodingmu hari ini. Kamu ada di rank **#{userRank}**.
              </p>
            </div>
            {/* Level badge */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4) var(--space-6)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)" }}>
                Level Saat Ini
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
                {user.level}
              </div>
            </div>
          </motion.div>

          {/* Overall Progress */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-6)",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "var(--space-8)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Progres Kurikulum Matrikulasi
              </h3>
              <span style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--color-primary-600)" }}>
                {percentage}% Selesai
              </span>
            </div>
            {/* Bar */}
            <div style={{ width: "100%", height: "10px", background: "var(--color-neutral-150)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: "var(--gradient-hero)",
                  borderRadius: "var(--radius-full)",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
              <span>M0: Orientasi</span>
              <span>{completedCount} dari 9 Modul Selesai</span>
              <span>M8: Mini Project</span>
            </div>
          </div>

          {/* Module list heading */}
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
            Daftar Modul Matrikulasi
          </h3>

          {/* Modules Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-4)", marginBottom: "var(--space-12)" }}>
            {MODULES_META.map((mod, index) => {
              const prog: { status: "locked" | "active" | "completed" } = user.progress[mod.id] || { status: "locked" };
              const isLocked = prog.status === "locked";
              const isCompleted = prog.status === "completed";

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: isLocked
                        ? "1px dashed var(--border-color)"
                        : isCompleted
                        ? "1px solid rgba(34, 197, 94, 0.25)"
                        : "2px solid var(--color-primary-400)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-4) var(--space-5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: isLocked ? "none" : "var(--shadow-sm)",
                      filter: isLocked ? "grayscale(100%) opacity(60%)" : "none",
                      transition: "transform var(--transition-base), box-shadow var(--transition-base)",
                    }}
                    className={!isLocked ? "hover-scale-card" : ""}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", minWidth: 0 }}>
                      {/* Icon container */}
                      <div
                        style={{
                          width: "46px",
                          height: "46px",
                          borderRadius: "var(--radius-md)",
                          background: isLocked ? "var(--color-neutral-150)" : `${mod.color}15`,
                          color: isLocked ? "var(--text-muted)" : mod.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: isLocked ? "none" : `1px solid ${mod.color}35`,
                        }}
                      >
                        {mod.icon}
                      </div>

                      {/* Info */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", color: mod.color, fontWeight: 700 }}>
                            {mod.code}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            ⏱ {mod.duration}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {mod.title}
                        </h4>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      {isLocked ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>
                          <LockKey size={16} /> Terkunci
                        </div>
                      ) : isCompleted ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#15803D", fontSize: "0.8rem", fontWeight: 700 }}>
                            <CheckCircle size={16} weight="fill" /> Selesai
                          </span>
                          <Link href={`/learn/${mod.id}`} className="btn btn-secondary btn-sm">
                            Ulangi
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/learn/${mod.id}`} className="btn btn-primary btn-sm">
                          Mulai Belajar <Lightning size={14} weight="fill" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Leaderboard, Stats, & Badges */}
        <div>
          {/* Stats card */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-5)",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-4)" }}>
              📊 STATS KAMU
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary-600)" }}>{user.xp}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Total XP</div>
              </div>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary-600)" }}>{user.badges.length}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Badge Didapat</div>
              </div>
            </div>
          </div>

          {/* Mini Leaderboard */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-5)",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-4)" }}>
              🏆 TOP LEADERBOARD
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sortedLeaderboard.map((item, idx) => (
                <div
                  key={item.uid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px",
                    borderRadius: "var(--radius-md)",
                    background: item.uid === user.uid ? "rgba(255,107,0,0.08)" : "transparent",
                    border: item.uid === user.uid ? "1px solid var(--border-color-strong)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: idx === 0 ? "#FFD93D" : idx === 1 ? "#9E9E9E" : idx === 2 ? "#CD7F32" : "var(--text-muted)", width: "16px" }}>
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary-600)" }}>
                    ⚡ {item.xp} XP
                  </span>
                </div>
              ))}
            </div>
            <Link href="/leaderboard" style={{ display: "block", textAlign: "center", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary-500)", textDecoration: "none", marginTop: "12px" }}>
              Lihat Leaderboard Lengkap →
            </Link>
          </div>

          {/* Badges sidebar */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-5)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-4)" }}>
              🏅 BADGE KAMU
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {BADGES.map((badge) => {
                const isEarned = user.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={badge.name + ": " + badge.description}
                    style={{
                      background: isEarned ? "var(--bg-page-alt)" : "var(--color-neutral-100)",
                      borderRadius: "var(--radius-md)",
                      aspectRatio: "1/1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      filter: isEarned ? "none" : "grayscale(100%) opacity(30%)",
                      border: isEarned ? `1px solid ${badge.color}35` : "1px dashed var(--border-color)",
                    }}
                  >
                    {badge.emoji}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
