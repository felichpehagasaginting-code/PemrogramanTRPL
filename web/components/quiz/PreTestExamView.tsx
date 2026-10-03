"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/lib/store/useUserStore";
import { EVALUATION_QUESTIONS } from "@/lib/content/modules-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowsClockwise,
  Sparkle,
  BookOpen,
  Check,
} from "@phosphor-icons/react";
import { fireConfetti } from "@/lib/confetti";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function PreTestExamView() {
  const user = useUserStore((s) => s.user);
  const isUserReady = useUserStore((s) => s.isUserReady);
  const addXP = useUserStore((s) => s.addXP);
  const saveTestResult = useUserStore((s) => s.saveTestResult);
  const completeSubModule = useUserStore((s) => s.completeSubModule);
  const completeModule = useUserStore((s) => s.completeModule);

  const [viewMode, setViewMode] = useState<"intro" | "exam">("intro");
  const [introSlideIdx, setIntroSlideIdx] = useState(0);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check URL query parameters (e.g. ?mode=exam)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "exam") {
        setViewMode("exam");
      }
    }
  }, []);

  if (!isUserReady || !user) {
    return <LoadingSpinner text="Memuat Pre-Test..." fullPage />;
  }

  const questions = EVALUATION_QUESTIONS;
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmitTest = async () => {
    setShowConfirmModal(false);
    const correctScore = calculateScore();
    const pct = Math.round((correctScore / totalQuestions) * 100);
    setIsSubmitted(true);

    const submission = {
      completed: true,
      score: correctScore,
      totalQuestions,
      percentage: pct,
      submittedAt: new Date().toISOString(),
      answers: selectedAnswers,
    };

    await saveTestResult("preTest", submission);
    await completeSubModule("M0", "m0-pretest", 25);
    await completeModule("M0");

    const earnedXP = correctScore * 10 + 50;
    await addXP(earnedXP);

    fireConfetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setViewMode("exam");
  };

  const finalCorrect = calculateScore();
  const finalPct = Math.round((finalCorrect / totalQuestions) * 100);

  // Intro Slides Data
  const introSlides = [
    {
      title: "Selamat Datang di Platform Matrikulasi TRPL!",
      subtitle: "Orientasi & Fondasi Awal Mahasiswa Baru 2026",
      badge: "Langkah Pertama",
      content: (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(255, 107, 0, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Sparkle size={36} color="var(--color-primary-500)" weight="fill" />
          </div>

          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px" }}>
            Halo Calon Software Engineer TRPL!
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "580px", margin: "0 auto" }}>
            Selamat datang di gerbang pembelajaran komputasi terstruktur. Melalui platform ini, kamu akan dibimbing langkah demi langkah dari nol mutlak hingga mampu merancang program berbasis Python dengan logika yang kuat.
          </p>

          <div
            style={{
              background: "var(--gradient-hero-soft)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              marginTop: "20px",
              textAlign: "left",
            }}
          >
            <strong style={{ color: "var(--color-primary-500)", display: "block", marginBottom: "4px", fontSize: "0.875rem" }}>
              💡 Prinsip Belajar di TRPL:
            </strong>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
              Belajar coding bukan soal menghafal kode atau syntax, melainkan soal melatih cara berpikir analitis, memecah masalah besar menjadi potongan kecil, dan berani mengulik saat error.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px", marginTop: "16px" }}>
            {[
              { label: "Syntax", desc: "Tata bahasa penulisan kode program" },
              { label: "Bug", desc: "Kesalahan logika yang membuat program error" },
              { label: "Debugging", desc: "Seni melacak & memperbaiki kesalahan kode" },
            ].map((item, i) => (
              <div key={i} style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", padding: "10px 12px", borderRadius: "var(--radius-md)", textAlign: "left" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-primary-500)", display: "block" }}>{item.label}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Bagaimana Komputer Menjalankan Kode?",
      subtitle: "Memahami Cara Komputer Berpikir Secara Harafiah",
      badge: "Konsep Dasar",
      content: (
        <div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "16px" }}>
            <strong>Pemrograman</strong> adalah proses memberikan serangkaian instruksi kepada komputer agar menjalankan tugas tertentu secara otomatis. Komputer bekerja sangat patuh dan presisi — ia melakukan tepat apa yang kamu instruksikan.
          </p>

          <div style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "16px", marginBottom: "16px" }}>
            <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>🤖 Analogi Robot Koki:</strong>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "6px", lineHeight: 1.6 }}>
              Bayangkan komputer seperti robot koki yang sangat setia tetapi tidak memiliki inisiatif sendiri. Jika kamu berkata &ldquo;buatkan kopi&rdquo;, ia akan bingung. Kamu harus menjelaskan urutannya:
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
              {["1. Ambil cangkir", "2. Masukkan bubuk kopi", "3. Tuang air panas", "4. Aduk 10 detik"].map((step, idx) => (
                <span key={idx} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "4px 10px", borderRadius: "var(--radius-md)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-primary-500)" }}>Python (.py)</span>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                Bahasa pemrograman yang kita gunakan, mudah dibaca dan mirip kalimat bahasa Inggris sehari-hari.
              </p>
            </div>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-primary-500)" }}>Interpreter</span>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                Penerjemah internal yang membaca dan mengeksekusi kode Python baris demi baris dari atas ke bawah.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Roadmap Perjalanan Matrikulasi (9 Modul)",
      subtitle: "Dua Fase Terarah dari Workshop Tatap Muka Hingga Mini Project",
      badge: "Kurikulum TRPL",
      content: (
        <div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "14px", fontSize: "0.9rem" }}>
            Kurikulum matrikulasi dibagi menjadi <strong>dua fase terstruktur</strong> agar belajarmu tidak membingungkan:
          </p>

          {/* Fase 1 */}
          <div style={{ background: "rgba(255, 107, 0, 0.06)", border: "1.5px solid rgba(255, 107, 0, 0.3)", borderRadius: "var(--radius-lg)", padding: "14px", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <strong style={{ fontSize: "0.82rem", color: "var(--color-primary-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                🔴 FASE 1: LIVE WORKSHOP (M0 - M4)
              </strong>
              <span style={{ fontSize: "0.7rem", background: "var(--color-primary-500)", color: "white", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 700 }}>
                Sesi Tatap Muka
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0 0 8px 0" }}>
              Didampingi langsung oleh dosen pengampu dan mentor senior untuk membangun fondasi:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { kode: "M0", nama: "Pre-Test & Orientasi", warna: "#FF9D00" },
                { kode: "M1", nama: "Dasar Komputer & Workspace VS Code", warna: "#FF8C42" },
                { kode: "M2", nama: "Logika & Algoritma Naratif", warna: "#FF6B00" },
                { kode: "M3", nama: "Toples Variabel & Tipe Data", warna: "#06B6D4" },
                { kode: "M4", nama: "Percabangan & Keputusan Diskon", warna: "#EF4444" },
              ].map((m) => (
                <div key={m.kode} style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "6px 10px" }}>
                  <span style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", fontWeight: 800, color: m.warna, width: "26px" }}>{m.kode}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>{m.nama}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fase 2 */}
          <div style={{ background: "rgba(34, 197, 94, 0.05)", border: "1.5px dashed rgba(34, 197, 94, 0.35)", borderRadius: "var(--radius-lg)", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <strong style={{ fontSize: "0.82rem", color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                🟢 FASE 2: GUIDED INDEPENDENT MASTERY (M5 - M8)
              </strong>
              <span style={{ fontSize: "0.7rem", background: "#22C55E", color: "white", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 700 }}>
                Belajar Mandiri di Asrama / Rumah
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0 0 6px 0" }}>
              Dilanjutkan secara mandiri dengan dukungan Auto-Grader otomatis dan modul lanjutan (Perulangan, Fungsi, List, dan Mini Project Kasir).
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Petunjuk & Panduan Ujian Pre-Test",
      subtitle: "Uji Diagnostik Pemetaan Awal Logika & Pemrograman",
      badge: "Informasi Ujian",
      content: (
        <div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "16px" }}>
            Sebelum melangkah ke materi pembelajaran Modul 1, kamu akan mengerjakan <strong>Pre-Test Diagnostik</strong>.
            Tujuannya bukan untuk memberi nilai buruk atau vonis kelulusan, melainkan untuk mengetahui titik awal pemahamanmu!
          </p>

          <div style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "16px", marginBottom: "20px" }}>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Check size={18} weight="bold" color="#22C55E" />
                <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                  <strong>Jumlah Soal:</strong> 15 Soal Pilihan Ganda (Konsep Dasar, Logika, &amp; Analisis)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Check size={18} weight="bold" color="#22C55E" />
                <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                  <strong>Waktu Pengerjaan:</strong> Bebas (santai tanpa tekanan batas waktu)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Check size={18} weight="bold" color="#22C55E" />
                <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                  <strong>Navigasi Cepat:</strong> Kamu bisa melompat ke nomor mana saja menggunakan panel nomor di bagian atas
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Check size={18} weight="bold" color="#22C55E" />
                <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                  <strong>Sifat Ujian:</strong> Diagnostik mandiri — kerjakan semampu dan sejujurnya
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", paddingTop: "8px" }}>
            <button
              onClick={() => setViewMode("exam")}
              className="btn btn-primary"
              style={{ fontSize: "1rem", padding: "12px 28px", gap: "8px" }}
            >
              <Sparkle size={18} weight="fill" /> Mulai Kerjakan 15 Soal Pre-Test Sekarang
            </button>
          </div>
        </div>
      ),
    },
  ];

  const currentIntro = introSlides[introSlideIdx];

  return (
    <div className="section-container" style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "80px", paddingTop: "24px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ gap: "6px" }}>
            <ArrowLeft size={16} /> Kembali ke Dasbor
          </Link>
          {viewMode === "exam" && !isSubmitted && (
            <button
              onClick={() => setViewMode("intro")}
              className="btn btn-secondary btn-sm"
              style={{ gap: "6px" }}
              title="Lihat kembali slide orientasi materi pengantar"
            >
              <BookOpen size={16} /> Baca Orientasi
            </button>
          )}
          {viewMode === "intro" && (
            <button
              onClick={() => setViewMode("exam")}
              className="btn btn-ghost btn-sm"
              style={{ gap: "6px", color: "var(--color-primary-500)" }}
            >
              Lewati ke Soal Pre-Test →
            </button>
          )}
        </div>

        {/* Institutional Logos Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "var(--bg-card)", padding: "4px 14px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)" }}>
          <div style={{ width: "32px", height: "24px", position: "relative" }}>
            <Image src="/images/logo_kiri_cwe.png" alt="Logo Kampus" fill style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>•</span>
          <div style={{ width: "24px", height: "24px", position: "relative" }}>
            <Image src="/images/logo_kanan_trpl.png" alt="Logo TRPL" fill style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--color-primary-500)", letterSpacing: "0.5px" }}>
            PRE-TEST TRPL 2026
          </span>
        </div>
      </div>

      {viewMode === "intro" ? (
        /* Introduction Stepper Mode */
        <motion.div
          key={introSlideIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "32px 28px",
          }}
        >
          {/* Stepper Navigation Pills */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="badge badge-primary" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
                {currentIntro.badge}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Slide {introSlideIdx + 1} dari {introSlides.length}
              </span>
            </div>

            {/* Slide Indicator Dots */}
            <div style={{ display: "flex", gap: "6px" }}>
              {introSlides.map((_, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setIntroSlideIdx(sIdx)}
                  style={{
                    width: sIdx === introSlideIdx ? "24px" : "10px",
                    height: "8px",
                    borderRadius: "4px",
                    background: sIdx === introSlideIdx ? "var(--color-primary-500)" : "var(--color-neutral-150)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title={`Ke Slide ${sIdx + 1}`}
                />
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
            {currentIntro.title}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
            {currentIntro.subtitle}
          </p>

          {/* Slide Content */}
          <div style={{ minHeight: "260px" }}>
            {currentIntro.content}
          </div>

          {/* Stepper Footer Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
            <button
              disabled={introSlideIdx === 0}
              onClick={() => setIntroSlideIdx((i) => Math.max(0, i - 1))}
              className="btn btn-secondary btn-sm"
              style={{ opacity: introSlideIdx === 0 ? 0.5 : 1 }}
            >
              ← Slide Sebelumnya
            </button>

            <div style={{ display: "flex", gap: "10px" }}>
              {introSlideIdx < introSlides.length - 1 ? (
                <button
                  onClick={() => setIntroSlideIdx((i) => Math.min(introSlides.length - 1, i + 1))}
                  className="btn btn-primary btn-sm"
                  style={{ gap: "6px" }}
                >
                  Slide Selanjutnya <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setViewMode("exam")}
                  className="btn btn-primary btn-sm"
                  style={{ background: "#22C55E", borderColor: "#22C55E", color: "#FFF", gap: "6px" }}
                >
                  <Sparkle size={16} weight="fill" /> Mulai Kerjakan Soal
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : !isSubmitted ? (
        /* Exam Mode */
        <div>
          {/* Progress Bar & Meta Card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "20px 24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
                  Evaluasi Awal Matrikulasi
                </span>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  Pre-Test Pemrograman TRPL
                </h1>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Terjawab: <strong style={{ color: "var(--color-primary-500)" }}>{answeredCount}</strong> / {totalQuestions} Soal
                </span>
              </div>
            </div>

            {/* Visual Progress bar */}
            <div style={{ width: "100%", height: "8px", background: "var(--color-neutral-150)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(answeredCount / totalQuestions) * 100}%`,
                  height: "100%",
                  background: "var(--gradient-hero)",
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Quick Question Navigator Grid */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "14px" }}>
              {questions.map((q, idx) => {
                const isSelected = selectedAnswers[idx] !== undefined;
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      border: isCurrent
                        ? "2px solid var(--color-primary-500)"
                        : isSelected
                        ? "1px solid rgba(34,197,94,0.4)"
                        : "1px solid var(--border-color)",
                      background: isCurrent
                        ? "rgba(255,107,0,0.15)"
                        : isSelected
                        ? "rgba(34,197,94,0.15)"
                        : "var(--bg-page-alt)",
                      color: isCurrent
                        ? "var(--color-primary-500)"
                        : isSelected
                        ? "#22C55E"
                        : "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title={`Soal nomor ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "28px 24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                SOAL NOMOR {currentIdx + 1} DARI {totalQuestions} • {currentQ.category?.toUpperCase() || "DASAR & WORKSPACE"}
              </span>
            </div>

            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "24px", whiteSpace: "pre-line" }}>
              {currentQ.question}
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                const optionLetters = ["A", "B", "C", "D"];
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "14px 18px",
                      borderRadius: "var(--radius-lg)",
                      border: isSelected
                        ? "2px solid var(--color-primary-500)"
                        : "1px solid var(--border-color)",
                      background: isSelected
                        ? "rgba(255, 107, 0, 0.08)"
                        : "var(--bg-page-alt)",
                      color: "var(--text-primary)",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.925rem",
                      lineHeight: 1.5,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: isSelected ? "var(--color-primary-500)" : "var(--bg-card)",
                        color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                        border: isSelected ? "none" : "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {optionLetters[optIdx]}
                    </span>
                    <span style={{ paddingTop: "2px" }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentIdx === 0 ? 0.5 : 1 }}
              >
                ← Sebelumnya
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                {currentIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}
                    className="btn btn-primary btn-sm"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#22C55E", borderColor: "#22C55E", color: "#FFF" }}
                  >
                    <CheckCircle size={16} weight="bold" /> Selesai &amp; Kumpulkan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          {/* Institutional Logos Header */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{ width: "64px", height: "48px", position: "relative" }}>
              <Image src="/images/logo_kiri_cwe.png" alt="Logo Kampus" fill style={{ objectFit: "contain" }} />
            </div>
            <div style={{ width: "48px", height: "48px", position: "relative" }}>
              <Image src="/images/logo_kanan_trpl.png" alt="Logo TRPL" fill style={{ objectFit: "contain" }} />
            </div>
          </div>

          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(34, 197, 94, 0.15)",
              color: "#22C55E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Trophy size={36} weight="fill" />
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Pre-Test Selesai!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "460px", margin: "8px auto 20px" }}>
            Hasil pemetaan awal logikamu telah tercatat di sistem TRPL. Sekarang kamu siap untuk memulai petualangan coding dari Modul 1!
          </p>

          {/* Score Box */}
          <div style={{ display: "inline-flex", gap: "24px", background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", padding: "16px 32px", borderRadius: "var(--radius-lg)", marginBottom: "28px" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#22C55E" }}>
                {finalPct}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>SKOR AWAL</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "24px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text-primary)" }}>
                {finalCorrect}/{totalQuestions}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>SOAL BENAR</div>
            </div>
          </div>

          {/* Action Navigation */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/learn/M1" className="btn btn-primary" style={{ gap: "8px" }}>
              <Sparkle size={18} weight="fill" /> Lanjut ke Modul 1 (M1)
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              Ke Dasbor Utama
            </Link>
            <button onClick={handleRetake} className="btn btn-secondary btn-sm" style={{ gap: "6px" }}>
              <ArrowsClockwise size={16} /> Kerjakan Ulang
            </button>
            <button onClick={() => setViewMode("intro")} className="btn btn-secondary btn-sm" style={{ gap: "6px" }}>
              <BookOpen size={16} /> Baca Ulang Orientasi
            </button>
          </div>

          {/* Review Answers List */}
          <div style={{ marginTop: "40px", textAlign: "left", borderTop: "1px solid var(--border-color)", paddingTop: "28px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px" }}>
              📋 Pembahasan Jawaban
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    style={{
                      background: "var(--bg-page-alt)",
                      border: isCorrect ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                      borderRadius: "var(--radius-lg)",
                      padding: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                      {isCorrect ? (
                        <CheckCircle size={20} weight="fill" color="#22C55E" style={{ flexShrink: 0, marginTop: "2px" }} />
                      ) : (
                        <XCircle size={20} weight="fill" color="#EF4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                      )}
                      <div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {idx + 1}. {q.question}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginLeft: "30px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div>
                        <strong>Jawaban Kamu:</strong>{" "}
                        <span style={{ color: isCorrect ? "#22C55E" : "#EF4444" }}>
                          {userAns !== undefined ? q.options[userAns] : "(Tidak dijawab)"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <strong>Kunci Jawaban:</strong>{" "}
                          <span style={{ color: "#22C55E" }}>{q.options[q.correctIndex]}</span>
                        </div>
                      )}
                      <div style={{ background: "var(--bg-card)", padding: "8px 12px", borderRadius: "6px", marginTop: "6px", border: "1px solid var(--border-color)", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                        💡 <em>{q.explanation}</em>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "20px" }}>
          <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "24px", maxWidth: "420px", width: "100%", border: "1px solid var(--border-color)", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              Kumpulkan Pre-Test Sekarang?
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "20px" }}>
              Kamu telah menjawab <strong>{answeredCount} dari {totalQuestions} soal</strong>. Setelah dikumpulkan, hasil pemetaan awal akan disimpan dan membuka akses belajar selanjutnya.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary btn-sm">
                Batal &amp; Periksa Lagi
              </button>
              <button onClick={handleSubmitTest} className="btn btn-primary btn-sm" style={{ background: "#22C55E", borderColor: "#22C55E", color: "#FFF" }}>
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
