"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, CaretDown, Question, XCircle, Sparkle } from "@phosphor-icons/react";

const FAQ_LIST = [
  {
    q: "Apakah platform ini gratis untuk seluruh mahasiswa baru TRPL?",
    a: "Ya! Platform Matrikulasi Pemrograman TRPL 100% gratis untuk seluruh mahasiswa baru angkatan 2026. Program ini didedikasikan oleh Divisi Pemrograman HIMA TRPL untuk mendukung transisi belajar koding yang menyenangkan.",
  },
  {
    q: "Apakah saya membutuhkan laptop dengan spesifikasi tinggi?",
    a: "Tidak sama sekali! Seluruh modul, kuis, dan eksekusi kode Python berjalan langsung di browser kamu (berbasis WebAssembly / Pyodide), sehingga laptop standar, notebook, atau bahkan tablet dapat menggunakannya dengan lancar.",
  },
  {
    q: "Bagaimana jika saya belum pernah koding sama sekali sebelumnya?",
    a: "Jangan khawatir! Kurikulum dirancang bertahap dari level nol (M0 Pre-test & M1 Workspace) hingga mampu membuat Mini Project nyata. AI Mentor siap membantu menjelaskan penyebab error jika kamu bingung.",
  },
  {
    q: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan seluruh modul?",
    a: "Rata-rata mahasiswa menyelesaikan seluruh 9 modul dalam rentang 5-7 hari dengan meluangkan waktu sekitar 30 menit per hari secara santai dan konsisten.",
  },
  {
    q: "Apakah saya mendapatkan sertifikat atau badge kelulusan?",
    a: "Ya! Mahasiswa yang berhasil menyelesaikan Modul M8 akan membuka Badge 'Matrikulasi Graduate' eksklusif serta rekapitulasi poin XP dan portofolio proyek mini.",
  },
];

export function FAQSection() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = FAQ_LIST.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section-container">
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-3)" }}>
            <Sparkle size={12} weight="fill" />
            Tanya Jawab
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-2)", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
            Pertanyaan yang <span className="gradient-text">Sering Diajukan</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "520px", margin: "var(--space-3) auto 0", fontSize: "0.95rem", lineHeight: 1.6 }}>
            Punya pertanyaan seputar kurikulum, sistem koding, atau persyaratan teknis? Temukan jawabannya di sini.
          </p>
        </div>

        {/* Search Input */}
        <div role="search" style={{ position: "relative", marginBottom: "var(--space-6)" }}>
          <MagnifyingGlass
            size={18}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Cari pertanyaan... (contoh: laptop, gratis, pemula)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus-ring"
            aria-label="Cari pertanyaan FAQ"
            style={{
              width: "100%",
              padding: "14px 44px 14px 44px",
              borderRadius: "var(--radius-xl)",
              border: "1.5px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              boxShadow: "var(--shadow-sm)",
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Hapus teks pencarian"
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <XCircle size={18} weight="fill" />
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-8)",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px dashed var(--border-color)",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>Pertanyaan tidak ditemukan untuk "{search}"</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.8rem" }}>Coba gunakan kata kunci umum lainnya seperti "laptop" atau "gratis".</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = openIndex === idx;
              const answerId = `faq-answer-${idx}`;
              return (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    border: isOpen ? "1.5px solid var(--color-primary-500)" : "1px solid var(--border-color)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    boxShadow: isOpen ? "0 4px 20px rgba(255,107,0,0.08)" : "var(--shadow-sm)",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <button
                    id={`faq-toggle-${idx}`}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="focus-ring"
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      textAlign: "left",
                      color: isOpen ? "var(--color-primary-600)" : "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      gap: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    <span>{item.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ flexShrink: 0, color: isOpen ? "var(--color-primary-500)" : "var(--text-muted)" }}
                    >
                      <CaretDown size={18} weight="bold" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={answerId}
                        role="region"
                        aria-labelledby={`faq-toggle-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            padding: "0 20px 18px 20px",
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.7,
                            borderTop: "1px solid var(--border-color)",
                            paddingTop: "14px",
                          }}
                        >
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

