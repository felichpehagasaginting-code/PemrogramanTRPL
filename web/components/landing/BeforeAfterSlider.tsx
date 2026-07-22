"use client";

import { useState } from "react";
import { XCircle, CheckCircle, ArrowsLeftRight } from "@phosphor-icons/react";

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 var(--space-4)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <h3 style={{ fontSize: "1.375rem", fontWeight: 800 }}>
          🔄 Transformasi Mahasiswa: Sebelum vs Sesudah Matrikulasi
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Geser slider di bawah untuk melihat perbedaan kemampuan maba setelah menyelesaikan platform matrikulasi TRPL!
        </p>
      </div>

      {/* Comparison Container */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          position: "relative",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Before Column */}
        <div style={{ opacity: sliderPos < 20 ? 0.3 : 1, transition: "opacity 0.2s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--error-color)", fontWeight: 700, marginBottom: "12px" }}>
            <XCircle size={20} /> SEBELUM MATRIKULASI
          </div>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <li>Bingung cara membuat folder project koding yang benar.</li>
            <li>Takut saat melihat tampilan Terminal / Command Line.</li>
            <li>Bingung membaca pesan error Python saat koding.</li>
            <li>Belum punya portofolio aplikasi koding buatan sendiri.</li>
          </ul>
        </div>

        {/* After Column */}
        <div style={{ opacity: sliderPos > 80 ? 0.3 : 1, transition: "opacity 0.2s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success-color)", fontWeight: 700, marginBottom: "12px" }}>
            <CheckCircle size={20} /> SESUDAH MATRIKULASI
          </div>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.8 }}>
            <li>Mahir menata workspace & aturan folder terstruktur.</li>
            <li>Lancar mengeksekusi perintah CLI & Python WASM.</li>
            <li>Paham memecahkan error dibantu AI Mentor interaktif.</li>
            <li>Memiliki karya Mini Project kalkulator/sistem kasir sendiri!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
