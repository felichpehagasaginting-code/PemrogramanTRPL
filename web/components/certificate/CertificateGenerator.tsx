"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  SealCheck,
  Printer,
  LinkedinLogo,
  ShareNetwork,
  InstagramLogo,
  Sparkle,
  DownloadSimple,
  X,
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

  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
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
            background: #180D30 !important;
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
            max-width: 1020px !important;
            border: 4px solid #D4AF37 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Printable Certificate Frame - Non-AI-Slop Solid Royal Deep Purple & Warm Gold */}
      <div
        ref={certRef}
        id="certificate-print-area"
        style={{
          width: "100%",
          maxWidth: "880px",
          backgroundColor: "#180D30",
          border: "4px solid #D4AF37",
          borderRadius: "16px",
          padding: "36px 40px",
          color: "#FFFBEB",
          position: "relative",
          boxShadow: "0 24px 60px rgba(10, 5, 20, 0.75)",
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Inner Guilloche / Double Gold Border Line */}
        <div
          style={{
            position: "absolute",
            inset: "10px",
            border: "1.5px solid rgba(212, 175, 55, 0.5)",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "15px",
            border: "0.5px solid rgba(212, 175, 55, 0.25)",
            borderRadius: "7px",
            pointerEvents: "none",
          }}
        />

        {/* Header Badges with Official Logos */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            position: "relative",
            zIndex: 2,
            borderBottom: "1px solid rgba(212, 175, 55, 0.3)",
            paddingBottom: "18px",
          }}
        >
          {/* Logo Sisi Kiri: Institusi CWE */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "68px", height: "50px", position: "relative", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
              <Image
                src="/images/logo_kiri_cwe.png"
                alt="Logo Kampus CWE"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "1.5px", color: "#F5E6BE" }}>
                POLITEKNIK KELAPA SAWIT CITRA WIDYA EDUKASI
              </div>
              <div style={{ fontSize: "0.75rem", color: "#CBD5E1", letterSpacing: "0.5px", marginTop: "2px" }}>
                Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak
              </div>
            </div>
          </div>

          {/* Logo Sisi Kanan: TRPL & Seal */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#D4AF37",
                fontSize: "0.72rem",
                fontWeight: 700,
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(212, 175, 55, 0.4)",
                letterSpacing: "0.5px",
              }}
            >
              <SealCheck size={16} weight="fill" />
              <span>DEWAN UJI RESMI</span>
            </div>
            <div style={{ width: "48px", height: "48px", position: "relative", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
              <Image
                src="/images/logo_kanan_trpl.png"
                alt="Logo TRPL"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Certificate Title & Decree Info */}
        <div style={{ textAlign: "center", margin: "16px 0 20px 0", position: "relative", zIndex: 2 }}>
          <div
            style={{
              textTransform: "uppercase",
              fontSize: "0.8rem",
              letterSpacing: "4px",
              color: "#D4AF37",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            SERTIFIKAT KELULUSAN &amp; KOMPETENSI
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
              fontWeight: 900,
              color: "#FFFBEB",
              margin: "4px 0 8px 0",
              letterSpacing: "0.5px",
            }}
          >
            MATRIKULASI PEMROGRAMAN TRPL
          </h1>
          <div
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              color: "#CBD5E1",
              backgroundColor: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              borderRadius: "4px",
              padding: "4px 14px",
              letterSpacing: "1px",
              fontWeight: 600,
            }}
          >
            SK KELULUSAN NO: 042/CWE-TRPL/SK-MATRIK/2026
          </div>
        </div>

        {/* Recipient Statement */}
        <div style={{ textAlign: "center", margin: "24px 0", position: "relative", zIndex: 2 }}>
          <span style={{ fontSize: "0.85rem", color: "#CBD5E1", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>
            Diberikan kepada:
          </span>

          {/* Student Name with Authentic Cursive Script (Huruf Tegak Bersambung) */}
          <div
            style={{
              fontFamily: "var(--font-script), 'Great Vibes', cursive",
              fontSize: "clamp(2.75rem, 5.5vw, 4rem)",
              fontWeight: 400,
              color: "#FFFBEB",
              margin: "6px 0 10px 0",
              lineHeight: 1.15,
              textShadow: "0 2px 12px rgba(212, 175, 55, 0.35)",
            }}
          >
            {studentName}
          </div>

          <p
            style={{
              fontSize: "0.88rem",
              color: "#CBD5E1",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Telah menyelesaikan seluruh rangkaian 9 modul matrikulasi dasar pemrograman, logika algoritma, dan proyek terapan dengan akumulasi pencapaian predikat kelulusan sebesar{" "}
            <strong style={{ color: "#F5E6BE", fontWeight: 700 }}>{totalXP} XP</strong>.
          </p>
        </div>

        {/* Signatures & Dynamic QR Code Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(212, 175, 55, 0.3)",
            position: "relative",
            zIndex: 2,
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Signatures */}
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            <div>
              <div style={{ height: "40px", display: "flex", alignItems: "flex-end", marginBottom: "6px" }}>
                <span style={{ fontFamily: "var(--font-script), 'Great Vibes', cursive", fontSize: "1.75rem", color: "#F5E6BE" }}>
                  Felich P. Ginting
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#FFFBEB", borderTop: "1px solid rgba(212, 175, 55, 0.5)", paddingTop: "4px" }}>
                Felich Pehagasa Ginting
              </div>
              <div style={{ fontSize: "0.75rem", color: "#D4AF37", fontWeight: 600 }}>Instruktur Utama Matrikulasi 2026</div>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Divisi Pemrograman TRPL CWE</div>
            </div>

            <div>
              <div style={{ height: "40px", display: "flex", alignItems: "flex-end", marginBottom: "6px" }}>
                <span style={{ fontFamily: "var(--font-script), 'Great Vibes', cursive", fontSize: "1.75rem", color: "#F5E6BE" }}>
                  Dosen Pembina
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#FFFBEB", borderTop: "1px solid rgba(212, 175, 55, 0.5)", paddingTop: "4px" }}>
                Ketua Program Studi TRPL
              </div>
              <div style={{ fontSize: "0.75rem", color: "#D4AF37", fontWeight: 600 }}>NIDN: 0418059001</div>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Diterbitkan: {completionDate}</div>
            </div>
          </div>

          {/* Dynamic Vector QR Code Digital Seal */}
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: "84px",
                height: "84px",
                backgroundColor: "#FFFFFF",
                padding: "6px",
                borderRadius: "8px",
                boxShadow: "0 0 16px rgba(212, 175, 55, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QRCodeSVG value={verifyUrl} size={72} />
            </div>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.68rem",
                color: "#D4AF37",
                fontWeight: 700,
                marginTop: "6px",
                fontFamily: "monospace",
                textDecoration: "none",
                letterSpacing: "0.5px",
              }}
              title="Klik untuk verifikasi sertifikat"
            >
              {certNumber}
            </a>
            <span style={{ fontSize: "0.6rem", color: "#94A3B8", marginTop: "2px" }}>
              Verifikasi Resmi Dikti &amp; Kampus
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={handlePrint} className="btn btn-primary" style={{ gap: "8px", backgroundColor: "#D4AF37", color: "#180D30", fontWeight: 700, borderColor: "#D4AF37" }}>
          <Printer size={18} weight="bold" /> Cetak / Simpan PDF
        </button>
        <button
          onClick={() => setStoryModalOpen(true)}
          className="btn btn-secondary"
          style={{ gap: "8px", backgroundColor: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(212, 175, 55, 0.5)", color: "#F5E6BE" }}
        >
          <InstagramLogo size={18} weight="fill" /> Kartu Story Medsos (9:16)
        </button>
        <button onClick={handleShareLinkedIn} className="btn btn-secondary" style={{ gap: "8px", color: "#38BDF8" }}>
          <LinkedinLogo size={18} weight="fill" /> Bagikan ke LinkedIn
        </button>
      </div>

      {/* Vertical 9:16 Social Story Modal with Matching Royal Purple & Warm Gold Aesthetic */}
      {storyModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(10, 5, 20, 0.8)",
            backdropFilter: "blur(8px)",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "24px",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1.5px solid var(--border-color)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#D4AF37", fontWeight: 700, fontSize: "0.9rem" }}>
                <Sparkle size={18} weight="fill" />
                <span>Format Instagram / WhatsApp Story</span>
              </div>
              <button onClick={() => setStoryModalOpen(false)} className="btn btn-sm btn-ghost">
                <X size={20} />
              </button>
            </div>

            {/* Render Vertical 9:16 Card - Royal Purple & Gold */}
            <div
              id="story-card-preview"
              style={{
                width: "270px",
                height: "480px",
                backgroundColor: "#180D30",
                border: "3px solid #D4AF37",
                borderRadius: "18px",
                padding: "22px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              {/* Inner Decorative Border */}
              <div
                style={{
                  position: "absolute",
                  inset: "8px",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  borderRadius: "12px",
                  pointerEvents: "none",
                }}
              />

              {/* Top Logos */}
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", position: "relative", zIndex: 2 }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "3px 6px", borderRadius: "5px" }}>
                  <Image src="/images/logo_kiri_cwe.png" alt="CWE" width={30} height={18} style={{ objectFit: "contain" }} />
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#D4AF37", letterSpacing: "1px" }}>TRPL 2026</span>
                <div style={{ backgroundColor: "#FFFFFF", padding: "3px 6px", borderRadius: "5px" }}>
                  <Image src="/images/logo_kanan_trpl.png" alt="TRPL" width={30} height={18} style={{ objectFit: "contain" }} />
                </div>
              </div>

              {/* Center Content */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative", zIndex: 2 }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    border: "2px solid #D4AF37",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 16px rgba(212, 175, 55, 0.4)",
                  }}
                >
                  <SealCheck size={28} color="#D4AF37" weight="fill" />
                </div>
                <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "2px", color: "#D4AF37", fontWeight: 700 }}>
                  SERTIFIKAT RESMI KELULUSAN
                </span>

                {/* Cursive Name in Story */}
                <h3
                  style={{
                    fontFamily: "var(--font-script), 'Great Vibes', cursive",
                    fontSize: "1.75rem",
                    fontWeight: 400,
                    color: "#FFFBEB",
                    margin: "2px 0",
                    lineHeight: 1.2,
                    textShadow: "0 2px 8px rgba(212, 175, 55, 0.3)",
                  }}
                >
                  {studentName}
                </h3>

                <span style={{ fontSize: "0.68rem", color: "#CBD5E1", lineHeight: 1.3 }}>
                  Resmi Menuntaskan Seluruh Modul Matrikulasi Pemrograman TRPL
                </span>
                <div
                  style={{
                    backgroundColor: "rgba(212, 175, 55, 0.12)",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    borderRadius: "20px",
                    padding: "3px 12px",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#F5E6BE",
                    marginTop: "4px",
                  }}
                >
                  Akumulasi: {totalXP} XP
                </div>
              </div>

              {/* Bottom QR Seal */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", position: "relative", zIndex: 2 }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "4px", borderRadius: "6px" }}>
                  <QRCodeSVG value={verifyUrl} size={50} />
                </div>
                <span style={{ fontSize: "0.58rem", color: "#D4AF37", fontFamily: "monospace", fontWeight: 700 }}>{certNumber}</span>
                <span style={{ fontSize: "0.52rem", color: "#94A3B8" }}>Pindai QR untuk Verifikasi Resmi</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "18px", width: "100%" }}>
              <button
                onClick={handleCopyLink}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: "0.8rem", gap: "6px" }}
              >
                <ShareNetwork size={16} /> {copiedLink ? "✓ Tautan Disalin!" : "Salin Link"}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, fontSize: "0.8rem", gap: "6px", backgroundColor: "#D4AF37", color: "#180D30", fontWeight: 700, borderColor: "#D4AF37" }}
              >
                <DownloadSimple size={16} /> Unduh Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
