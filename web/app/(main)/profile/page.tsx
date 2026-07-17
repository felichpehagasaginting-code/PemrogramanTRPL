"use client";

import { useUserStore, BADGES } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Medal, Calendar, ShieldCheck, GameController, Star } from "@phosphor-icons/react";
import { AvatarIcon, BadgeIcon } from "@/components/ui";
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { PROFILE_FEATURES } from "@/lib/features";

const AVATARS = [
  { id: "avatar_default", emoji: "🤖", label: "Robot" },
  { id: "avatar_1", emoji: "🐱", label: "Cat" },
  { id: "avatar_2", emoji: "🦊", label: "Fox" },
  { id: "avatar_3", emoji: "🐼", label: "Panda" },
  { id: "avatar_4", emoji: "🦁", label: "Lion" },
  { id: "avatar_5", emoji: "🐸", label: "Frog" },
];

export default function ProfilePage() {
  const { user, updateAvatar } = useUserStore();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "avatar_default");

  if (!user) return null;

  const handleAvatarChange = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    updateAvatar(avatarId);
  };

  const currentAvatarInfo = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="section-container" style={{ maxWidth: "680px", paddingTop: "var(--space-4)" }}>
      {/* Cover / Profile Banner */}
      <div
        style={{
          background: "var(--gradient-hero)",
          height: "140px",
          borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
          position: "relative",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Avatar badge floating */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "var(--space-6)",
            width: "84px",
            height: "84px",
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "4px solid var(--bg-page)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-md)",
            zIndex: 2,
          }}
        >
          <AvatarIcon id={selectedAvatar} size={64} />
        </div>
      </div>

      {/* Profile Details Container */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
          padding: "var(--space-12) var(--space-6) var(--space-6)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "var(--space-8)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {user.name}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <Calendar size={16} /> Mahasiswa TRPL Angkatan 2026
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>
              {user.email}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="badge badge-primary">
              <ShieldCheck size={12} weight="fill" /> {user.level}
            </span>
            <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-primary-600)", marginTop: "4px" }}>
              ⚡ {user.xp} XP
            </div>
          </div>
        </div>

        {/* Choose Avatar section */}
        <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "var(--space-6)", paddingTop: "var(--space-4)" }}>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px" }}>
            PILIH AVATAR KAMU
          </h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => handleAvatarChange(av.id)}
                style={{
                  background: selectedAvatar === av.id ? "rgba(255,107,0,0.1)" : "var(--bg-page-alt)",
                  border: selectedAvatar === av.id ? "2px solid var(--color-primary-500)" : "1.5px solid var(--border-color)",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all var(--transition-fast)",
                }}
                title={av.label}
              >
                <AvatarIcon id={av.id} size={32} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Cabinet */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "var(--space-12)",
        }}
      >
        <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "var(--space-5)" }}>
          🏅 LEMARI BADGE MATRIKULASI ({user.badges.length} / 13)
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="badges-cabinet-grid">
          {BADGES.map((badge) => {
            const isEarned = user.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                style={{
                  background: isEarned ? "var(--bg-page-alt)" : "var(--color-neutral-100)",
                  border: isEarned ? `1.5px solid ${badge.color}35` : "1px dashed var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-3) var(--space-4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  filter: isEarned ? "none" : "grayscale(100%) opacity(50%)",
                  transition: "all var(--transition-fast)",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BadgeIcon id={badge.id} color={badge.color} size={48} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: isEarned ? "var(--text-primary)" : "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {badge.name}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4, marginTop: "2px" }}>
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .badges-cabinet-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <FeaturePopupQueue features={PROFILE_FEATURES} delay={5000} />
    </div>
  );
}
