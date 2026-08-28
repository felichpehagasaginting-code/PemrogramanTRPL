"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LockKey, Backspace, X, ShieldCheck, CheckCircle } from "@phosphor-icons/react";
import { useUserStore } from "@/lib/store/useUserStore";

export const DOSEN_SECRET_PIN = "1213";

interface DosenPinDialpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DosenPinDialpadModal({
  isOpen,
  onClose,
  onSuccess,
}: DosenPinDialpadModalProps) {
  const router = useRouter();
  const loginAsDosenPenguji = useUserStore((s) => s.loginAsDosenPenguji);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  const handleKeyPress = useCallback((digit: string) => {
    setError(null);
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      return prev + digit;
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setError(null);
    setPin("");
  }, []);

  // Validate when 4 digits are reached
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === DOSEN_SECRET_PIN) {
        setIsSuccess(true);
        setError(null);
        setTimeout(() => {
          loginAsDosenPenguji(pin);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin");
          }
          onClose();
        }, 600);
      } else {
        setShake(true);
        setError("PIN salah! Akses khusus Dosen Penguji.");
        setTimeout(() => {
          setShake(false);
          setPin("");
        }, 500);
      }
    }
  }, [pin, loginAsDosenPenguji, onSuccess, onClose, router]);

  // Physical keyboard listener
  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError(null);
      setIsSuccess(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyPress, handleBackspace, onClose]);

  const numpadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["C", "0", "DEL"],
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            padding: "20px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: shake ? [-10, 10, -8, 8, 0] : 0,
            }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              scale: { type: "spring", damping: 25, stiffness: 300 },
              y: { type: "spring", damping: 25, stiffness: 300 },
              opacity: { duration: 0.2 },
              x: { duration: 0.35, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "360px",
              background: "var(--bg-card)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="btn btn-sm btn-ghost"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                color: "var(--text-muted)",
                borderRadius: "50%",
                padding: "6px",
              }}
            >
              <X size={18} />
            </button>

            {/* Header Icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "18px",
                background: isSuccess
                  ? "rgba(16, 185, 129, 0.15)"
                  : "var(--gradient-hero)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
                boxShadow: isSuccess
                  ? "0 0 20px rgba(16, 185, 129, 0.4)"
                  : "var(--shadow-glow-soft)",
                color: isSuccess ? "#10B981" : "#ffffff",
                transition: "all 0.3s ease",
              }}
            >
              {isSuccess ? (
                <CheckCircle size={32} weight="fill" />
              ) : (
                <ShieldCheck size={32} weight="fill" />
              )}
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: "0 0 4px",
                textAlign: "center",
              }}
            >
              {isSuccess ? "Akses Terbuka!" : "Akses Dosen Penguji"}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                margin: "0 0 20px",
                textAlign: "center",
              }}
            >
              {isSuccess
                ? "Selamat datang, Dosen Penguji TRPL."
                : "Masukkan 4 digit PIN Dosen untuk membuka panel."}
            </p>

            {/* 4-Digit Indicator Circles */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              {[0, 1, 2, 3].map((idx) => {
                const filled = idx < pin.length;
                return (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: filled ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.15 }}
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: `2px solid ${
                        isSuccess
                          ? "#10B981"
                          : filled
                          ? "var(--color-primary-500)"
                          : "var(--border-color)"
                      }`,
                      background: isSuccess
                        ? "#10B981"
                        : filled
                        ? "var(--color-primary-500)"
                        : "transparent",
                      boxShadow: filled
                        ? `0 0 10px ${
                            isSuccess
                              ? "rgba(16, 185, 129, 0.5)"
                              : "rgba(255, 107, 0, 0.4)"
                          }`
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: "#EF4444",
                  fontSize: "0.775rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* Floating Numpad Dial Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                width: "100%",
                maxWidth: "280px",
              }}
            >
              {numpadButtons.flat().map((btn) => {
                const isClear = btn === "C";
                const isDel = btn === "DEL";

                return (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => {
                      if (isClear) handleClear();
                      else if (isDel) handleBackspace();
                      else handleKeyPress(btn);
                    }}
                    className="focus-ring"
                    style={{
                      height: "56px",
                      borderRadius: "50%",
                      background: isClear || isDel
                        ? "var(--bg-secondary)"
                        : "var(--bg-page)",
                      border: "1px solid var(--border-color)",
                      color: isClear || isDel
                        ? "var(--text-secondary)"
                        : "var(--text-primary)",
                      fontSize: isDel || isClear ? "0.85rem" : "1.35rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      transition: "all 0.15s ease",
                      userSelect: "none",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.92)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {isDel ? (
                      <Backspace size={20} />
                    ) : isClear ? (
                      "CLR"
                    ) : (
                      btn
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
