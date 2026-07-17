"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";

interface Props {
  message?: string;
  returnHref?: string;
  returnLabel?: string;
}

export function NotFound({
  message = "Halaman yang kamu cari tidak ditemukan.",
  returnHref = "/dashboard",
  returnLabel = "Kembali ke Dashboard",
}: Props) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-8)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <WarningCircle size={64} color="var(--color-primary-500)" weight="fill" style={{ marginBottom: "var(--space-4)" }} />
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Wah, nyasar!
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginBottom: "var(--space-6)", lineHeight: 1.6 }}>
          {message}
        </p>
        <Link href={returnHref} className="btn btn-primary">
          {returnLabel}
        </Link>
      </div>
    </div>
  );
}
