"use client";

import { useUserStore, BADGES, isCreator } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Medal, Calendar, ShieldCheck, GameController, Star, PencilSimple, Check, X, WarningCircle } from "@phosphor-icons/react";
import { AvatarIcon, BadgeIcon, CreatorBadge } from "@/components/ui";
import { AvatarCustomizer } from "@/components/profile/AvatarCustomizer";
import { SkillRadarChart } from "@/components/profile/SkillRadarChart";
import { SkeletonProfile } from "@/components/ui/Skeleton";

const AVATARS = [
  { id: "avatar_default", emoji: "🤖", label: "Robot" },
  { id: "avatar_1", emoji: "🐱", label: "Cat" },
  { id: "avatar_2", emoji: "🦊", label: "Fox" },
  { id: "avatar_3", emoji: "🐼", label: "Panda" },
  { id: "avatar_4", emoji: "🦁", label: "Lion" },
  { id: "avatar_5", emoji: "🐸", label: "Frog" },
];

export default function ProfilePage() {
  const { user, isUserReady, updateAvatar, updateProfileName, restoreCreatorProgress } = useUserStore();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "avatar_default");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  if (!user || !isUserReady) return <SkeletonProfile />;

  const handleAvatarChange = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    updateAvatar(avatarId);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    const trimmed = editedName.trim();
    if (trimmed.length < 3) {
      setNameError("Nama lengkap minimal 3 karakter.");
      return;
    }
    if (trimmed.length > 60) {
      setNameError("Nama lengkap maksimal 60 karakter.");
      return;
    }
    if (!/[a-zA-Z]/.test(trimmed)) {
      setNameError("Nama harus mengandung huruf alfabet.");
      return;
    }

    setIsSavingName(true);
    try {
      const ok = await updateProfileName(trimmed);
      if (ok) {
        setIsEditingName(false);
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 3500);
      } else {
        setNameError("Gagal memperbarui nama. Format tidak valid.");
      }
    } catch {
      setNameError("Terjadi kesalahan saat menyimpan ke database.");
    } finally {
      setIsSavingName(false);
    }
  };

  const currentAvatarInfo = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="section-container" style={{ maxWidth: "680px", paddingTop: "var(--space-6)" }}>
      {/* Integrated Profile Card Header */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "var(--space-6)",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Avatar Icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "var(--bg-secondary)",
              border: "2px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-sm)",
              flexShrink: 0,
            }}
          >
            <AvatarIcon id={selectedAvatar} size={56} />
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            {!isEditingName ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  {user.name}
                </h2>
                <button
                  onClick={() => {
                    setEditedName(user.name);
                    setIsEditingName(true);
                    setNameError(null);
                  }}
                  className="focus-ring"
                  aria-label="Ubah nama akun profil"
                  title="Ubah nama profil"
                  style={{
                    background: "var(--bg-page-alt)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-full)",
                    padding: "3px 9px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <PencilSimple size={12} weight="bold" />
                  <span>Ubah Nama</span>
                </button>
                {isCreator(user) && (
                  <CreatorBadge
                    size="md"
                    variant="hero"
                    label="Platform Creator & Lead Architect"
                  />
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveName} style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", maxWidth: "380px", marginBottom: "4px" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => {
                      setEditedName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    maxLength={60}
                    placeholder="Nama Lengkap Mahasiswa"
                    aria-label="Nama Lengkap Mahasiswa"
                    className="focus-ring"
                    autoFocus
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      borderRadius: "var(--radius-md)",
                      border: nameError ? "1.5px solid var(--color-accent-red)" : "1.5px solid var(--border-color-strong)",
                      background: "var(--bg-page)",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSavingName || editedName.trim().length < 3}
                    className="btn btn-sm btn-primary focus-ring"
                    aria-label="Simpan perubahan nama"
                    style={{ padding: "6px 12px", gap: "4px" }}
                  >
                    <Check size={14} weight="bold" />
                    <span>{isSavingName ? "..." : "Simpan"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNameError(null);
                    }}
                    disabled={isSavingName}
                    className="btn btn-sm btn-secondary focus-ring"
                    aria-label="Batal ubah nama"
                    style={{ padding: "6px 8px" }}
                  >
                    <X size={14} weight="bold" />
                  </button>
                </div>
                {nameError && (
                  <div style={{ fontSize: "0.75rem", color: "var(--color-accent-red)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <WarningCircle size={14} weight="fill" /> {nameError}
                  </div>
                )}
              </form>
            )}

            {saveSuccessMsg && (
              <div
                role="status"
                style={{
                  fontSize: "0.75rem",
                  color: "#10B981",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "3px",
                }}
              >
                <Check size={14} weight="bold" />
                <span>Nama berhasil diperbarui dan disinkronkan ke database</span>
              </div>
            )}
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <Calendar size={16} /> Mahasiswa TRPL Angkatan 2026
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>
              {user.email}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="btn btn-sm btn-primary focus-ring"
                aria-label="Buka kustomisasi avatar"
              >
                🎨 Kustomisasi Avatar Hero
              </button>
              {isCreator(user) && (
                <button
                  onClick={() => restoreCreatorProgress()}
                  className="btn btn-sm btn-secondary focus-ring"
                  title="Pulihkan seluruh progres modul M0-M8 dan semua badges kelulusan"
                >
                  ⚡ Pulihkan Progres Penuh (M0-M8)
                </button>
              )}
            </div>
          </div>

          <AvatarCustomizer
            isOpen={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
          />

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
                aria-label={`Pilih avatar ${av.label}`}
                aria-pressed={selectedAvatar === av.id}
                title={av.label}
                className="focus-ring"
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }} className="badges-cabinet-grid">
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

      {/* Skill Radar Competency Polygon */}
      <div style={{ marginTop: "var(--space-6)" }}>
        <SkillRadarChart studentLevel={user.level || "TRPL Cadet"} />
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .badges-cabinet-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
