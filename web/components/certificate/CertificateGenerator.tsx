"use client";

import React, { useRef } from "react";
import {
  SealCheck,
  DownloadSimple,
  Printer,
  ShareNetwork,
  LinkedinLogo,
  CheckCircle,
  Sparkle,
} from "@phosphor-icons/react";

interface CertificateGeneratorProps {
  studentName: string;
  completionDate?: string;
  totalXP: number;
  certNumber?: string;
}

export function CertificateGenerator({
  studentName,
  completionDate = "28 Agustus 2026",
  totalXP = 1450,
  certNumber = "TRPL-2026-MATRIK-0828",
}: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const shareText = encodeURIComponent(
      `Saya baru saja menyelesaikan Matrikulasi Pemrograman TRPL 2026 dengan perolehan ${totalXP} XP! Siap melangkah menjadi software engineer tangguh! 🚀`
    );
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`,
      "_blank"
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
      {/* Printable Certificate Frame */}
      <div
        ref={certRef}
        id="certificate-print-area"
        style={{
          width: "100%",
          maxWidth: "840px",
          background: "linear-gradient(135deg, #0B0F19 0%, #030712 100%)",
          border: "4px solid #F59E0B",
          borderRadius: "16px",
          padding: "40px",
          color: "#F8FAFC",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Background Watermark Pattern */}
        <div
          style={{
            position: "absolute",
            inset: "10px",
            border: "1px dashed rgba(245, 158, 11, 0.4)",
            borderRadius: "12px",
            pointerEvents: "none",
          }}
        />

        {/* Header Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "#F59E0B", color: "#000", padding: "6px 12px", borderRadius: "6px", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "1px" }}>
              TRPL 2026
            </div>
            <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Program Studi Teknologi Rekayasa Perangkat Lunak</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#F59E0B", fontSize: "0.8rem", fontWeight: 700 }}>
            <SealCheck size={18} weight="fill" />
            <span>TERVERIFIKASI RESMI</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <span style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "3px", color: "#94A3B8", fontWeight: 600 }}>
            Sertifikat Kelulusan & Kompetensi
          </span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "8px 0",
              letterSpacing: "-0.5px",
            }}
          >
            MATRIKULASI PEMROGRAMAN TRPL
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#CBD5E1", maxWidth: "600px", margin: "0 auto" }}>
            Diberikan sebagai pengakuan atas dedikasi dan keberhasilan menyelesaikan seluruh modul kurikulum logika pemrograman, algoritma dasar, dan mini-project.
          </p>
        </div>

        {/* Student Name */}
        <div style={{ textAlign: "center", margin: "32px 0" }}>
          <span style={{ fontSize: "0.8rem", color: "#94A3B8", textTransform: "uppercase" }}>Dianugerahkan Kepada:</span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "#38BDF8",
              margin: "6px 0",
              textDecoration: "underline",
              textUnderlineOffset: "8px",
              textDecorationColor: "rgba(56, 189, 248, 0.4)",
            }}
          >
            {studentName}
          </h2>
          <span style={{ fontSize: "0.9rem", color: "#E2E8F0", fontWeight: 600 }}>
            Telah Menyelesaikan 9 Modul Pembelajaran • Total Pencapaian: <strong style={{ color: "#F59E0B" }}>{totalXP} XP</strong>
          </span>
        </div>

        {/* Signatures & QR Code */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#F8FAFC" }}>Divisi Pemrograman HIMA TRPL</div>
            <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Koordinator Kurikulum & Dosen Pembina</div>
            <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "4px" }}>Tanggal: {completionDate}</div>
          </div>

          {/* QR Code Digital Seal */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                background: "#FFF",
                padding: "6px",
                borderRadius: "8px",
                boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* SVG QR Code Simulation */}
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" />
                <path fill="#000" d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm4-4h4v4h-4v-4z" />
              </svg>
            </div>
            <span style={{ fontSize: "0.68rem", color: "#F59E0B", fontWeight: 700, marginTop: "6px", fontFamily: "monospace" }}>
              {certNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={handlePrint} className="btn btn-primary" style={{ gap: "8px" }}>
          <Printer size={18} /> Cetak / Simpan PDF
        </button>
        <button onClick={handleShareLinkedIn} className="btn btn-secondary" style={{ gap: "8px", color: "#38BDF8" }}>
          <LinkedinLogo size={18} weight="fill" /> Bagikan ke LinkedIn
        </button>
      </div>
    </div>
  );
}
