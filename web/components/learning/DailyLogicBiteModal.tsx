"use client";

import React, { useState, useEffect } from "react";
import { Lightning, Flame, CheckCircle, XCircle, Sparkle, X, Trophy } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/lib/store/useUserStore";

interface LogicPuzzle {
  id: string;
  topic: string;
  code: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const DAILY_PUZZLES: LogicPuzzle[] = [
  {
    id: "pz-1",
    topic: "List & Indexing",
    code: `angka = [10, 20, 30, 40]\nprint(angka[-1])`,
    question: "Apa output dari program di atas?",
    options: ["10", "40", "30", "IndexError"],
    correctIdx: 1,
    explanation: "Indeks negatif `-1` di Python mengambil elemen paling terakhir dari sebuah list, yaitu 40.",
  },
  {
    id: "pz-2",
    topic: "String Replication",
    code: `a = "5"\nb = 3\nprint(a * b)`,
    question: "Apa hasil cetakan dari `a * b`?",
    options: ["15", "555", "Error", "5 5 5"],
    correctIdx: 1,
    explanation: "Mengalikan string dengan integer di Python akan menduplikasi teks sebanyak nilai integer ('5' * 3 = '555').",
  },
  {
    id: "pz-3",
    topic: "Boolean & Truthiness",
    code: `nama = ""\nif nama:\n    print("Ada nama")\nelse:\n    print("Kosong")`,
    question: "Apa output dari blok percabangan di atas?",
    options: ["Ada nama", "Kosong", "Error", "None"],
    correctIdx: 1,
    explanation: "String kosong `\"\"` di Python bernilai Falsy (False), sehingga blok `else` yang akan dieksekusi.",
  },
  {
    id: "pz-4",
    topic: "Modulo Arithmetic",
    code: `x = 17 % 5\nprint(x)`,
    question: "Berapa nilai `x` yang dicetak?",
    options: ["3.4", "2", "3", "1"],
    correctIdx: 1,
    explanation: "Operator modulo `%` menghasilkan sisa bagi integer. 17 dibagi 5 adalah 3 dengan sisa 2.",
  },
  {
    id: "pz-5",
    topic: "Integer Division",
    code: `hasil = 7 // 2\nprint(hasil)`,
    question: "Berapa hasil eksekusi `7 // 2`?",
    options: ["3.5", "3", "4", "3.0"],
    correctIdx: 1,
    explanation: "Operator floor division `//` membagi angka dan membulatkan ke bawah menghasilkan bilangan bulat integer (3).",
  },
  {
    id: "pz-6",
    topic: "Range Function",
    code: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`,
    question: "Berapa nilai akhir `total`?",
    options: ["6", "10", "4", "3"],
    correctIdx: 0,
    explanation: "`range(1, 4)` menghasilkan angka 1, 2, dan 3 (stop 4 tidak diikutkan). Total = 1 + 2 + 3 = 6.",
  },
  {
    id: "pz-7",
    topic: "List Append & Length",
    code: `buah = ["Apel", "Jeruk"]\nbuah.append("Mangga")\nprint(len(buah))`,
    question: "Berapa panjang list `buah` sekarang?",
    options: ["2", "3", "4", "None"],
    correctIdx: 1,
    explanation: "Metode `.append()` menambahkan satu item baru di akhir list, sehingga jumlah elemen menjadi 3.",
  },
  {
    id: "pz-8",
    topic: "String Slicing",
    code: `teks = "TRPL2026"\nprint(teks[:4])`,
    question: "Apa output dari slicing `teks[:4]`?",
    options: ["TRPL", "2026", "TRPL2", "T"],
    correctIdx: 0,
    explanation: "Slicing `[:4]` mengambil karakter dari indeks 0 hingga sebelum indeks 4, yaitu 'T', 'R', 'P', 'L'.",
  },
];

export function DailyLogicBiteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [puzzle, setPuzzle] = useState<LogicPuzzle>(DAILY_PUZZLES[0]);
  const addXP = useUserStore((s) => s.addXP);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    // Check if shown today
    const lastShown = localStorage.getItem("daily_logic_bite_date");
    const today = new Date().toISOString().split("T")[0];

    if (lastShown !== today) {
      const randomPuzzle = DAILY_PUZZLES[Math.floor(Math.random() * DAILY_PUZZLES.length)];
      setPuzzle(randomPuzzle);
      setIsOpen(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (selectedOpt === null) return;
    setSubmitted(true);

    if (selectedOpt === puzzle.correctIdx && user) {
      await addXP(25);
    }
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("daily_logic_bite_date", today);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            padding: "16px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(239,68,68,0.15) 100%)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ background: "#F59E0B", color: "#000", padding: "6px", borderRadius: "8px", display: "flex" }}>
                  <Flame size={20} weight="fill" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    Daily Logic Bite (Warm-Up 2 Menit)
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700 }}>
                    🔥 +25 XP & Pertahankan Streak Belajar!
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "20px" }}>
              {/* Code Snippet Box */}
              <div
                style={{
                  background: "#0D1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 16px",
                  fontFamily: "var(--font-code)",
                  fontSize: "0.85rem",
                  color: "#38BDF8",
                  marginBottom: "16px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {puzzle.code}
              </div>

              <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem", marginBottom: "12px" }}>
                {puzzle.question}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {puzzle.options.map((opt, idx) => {
                  let bg = "var(--bg-secondary)";
                  let border = "1px solid var(--border-color)";

                  if (selectedOpt === idx) {
                    bg = "rgba(56, 189, 248, 0.15)";
                    border = "1.5px solid #38BDF8";
                  }

                  if (submitted) {
                    if (idx === puzzle.correctIdx) {
                      bg = "rgba(16, 185, 129, 0.2)";
                      border = "1.5px solid #10B981";
                    } else if (selectedOpt === idx) {
                      bg = "rgba(239, 68, 68, 0.2)";
                      border = "1.5px solid #EF4444";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={submitted}
                      onClick={() => setSelectedOpt(idx)}
                      style={{
                        background: bg,
                        border,
                        borderRadius: "var(--radius-md)",
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: "0.85rem",
                        color: "var(--text-primary)",
                        cursor: submitted ? "default" : "pointer",
                        fontWeight: selectedOpt === idx ? 700 : 500,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{opt}</span>
                      {submitted && idx === puzzle.correctIdx && (
                        <CheckCircle size={18} weight="fill" color="#10B981" />
                      )}
                      {submitted && selectedOpt === idx && idx !== puzzle.correctIdx && (
                        <XCircle size={18} weight="fill" color="#EF4444" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result explanation */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "12px 14px",
                    background: selectedOpt === puzzle.correctIdx ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                    border: `1px solid ${selectedOpt === puzzle.correctIdx ? "#10B981" : "#F59E0B"}`,
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8rem",
                    color: "var(--text-primary)",
                    marginBottom: "16px",
                  }}
                >
                  <strong>{selectedOpt === puzzle.correctIdx ? "🎉 Jawaban Benar (+25 XP)!" : "💡 Pembahasan:"}</strong>{" "}
                  {puzzle.explanation}
                </motion.div>
              )}

              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOpt === null}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Kirim Jawaban
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Lanjut ke Dashboard
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
