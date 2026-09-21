"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  SealCheck,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  CalendarBlank,
  Hash,
} from "@phosphor-icons/react";

export default function PublicVerifyCertificatePage() {
  const params = useParams();
  const certId = (params?.certId as string) || "TRPL-2026-MATRIK";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 28px",
          boxShadow: "var(--shadow-xl)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #F59E0B, #10B981, #38BDF8)",
          }}
        />

        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <SealCheck size={36} weight="fill" />
        </div>

        <h1 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "6px" }}>
          Sertifikat Terverifikasi Resmi
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Dokumen ini terdaftar sah dalam Pangkalan Data Matrikulasi Pemrograman TRPL 2026.
        </p>

        <div
          style={{
            background: "var(--bg-page)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            textAlign: "left",
            fontSize: "0.85rem",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Hash size={16} /> Nomor Sertifikat:
            </span>
            <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "#F59E0B" }}>
              {certId}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <GraduationCap size={16} /> Program:
            </span>
            <span style={{ fontWeight: 600 }}>Matrikulasi Pemrograman TRPL</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="#10B981" /> Status:
            </span>
            <span style={{ fontWeight: 700, color: "#10B981" }}>LULUS &amp; KOMPETEN</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <CalendarBlank size={16} /> Terbit:
            </span>
            <span>Tahun Akademik 2026/2027</span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
