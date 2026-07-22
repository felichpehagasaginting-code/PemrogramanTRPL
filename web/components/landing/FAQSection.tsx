"use client";

import { useState } from "react";
import { MagnifyingGlass, CaretDown, CaretUp, Question } from "@phosphor-icons/react";

const FAQ_LIST = [
  {
    q: "Apakah platform ini gratis untuk seluruh mahasiswa baru TRPL?",
    a: "Ya! Platform Matrikulasi Pemrograman TRPL 100% gratis untuk seluruh mahasiswa baru angkatan 2026 yang diselenggarakan oleh Divisi Pemrograman HIMA TRPL.",
  },
  {
    q: "Apakah saya membutuhkan laptop dengan spesifikasi tinggi?",
    a: "Tidak sama sekali! Seluruh modul kuis dan eksekusi kode Python berjalan langsung di browser kamu (berbasis WebAssembly), sehingga laptop standar atau tablet pun lancar menggunakannya.",
  },
  {
    q: "Bagaimana jika saya belum pernah koding sama sekali sebelumnya?",
    a: "Jangan khawatir! Kurikulum dirancang khusus dari level nol (M0 Pre-test & M1 Setup Workspace) hingga mampu membuat Mini Project. AI Mentor juga akan siap membimbing jika kamu menemukan error.",
  },
  {
    q: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan seluruh modul?",
    a: "Rata-rata mahasiswa menyelesaikan 9 modul dalam waktu 5-7 hari jika meluangkan waktu 30 menit per hari.",
  },
  {
    q: "Apakah saya mendapatkan sertifikat atau badge kelulusan?",
    a: "Ya! Mahasiswa yang berhasil menyelesaikan Modul M8 akan mendapatkan Badge 'Matrikulasi Graduate' dan rekap perolehan XP untuk diserahkan ke Dosen Wali.",
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
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 var(--space-4)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <h3 style={{ fontSize: "1.375rem", fontWeight: 800 }}>
          ❓ Pertanyaan yang Sering Diajukan (FAQ)
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Punya pertanyaan seputar matrikulasi? Temukan jawabannya di bawah ini!
        </p>
      </div>

      {/* Search Input */}
      <div style={{ position: "relative", marginBottom: "var(--space-6)" }}>
        <MagnifyingGlass
          size={18}
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Cari pertanyaan... (contoh: laptop, gratis, sertifikat)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px 12px 42px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
      </div>

      {/* FAQ Accordion List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Pertanyaan tidak ditemukan. Coba ketik kata kunci lain.
          </p>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                  }}
                >
                  <span>{item.q}</span>
                  {isOpen ? <CaretUp size={18} /> : <CaretDown size={18} />}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 18px 16px 18px",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      borderTop: "1px solid var(--border-color)",
                      paddingTop: "12px",
                    }}
                  >
                    💬 {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
