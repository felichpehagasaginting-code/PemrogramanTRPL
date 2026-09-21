"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  SealCheck,
  Printer,
  LinkedinLogo,
  ShareNetwork,
} from "@phosphor-icons/react";
import { QRCodeSVG } from "./QRCodeSVG";

interface CertificateGeneratorProps {
  studentName: string;
  completionDate?: string;
  totalXP?: number;
  certNumber?: string;
}

export function CertificateGenerator({
  studentName,
  completionDate = "28 Agustus 2026",
  totalXP = 1450,
  certNumber = "TRPL-2026-MATRIK-0828",
}: CertificateGeneratorProps) {
  const certRef = useRef<HTMLDivElement | null>(null);
  const [verifyUrl, setVerifyUrl] = useState(`https://pemrograman-trpl-2026.web.app/verify/${certNumber}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVerifyUrl(`${window.location.origin}/verify/${certNumber}`);
    }
  }, [certNumber]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const shareText = encodeURIComponent(
      `Saya resmi menyelesaikan Matrikulasi Pemrograman TRPL 2026 dengan perolehan ${totalXP} XP! Verifikasi: ${verifyUrl} 🚀`
    );
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${shareText}`,
      "_blank"
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
      {/* Print styles */}
      <style>{`
        @page {
          size: landscape;
          margin: 0;
        }
        @media print {
          html, body {
            background: #030712 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #certificate-print-area, #certificate-print-area * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #certificate-print-area {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 95vw !important;
            max-width: 1000px !important;
            border: 4px solid #F59E0B !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Printable Certificate Frame */}
      <div
        ref={certRef}
        id="certificate-print-area"
        style={{
          width: "100%",
          maxWidth: "860px",
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
            inset: "12px",
            border: "1px dashed rgba(245, 158, 11, 0.35)",
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
            Sertifikat Kelulusan &amp; Kompetensi
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

        {/* Signatures & Dynamic QR Code */}
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
          {/* Signatures */}
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#F8FAFC" }}>Ketua Divisi Pemrograman</div>
              <div style={{ fontSize: "0.75rem", color: "#F59E0B" }}>Lead Instructor Matrikulasi 2026</div>
              <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "4px" }}>Divisi Pemrograman TRPL</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#F8FAFC" }}>Ketua Program Studi TRPL</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Dosen Pembina Kemahasiswaan</div>
              <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "4px" }}>Tanggal: {completionDate}</div>
            </div>
          </div>

          {/* Dynamic Vector QR Code Digital Seal */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "82px",
                height: "82px",
                background: "#FFFFFF",
                padding: "6px",
                borderRadius: "8px",
                boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QRCodeSVG value={verifyUrl} size={70} />
            </div>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.68rem",
                color: "#F59E0B",
                fontWeight: 700,
                marginTop: "6px",
                fontFamily: "monospace",
                textDecoration: "none",
              }}
              title="Klik untuk verifikasi sertifikat"
            >
              {certNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={handlePrint} className="btn btn-primary" style={{ gap: "8px" }}>
          <Printer size={18} weight="bold" /> Cetak / Simpan PDF
        </button>
        <button onClick={handleShareLinkedIn} className="btn btn-secondary" style={{ gap: "8px", color: "#38BDF8" }}>
          <LinkedinLogo size={18} weight="fill" /> Bagikan ke LinkedIn
        </button>
      </div>
    </div>
  );
}
