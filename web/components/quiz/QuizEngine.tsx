"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, Star } from "@phosphor-icons/react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Props {
  questions: QuizQuestion[];
  moduleId: string;
  onComplete: (score: number, total: number) => void;
  onBack?: () => void;
}

export function QuizEngine({ questions, moduleId, onComplete, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete(score + (selected === question.correctIndex ? 1 : 0), questions.length);
    }
  };

  if (finished) {
    const finalScore = score + (selected === question.correctIndex ? 1 : 0);
    const pct = Math.round((finalScore / questions.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-4)" }}>
          {pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}
        </div>
        <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Kuis Selesai!
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Skor kamu: <strong style={{ color: "var(--color-primary-600)" }}>{finalScore}/{questions.length}</strong> ({pct}%)
        </p>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: "var(--color-neutral-150)",
            borderRadius: "var(--radius-full)",
            margin: "var(--space-4) 0",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            style={{ height: "100%", background: "var(--gradient-hero)", borderRadius: "var(--radius-full)" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>
          Soal {currentQ + 1} dari {questions.length}
        </span>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary-600)" }}>
          <Star size={14} weight="fill" /> {score} benar
        </span>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "var(--space-6)" }}>
        {questions.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background: idx < currentQ ? "var(--color-primary-500)" : idx === currentQ ? "var(--color-primary-300)" : "var(--color-neutral-150)",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-5)", lineHeight: 1.5 }}>
            {question.question}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {question.options.map((opt, idx) => {
              const isCorrect = answered && idx === question.correctIndex;
              const isWrong = answered && idx === selected && idx !== question.correctIndex;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: isCorrect ? "2px solid #22C55E" : isWrong ? "2px solid #EF4444" : "1.5px solid var(--border-color)",
                    background: isCorrect ? "rgba(34,197,94,0.08)" : isWrong ? "rgba(239,68,68,0.08)" : "var(--bg-card)",
                    cursor: answered ? "default" : "pointer",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    transition: "all var(--transition-fast)",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isCorrect ? "#22C55E" : isWrong ? "#EF4444" : "var(--color-neutral-150)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {isCorrect ? <CheckCircle size={16} weight="fill" /> : isWrong ? <XCircle size={16} weight="fill" /> : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "var(--space-4)",
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                background: selected === question.correctIndex ? "rgba(34,197,94,0.08)" : "rgba(255,107,0,0.08)",
                border: `1px solid ${selected === question.correctIndex ? "#22C55E" : "var(--border-color-strong)"}`,
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              <strong>{selected === question.correctIndex ? "✅ Benar!" : "❌ Kurang tepat"}</strong>
              <br />
              {question.explanation}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-6)" }}>
          <button onClick={handleNext} className="btn btn-primary">
            {currentQ < questions.length - 1 ? "Soal Berikutnya" : "Lihat Hasil"}
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}
