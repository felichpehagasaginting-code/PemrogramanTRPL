"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle, ArrowsLeftRight, Sparkle, WarningOctagon, CheckFat } from "@phosphor-icons/react";

const BEFORE_POINTS = [
  "Minder karena merasa teman lain sudah jago koding duluan dari SMA/SMK.",
  "Ragu & takut buka terminal layar hitam karena takut salah ketik perintah.",
  "Panik dan stres setiap kali melihat pesan error merah yang panjang.",
  "Bingung mau mulai belajar dari mana tanpa arahan dan mentor yang sabar.",
];

const AFTER_POINTS = [
  "Percaya diri tinggi dan paham logika dasar pemrograman dengan sangat matang!",
  "Lancar mengetik perintah terminal & terbiasa pakai tools standar industri.",
  "Tenang menghadapi bug karena sudah paham cara membaca error dan memperbaikinya.",
  "Punya karya Mini Project nyata (Kalkulator/Kasir) dan Sertifikat Resmi TRPL 2026!",
];

export function BeforeAfterSlider() {
  const [activeTab, setActiveTab] = useState<"all" | "before" | "after">("all");

  return (
    <div className="section-container">
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-3)" }}>
            <Sparkle size={12} weight="fill" />
            Transformasi Nyata
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-2)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
            Sebelum vs Sesudah <span className="gradient-text">Matrikulasi</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "580px", margin: "var(--space-3) auto 0", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Lihat lonjakan kepercayaan diri dan skill teknis mahasiswa baru setelah menyelesaikan seluruh tahapan modul interaktif.
          </p>

          {/* Mode Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-full)",
              marginTop: "var(--space-6)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <button
              onClick={() => setActiveTab("all")}
              aria-label="Tampilkan perbandingan kedua sisi"
              style={{
                background: activeTab === "all" ? "var(--gradient-hero)" : "transparent",
                color: activeTab === "all" ? "#ffffff" : "var(--text-secondary)",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "6px 16px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ArrowsLeftRight size={14} weight="bold" /> Bandingkan
            </button>
            <button
              onClick={() => setActiveTab("before")}
              aria-label="Tampilkan kondisi sebelum matrikulasi"
              style={{
                background: activeTab === "before" ? "rgba(239, 68, 68, 0.15)" : "transparent",
                color: activeTab === "before" ? "var(--error-color)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <XCircle size={14} weight="fill" /> Sebelum
            </button>
            <button
              onClick={() => setActiveTab("after")}
              aria-label="Tampilkan hasil sesudah matrikulasi"
              style={{
                background: activeTab === "after" ? "rgba(34, 197, 94, 0.15)" : "transparent",
                color: activeTab === "after" ? "var(--success-color)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={14} weight="fill" /> Sesudah
            </button>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: activeTab === "all" ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr",
            gap: "var(--space-6)",
            alignItems: "stretch",
          }}
        >
          {/* Before Card */}
          {(activeTab === "all" || activeTab === "before") && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "var(--bg-card)",
                border: "1.5px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                boxShadow: "var(--shadow-card)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #EF4444, #F87171)",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-5)" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.12)",
                    color: "var(--error-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <WarningOctagon size={20} weight="fill" />
                </span>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--error-color)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Sebelum Matrikulasi
                  </div>
                  <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Kebingungan Awal Maba
                  </h3>
                </div>
              </div>

              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {BEFORE_POINTS.map((point, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    <XCircle size={18} color="var(--error-color)" weight="fill" style={{ flexShrink: 0, marginTop: "3px" }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* After Card */}
          {(activeTab === "all" || activeTab === "after") && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "var(--bg-card)",
                border: "1.5px solid rgba(34, 197, 94, 0.35)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                boxShadow: "0 8px 30px rgba(34, 197, 94, 0.10)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #22C55E, #10B981)",
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-5)" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "var(--success-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckFat size={20} weight="fill" />
                </span>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--success-color)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Sesudah Matrikulasi
                  </div>
                  <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    Siap Berprestasi di Perkuliahan
                  </h3>
                </div>
              </div>

              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                {AFTER_POINTS.map((point, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.6 }}>
                    <CheckCircle size={18} color="var(--success-color)" weight="fill" style={{ flexShrink: 0, marginTop: "3px" }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

