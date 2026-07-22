"use client";

import { X, Sparkle, Clock, Trophy, Lightning, CheckCircle } from "@phosphor-icons/react";
import { soundFX } from "@/lib/audio";

interface ModulePreviewModalProps {
  moduleId: string | null;
  onClose: () => void;
}

const MODULE_DETAILS: Record<string, { title: string; desc: string; time: string; xp: number; slides: string[]; teaserQuiz: { question: string; options: string[]; answer: number } }> = {
  M0: {
    title: "M0: Pre-Test & Orientasi",
    desc: "Pemetaan kemampuan awal dan pengenalan dunia pemrograman TRPL.",
    time: "15 Menit",
    xp: 50,
    slides: ["Selamat Datang", "Apa itu Pemrograman?", "Roadmap TRPL", "Pre-Test Diagnostik"],
    teaserQuiz: {
      question: "Manakah yang merupakan bahasa pemrograman utama untuk Data Science & AI?",
      options: ["HTML", "Python", "CSS", "Photoshop"],
      answer: 1,
    },
  },
  M1: {
    title: "M1: Dasar Komputer & Workspace",
    desc: "Setup folder project, memahami CLI vs GUI, dan menginstal tools koding.",
    time: "30 Menit",
    xp: 100,
    slides: ["Bagaimana Komputer Bekerja", "Aturan Folder & PATH", "GUI vs CLI", "Checklist Workspace"],
    teaserQuiz: {
      question: "Mengapa folder project koding sebaiknya tidak diberi spasi?",
      options: ["Agar rapi", "Mencegah error path CLI/Terminal", "Biar cepat", "Aturan Windows"],
      answer: 1,
    },
  },
  M2: {
    title: "M2: Logika & Algoritma",
    desc: "Belajar berpikir terstruktur dengan Pseudocode dan Flowchart.",
    time: "40 Menit",
    xp: 100,
    slides: ["Definisi Algoritma", "Bagan Alir (Flowchart)", "Pseudocode", "Struktur Logika"],
    teaserQuiz: {
      question: "Symbol belah ketupat pada flowchart melambangkan?",
      options: ["Input/Output", "Keputusan (Decision / If)", "Proses", "Mulai/Selesai"],
      answer: 1,
    },
  },
  M3: {
    title: "M3: Variabel & Tipe Data",
    desc: "Menyimpan data angka, teks, dan boolean di memori Python.",
    time: "45 Menit",
    xp: 120,
    slides: ["Apa itu Variabel", "Integer & Float", "String & Operator Teks", "Casting Tipe Data"],
    teaserQuiz: {
      question: "Apa tipe data dari nilai `3.14` di Python?",
      options: ["int", "str", "float", "bool"],
      answer: 2,
    },
  },
  M4: {
    title: "M4: Percabangan (If-Else)",
    desc: "Membuat keputusan otomatis berdasarkan kondisi yang dipenuhi.",
    time: "50 Menit",
    xp: 150,
    slides: ["Struktur if-elif-else", "Operator Perbandingan", "Operator Logika AND/OR", "Nested If"],
    teaserQuiz: {
      question: "Sintaksis percabangan alternatif di Python ditulis dengan?",
      options: ["else if", "elif", "elseif", "switch"],
      answer: 1,
    },
  },
  M5: {
    title: "M5: Perulangan (Loops)",
    desc: "Otomatisasi tugas berulang dengan for loop dan while loop.",
    time: "55 Menit",
    xp: 150,
    slides: ["Mengapa Perulangan?", "For Loop & range()", "While Loop", "Break & Continue"],
    teaserQuiz: {
      question: "Hasil dari `range(1, 5)` di Python menghasilkan deret angka?",
      options: ["1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "1, 5"],
      answer: 0,
    },
  },
  M6: {
    title: "M6: Fungsi & Prosedur",
    desc: "Membungkus kode modular agar dapat dipanggil berulang kali.",
    time: "60 Menit",
    xp: 180,
    slides: ["Sintaksis def", "Parameter & Argumen", "Return Value", "Scope Variabel"],
    teaserQuiz: {
      question: "Kata kunci apa yang digunakan untuk mengembalikan nilai fungsi?",
      options: ["output", "send", "return", "give"],
      answer: 2,
    },
  },
  M7: {
    title: "M7: Array & List",
    desc: "Menampung banyak data sekaligus dalam himpunan list.",
    time: "60 Menit",
    xp: 200,
    slides: ["Struktur List", "Indeks List", "Method append() & pop()", "Iterasi List"],
    teaserQuiz: {
      question: "Indeks elemen pertama pada List di Python dimulai dari angka?",
      options: ["1", "0", "-1", "2"],
      answer: 1,
    },
  },
  M8: {
    title: "M8: Mini Project Akhir",
    desc: "Membangun aplikasi kalkulator / sistem kasir sebagai karya portofolio matrikulasi.",
    time: "90 Menit",
    xp: 300,
    slides: ["Persiapan Mini Project", "Struktur Logika Project", "Pengujian & Debugging", "Submission Portfolio"],
    teaserQuiz: {
      question: "Syarat kelulusan matrikulasi TRPL adalah?",
      options: ["Menyelesaikan Mini Project M8", "Mendapatkan Badge Graduated", "Lulus Kuis", "Semua Jawaban Benar"],
      answer: 3,
    },
  },
};

export function ModulePreviewModal({ moduleId, onClose }: ModulePreviewModalProps) {
  if (!moduleId || !MODULE_DETAILS[moduleId]) return null;

  const info = MODULE_DETAILS[moduleId];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.6)",
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
          maxWidth: "480px",
          width: "100%",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {info.title}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
          {info.desc}
        </p>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "var(--space-5)" }}>
          <div style={{ flex: 1, background: "var(--bg-secondary)", padding: "10px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={20} color="var(--primary-color)" />
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Estimasi Waktu</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>{info.time}</div>
            </div>
          </div>

          <div style={{ flex: 1, background: "var(--bg-secondary)", padding: "10px", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Lightning size={20} color="var(--color-accent)" />
            <div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Reward XP</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>+{info.xp} XP</div>
            </div>
          </div>
        </div>

        {/* Slide Topics */}
        <h5 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", fontWeight: 700 }}>📚 Topik Bahasan:</h5>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "var(--space-5)" }}>
          {info.slides.map((s, idx) => (
            <div key={idx} style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={14} color="var(--success-color)" /> {s}
            </div>
          ))}
        </div>

        {/* Teaser Quiz */}
        <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", marginBottom: "var(--space-6)" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-color)", marginBottom: "4px" }}>
            ❓ Sample Teaser Quiz:
          </div>
          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
            {info.teaserQuiz.question}
          </div>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ width: "100%" }}>
          Tutup & Mulai Belajar
        </button>
      </div>
    </div>
  );
}
