"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/lib/store/useUserStore";
import { POST_TEST_QUESTIONS } from "@/lib/content/modules-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowsClockwise,
  Clock,
  Sparkle,
  LockKey,
  ShieldCheck,
  WarningCircle,
  FileText,
} from "@phosphor-icons/react";
import { fireConfetti } from "@/lib/confetti";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function PostTestPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const isUserReady = useUserStore((s) => s.isUserReady);
  const addXP = useUserStore((s) => s.addXP);
  const saveTestResult = useUserStore((s) => s.saveTestResult);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check if Pre-Test is completed
  const isPreTestDone = useMemo(() => {
    if (!user) return false;
    return Boolean(user.tests?.preTest?.completed);
  }, [user]);

  if (!isUserReady || !user) {
    return <LoadingSpinner text="Memuat Post-Test..." fullPage />;
  }

  // Guard: Pre-test must be done first
  if (!isPreTestDone) {
    return (
      <div className="section-container" style={{ maxWidth: "680px", margin: "0 auto", paddingBottom: "80px", paddingTop: "40px" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          {/* Header Logos */}
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
              width: "60px",
              height: "60px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#EF4444",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LockKey size={30} weight="fill" />
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Post-Test Belum Dapat Diakses
          </h2>
          <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", marginTop: "10px", lineHeight: 1.6, maxWidth: "460px", margin: "10px auto 0" }}>
            Kamu harus menyelesaikan <strong>Pre-Test (M0: Orientasi & Kuis Pemetaan)</strong> terlebih dahulu untuk membuka akses Post-Test ini.
          </p>

          <div style={{ marginTop: "28px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/learn/M0" className="btn btn-primary" style={{ gap: "8px" }}>
              <Sparkle size={16} weight="fill" /> Kerjakan Pre-Test Sekarang
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              Kembali ke Dasbor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const questions = POST_TEST_QUESTIONS;
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

    // Save test result in UserProfile
    const submission = {
      completed: true,
      score: correctScore,
      totalQuestions,
      percentage: pct,
      submittedAt: new Date().toISOString(),
      answers: selectedAnswers,
    };

    await saveTestResult("postTest", submission);

    // Give XP reward
    const earnedXP = correctScore * 10 + 50; // Bonus 50 XP completion
    await addXP(earnedXP);

    if (pct >= 60) {
      fireConfetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const finalCorrect = calculateScore();
  const finalPct = Math.round((finalCorrect / totalQuestions) * 100);
  const isPassed = finalPct >= 60;

  return (
    <div className="section-container" style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "80px", paddingTop: "24px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ gap: "6px" }}>
          <ArrowLeft size={16} /> Kembali ke Dasbor
        </Link>

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
            POST-TEST TRPL 2026
          </span>
        </div>
      </div>

      {!isSubmitted ? (
        <div>
          {/* Progress Bar & Meta */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "20px 24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
                  Evaluasi Akhir Matrikulasi
                </span>
                <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
                  Post-Test Pemrograman TRPL
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
                SOAL NOMOR {currentIdx + 1} DARI {totalQuestions} • {currentQ.category}
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
              background: isPassed ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: isPassed ? "#22C55E" : "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {isPassed ? <Trophy size={36} weight="fill" /> : <WarningCircle size={36} weight="fill" />}
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {isPassed ? "Selamat! Kamu Lulus Post-Test!" : "Post-Test Selesai"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "460px", margin: "8px auto 20px" }}>
            {isPassed
              ? "Hasil ujianmu telah dicatat secara resmi ke dalam sistem penilaian matrikulasi TRPL 2026."
              : "Jangan berkecil hati! Pelajari kembali materi modul yang belum kamu kuasai dan coba lagi."}
          </p>

          {/* Score Box */}
          <div style={{ display: "inline-flex", gap: "24px", background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", padding: "16px 32px", borderRadius: "var(--radius-lg)", marginBottom: "28px" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: isPassed ? "#22C55E" : "#EF4444" }}>
                {finalPct}%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>SKOR AKHIR</div>
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
            <Link href="/certificate" className="btn btn-primary" style={{ gap: "8px" }}>
              <ShieldCheck size={18} weight="fill" /> Cek Status Sertifikat Kelulusan
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              Ke Dasbor Utama
            </Link>
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
              Kumpulkan Post-Test Sekarang?
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "20px" }}>
              Kamu telah menjawab <strong>{answeredCount} dari {totalQuestions} soal</strong>. Setelah dikumpulkan, nilai akan langsung dihitung dan disimpan di profilmu.
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
