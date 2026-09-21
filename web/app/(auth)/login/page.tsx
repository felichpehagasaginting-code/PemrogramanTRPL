"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import { isMockFirebase } from "@/lib/firebase";
import { Code, GoogleLogo, User, ShieldCheck } from "@phosphor-icons/react";
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { LOGIN_FEATURES } from "@/lib/features";
import { SESSION_EXPIRED_KEY } from "@/lib/auth/useSessionTimeout";
import { DosenPinDialpadModal } from "@/components/auth/DosenPinDialpadModal";
import gsap from "gsap";

export default function LoginPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const loginWithGoogle = useUserStore((s) => s.loginWithGoogle);
  const login = useUserStore((s) => s.login);
  const handleRedirectResult = useUserStore((s) => s.handleRedirectResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingRedirect, setCheckingRedirect] = useState(true);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);
  const [dosenModalOpen, setDosenModalOpen] = useState(false);

  // GSAP animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Initial Entrance Animation with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating glowing dots
      if (glow1Ref.current) {
        gsap.to(glow1Ref.current, {
          x: 24,
          y: 18,
          scale: 1.1,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (glow2Ref.current) {
        gsap.to(glow2Ref.current, {
          x: -20,
          y: -20,
          scale: 1.15,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Card pop-in & content stagger
      if (cardRef.current) {
        const tl = gsap.timeline();
        tl.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
        );

        if (logoRef.current) {
          tl.fromTo(
            logoRef.current,
            { scale: 0, rotate: -15 },
            { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(1.8)" },
            "-=0.3"
          );
        }

        const items = cardRef.current.querySelectorAll(".login-anim-item");
        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
            "-=0.2"
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate error shake with GSAP
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { x: 0 },
        { x: 8, duration: 0.08, repeat: 5, yoyo: true, ease: "power1.inOut" }
      );
    }
  }, [error]);

  // Handle session expired notice
  useEffect(() => {
    try {
      const expiredFromStorage = sessionStorage.getItem(SESSION_EXPIRED_KEY);
      if (expiredFromStorage === "true" || (typeof window !== "undefined" && window.location.search.includes("session_expired"))) {
        setSessionExpiredNotice(true);
        sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      }
    } catch {}
  }, []);

  const handleSuccessNavigation = (targetPath: string) => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        y: -16,
        scale: 0.98,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => router.push(targetPath),
      });
    } else {
      router.push(targetPath);
    }
  };

  // Handle redirect result
  useEffect(() => {
    handleRedirectResult().then((signedIn) => {
      if (signedIn) {
        handleSuccessNavigation("/dashboard");
      }
      setCheckingRedirect(false);
    }).catch(() => setCheckingRedirect(false));
  }, [handleRedirectResult]);

  // Handle existing user redirect
  useEffect(() => {
    if (user && !checkingRedirect) {
      handleSuccessNavigation("/dashboard");
    }
  }, [user, checkingRedirect]);

  const handleSSOLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      setLoading(false);
    } catch (e: any) {
      const msg = e?.code === "auth/unauthorized-domain"
        ? "Domain ini belum terdaftar di Firebase Console."
        : e?.message || "Gagal login dengan Google. Silakan coba lagi atau gunakan Masuk Cepat.";
      setError(msg);
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    login("Maba TRPL 2026", "maba2026@student.polsri.ac.id");
  };

  return (
    <main
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-page)",
        position: "relative",
        overflow: "hidden",
        padding: "20px 16px",
      }}
    >
      <div
        ref={glow1Ref}
        className="glow-dot"
        style={{
          width: "400px",
          height: "400px",
          top: "-100px",
          left: "-100px",
          background: "rgba(255, 107, 0, 0.09)",
          filter: "blur(60px)",
        }}
      />
      <div
        ref={glow2Ref}
        className="glow-dot"
        style={{
          width: "320px",
          height: "320px",
          bottom: "-50px",
          right: "-50px",
          background: "rgba(255, 157, 0, 0.07)",
          filter: "blur(50px)",
        }}
      />

      <div
        ref={cardRef}
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
        <div className="login-anim-item">
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none", marginBottom: "var(--space-3)", fontFamily: "inherit" }}>
            &#8592; Beranda
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div
            ref={logoRef}
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
          <h2 className="login-anim-item" style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Masuk Platform
          </h2>
          <p className="login-anim-item" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "4px" }}>
            Belajar Coding Interaktif Mahasiswa TRPL 2026
          </p>
        </div>

        {sessionExpiredNotice && (
          <div
            role="alert"
            style={{
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid #F59E0B",
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              marginBottom: "var(--space-4)",
              color: "#F59E0B",
              fontSize: "0.825rem",
              textAlign: "left",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🔒</span>
            <div>
              <strong style={{ color: "var(--text-primary)" }}>Sesi Berakhir Demi Keamanan</strong>
              <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Tidak ada aktivitas selama 1 jam. Silakan login kembali untuk melanjutkan ngoding!
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            ref={errorRef}
            role="alert"
            aria-live="assertive"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid var(--color-accent-red)",
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              marginBottom: "var(--space-4)",
              color: "var(--color-accent-red)",
              fontSize: "0.825rem",
              textAlign: "left",
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={handleSSOLogin}
            disabled={loading || checkingRedirect}
            className="login-btn focus-ring login-anim-item"
            aria-label={loading ? "Memproses login..." : checkingRedirect ? "Memeriksa sesi..." : "Login dengan Google"}
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--border-color-strong)",
              background: "var(--bg-page-alt)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.9375rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <GoogleLogo size={20} weight="bold" color="var(--color-primary-500)" />
            {loading ? "Memproses Otentikasi..." : checkingRedirect ? "Memeriksa sesi..." : "Login dengan Akun Google"}
          </button>

          <div className="login-anim-item" style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0", color: "var(--text-muted)", fontSize: "0.75rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
            <span>ATAU</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={loading || checkingRedirect}
            className="focus-ring login-anim-item"
            aria-label="Masuk langsung mode tamu / demo"
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-full)",
              border: "1.5px dashed var(--border-color-strong)",
              background: "transparent",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <User size={18} aria-hidden="true" color="var(--color-primary-500)" /> Masuk Cepat (Mode Tamu / Maba)
          </button>

          <button
            onClick={() => setDosenModalOpen(true)}
            className="focus-ring login-anim-item"
            aria-label="Masuk sebagai dosen penguji"
            style={{
              width: "100%",
              padding: "10px var(--space-4)",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              background: "rgba(168, 85, 247, 0.08)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.825rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              marginTop: "4px",
              transition: "transform 0.15s ease",
            }}
          >
            <ShieldCheck size={18} color="#A855F7" weight="fill" />
            <span>Masuk sebagai Dosen Penguji (PIN Khusus)</span>
          </button>
        </div>
      </div>
      <DosenPinDialpadModal
        isOpen={dosenModalOpen}
        onClose={() => setDosenModalOpen(false)}
      />
      <FeaturePopupQueue features={LOGIN_FEATURES} delay={3000} />
    </main>
  );
}

