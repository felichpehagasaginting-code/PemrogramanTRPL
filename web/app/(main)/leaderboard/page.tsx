"use client";

import { useEffect } from "react";
import { useUserStore, isCreator } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { Trophy, Star, Sparkle, User, Medal } from "@phosphor-icons/react";
import { AvatarIcon } from "@/components/ui";
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { LEADERBOARD_FEATURES } from "@/lib/features";
import { soundFX } from "@/lib/audio";

export default function LeaderboardPage() {
  const { user, leaderboard, fetchLeaderboard, subscribeLeaderboardRealtime } = useUserStore();

  useEffect(() => {
    fetchLeaderboard();
    const unsub = subscribeLeaderboardRealtime();
    return () => {
      unsub();
    };
  }, [fetchLeaderboard, subscribeLeaderboardRealtime]);

  if (!user) return null;

  // Filter out Dosen Penguji from public student leaderboard
  const baseList = leaderboard.filter(
    (u) => !u.email?.includes("dosen.penguji") && u.uid !== "dosen-penguji-trpl"
  );

  // Use the synchronized real-time Firestore list
  const fullLeaderboardList = [...baseList];

  if (
    !user.isDosenPenguji &&
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
      isCreator: user.isCreator,
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
    : userRankIndex !== -1
    ? `#${userRankIndex + 1}`
    : "#1";

  return (
    <div className="section-container" style={{ maxWidth: "680px", paddingTop: "var(--space-4)" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <span className="badge badge-amber" style={{ marginBottom: "var(--space-3)" }}>
          <Trophy size={12} weight="fill" /> LEADERBOARD PLATFORM
        </span>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
          Peringkat Kelas TRPL 2026
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: "6px" }}>
          Persaingan sehat antarmaba. Selesaikan modul kuis untuk kumpulkan XP lebih cepat!
        </p>
      </div>

      {/* Class Statistics Row */}
      <div className="lb-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "var(--space-6)",
        }}
      >
        {[
          { label: "Peringkat Kamu", value: userRank, color: "var(--color-primary-500)" },
          { label: "Rata-rata XP Kelas", value: `${avgXP} XP`, color: "#FF9D00" },
          { label: "Total Mahasiswa", value: sortedList.length.toString(), color: "#22C55E" },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              padding: "16px var(--space-4)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ fontSize: "1.375rem", fontWeight: 800, color: stat.color, fontFamily: "var(--font-heading)" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginTop: "4px" }}>
              {stat.label}
            </div>
          </div>
        ))}
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
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              background: "linear-gradient(135deg, #FF6B00 0%, #F59E0B 100%)",
                              color: "#000",
                              padding: "1px 6px",
                              borderRadius: "10px",
                            }}
                          >
                            👑 Creator
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
      <FeaturePopupQueue features={LEADERBOARD_FEATURES} delay={5000} />
    </div>
  );
}
