"use client";

import { useEffect } from "react";
import { useUserStore, isCreator, isStaff, isTester } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { Trophy, Star, Sparkle, User, Medal } from "@phosphor-icons/react";
import { AvatarIcon, CreatorBadge } from "@/components/ui";
import { soundFX } from "@/lib/audio";
import { SkeletonLeaderboard } from "@/components/ui/Skeleton";

export default function LeaderboardPage() {
  const { user, leaderboard, isLeaderboardReady, fetchLeaderboard, subscribeLeaderboardRealtime } = useUserStore();

  useEffect(() => {
    fetchLeaderboard();
    const unsub = subscribeLeaderboardRealtime();
    return () => {
      unsub();
    };
  }, [fetchLeaderboard, subscribeLeaderboardRealtime]);

  if (!user || !isLeaderboardReady) return <SkeletonLeaderboard />;

  // Filter out Dosen Penguji and Testers from public student leaderboard
  const baseList = leaderboard.filter((u) => {
    if (u.email?.includes("dosen.penguji") || u.uid === "dosen-penguji-trpl") return false;
    const isCreatorUser = Boolean(u.isCreator || isCreator({ email: u.email, name: u.name }));
    const isStaffUser = Boolean(u.isStaff || isStaff({ email: u.email }));
    const isTesterUser = Boolean(u.isTester || isTester(u));
    if (isTesterUser && !isCreatorUser && !isStaffUser) return false;
    return true;
  });

  // Use the synchronized real-time Firestore list
  const fullLeaderboardList = [...baseList];

  const isCurrentUserCreator = Boolean(user.isCreator || isCreator({ email: user.email, name: user.name }));
  const isCurrentUserStaff = Boolean(user.isStaff || isStaff({ email: user.email }));
  const isCurrentUserTester = isTester(user);
  const shouldShowCurrentUser = !user.isDosenPenguji && (!isCurrentUserTester || isCurrentUserCreator || isCurrentUserStaff);

  if (
    shouldShowCurrentUser &&
    !fullLeaderboardList.some(
      (u) =>
        u.uid === user.uid ||
        (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
    )
  ) {
    fullLeaderboardList.push({
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      email: user.email,
      isCreator: isCurrentUserCreator,
      isStaff: isCurrentUserStaff,
      isTester: isCurrentUserTester,
    });
  }

  // Sort by XP desc
  const sortedList = fullLeaderboardList.sort((a, b) => b.xp - a.xp);

  // Stats calculation
  const totalXP = sortedList.reduce((sum, item) => sum + item.xp, 0);
  const avgXP = sortedList.length > 0 ? Math.round(totalXP / sortedList.length) : 0;
  const userRankIndex = sortedList.findIndex(
    (u) => u.uid === user.uid || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
  );
  const userRank = user.isDosenPenguji
    ? "Mode Dosen"
    : isCurrentUserTester && !isCurrentUserCreator && !isCurrentUserStaff
    ? "Akun Tester"
    : userRankIndex !== -1
    ? `#${userRankIndex + 1}`
    : "#1";

  return (
    <div className="section-container" style={{ maxWidth: "680px", paddingTop: "var(--space-6)" }}>
      {/* Page Header Minimalis */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
          Papan Peringkat Kelas TRPL 2026
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
          Persaingan sehat antarmahasiswa. Kumpulkan XP dari kuis dan auto-grader!
        </p>
      </div>

      {/* Single-Line Compact Stats Bar */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-full)",
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          marginBottom: "var(--space-6)",
          boxShadow: "var(--shadow-sm)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)" }}>Posisi Kamu:</span>
          <strong style={{ color: "var(--color-primary-600)", fontWeight: 800 }}>{userRank}</strong>
        </div>
        <div style={{ width: "1px", height: "16px", background: "var(--border-color)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)" }}>Rata-rata Kelas:</span>
          <strong style={{ color: "var(--text-primary)", fontWeight: 800 }}>{avgXP} XP</strong>
        </div>
        <div style={{ width: "1px", height: "16px", background: "var(--border-color)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)" }}>Total Mahasiswa:</span>
          <strong style={{ color: "#16a34a", fontWeight: 800 }}>{sortedList.length} Orang</strong>
        </div>
      </div>

      {/* Podium Top 3 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr 1fr",
          gap: "14px",
          alignItems: "end",
          marginBottom: "var(--space-8)",
        }}
        className="podium-grid"
      >
        {/* Rank 2 (Silver) */}
        {sortedList[1] && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "20px 14px",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
              minHeight: "155px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "6px" }}>
              <Medal size={36} weight="fill" color="#A0AEC0" aria-hidden="true" />
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sortedList[1].name}
            </div>
            {(sortedList[1].isCreator || isCreator({ email: sortedList[1].email, name: sortedList[1].name })) && (
              <CreatorBadge size="sm" variant="solid" style={{ marginTop: "3px" }} />
            )}
            {(sortedList[1].isStaff || isStaff({ email: sortedList[1].email })) && (
              <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "rgba(16, 185, 129, 0.12)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1px 7px", borderRadius: "10px", marginTop: "3px" }}>
                🛡️ Staff
              </span>
            )}
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {sortedList[1].level}
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-primary-600)", marginTop: "6px" }}>
              ⚡ {sortedList[1].xp} XP
            </div>
          </div>
        )}

        {/* Rank 1 (Champion Gold) */}
        {sortedList[0] && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "2px solid #FFD93D",
              borderRadius: "var(--radius-xl)",
              padding: "24px 16px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(255, 217, 61, 0.15), var(--shadow-md)",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#FFD93D", color: "#1C0A00", fontSize: "0.7rem", fontWeight: 900, padding: "3px 12px", borderRadius: "var(--radius-full)", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
              CHAMPION
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "6px" }}>
              <Trophy size={44} weight="fill" color="#FFD93D" aria-hidden="true" />
            </div>
            <div style={{ fontSize: "0.975rem", fontWeight: 900, color: "var(--text-primary)", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sortedList[0].name}
            </div>
            {(sortedList[0].isCreator || isCreator({ email: sortedList[0].email, name: sortedList[0].name })) && (
              <CreatorBadge size="sm" variant="solid" style={{ marginTop: "3px" }} />
            )}
            {(sortedList[0].isStaff || isStaff({ email: sortedList[0].email })) && (
              <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "rgba(16, 185, 129, 0.12)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1px 7px", borderRadius: "10px", marginTop: "3px" }}>
                🛡️ Staff
              </span>
            )}
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {sortedList[0].level}
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 900, color: "var(--color-primary-600)", marginTop: "6px" }}>
              ⚡ {sortedList[0].xp} XP
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {sortedList[2] && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "20px 14px",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
              minHeight: "155px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "6px" }}>
              <Medal size={36} weight="fill" color="#CD7F32" aria-hidden="true" />
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sortedList[2].name}
            </div>
            {(sortedList[2].isCreator || isCreator({ email: sortedList[2].email, name: sortedList[2].name })) && (
              <CreatorBadge size="sm" variant="solid" style={{ marginTop: "3px" }} />
            )}
            {(sortedList[2].isStaff || isStaff({ email: sortedList[2].email })) && (
              <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "rgba(16, 185, 129, 0.12)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "1px 7px", borderRadius: "10px", marginTop: "3px" }}>
                🛡️ Staff
              </span>
            )}
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {sortedList[2].level}
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-primary-600)", marginTop: "6px" }}>
              ⚡ {sortedList[2].xp} XP
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard List (Rank #4 and below) */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
          padding: "var(--space-4) 0",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "0 var(--space-6) 12px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Peringkat #4 dan Seterusnya
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Top 3 ditampilkan di Podium Atas
          </span>
        </div>

        {sortedList.slice(3).length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Trophy size={28} color="var(--text-muted)" style={{ margin: "0 auto 8px" }} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem" }}>Belum ada mahasiswa lain di peringkat #4 ke bawah.</p>
            <span style={{ fontSize: "0.75rem" }}>Selesaikan kuis dan modul untuk masuk ke papan peringkat!</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {sortedList.slice(3).map((item, idx) => {
              const rankNumber = idx + 4;
              const isSelf = item.uid === user.uid;
              return (
                <motion.div
                  key={item.uid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px var(--space-6)",
                    background: isSelf ? "rgba(255,107,0,0.06)" : "transparent",
                    borderBottom: "1px solid var(--border-color)",
                    borderLeft: isSelf ? "4px solid var(--color-primary-500)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        width: "28px",
                      }}
                    >
                      #{rankNumber}
                    </span>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--bg-page-alt)",
                        border: "1.5px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AvatarIcon id={item.avatar} size={26} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9375rem", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                        <span>{item.name}</span>
                        {isSelf && <span style={{ fontSize: "0.7rem", background: "var(--color-primary-500)", color: "white", padding: "1px 6px", borderRadius: "var(--radius-full)" }}>KAMU</span>}
                        {(item.isCreator || isCreator({ email: item.email, name: item.name })) && (
                          <CreatorBadge size="xs" variant="pill" />
                        )}
                        {(item.isStaff || isStaff({ email: item.email })) && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              background: "rgba(16, 185, 129, 0.12)",
                              color: "#10B981",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              padding: "1px 6px",
                              borderRadius: "10px",
                            }}
                          >
                            🛡️ Staff
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {item.level}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--color-primary-600)", fontSize: "0.9375rem" }}>
                      ⚡ {item.xp} XP
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .podium-grid { display: none !important; }
          .lb-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
