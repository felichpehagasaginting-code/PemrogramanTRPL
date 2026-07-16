"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { motion } from "framer-motion";
import { Code, GoogleLogo } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleSSOLogin = async () => {
    setLoading(true);
    await loginWithGoogle();
    router.push("/dashboard");
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
      {/* Decorative Orbs */}
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
        {/* Branding header */}
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

        {/* SSO Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSSOLogin}
          disabled={loading}
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
            cursor: "pointer",
            transition: "background var(--transition-fast)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 107, 0, 0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <GoogleLogo size={20} weight="bold" color="#FF6B00" />
          {loading ? "Menghubungkan..." : "Login dengan Google"}
        </motion.button>
      </motion.div>
    </main>
  );
}
