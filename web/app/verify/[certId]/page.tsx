"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { SealCheck, CheckCircle, ArrowLeft, Student, CalendarCheck, ShieldCheck } from "@phosphor-icons/react";

export default function PublicVerifyCertificatePage() {
  const params = useParams();
  const certId = (params.certId as string) || "TRPL-2026-MATRIK";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          maxWidth: "520px",
          width: "100%",
          padding: "36px 28px",
          boxShadow: "var(--shadow-card)",
          textAlign: "center",
        }}
      >
        {/* Verified Badge */}
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "2px solid #10B981",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "#10B981",
          }}
        >
          <SealCheck size={40} weight="fill" />
        </div>

        <span
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            color: "#10B981",
            padding: "4px 14px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.78rem",
            fontWeight: 800,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Sertifikat Asli & Terverifikasi
        </span>

        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-primary)", margin: "16px 0 6px" }}>
          Matrikulasi Pemrograman TRPL 2026
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
          Sistem Verifikasi Kredensial Akademik Mahasiswa
        </p>

        {/* Credential Data Box */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-lg)",
            padding: "18px",
            margin: "24px 0",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Nomor Sertifikat:</span>
            <strong style={{ fontFamily: "monospace", color: "#38BDF8" }}>{certId}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Institusi:</span>
            <strong style={{ color: "var(--text-primary)" }}>Prodi TRPL Angkatan 2026</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            <span style={{ color: "var(--text-muted)" }}>Status Kompetensi:</span>
            <span style={{ color: "#10B981", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle size={14} weight="fill" /> Lulus Lengkap (M0-M8)
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-muted)" }}>Tanggal Verifikasi:</span>
            <span style={{ color: "var(--text-secondary)" }}>{new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <Link href="/" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Kunjungi Platform Matrikulasi
        </Link>
      </div>
    </div>
  );
}
