"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <html>
      <body style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#FFF8F2", color: "#1C0A00", fontFamily: "system-ui, sans-serif", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px" }}>Terjadi Kesalahan</h2>
          <p style={{ color: "#7A4A25", fontSize: "0.9375rem", marginBottom: "24px" }}>
            Aplikasi mengalami error. Silakan muat ulang.
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: "12px 32px", borderRadius: "9999px", border: "none", background: "linear-gradient(135deg, #FF6B00, #FF9D00)", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
