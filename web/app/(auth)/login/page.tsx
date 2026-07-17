"use client";

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { isMockFirebase } from "@/lib/firebase";
import { Code, GoogleLogo, User } from "@phosphor-icons/react";
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { LOGIN_FEATURES } from "@/lib/features";

export default function LoginPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const loginWithGoogle = useUserStore((s) => s.loginWithGoogle);
  const login = useUserStore((s) => s.login);
  const handleRedirectResult = useUserStore((s) => s.handleRedirectResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  useEffect(() => {
    handleRedirectResult().then((signedIn) => {
      if (signedIn) router.push("/dashboard");
      setCheckingRedirect(false);
    }).catch(() => setCheckingRedirect(false));
  }, [handleRedirectResult, router]);

  useEffect(() => {
    if (user && !checkingRedirect) {
      router.push("/dashboard");
    }
  }, [user, checkingRedirect, router]);

  const handleSSOLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      setLoading(false);
    } catch (e: any) {
      const msg = e?.code === "auth/unauthorized-domain"
        ? "Domain ini belum terdaftar. Akses via localhost atau tambahkan IP ini ke Firebase Console."
        : e?.message || "Gagal login. Coba lagi.";
      setError(msg);
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    setLoading(true);
    login("Demo User (Mock)", "demo@student.polsri.ac.id");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      <div
        className="glow-dot"
        style={{
          width: "400px",
          height: "400px",
          top: "-100px",
          left: "-100px",
          background: "rgba(255, 107, 0, 0.08)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="glow-dot"
        style={{
          width: "300px",
          height: "300px",
          bottom: "-50px",
          right: "-50px",
          background: "rgba(255, 157, 0, 0.06)",
          filter: "blur(50px)",
        }}
      />

      <div
        className="fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)",
          padding: "var(--space-8)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none", marginBottom: "var(--space-3)", fontFamily: "inherit" }}>
          &#8592; Beranda
        </a>
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--gradient-hero)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-4)",
              boxShadow: "var(--shadow-glow-soft)",
            }}
          >
            <Code size={24} color="white" weight="bold" />
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Masuk Platform
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
            Belajar Coding Interaktif Mahasiswa TRPL 2026
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-md)", padding: "10px", marginBottom: "var(--space-4)", color: "#EF4444", fontSize: "0.85rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSSOLogin}
          disabled={loading || checkingRedirect}
          className="login-btn"
          style={{
            width: "100%",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--border-color-strong)",
            background: "transparent",
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <GoogleLogo size={20} weight="bold" color="#FF6B00" />
          {loading ? "Memproses..." : checkingRedirect ? "Memeriksa sesi..." : "Login dengan Google"}
        </button>

        {isMockFirebase && (
          <button
            onClick={handleMockLogin}
            disabled={loading || checkingRedirect}
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-full)",
              border: "1px dashed var(--border-color)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontWeight: 500,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              marginTop: "12px",
            }}
          >
            <User size={18} /> Login Mock (tanpa Firebase)
          </button>
        )}
      </div>
      <FeaturePopupQueue features={LOGIN_FEATURES} delay={3000} />
    </main>
  );
}
