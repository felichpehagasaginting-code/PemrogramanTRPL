"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore, BADGES, isCreator } from "@/lib/store/useUserStore";
import { MODULES_META } from "@/lib/content/modules-data";
import Link from "next/link";
import { LockKey, CheckCircle, Lightning, Trophy, ChartBar, Medal, Rocket, FileText, Sparkle } from "@phosphor-icons/react";
import { BadgeIcon } from "@/components/ui";
import { SkillTree } from "@/components/learning/SkillTree";
import { DailyStreakWidget } from "@/components/dashboard/DailyStreakWidget";
import { SkeletonDashboard } from "@/components/ui/Skeleton";

const moduleIconMap: Record<string, React.ReactNode> = {
  M0: <Lightning size={22} weight="fill" />, M1: <Lightning size={22} weight="fill" />,
  M2: <Lightning size={22} weight="fill" />, M3: <Lightning size={22} weight="fill" />,
  M4: <Lightning size={22} weight="fill" />, M5: <Lightning size={22} weight="fill" />,
  M6: <Lightning size={22} weight="fill" />, M7: <Lightning size={22} weight="fill" />,
  M8: <Rocket size={22} weight="fill" />,
};

export default function DashboardPage() {
  const user = useUserStore((s) => s.user);
  const isUserReady = useUserStore((s) => s.isUserReady);
  const isLeaderboardReady = useUserStore((s) => s.isLeaderboardReady);
  const leaderboard = useUserStore((s) => s.leaderboard);
  const fetchLeaderboard = useUserStore((s) => s.fetchLeaderboard);
  const subscribeLeaderboardRealtime = useUserStore((s) => s.subscribeLeaderboardRealtime);

  const [skillTreeOpen, setSkillTreeOpen] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    const unsub = subscribeLeaderboardRealtime();
    return () => {
      unsub();
    };
  }, [fetchLeaderboard, subscribeLeaderboardRealtime]);

  if (!user || !isUserReady || !isLeaderboardReady) {
    return <SkeletonDashboard />;
  }

  // Calculate completed modules percentage
  const moduleKeys = Object.keys(user.progress);
  const completedCount = moduleKeys.filter(
    (key) => user.progress[key]?.status === "completed"
  ).length;
  const percentage = Math.round((completedCount / moduleKeys.length) * 100);

  // Filter out Dosen Penguji and prepare synchronized leaderboard
  const baseLeaderboard = leaderboard.filter(
    (u) => !u.email?.includes("dosen.penguji") && u.uid !== "dosen-penguji-trpl"
  );
  const syncedLeaderboard = [...baseLeaderboard];

  if (
    !user.isDosenPenguji &&
    !syncedLeaderboard.some(
      (u) =>
        u.uid === user.uid ||
        (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
    )
  ) {
    syncedLeaderboard.push({
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      email: user.email,
      isCreator: user.isCreator,
    });
  }

  const sortedLeaderboard = syncedLeaderboard.sort((a, b) => b.xp - a.xp).slice(0, 5);
  const userRankIndex = syncedLeaderboard.findIndex(
    (u) => u.uid === user.uid || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
  );
  const userRank = user.isDosenPenguji ? "Dosen" : userRankIndex !== -1 ? userRankIndex + 1 : 1;

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
          {/* Compact Executive Summary Card */}
          <div
            className="fade-in"
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-5) var(--space-6)",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "var(--space-6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                    Halo, {user.name}! 👋
                  </h2>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(255,107,0,0.1)", color: "var(--color-primary-600)" }}>
                    Rank #{userRank}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "4px 0 0" }}>
                  Lanjutkan modul matrikulasi TRPL kodingmu hari ini.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Level & XP</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {user.level} <span style={{ fontSize: "0.8rem", color: "var(--color-primary-600)", fontWeight: 700 }}>({user.xp} XP)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar Tipis & Ramping */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", marginBottom: "6px" }}>
                <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                  Progres Kurikulum ({completedCount}/9 Modul)
                </span>
                <span style={{ fontWeight: 800, color: "var(--color-primary-600)" }}>
                  {percentage}% Selesai
                </span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "var(--color-neutral-150)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: "var(--gradient-hero)",
                    borderRadius: "var(--radius-full)",
                  }}
                />
              </div>
            </div>

            {/* Evaluasi Standar (Pre-Test & Post-Test Side-by-Side) */}
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                background: "var(--bg-page-alt)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "24px", height: "18px", position: "relative" }}>
                    <Image src="/images/logo_kiri_cwe.png" alt="Logo CWE" fill style={{ objectFit: "contain" }} />
                  </div>
                  <div style={{ width: "18px", height: "18px", position: "relative" }}>
                    <Image src="/images/logo_kanan_trpl.png" alt="Logo TRPL" fill style={{ objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    Evaluasi Standar Matrikulasi TRPL
                  </span>
                </div>
                {/* Certificate inline trigger */}
                {(() => {
                  const requiredModules = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];
                  const allDone = requiredModules.every((k) => user.progress?.[k]?.status === "completed");
                  const preDone = Boolean(user.tests?.preTest?.completed);
                  const postDone = Boolean(user.tests?.postTest?.completed);
                  const isEligible = allDone && preDone && postDone;
                  return (
                    <Link
                      href="/certificate"
                      style={{
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        color: isEligible ? "#16a34a" : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        textDecoration: "none",
                      }}
                    >
                      <Trophy size={14} weight="fill" color={isEligible ? "#16a34a" : "var(--text-muted)"} />
                      {isEligible ? "Klaim Sertifikat 🎓" : "Status Sertifikat"}
                    </Link>
                  );
                })()}
              </div>

              {/* Side-by-side Dual Cards for Pre-Test & Post-Test */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Pre-Test Card */}
                {(() => {
                  const isPreDone = Boolean(user.tests?.preTest?.completed);
                  const prePct = user.tests?.preTest?.percentage ?? 0;
                  return (
                    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>PRE-TEST (M0)</span>
                        {isPreDone ? (
                          <span style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700, background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                            Selesai ({prePct}%)
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.68rem", color: "#d97706", fontWeight: 700, background: "rgba(245,158,11,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                            Wajib
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Diagnostik Pemetaan
                      </div>
                      <Link
                        href="/pre-test"
                        className="btn btn-sm btn-secondary"
                        style={{ marginTop: "8px", width: "100%", fontSize: "0.72rem", padding: "4px" }}
                      >
                        {isPreDone ? "Tinjau Hasil Pre-Test" : "Mulai Pre-Test"}
                      </Link>
                    </div>
                  );
                })()}

                {/* Post-Test Card */}
                {(() => {
                  const isPreDone = Boolean(user.tests?.preTest?.completed);
                  const isPostDone = Boolean(user.tests?.postTest?.completed);
                  const postPct = user.tests?.postTest?.percentage ?? 0;
                  return (
                    <div style={{
                      background: "var(--bg-card)",
                      border: isPostDone ? "1px solid rgba(34,197,94,0.3)" : !isPreDone ? "1px dashed var(--border-color)" : "1px solid var(--color-primary-400)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 12px",
                      opacity: !isPreDone ? 0.6 : 1,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>POST-TEST AKHIR</span>
                        {isPostDone ? (
                          <span style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700, background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                            Lulus ({postPct}%)
                          </span>
                        ) : isPreDone ? (
                          <span style={{ fontSize: "0.68rem", color: "var(--color-primary-600)", fontWeight: 700, background: "rgba(255,107,0,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                            Terbuka
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            Terkunci
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Ujian Evaluasi Akhir
                      </div>
                      {isPreDone ? (
                        <Link
                          href="/post-test"
                          className="btn btn-sm btn-primary"
                          style={{ marginTop: "8px", width: "100%", fontSize: "0.72rem", padding: "4px" }}
                        >
                          {isPostDone ? "Lihat Hasil Post-Test" : "Mulai Post-Test 🚀"}
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="btn btn-sm btn-secondary"
                          style={{ marginTop: "8px", width: "100%", fontSize: "0.72rem", padding: "4px", opacity: 0.5, cursor: "not-allowed" }}
                        >
                          Selesaikan Pre-Test Dulu
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Collapsible Skill Tree Toggle */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <button
              onClick={() => setSkillTreeOpen(!skillTreeOpen)}
              className="btn btn-sm btn-secondary"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 14px",
                fontSize: "0.82rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                🌳 Peta Jalur Kompetensi (Skill Tree)
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {skillTreeOpen ? "▲ Tutup Peta" : "▼ Tampilkan Peta"}
              </span>
            </button>
            {skillTreeOpen && (
              <div style={{ marginTop: "12px" }}>
                <SkillTree progress={user.progress} />
              </div>
            )}
          </div>

          {/* Module list heading */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)", flexWrap: "wrap", gap: "8px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Daftar Modul Matrikulasi
            </h3>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "4px 10px", borderRadius: "var(--radius-full)" }}>
              2 Fase Pembelajaran Terarah
            </span>
          </div>

          {/* Group Fase 1 */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)", flexWrap: "wrap", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary-500)" }}></span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Fase 1: Live Interactive Workshop (4–6 Jam)
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--color-primary-500)", fontWeight: 700 }}>
                Dipandu Ketua &amp; Staff Divisi
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-3)" }}>
              {MODULES_META.filter((m) => m.phase === "live").map((mod) => {
                const prog: { status: "locked" | "active" | "completed" } = user.progress[mod.id] || { status: "locked" };
                const isLocked = prog.status === "locked";
                const isCompleted = prog.status === "completed";

                return (
                  <div key={mod.id} className="fade-in">
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
                      className={"module-card" + (!isLocked ? " hover-scale-card" : "")}
                    >
                      <div className="module-card-inner" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", minWidth: 0 }}>
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
                          {moduleIconMap[mod.id] || <Lightning size={22} weight="fill" />}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", color: mod.color, fontWeight: 700 }}>
                              {mod.code}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--color-primary-500)", background: "rgba(255, 107, 0, 0.08)", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                              Live Sesi
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

                      <div>
                        {isLocked ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>
                            <LockKey size={16} /> Terkunci
                          </div>
                        ) : isCompleted ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-accent-green)", fontSize: "0.8rem", fontWeight: 700 }}>
                              <CheckCircle size={16} weight="fill" /> Selesai
                            </span>
                            <Link href={`/learn/${mod.id}`} className="btn btn-secondary btn-sm focus-ring" aria-label={`Ulangi modul ${mod.code}`}>
                              Ulangi
                            </Link>
                          </div>
                        ) : (
                          <Link href={`/learn/${mod.id}`} className="btn btn-primary btn-sm focus-ring" aria-label={`Mulai belajar modul ${mod.code}: ${mod.title}`}>
                            Mulai Belajar <Lightning size={14} weight="fill" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Fase 2 */}
          <div style={{ marginBottom: "var(--space-12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)", flexWrap: "wrap", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }}></span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Fase 2: Guided Independent Mastery
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#22C55E", fontWeight: 700 }}>
                Mandiri di Asrama + Auto-Grader
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-3)" }}>
              {MODULES_META.filter((m) => m.phase === "independent").map((mod) => {
                const prog: { status: "locked" | "active" | "completed" } = user.progress[mod.id] || { status: "locked" };
                const isLocked = prog.status === "locked";
                const isCompleted = prog.status === "completed";

                return (
                  <div key={mod.id} className="fade-in">
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
                      className={"module-card" + (!isLocked ? " hover-scale-card" : "")}
                    >
                      <div className="module-card-inner" style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", minWidth: 0 }}>
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
                          {moduleIconMap[mod.id] || <Lightning size={22} weight="fill" />}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", color: mod.color, fontWeight: 700 }}>
                              {mod.code}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "#22C55E", background: "rgba(34, 197, 94, 0.08)", padding: "1px 6px", borderRadius: "4px", fontWeight: 600 }}>
                              Tugas Asrama
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

                      <div>
                        {isLocked ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>
                            <LockKey size={16} /> Terkunci
                          </div>
                        ) : isCompleted ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-accent-green)", fontSize: "0.8rem", fontWeight: 700 }}>
                              <CheckCircle size={16} weight="fill" /> Selesai
                            </span>
                            <Link href={`/learn/${mod.id}`} className="btn btn-secondary btn-sm focus-ring" aria-label={`Ulangi modul ${mod.code}`}>
                              Ulangi
                            </Link>
                          </div>
                        ) : (
                          <Link href={`/learn/${mod.id}`} className="btn btn-primary btn-sm focus-ring" aria-label={`Mulai belajar modul ${mod.code}: ${mod.title}`}>
                            Mulai Belajar <Lightning size={14} weight="fill" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Leaderboard, Stats, & Badges */}
        <div>
          {/* Daily Streak & Meme Widget */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <DailyStreakWidget streak={user.streak || 1} />
          </div>

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
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "6px" }}>
              <ChartBar size={18} weight="fill" color="var(--color-primary-500)" /> STATS KAMU
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
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Trophy size={18} weight="fill" color="var(--color-primary-500)" /> PAPAN PERINGKAT
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
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
                      {item.name}
                      {(item.isCreator || isCreator({ email: item.email, name: item.name })) && (
                        <span title="Platform Creator" style={{ fontSize: "0.7rem", background: "linear-gradient(135deg, #FF6B00, #F59E0B)", color: "#000", padding: "1px 6px", borderRadius: "10px", fontWeight: 800 }}>👑 Creator</span>
                      )}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary-600)" }}>
                    ⚡ {item.xp} XP
                  </span>
                </div>
              ))}
            </div>
            <Link href="/leaderboard" style={{ display: "block", textAlign: "center", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary-500)", textDecoration: "none", marginTop: "12px" }}>
              Lihat Semua →
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
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Medal size={18} weight="fill" color="var(--color-primary-500)" /> BADGE KAMU
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {BADGES.map((badge) => {
                const isEarned = user.badges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={badge.name + ": " + badge.description}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      filter: isEarned ? "none" : "grayscale(100%) opacity(30%)",
                      aspectRatio: "1/1",
                    }}
                  >
                    <BadgeIcon id={badge.id} color={badge.color} size={48} />
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
        @media (max-width: 640px) {
          .module-card { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
          .module-card-inner { min-width: 0 !important; }
          .module-card h4 { white-space: normal !important; }
        }
      `}</style>
    </div>
  );
}
