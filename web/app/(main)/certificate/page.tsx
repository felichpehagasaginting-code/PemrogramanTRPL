"use client";

import { useUserStore } from "@/lib/store/useUserStore";
import { CertificateGenerator } from "@/components/certificate/CertificateGenerator";
import Link from "next/link";
import { ArrowLeft, LockKey, SealCheck, Sparkle, Trophy, CheckCircle, Clock } from "@phosphor-icons/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CertificatePage() {
  const user = useUserStore((s) => s.user);

  if (!user) return <LoadingSpinner text="Memuat sertifikat..." fullPage />;

  const requiredModules = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];
  const completedModuleCount = requiredModules.filter(
    (k) => user.progress?.[k]?.status === "completed"
  ).length;
  const isAllModulesDone = completedModuleCount === requiredModules.length;

  const isPreTestDone = Boolean(
    user.tests?.preTest?.completed
  );

  const isPostTestDone = Boolean(
    user.tests?.postTest?.completed
  );

  const isEligible = isPreTestDone && isAllModulesDone && isPostTestDone;

  return (
    <div className="section-container" style={{ maxWidth: "960px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <Link href="/dashboard" className="btn btn-secondary" style={{ gap: "6px" }}>
          <ArrowLeft size={16} /> Kembali ke Dasbor
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
            padding: "40px 24px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "30px auto",
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
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Sertifikat Kelulusan Masih Terkunci
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "8px", lineHeight: 1.6 }}>
            Untuk memperoleh Sertifikat Resmi Matrikulasi TRPL 2026, kamu harus menuntaskan <strong>3 pilar kelulusan</strong> berikut:
          </p>

          {/* Checklist 3 Pilar Kelulusan */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "24px 0", textAlign: "left" }}>
            {/* Pilar 1: Pre-Test */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "var(--radius-lg)",
                background: isPreTestDone ? "rgba(34,197,94,0.08)" : "var(--bg-page-alt)",
                border: isPreTestDone ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isPreTestDone ? (
                  <CheckCircle size={20} weight="fill" color="#22C55E" />
                ) : (
                  <Clock size={20} color="var(--text-muted)" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    1. Pre-Test Diagnostik (M0)
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {isPreTestDone ? "Sudah diselesaikan" : "Belum dikerjakan"}
                  </div>
                </div>
              </div>
              {!isPreTestDone && (
                <Link href="/pre-test" className="btn btn-primary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
                  Kerjakan
                </Link>
              )}
            </div>

            {/* Pilar 2: Seluruh Modul M0 - M8 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "var(--radius-lg)",
                background: isAllModulesDone ? "rgba(34,197,94,0.08)" : "var(--bg-page-alt)",
                border: isAllModulesDone ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isAllModulesDone ? (
                  <CheckCircle size={20} weight="fill" color="#22C55E" />
                ) : (
                  <Clock size={20} color="var(--text-muted)" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    2. Seluruh Modul Materi (M0 s/d M8)
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Progres: {completedModuleCount} dari 9 modul selesai
                  </div>
                </div>
              </div>
              {!isAllModulesDone && (
                <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
                  Buka Modul
                </Link>
              )}
            </div>

            {/* Pilar 3: Post-Test */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "var(--radius-lg)",
                background: isPostTestDone ? "rgba(34,197,94,0.08)" : "var(--bg-page-alt)",
                border: isPostTestDone ? "1px solid rgba(34,197,94,0.3)" : "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isPostTestDone ? (
                  <CheckCircle size={20} weight="fill" color="#22C55E" />
                ) : (
                  <Clock size={20} color="var(--text-muted)" />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    3. Post-Test Evaluasi Akhir
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {isPostTestDone ? `Sudah diselesaikan (Skor: ${user.tests?.postTest?.percentage}%)` : isPreTestDone ? "Tersedia untuk dikerjakan" : "Terkunci (butuh Pre-Test)"}
                  </div>
                </div>
              </div>
              {!isPostTestDone && isPreTestDone && (
                <Link href="/post-test" className="btn btn-primary btn-sm" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
                  Mulai Post-Test
                </Link>
              )}
            </div>
          </div>

          <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: "10px" }}>
            Lanjutkan Belajar di Dasbor
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
