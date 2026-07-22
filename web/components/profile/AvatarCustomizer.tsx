"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { Sparkle, Check, X, ShieldCheck } from "@phosphor-icons/react";
import { soundFX } from "@/lib/audio";

const AVATAR_OPTIONS = [
  { id: "avatar_1", name: "Cyber Maba", emoji: "👨‍💻", bg: "linear-gradient(135deg, #06B6D4, #3B82F6)" },
  { id: "avatar_2", name: "Code Wizard", emoji: "🧙‍♂️", bg: "linear-gradient(135deg, #FF9D00, #FF6B00)" },
  { id: "avatar_3", name: "Algorithm Hero", emoji: "🦸‍♀️", bg: "linear-gradient(135deg, #22C55E, #10B981)" },
  { id: "avatar_4", name: "Python Ninja", emoji: "🥷", bg: "linear-gradient(135deg, #EC4899, #8B5CF6)" },
  { id: "avatar_5", name: "TRPL Legend", emoji: "👑", bg: "linear-gradient(135deg, #F59E0B, #D97706)" },
];

interface AvatarCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarCustomizer({ isOpen, onClose }: AvatarCustomizerProps) {
  const user = useUserStore((s) => s.user);
  const updateAvatar = useUserStore((s) => s.updateAvatar);
  const [selected, setSelected] = useState(user?.avatar || "avatar_1");

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    soundFX.playXPGain();
    await updateAvatar(selected);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkle size={20} color="var(--primary-color)" /> Kustomisasi Avatar Hero
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
          Pilih karakter avatar digital yang akan ditampilkan pada Leaderboard dan Profil kamu!
        </p>

        {/* Options Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "var(--space-6)" }}>
          {AVATAR_OPTIONS.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelected(opt.id);
                }}
                style={{
                  background: opt.bg,
                  borderRadius: "var(--radius-lg)",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: isSelected ? "3px solid #FFF" : "2px solid transparent",
                  boxShadow: isSelected ? "0 0 15px rgba(255,157,0,0.8)" : "none",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ fontSize: "2rem" }}>{opt.emoji}</div>
                <div style={{ fontSize: "0.75rem", color: "#FFF", fontWeight: 700, marginTop: "4px" }}>
                  {opt.name}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Batal
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Check size={16} /> Simpan Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
