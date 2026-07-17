"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-4)" }}>⚠️</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>Terjadi Kesalahan</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginBottom: "var(--space-6)" }}>
          {error.message || "Terjadi error yang tidak terduga."}
        </p>
        <button
          onClick={() => reset()}
          style={{ padding: "var(--space-3) var(--space-6)", borderRadius: "var(--radius-full)", border: "none", background: "var(--gradient-hero)", color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)", fontSize: "1rem" }}
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
