"use client";

import React from "react";
import { Printer, X, FilePdf, BookOpen, Sparkle, NotePencil } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface PrintableSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  moduleTitle: string;
  moduleAnalogy?: string;
  cheatSheetContent?: string;
  keyPoints?: string[];
}

export function PrintableSummaryModal({
  isOpen,
  onClose,
  moduleId,
  moduleTitle,
  moduleAnalogy,
  cheatSheetContent,
  keyPoints = [],
}: PrintableSummaryProps) {
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
            background: "rgba(0, 0, 0, 0.6)",
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
              maxWidth: "780px",
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
                  Pratinjau Rangkuman Binder Cetak A4
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handlePrint}
                  className="btn btn-sm btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "6px", background: "#2563eb", color: "#ffffff" }}
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

            {/* Printable Document Body (A4 Styled) */}
            <div
              id="printable-binder-sheet"
              style={{
                padding: "36px 40px",
                overflowY: "auto",
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
                background: "#ffffff",
                color: "#111827",
              }}
            >
              {/* Document Header */}
              <div style={{ borderBottom: "2px solid #111827", paddingBottom: "16px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#4b5563" }}>
                      TRPL 2026 • LEMBAR CONTEKAN MATRIKULASI
                    </span>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 900, margin: "4px 0 0", color: "#111827" }}>
                      Modul {moduleId}: {moduleTitle}
                    </h1>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#6b7280" }}>
                    <div>Nama Maba: ____________________</div>
                    <div>NIM: ____________________</div>
                  </div>
                </div>
              </div>

              {/* Analogy & Concept Box */}
              {moduleAnalogy && (
                <div
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderLeft: "4px solid #2563eb",
                    padding: "12px 16px",
                    borderRadius: "6px",
                    marginBottom: "20px",
                    fontSize: "0.875rem",
                  }}
                >
                  <strong>💡 Analogi Intuitif:</strong> {moduleAnalogy}
                </div>
              )}

              {/* Cheat Sheet Code Section */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "8px", color: "#1f2937", display: "flex", alignItems: "center", gap: "6px" }}>
                  <BookOpen size={18} /> Contekan Sintaks Kunci
                </h3>
                <pre
                  style={{
                    background: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "14px",
                    fontSize: "0.825rem",
                    fontFamily: "monospace",
                    color: "#111827",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                  }}
                >
                  <code>
                    {cheatSheetContent ||
                      `# Sintaks Kunci Modul ${moduleId}
# Contoh Deklarasi:
data = [10, 20, 30]

# Loop / Logika:
for item in data:
    if item > 15:
        print("Item:", item)`}
                  </code>
                </pre>
              </div>

              {/* Key Takeaways */}
              {keyPoints.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "8px", color: "#1f2937" }}>
                    ⭐ Hal Penting yang Wajib Diingat
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#374151" }}>
                    {keyPoints.map((pt, idx) => (
                      <li key={idx} style={{ marginBottom: "4px" }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Binder Notes Dotted Section */}
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "12px", color: "#1f2937", display: "flex", alignItems: "center", gap: "6px" }}>
                  <NotePencil size={18} /> Catatan Tambahan Pribadi
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ borderBottom: "1px dashed #9ca3af", height: "18px" }}></div>
                  <div style={{ borderBottom: "1px dashed #9ca3af", height: "18px" }}></div>
                  <div style={{ borderBottom: "1px dashed #9ca3af", height: "18px" }}></div>
                  <div style={{ borderBottom: "1px dashed #9ca3af", height: "18px" }}></div>
                </div>
              </div>

              {/* Document Footer */}
              <div style={{ marginTop: "32px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#9ca3af" }}>
                <span>Platform Pembelajaran Matrikulasi Pemrograman TRPL 2026</span>
                <span>Halaman 1 dari 1</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
