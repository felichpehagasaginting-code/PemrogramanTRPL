"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { Trophy, Star, Sparkle, User, Medal } from "@phosphor-icons/react";

export default function LeaderboardPage() {
  const { user, leaderboard, fetchLeaderboard } = useUserStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (!user) return null;

  // Add active user into leaderboard list to display ranks correctly
  const fullLeaderboardList = [...leaderboard];
  if (!fullLeaderboardList.some((u) => u.uid === user.uid)) {
    fullLeaderboardList.push({
      uid: user.uid,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
    });
  }

  // Sort by XP desc
  const sortedList = fullLeaderboardList.sort((a, b) => b.xp - a.xp);

  // Stats calculation
  const totalXP = sortedList.reduce((sum, item) => sum + item.xp, 0);
  const avgXP = Math.round(totalXP / sortedList.length);

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "var(--space-6)",
        }}
      >
        {[
          { label: "Peringkat Kamu", value: `#${sortedList.findIndex((u) => u.uid === user.uid) + 1}`, color: "var(--color-primary-500)" },
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
          gridTemplateColumns: "1fr 1.2fr 1fr",
          gap: "12px",
          alignItems: "end",
          marginBottom: "var(--space-8)",
        }}
        className="podium-grid"
      >
        {/* Rank 2 */}
        {sortedList[1] && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "4px" }}>🥈</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sortedList[1].name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {sortedList[1].level}
            </div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--color-primary-600)", marginTop: "4px" }}>
              ⚡ {sortedList[1].xp} XP
            </div>
          </div>
        )}

        {/* Rank 1 */}
        {sortedList[0] && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "2px solid #FFD93D",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              textAlign: "center",
              boxShadow: "var(--shadow-md), var(--shadow-glow-soft)",
              height: "170px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#FFD93D", color: "#1C0A00", fontSize: "0.7rem", fontWeight: 900, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
              CHAMPION
            </div>
            <div style={{ fontSize: "2.5rem", marginBottom: "4px" }}>👑</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sortedList[0].name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {sortedList[0].level}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 900, color: "var(--color-primary-600)", marginTop: "6px" }}>
              ⚡ {sortedList[0].xp} XP
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {sortedList[2] && (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "1.75rem", marginBottom: "4px" }}>🥉</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sortedList[2].name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              {sortedList[2].level}
            </div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--color-primary-600)", marginTop: "4px" }}>
              ⚡ {sortedList[2].xp} XP
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard List */}
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          {sortedList.map((item, idx) => {
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
                      color: idx === 0 ? "#FFD93D" : idx === 1 ? "#9E9E9E" : idx === 2 ? "#CD7F32" : "var(--text-muted)",
                      width: "24px",
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "var(--color-neutral-150)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <User size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
                      {item.name} {isSelf && <span style={{ fontSize: "0.7rem", background: "var(--color-primary-500)", color: "white", padding: "1px 6px", borderRadius: "var(--radius-full)", marginLeft: "4px" }}>KAMU</span>}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.level}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkle size={16} color="var(--color-primary-500)" weight="fill" />
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--color-primary-600)", fontSize: "0.9375rem" }}>
                    {item.xp} XP
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .podium-grid { display: none !important; }
        }
      `}</style>
    </div>
  );
}
