"use client";

import React from "react";
import {
  Printer,
  X,
  FilePdf,
  Certificate,
  ChartBar,
  Student,
  CheckCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/lib/store/useUserStore";

interface AcademicGradebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
}

export function AcademicGradebookModal({
  isOpen,
  onClose,
  users,
}: AcademicGradebookModalProps) {
  // Convert XP and module completion to academic letter grade
  const gradedStudents = users.map((u) => {
    const totalModules = 9; // M0 to M8
    const completedCount = Object.values(u.progress || {}).filter(
      (p) => p.status === "completed"
    ).length;

    // Scale score based on XP and module completion (Max 100)
    const progressScore = (completedCount / totalModules) * 60; // 60% weight from modules
    const xpBonus = Math.min(40, ((u.xp || 0) / 1200) * 40); // 40% weight from XP
    const finalScore = Math.round(progressScore + xpBonus);

    let letterGrade = "E";
    let gradePoint = 0.0;
    if (finalScore >= 85) {
      letterGrade = "A";
      gradePoint = 4.0;
    } else if (finalScore >= 78) {
      letterGrade = "B+";
      gradePoint = 3.5;
    } else if (finalScore >= 70) {
      letterGrade = "B";
      gradePoint = 3.0;
    } else if (finalScore >= 62) {
      letterGrade = "C+";
      gradePoint = 2.5;
    } else if (finalScore >= 55) {
      letterGrade = "C";
      gradePoint = 2.0;
    } else if (finalScore >= 45) {
      letterGrade = "D";
      gradePoint = 1.0;
    } else {
      letterGrade = "E";
      gradePoint = 0.0;
    }

    return {
      uid: u.uid,
      name: u.name,
      email: u.email,
      completedCount,
      xp: u.xp || 0,
      finalScore,
      letterGrade,
      gradePoint,
      cpl1: u.progress?.["M2"]?.status === "completed" ? 100 : 50,
      cpl2: u.progress?.["M5"]?.status === "completed" ? 100 : 60,
      cpl3: u.progress?.["M7"]?.status === "completed" ? 100 : 40,
      cpl4: u.progress?.["M8"]?.status === "completed" ? 100 : 30,
    };
  });

  // Calculate grade distribution
  const distribution = {
    A: gradedStudents.filter((s) => s.letterGrade === "A").length,
    "B+": gradedStudents.filter((s) => s.letterGrade === "B+").length,
    B: gradedStudents.filter((s) => s.letterGrade === "B").length,
    "C+": gradedStudents.filter((s) => s.letterGrade === "C+").length,
    C: gradedStudents.filter((s) => s.letterGrade === "C").length,
    D: gradedStudents.filter((s) => s.letterGrade === "D").length,
    E: gradedStudents.filter((s) => s.letterGrade === "E").length,
  };

  const avgFinalScore =
    gradedStudents.length > 0
      ? Math.round(
          gradedStudents.reduce((acc, s) => acc + s.finalScore, 0) /
            gradedStudents.length
        )
      : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="print-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            padding: "20px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "880px",
              maxHeight: "90vh",
              background: "#ffffff",
              color: "#111827",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
          >
            {/* Action Bar (Hidden on print) */}
            <div
              className="no-print"
              style={{
                padding: "12px 24px",
                background: "#f3f4f6",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FilePdf size={20} color="#EF4444" weight="fill" />
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1f2937" }}>
                  Rekapitulasi Nilai & Laporan Capaian Pembelajaran Lulusan (CPL)
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handlePrint}
                  className="btn btn-sm btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#2563eb",
                    color: "#ffffff",
                  }}
                >
                  <Printer size={16} weight="fill" /> Cetak / Simpan PDF
                </button>
                <button
                  onClick={onClose}
                  className="btn btn-sm"
                  style={{ background: "#e5e7eb", color: "#374151" }}
                >
                  <X size={16} /> Tutup
                </button>
              </div>
            </div>

            {/* Printable Document Body (A4 Official Format) */}
            <div
              id="printable-binder-sheet"
              style={{
                padding: "36px 40px",
                overflowY: "auto",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.5,
                background: "#ffffff",
                color: "#111827",
              }}
            >
              {/* University / Prodi Letterhead */}
              <div
                style={{
                  borderBottom: "2px solid #111827",
                  paddingBottom: "12px",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                <h2 style={{ fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                  PROGRAM STUDI SARJANA TERAPAN TEKNOLOGI REKAYASA PERANGKAT LUNAK (TRPL)
                </h2>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#374151", margin: "4px 0 0" }}>
                  BERITA ACARA & REKAPITULASI NILAI AKHIR MATRIKULASI PEMROGRAMAN 2026
                </h3>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Tahun Akademik 2026/2027 • Status: Terverifikasi Sistem Auto-Grader
                </span>
              </div>

              {/* Summary KPIs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ border: "1px solid #e5e7eb", padding: "10px", borderRadius: "6px", background: "#f9fafb" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Total Mahasiswa:</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{gradedStudents.length} Mahasiswa</div>
                </div>
                <div style={{ border: "1px solid #e5e7eb", padding: "10px", borderRadius: "6px", background: "#f9fafb" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Rata-Rata Nilai Akhir:</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2563eb" }}>{avgFinalScore} / 100</div>
                </div>
                <div style={{ border: "1px solid #e5e7eb", padding: "10px", borderRadius: "6px", background: "#f9fafb" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Tingkat Kelulusan:</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#16a34a" }}>
                    {gradedStudents.length > 0
                      ? Math.round(
                          (gradedStudents.filter((s) => s.finalScore >= 55).length /
                            gradedStudents.length) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>

              {/* Grade Distribution Bar */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 800, margin: "0 0 8px" }}>
                  📊 Distribusi Nilai Huruf:
                </h4>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Object.entries(distribution).map(([grade, count]) => (
                    <div
                      key={grade}
                      style={{
                        flex: 1,
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "6px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{grade}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{count} org</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Grade Table */}
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 800, margin: "0 0 8px" }}>
                  📋 Daftar Nilai Mahasiswa & Capaian CPL:
                </h4>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.75rem",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f3f4f6", borderBottom: "1.5px solid #d1d5db" }}>
                      <th style={{ padding: "6px 8px" }}>No</th>
                      <th style={{ padding: "6px 8px" }}>Nama Mahasiswa</th>
                      <th style={{ padding: "6px 8px" }}>Email / Akun</th>
                      <th style={{ padding: "6px 8px", textAlign: "center" }}>Modul Selesai</th>
                      <th style={{ padding: "6px 8px", textAlign: "center" }}>XP</th>
                      <th style={{ padding: "6px 8px", textAlign: "center" }}>Skor Angka</th>
                      <th style={{ padding: "6px 8px", textAlign: "center" }}>Nilai Huruf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradedStudents.map((s, idx) => (
                      <tr
                        key={s.uid}
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          background: idx % 2 === 0 ? "transparent" : "#fafafa",
                        }}
                      >
                        <td style={{ padding: "6px 8px" }}>{idx + 1}</td>
                        <td style={{ padding: "6px 8px", fontWeight: 700 }}>{s.name}</td>
                        <td style={{ padding: "6px 8px", color: "#6b7280" }}>{s.email}</td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          {s.completedCount} / 9
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>{s.xp}</td>
                        <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 700 }}>
                          {s.finalScore}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            textAlign: "center",
                            fontWeight: 900,
                            color: s.letterGrade === "A" ? "#16a34a" : s.letterGrade === "E" ? "#dc2626" : "#2563eb",
                          }}
                        >
                          {s.letterGrade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures Area */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "36px",
                  fontSize: "0.8rem",
                  color: "#1f2937",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div>Mengetahui,</div>
                  <div style={{ fontWeight: 700 }}>Koordinator Asisten Lab TRPL</div>
                  <div style={{ height: "48px" }}></div>
                  <div style={{ fontWeight: 800 }}>( Tim Asisten TRPL 2026 )</div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div>Jakarta, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                  <div style={{ fontWeight: 700 }}>Dosen Pengampu Matrikulasi TRPL</div>
                  <div style={{ height: "48px" }}></div>
                  <div style={{ fontWeight: 800 }}>( Felich Pehagasa Ginting, S.Tr.Kom. )</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
