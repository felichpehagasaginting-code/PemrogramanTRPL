"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Sparkle,
  LockKey,
  LockKeyOpen,
  CaretRight,
  CheckCircle,
  X,
  Code,
  Article,
  Eye,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export interface TieredHint {
  level1Concept: {
    title: string;
    description: string;
    analogy: string;
  };
  level2Pseudocode: {
    title: string;
    steps: string[];
  };
  level3Template: {
    title: string;
    codeTemplate: string;
    explanation: string;
  };
}

interface ScaffoldedHintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hintData?: TieredHint;
  moduleTitle?: string;
}

export function ScaffoldedHintDrawer({
  isOpen,
  onClose,
  hintData,
  moduleTitle = "Latihan Modul",
}: ScaffoldedHintDrawerProps) {
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);

  const defaultHint: TieredHint = {
    level1Concept: {
      title: "🧠 Pahami Tujuan Masalah",
      description: "Komputer butuh instruksi runtut dan terdefinisi dari atas ke bawah.",
      analogy: "Ibarat membuat kopi instan: tuang bubuk kopi dulu, baru tuang air panas, jangan dibalik!",
    },
    level2Pseudocode: {
      title: "📝 Langkah Logika (Pseudocode)",
      steps: [
        "1. Deklarasikan variabel awal atau ambil input.",
        "2. Lakukan evaluasi kondisi percabangan (if) atau perulangan (loop).",
        "3. Cetak hasil akhir ke terminal dengan print().",
      ],
    },
    level3Template: {
      title: "🧩 Template Sintaks Berlubang",
      codeTemplate: `# Buat variabel atau deklarasi fungsi\nvariabel_utama = ___\n\n# Proses logika\nif variabel_utama == ___:\n    print("Hasil yang diharapkan")\n`,
      explanation: "Ganti bagian '___' dengan nilai atau variabel yang sesuai instruksi soal.",
    },
  };

  const currentHint = hintData || defaultHint;

  const handleUnlockNext = () => {
    if (unlockedLevel < 3) {
      setUnlockedLevel((prev) => prev + 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              background: "var(--bg-card)",
              borderLeft: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-xl)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "var(--space-4) var(--space-6)",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.15)",
                    color: "#F59E0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lightbulb size={20} weight="fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                    Petunjuk Bertingkat (3-Tier Hint)
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {moduleTitle}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn btn-sm btn-ghost"
                style={{ borderRadius: "var(--radius-full)", padding: "6px" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Hint Tiers Body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-6)",
              }}
            >
              {/* Tier 1: Concept */}
              <div
                style={{
                  background: "var(--bg-page)",
                  border: "1.5px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      background: "rgba(59, 130, 246, 0.15)",
                      color: "#3B82F6",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-full)",
                    }}
                  >
                    Level 1: Konsep & Analogi
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {currentHint.level1Concept.title}
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 8px" }}>
                  {currentHint.level1Concept.description}
                </p>
                <div
                  style={{
                    background: "var(--bg-secondary)",
                    borderLeft: "3px solid var(--color-primary-500)",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                  }}
                >
                  💡 <strong>Analogi:</strong> {currentHint.level1Concept.analogy}
                </div>
              </div>

              {/* Tier 2: Pseudocode */}
              <div
                style={{
                  background: unlockedLevel >= 2 ? "var(--bg-page)" : "var(--bg-secondary)",
                  border: `1.5px solid ${unlockedLevel >= 2 ? "var(--border-color)" : "var(--border-color)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  opacity: unlockedLevel >= 2 ? 1 : 0.7,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        background: "rgba(245, 158, 11, 0.15)",
                        color: "#F59E0B",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Level 2: Alur Logika
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {currentHint.level2Pseudocode.title}
                    </span>
                  </div>
                  {unlockedLevel < 2 && <LockKey size={16} color="var(--text-muted)" />}
                </div>

                {unlockedLevel >= 2 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {currentHint.level2Pseudocode.steps.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: "0.825rem",
                          color: "var(--text-primary)",
                          background: "var(--bg-secondary)",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          lineHeight: 1.5,
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 10px" }}>
                      Coba pikirkan dulu Level 1 di atas. Kalau masih bingung, buka panduan alur logika.
                    </p>
                    <button
                      onClick={handleUnlockNext}
                      className="btn btn-sm btn-secondary"
                      style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <LockKeyOpen size={14} /> Buka Level 2 (Alur Logika)
                    </button>
                  </div>
                )}
              </div>

              {/* Tier 3: Template */}
              <div
                style={{
                  background: unlockedLevel >= 3 ? "var(--bg-page)" : "var(--bg-secondary)",
                  border: `1.5px solid ${unlockedLevel >= 3 ? "var(--border-color)" : "var(--border-color)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  opacity: unlockedLevel >= 3 ? 1 : 0.7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10B981",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                      }}
                    >
                      Level 3: Template Sintaks
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      {currentHint.level3Template.title}
                    </span>
                  </div>
                  {unlockedLevel < 3 && <LockKey size={16} color="var(--text-muted)" />}
                </div>

                {unlockedLevel >= 3 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <pre
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        padding: "10px",
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-mono, monospace)",
                        color: "var(--text-primary)",
                        margin: 0,
                        overflowX: "auto",
                      }}
                    >
                      <code>{currentHint.level3Template.codeTemplate}</code>
                    </pre>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      💡 {currentHint.level3Template.explanation}
                    </span>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "12px 0" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 10px" }}>
                      Butuh kerangka kode langsung? Buka level terakhir ini.
                    </p>
                    <button
                      disabled={unlockedLevel < 2}
                      onClick={handleUnlockNext}
                      className="btn btn-sm btn-primary"
                      style={{
                        fontSize: "0.75rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: unlockedLevel < 2 ? 0.5 : 1,
                      }}
                    >
                      <LockKeyOpen size={14} /> Buka Level 3 (Template Kode)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "var(--space-4) var(--space-6)",
                borderTop: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              🎓 <em>Tips: Menyelesaikan soal mandiri melatih intuisi algoritma lebih cepat!</em>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
