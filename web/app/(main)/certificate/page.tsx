"use client";

import { useUserStore } from "@/lib/store/useUserStore";
import { CertificateGenerator } from "@/components/certificate/CertificateGenerator";
import Link from "next/link";
import { ArrowLeft, LockKey, SealCheck, Sparkle, Trophy } from "@phosphor-icons/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CertificatePage() {
  const user = useUserStore((s) => s.user);

  if (!user) return <LoadingSpinner text="Memuat sertifikat..." fullPage />;

  const moduleKeys = Object.keys(user.progress || {});
  const completedCount = moduleKeys.filter(
    (k) => user.progress[k]?.status === "completed"
  ).length;

  const isEligible = completedCount >= 8; // M0 to M8

  return (
    <div className="section-container" style={{ maxWidth: "960px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <Link href="/dashboard" className="btn btn-secondary" style={{ gap: "6px" }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <span className="badge badge-primary" style={{ gap: "6px" }}>
          <Trophy size={14} weight="fill" />
          Klaim Kelulusan
        </span>
      </div>

      {!isEligible ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "48px 24px",
            textAlign: "center",
            maxWidth: "540px",
            margin: "40px auto",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(245, 158, 11, 0.15)",
              color: "#F59E0B",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LockKey size={32} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Sertifikat Masih Terkunci
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "8px", lineHeight: 1.6 }}>
            Kamu baru menyelesaikan <strong>{completedCount} dari 9 modul</strong>. Selesaikan semua modul sampai Mini Project M8 untuk membuka sertifikat kelulusan resmimu!
          </p>
          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: "20px" }}>
            Lanjutkan Belajar Modul
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span className="badge badge-primary" style={{ marginBottom: "8px" }}>
              <Sparkle size={14} weight="fill" />
              Selamat atas kelulusanmu!
            </span>
            <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 800, color: "var(--text-primary)" }}>
              Sertifikat Kelulusan Matrikulasi TRPL
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "540px", margin: "8px auto 0", fontSize: "0.95rem" }}>
              Kamu telah membuktikan kemampuan dasar pemrograman dan siap mengikuti perkuliahan dengan penuh percaya diri!
            </p>
          </div>

          <CertificateGenerator
            studentName={user.name}
            totalXP={user.xp}
            certNumber={`TRPL-2026-${user.uid.substring(0, 6).toUpperCase()}`}
          />
        </div>
      )}
    </div>
  );
}
