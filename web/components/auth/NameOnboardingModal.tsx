"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IdentificationCard, CheckCircle, WarningCircle, Sparkle } from "@phosphor-icons/react";
import { useUserStore } from "@/lib/store/useUserStore";

export function NameOnboardingModal() {
  const user = useUserStore((s) => s.user);
  const isUserReady = useUserStore((s) => s.isUserReady);
  const updateProfileName = useUserStore((s) => s.updateProfileName);

  // Check if onboarding is needed: user must be logged in, ready, not creator, not dosen, and hasCustomizedName is false
  const isNeeded = Boolean(
    user &&
    isUserReady &&
    !user.isCreator &&
    !user.isDosenPenguji &&
    !user.hasCustomizedName
  );

  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input with user's existing name if it's not a generic placeholder
  useEffect(() => {
    if (user && isNeeded) {
      const currentName = user.name || "";
      if (
        currentName &&
        currentName !== "Maba TRPL" &&
        currentName !== "Maba TRPL 2026" &&
        !currentName.startsWith("user-")
      ) {
        setNameInput(currentName);
      } else {
        setNameInput("");
      }
    }
  }, [user?.uid, isNeeded]);

  // Focus input field when modal opens
  useEffect(() => {
    if (isNeeded) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isNeeded]);

  if (!isNeeded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = nameInput.trim();
    if (trimmed.length < 3) {
      setError("Nama lengkap harus memiliki minimal 3 karakter.");
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 60) {
      setError("Nama lengkap maksimal 60 karakter.");
      inputRef.current?.focus();
      return;
    }
    if (!/[a-zA-Z]/.test(trimmed)) {
      setError("Nama harus mengandung setidaknya huruf alfabet.");
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfileName(trimmed);
      if (success) {
        setIsSuccess(true);
        // Modal will automatically unmount because hasCustomizedName becomes true in store
      } else {
        setError("Gagal menyimpan nama. Pastikan format nama sudah sesuai.");
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan ke database. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        aria-describedby="onboarding-modal-desc"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "rgba(0, 0, 0, 0.82)",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-color-strong)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              padding: "24px 24px 16px",
              borderBottom: "1px solid var(--border-color)",
              background: "var(--bg-page-alt)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255, 107, 0, 0.12)",
                border: "1.5px solid var(--color-primary-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--color-primary-500)",
              }}
            >
              <IdentificationCard size={28} weight="duotone" />
            </div>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-primary-500)",
                  marginBottom: "2px",
                }}
              >
                <Sparkle size={13} weight="fill" />
                Registrasi Identitas Mahasiswa
              </div>
              <h2
                id="onboarding-modal-title"
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Masukkan Nama Lengkap Anda
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
            <p
              id="onboarding-modal-desc"
              style={{
                margin: "0 0 18px",
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.55,
              }}
            >
              Sebelum memulai pembelajaran matrikulasi, mohon isi <strong>Nama Lengkap Asli</strong> sesuai identitas mahasiswa (KRS / KTP). Nama ini akan digunakan secara resmi pada <strong>Sertifikat Kelulusan</strong> dan <strong>Papan Peringkat</strong>.
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="maba-real-name-input"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                Nama Lengkap Mahasiswa <span style={{ color: "var(--color-accent-red)" }}>*</span>
              </label>
              <input
                ref={inputRef}
                id="maba-real-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={60}
                placeholder="Contoh: Muhammad Rayhan Pratama"
                disabled={isSubmitting || isSuccess}
                autoComplete="name"
                className="focus-ring"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: error
                    ? "1.5px solid var(--color-accent-red)"
                    : "1.5px solid var(--border-color-strong)",
                  background: "var(--bg-page)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s ease",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "6px",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                <span>Bukan username game atau singkatan samaran.</span>
                <span>{nameInput.length}/60</span>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid var(--color-accent-red)",
                  color: "var(--color-accent-red)",
                  fontSize: "0.82rem",
                  marginBottom: "18px",
                }}
              >
                <WarningCircle size={18} weight="fill" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div
                role="status"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid #10B981",
                  color: "#10B981",
                  fontSize: "0.82rem",
                  marginBottom: "18px",
                }}
              >
                <CheckCircle size={18} weight="fill" />
                <span>Identitas berhasil disimpan! Menyiapkan dasbor...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isSuccess || nameInput.trim().length < 3}
              className="focus-ring"
              style={{
                width: "100%",
                padding: "12px 18px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: "var(--color-primary-500)",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 800,
                fontFamily: "var(--font-heading)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor:
                  isSubmitting || isSuccess || nameInput.trim().length < 3
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  isSubmitting || isSuccess || nameInput.trim().length < 3
                    ? 0.6
                    : 1,
                boxShadow: "0 4px 14px rgba(255, 107, 0, 0.3)",
                transition: "opacity 0.15s ease, transform 0.15s ease",
              }}
            >
              {isSubmitting ? (
                <span>Menyimpan ke Database...</span>
              ) : isSuccess ? (
                <>
                  <CheckCircle size={18} weight="bold" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <span>Konfirmasi &amp; Lanjutkan ke Platform</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
