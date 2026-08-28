"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useGameStore } from "@/lib/store/useGameStore";
import Link from "next/link";
import { Code, SignOut, User, Trophy, BookOpen, ShieldCheck } from "@phosphor-icons/react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BroadcastBanner } from "@/components/ui/BroadcastBanner";
import { useSessionTimeout } from "@/lib/auth/useSessionTimeout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const { checkDailyStreak } = useGameStore();
  const [mounted, setMounted] = useState(false);

  // Activate 1-hour inactivity auto-logout protection
  useSessionTimeout();

  useEffect(() => {
    setMounted(true);
    checkDailyStreak();
    if (!user) router.push("/login");
  }, [user, router, checkDailyStreak]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !user) return <LoadingScreen text="Memuat platform..." fullPage />;

  const menuLinks = [
    { label: "Dashboard", href: "/dashboard", icon: <BookOpen size={20} weight="bold" /> },
    { label: "Sandbox", href: "/sandbox", icon: <Code size={20} weight="bold" /> },
    { label: "Leaderboard", href: "/leaderboard", icon: <Trophy size={20} weight="bold" /> },
    { label: "Profil", href: "/profile", icon: <User size={20} weight="bold" /> },
    { label: "Admin", href: "/admin", icon: <ShieldCheck size={20} weight="bold" /> },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", paddingBottom: "64px" }}>
      {/* Top Header */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 90,
          background: "var(--bg-navbar)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-color)", height: "60px",
          display: "flex", alignItems: "center",
        }}
      >
        <div className="section-container" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {/* Brand Logo */}
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--gradient-hero)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-glow-soft)", flexShrink: 0 }}>
              <Code size={18} color="white" weight="bold" />
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
              Matrikulasi <span className="gradient-text">TRPL</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }} className="platform-nav-desktop" aria-label="Navigasi platform desktop">
            {menuLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link no-underline ${isActive ? "nav-link-active" : ""}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div
              style={{
                background: "var(--bg-page-alt)",
                border: "1.5px solid var(--border-color-strong)",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
              }}
              aria-label="Poin pengguna"
            >
              <span style={{ color: "var(--color-primary-500)" }}>⚡</span> {user.xp} XP
            </div>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="focus-ring"
              aria-label="Keluar dari akun"
              title="Keluar dari akun"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1.5px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-full)",
                color: "#EF4444",
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              }}
            >
              <SignOut size={16} weight="bold" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Push Broadcast Announcement Banner */}
      <BroadcastBanner />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "var(--space-6) 0" }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="mobile-bottom-nav"
        aria-label="Navigasi platform mobile"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "var(--bg-navbar)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid var(--border-color)",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 8px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {menuLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
                textDecoration: "none",
                color: isActive ? "var(--color-primary-500)" : "var(--text-muted)",
                flex: 1,
                padding: "6px 0",
                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    width: "24px",
                    height: "3px",
                    borderRadius: "0 0 4px 4px",
                    background: "var(--color-primary-500)",
                    boxShadow: "0 2px 8px var(--color-primary-500)",
                  }}
                />
              )}
              {link.icon}
              <span style={{ fontSize: "0.68rem", fontWeight: isActive ? 800 : 500 }}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .mobile-bottom-nav {
          display: none !important;
        }
        @media (max-width: 768px) {
          .logout-text { display: none !important; }
          .platform-nav-desktop { display: none !important; }
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
