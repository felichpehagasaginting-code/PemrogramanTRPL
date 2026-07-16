"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowsClockwise,
  Question,
  BookOpen,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";

interface QuestionData {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizPage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeModule, addXP, unlockBadge } = useUserStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!user) return null;

  const quizData: Record<string, QuestionData[]> = {
    M0: [
      {
        text: "Apa ekstensi file standar untuk menyimpan script kode program Python?",
        options: [".py", ".pyt", ".py.txt", ".python"],
        correctIndex: 0,
        explanation: "File Python secara resmi menggunakan ekstensi .py agar bisa dikenali oleh interpreter Python.",
      },
      {
        text: "Mengapa dosen melarang membuat folder project coding di Desktop atau folder Downloads?",
        options: [
          "Agar Desktop terlihat bersih saja.",
          "Menghindari error permission/path di IDE dan risiko file terhapus saat pembersihan folder.",
          "Supaya laptop tidak cepat panas.",
          "Karena compiler Python tidak bisa membaca folder Desktop.",
        ],
        correctIndex: 1,
        explanation: "Folder Desktop dan Downloads adalah folder sistem sementara. Menaruh folder project di sana sering memicu error path permission saat IDE atau command terminal mencoba mengaksesnya.",
      },
      {
        text: "Simbol belah ketupat (diamond) pada bagan alir (Flowchart) digunakan untuk melambangkan...",
        options: ["Proses / Kalkulasi", "Mulai / Selesai (Terminal)", "Input / Output data", "Keputusan / Percabangan (Decision)"],
        correctIndex: 3,
        explanation: "Simbol belah ketupat melambangkan kondisi percabangan (Decision) di mana program harus memilih jalur True atau False.",
      },
      {
        text: "Jenis perulangan yang paling cocok digunakan ketika kita sudah tahu secara pasti berapa kali pengulangan harus dilakukan adalah...",
        options: ["while loop", "for loop", "nested if", "switch-case"],
        correctIndex: 1,
        explanation: "for loop paling optimal untuk perulangan dengan jumlah iterasi yang sudah pasti/terbatas (misalnya mengulang sebanyak 10 kali).",
      },
      {
        text: "Manakah penulisan nama variabel Python yang BENAR menurut konvensi snake_case?",
        options: ["namaMahasiswa", "nama_mahasiswa", "Nama-Mahasiswa", "nama mahasiswa"],
        correctIndex: 1,
        explanation: "snake_case menggunakan huruf kecil semua dan memisahkan kata menggunakan underscore (_). Ini konvensi standar dalam Python.",
      },
    ],
  };

  const questions = quizData[moduleId as string] || quizData.M0;
  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setIsAnswered(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);

      const passRate = (score / questions.length) * 100;
      if (passRate >= 60) {
        // Confetti splash
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Save module completion
        completeModule(moduleId as string);

        // If they got 100%, unlock perfectionist badge
        if (score === questions.length) {
          unlockBadge("perfectionist");
        }
      }
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="section-container" style={{ maxWidth: "600px", paddingTop: "var(--space-4)" }}>
      {/* Header Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-6)" }}>
        <button
          onClick={() => router.push(`/learn/${moduleId}`)}
          style={{
            background: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--border-color)",
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase" }}>
            Uji Pemahaman
          </span>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Kuis Evaluasi Modul
          </h2>
        </div>
      </div>

      {!quizFinished ? (
        <>
          {/* Question Index Progress */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
            <span>Soal {currentIdx + 1} dari {questions.length}</span>
            <span>Skor: {Math.round((score / questions.length) * 100)}%</span>
          </div>

          <div style={{ width: "100%", height: "6px", background: "var(--color-neutral-150)", borderRadius: "3px", overflow: "hidden", marginBottom: "var(--space-6)" }}>
            <div
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
                height: "100%",
                background: "var(--gradient-hero)",
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Quiz Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6) var(--space-8)",
              boxShadow: "var(--shadow-card)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h3 style={{ fontSize: "1.1875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: "var(--space-6)" }}>
              {currentQuestion.text}
            </h3>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "var(--space-6)" }}>
              {currentQuestion.options.map((opt, i) => {
                let optionStyle: React.CSSProperties = {
                  background: "var(--bg-page-alt)",
                  border: "1.5px solid var(--border-color)",
                  color: "var(--text-primary)",
                };

                if (isAnswered) {
                  if (i === currentQuestion.correctIndex) {
                    // Correct option
                    optionStyle = {
                      background: "rgba(34,197,94,0.12)",
                      border: "2px solid #22C55E",
                      color: "#15803D",
                      fontWeight: 700,
                    };
                  } else if (i === selectedIdx) {
                    // Wrong option clicked by user
                    optionStyle = {
                      background: "rgba(239,68,68,0.12)",
                      border: "2px solid #EF4444",
                      color: "#B91C1C",
                      fontWeight: 700,
                    };
                  } else {
                    optionStyle = {
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-muted)",
                      opacity: 0.6,
                    };
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: isAnswered ? 1 : 1.01 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.99 }}
                    onClick={() => handleOptionClick(i)}
                    disabled={isAnswered}
                    style={{
                      width: "100%",
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: isAnswered ? "default" : "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all var(--transition-fast)",
                      ...optionStyle,
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && i === currentQuestion.correctIndex && (
                      <CheckCircle size={20} weight="fill" color="#22C55E" />
                    )}
                    {isAnswered && i === selectedIdx && i !== currentQuestion.correctIndex && (
                      <XCircle size={20} weight="fill" color="#EF4444" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation box */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "var(--bg-page-alt)",
                    borderLeft: "4px solid var(--color-primary-500)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>💡 Pembahasan:</strong> {currentQuestion.explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="btn btn-primary"
              style={{ opacity: !isAnswered ? 0.5 : 1 }}
            >
              Lanjut Soal
            </button>
          </div>
        </>
      ) : (
        /* Quiz Summary Report Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-8)",
            textAlign: "center",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {score / questions.length >= 0.6 ? (
            <>
              <div style={{ fontSize: "5rem", marginBottom: "var(--space-4)" }}>🏆</div>
              <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Selamat! Kamu Lulus Kuis!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: "8px", marginBottom: "var(--space-6)" }}>
                Kamu menyelesaikan kuis dengan skor **{Math.round((score / questions.length) * 100)}%** ({score} dari {questions.length} benar).
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={() => router.push("/dashboard")} className="btn btn-primary">
                  Kembali ke Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "5rem", marginBottom: "var(--space-4)" }}>🥺</div>
              <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Kamu Belum Lulus, Jangan Menyerah!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: "8px", marginBottom: "var(--space-6)" }}>
                Nilai kamu **{Math.round((score / questions.length) * 100)}%** (passing grade kuis: 60%). Yuk ulangi sekali lagi biar paham!
              </p>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={handleRetry} className="btn btn-primary" style={{ background: "var(--color-primary-500)" }}>
                  <ArrowsClockwise size={16} weight="bold" /> Ulangi Kuis
                </button>
                <button onClick={() => router.push(`/learn/${moduleId}`)} className="btn btn-secondary">
                  Baca Materi Lagi
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
