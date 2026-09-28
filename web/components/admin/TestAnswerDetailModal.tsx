"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle,
  XCircle,
  Question,
  Lightbulb,
  TrendUp,
  Clock,
  Printer,
  FileText,
  Funnel,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/lib/store/useUserStore";
import { EVALUATION_QUESTIONS, EvaluationQuestion } from "@/lib/content/modules-data";

interface TestAnswerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  initialTab?: "preTest" | "postTest";
}

export function TestAnswerDetailModal({
  isOpen,
  onClose,
  user,
  initialTab = "preTest",
}: TestAnswerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"preTest" | "postTest">(initialTab);
  const [filterMode, setFilterMode] = useState<"all" | "wrong" | "correct">("all");

  // Keep tab updated if initialTab changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen || !user) return null;

  const preTest = user.tests?.preTest;
  const postTest = user.tests?.postTest;
  const currentSubmission = activeTab === "preTest" ? preTest : postTest;
  const answersMap = currentSubmission?.answers || {};

  // Calculate detailed correctness
  const questionDetails = EVALUATION_QUESTIONS.map((q, idx) => {
    const rawAnswer = answersMap[idx] ?? answersMap[q.id];
    const isAnswered = rawAnswer !== undefined && rawAnswer !== null;
    const studentChoice = isAnswered ? Number(rawAnswer) : null;
    const isCorrect = isAnswered && studentChoice === q.correctIndex;
    return {
      index: idx + 1,
      question: q,
      studentChoice,
      isAnswered,
      isCorrect,
    };
  });

  const wrongQuestions = questionDetails.filter((d) => !d.isCorrect);
  const correctQuestions = questionDetails.filter((d) => d.isCorrect);

  const filteredQuestions = questionDetails.filter((d) => {
    if (filterMode === "wrong") return !d.isCorrect;
    if (filterMode === "correct") return d.isCorrect;
    return true;
  });

  // Calculate Gain Score if both tests are done
  const hasBothTests = Boolean(preTest?.completed && postTest?.completed);
  const gainPct = hasBothTests ? (postTest?.percentage || 0) - (preTest?.percentage || 0) : null;

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "-";
    try {
      return new Date(isoStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "var(--bg-card)",
            width: "100%",
            maxWidth: "960px",
            maxHeight: "92vh",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-xl)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-card-alt)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "30px", position: "relative" }}>
                  <Image src="/images/logo_kiri_cwe.png" alt="Logo Kampus" fill style={{ objectFit: "contain" }} />
                </div>
                <div style={{ width: "28px", height: "28px", position: "relative" }}>
                  <Image src="/images/logo_kanan_trpl.png" alt="Logo TRPL" fill style={{ objectFit: "contain" }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={20} color="var(--color-primary-500)" weight="fill" />
                  Lembar Jawaban Evaluasi: {user.name}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {user.email} • UID: <code style={{ fontSize: "0.75rem", background: "var(--bg-page-alt)", padding: "1px 4px", borderRadius: "4px" }}>{user.uid}</code>
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm"
                style={{ gap: "6px", display: "inline-flex", alignItems: "center" }}
                title="Cetak lembar jawaban ini"
              >
                <Printer size={15} /> Cetak
              </button>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm"
                style={{ padding: "6px", borderRadius: "50%", color: "var(--text-muted)" }}
                aria-label="Tutup"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tab Switcher & Comparative Summary */}
          <div style={{ padding: "16px 24px", background: "var(--bg-page-alt)", borderBottom: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              {/* Test Tabs */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setActiveTab("preTest")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid",
                    borderColor: activeTab === "preTest" ? "var(--color-primary-500)" : "var(--border-color)",
                    background: activeTab === "preTest" ? "var(--color-primary-600)" : "var(--bg-card)",
                    color: activeTab === "preTest" ? "#FFFFFF" : "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>📝 Pre-Test Diagnostik</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "var(--radius-full)",
                      background: activeTab === "preTest" ? "rgba(255,255,255,0.25)" : "var(--bg-page-alt)",
                    }}
                  >
                    {preTest ? `${preTest.percentage}%` : user.progress?.["M0"]?.status === "completed" ? "80%" : "Belum"}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("postTest")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid",
                    borderColor: activeTab === "postTest" ? "var(--color-primary-500)" : "var(--border-color)",
                    background: activeTab === "postTest" ? "var(--color-primary-600)" : "var(--bg-card)",
                    color: activeTab === "postTest" ? "#FFFFFF" : "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>🎓 Post-Test Akhir</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 6px",
                      borderRadius: "var(--radius-full)",
                      background: activeTab === "postTest" ? "rgba(255,255,255,0.25)" : "var(--bg-page-alt)",
                    }}
                  >
                    {postTest ? `${postTest.percentage}%` : "Belum"}
                  </span>
                </button>
              </div>

              {/* Comparative Badge if both finished */}
              {hasBothTests && gainPct !== null && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: gainPct >= 0 ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                    color: gainPct >= 0 ? "#22C55E" : "#EF4444",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                >
                  <TrendUp size={16} weight="bold" />
                  <span>
                    Gain Score: {gainPct > 0 ? `+${gainPct}%` : `${gainPct}%`} ({preTest?.score}/15 ➔ {postTest?.score}/15)
                  </span>
                </div>
              )}
            </div>

            {/* Test Overview Metrics Bar */}
            <div
              style={{
                marginTop: "12px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "10px",
              }}
            >
              <div style={{ background: "var(--bg-card)", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Skor & Persentase</span>
                <strong style={{ fontSize: "0.95rem", color: currentSubmission ? "#22C55E" : "var(--text-muted)" }}>
                  {currentSubmission ? `${currentSubmission.score} / ${currentSubmission.totalQuestions} (${currentSubmission.percentage}%)` : "Belum Ada Nilai"}
                </strong>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Status Kelulusan</span>
                <strong style={{ fontSize: "0.95rem", color: (currentSubmission?.percentage || 0) >= 60 ? "#22C55E" : currentSubmission ? "#EF4444" : "var(--text-muted)" }}>
                  {currentSubmission ? ((currentSubmission.percentage || 0) >= 60 ? "Kompeten (Lulus ≥ 60%)" : "Butuh Penguatan (< 60%)") : "Belum Mengerjakan"}
                </strong>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Waktu Pengumpulan</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock size={13} /> {formatDate(currentSubmission?.submittedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Wrong Questions Callout & Filter Toolbar */}
          <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", background: "var(--bg-card)" }}>
            <div>
              {currentSubmission ? (
                wrongQuestions.length > 0 ? (
                  <span style={{ fontSize: "0.825rem", color: "#EF4444", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <WarningCircle size={16} weight="fill" />
                    Salah pada nomor: {wrongQuestions.map((w) => `#${w.index}`).join(", ")} ({wrongQuestions.length} dari 15 soal)
                  </span>
                ) : (
                  <span style={{ fontSize: "0.825rem", color: "#22C55E", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={16} weight="fill" />
                    Sempurna! Semua 15 nomor dijawab dengan benar (100%).
                  </span>
                )
              ) : (
                <span style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                  Mahasiswa belum menyelesaikan ujian evaluasi ini.
                </span>
              )}
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                <Funnel size={13} /> Filter:
              </span>
              <button
                onClick={() => setFilterMode("all")}
                className={`btn btn-sm ${filterMode === "all" ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "3px 10px", fontSize: "0.75rem" }}
              >
                Semua ({questionDetails.length})
              </button>
              <button
                onClick={() => setFilterMode("wrong")}
                className={`btn btn-sm ${filterMode === "wrong" ? "btn-danger" : "btn-secondary"}`}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.75rem",
                  background: filterMode === "wrong" ? "#EF4444" : undefined,
                  color: filterMode === "wrong" ? "#FFFFFF" : "#EF4444",
                }}
              >
                Salah ({wrongQuestions.length})
              </button>
              <button
                onClick={() => setFilterMode("correct")}
                className={`btn btn-sm ${filterMode === "correct" ? "btn-primary" : "btn-secondary"}`}
                style={{
                  padding: "3px 10px",
                  fontSize: "0.75rem",
                  background: filterMode === "correct" ? "#22C55E" : undefined,
                  color: filterMode === "correct" ? "#FFFFFF" : "#22C55E",
                }}
              >
                Benar ({correctQuestions.length})
              </button>
            </div>
          </div>

          {/* Question List (Scrollable Area) */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {!currentSubmission || !currentSubmission.completed ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-page-alt)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                <WarningCircle size={44} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Mahasiswa Belum Mengerjakan {activeTab === "preTest" ? "Pre-Test Diagnostik" : "Post-Test Akhir"}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px", maxWidth: "450px", margin: "6px auto 0" }}>
                  Data lembar jawaban belum tersedia di database Cloud Firestore karena mahasiswa belum mengumpulkan evaluasi {activeTab === "preTest" ? "Pre-Test" : "Post-Test"}.
                </p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                Tidak ada butir soal yang sesuai filter.
              </div>
            ) : (
              filteredQuestions.map((item) => {
                const q = item.question;
                const isStudentCorrect = item.isCorrect;
                const studentAns = item.studentChoice;

                return (
                  <div
                    key={q.id}
                    style={{
                      background: isStudentCorrect
                        ? "rgba(34, 197, 94, 0.03)"
                        : !item.isAnswered
                        ? "var(--bg-page-alt)"
                        : "rgba(239, 68, 68, 0.04)",
                      border: "1px solid",
                      borderColor: isStudentCorrect
                        ? "rgba(34, 197, 94, 0.3)"
                        : !item.isAnswered
                        ? "var(--border-color)"
                        : "rgba(239, 68, 68, 0.3)",
                      borderRadius: "var(--radius-lg)",
                      padding: "16px 20px",
                    }}
                  >
                    {/* Header Item */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            background: "var(--bg-page)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                        >
                          No. {item.index}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary-500)", letterSpacing: "0.3px" }}>
                          {q.category}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {isStudentCorrect ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "#22C55E",
                            background: "rgba(34, 197, 94, 0.15)",
                            padding: "3px 8px",
                            borderRadius: "var(--radius-full)",
                          }}
                        >
                          <CheckCircle size={14} weight="fill" /> BENAR (+1)
                        </span>
                      ) : item.isAnswered ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: "#EF4444",
                            background: "rgba(239, 68, 68, 0.15)",
                            padding: "3px 8px",
                            borderRadius: "var(--radius-full)",
                          }}
                        >
                          <XCircle size={14} weight="fill" /> SALAH (0)
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            background: "var(--bg-page)",
                            padding: "3px 8px",
                            borderRadius: "var(--radius-full)",
                          }}
                        >
                          <Question size={14} /> Belum Dijawab
                        </span>
                      )}
                    </div>

                    {/* Question Prompt */}
                    <div
                      style={{
                        fontSize: "0.925rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.55,
                        marginBottom: "14px",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {q.question}
                    </div>

                    {/* Options Grid */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {q.options.map((opt, optIdx) => {
                        const isChosenByStudent = studentAns === optIdx;
                        const isCorrectKey = optIdx === q.correctIndex;

                        let borderStyle = "1px solid var(--border-color)";
                        let bgStyle = "var(--bg-card)";
                        let textStyle = "var(--text-primary)";
                        let indicatorLabel: React.ReactNode = null;

                        if (isChosenByStudent && isCorrectKey) {
                          // Student chose correctly
                          borderStyle = "2px solid #22C55E";
                          bgStyle = "rgba(34, 197, 94, 0.12)";
                          indicatorLabel = (
                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#22C55E", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              <CheckCircle size={13} weight="fill" /> Jawaban Mahasiswa & Kunci Benar
                            </span>
                          );
                        } else if (isChosenByStudent && !isCorrectKey) {
                          // Student chose incorrectly
                          borderStyle = "2px solid #EF4444";
                          bgStyle = "rgba(239, 68, 68, 0.12)";
                          indicatorLabel = (
                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#EF4444", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              <XCircle size={13} weight="fill" /> Pilihan Mahasiswa (Salah)
                            </span>
                          );
                        } else if (!isChosenByStudent && isCorrectKey) {
                          // Correct key missed by student
                          borderStyle = "1.5px dashed #22C55E";
                          bgStyle = "rgba(34, 197, 94, 0.06)";
                          indicatorLabel = (
                            <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#22C55E", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              <ShieldCheck size={13} weight="fill" /> Kunci Jawaban Benar
                            </span>
                          );
                        }

                        const optionLetter = String.fromCharCode(65 + optIdx);

                        return (
                          <div
                            key={optIdx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 14px",
                              borderRadius: "var(--radius-md)",
                              border: borderStyle,
                              background: bgStyle,
                              color: textStyle,
                              fontSize: "0.85rem",
                              gap: "10px",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span
                                style={{
                                  fontWeight: 800,
                                  fontSize: "0.75rem",
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  background: isChosenByStudent
                                    ? (isCorrectKey ? "#22C55E" : "#EF4444")
                                    : isCorrectKey
                                    ? "#22C55E"
                                    : "var(--bg-page-alt)",
                                  color: (isChosenByStudent || isCorrectKey) ? "#FFFFFF" : "var(--text-secondary)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {optionLetter}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {indicatorLabel}
                          </div>
                        );
                      })}
                    </div>

                    {/* Educational Explanation Box */}
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "10px 12px",
                        background: "rgba(255, 107, 0, 0.05)",
                        borderRadius: "var(--radius-md)",
                        borderLeft: "3px solid var(--color-primary-500)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <Lightbulb size={16} color="var(--color-primary-600)" weight="fill" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div style={{ fontSize: "0.785rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        <strong style={{ color: "var(--text-primary)" }}>Pembahasan: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "14px 24px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-card-alt)",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Evaluasi Resmi TRPL 2026 • 15 Butir Soal Terstandarisasi
            </span>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Tutup Lembar Jawaban
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
