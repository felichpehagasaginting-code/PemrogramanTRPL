"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useGameStore } from "@/lib/store/useGameStore";
import Link from "next/link";
import { Code, SignOut, User, Trophy, BookOpen, ShieldCheck, CheckSquareOffset } from "@phosphor-icons/react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BroadcastBanner } from "@/components/ui/BroadcastBanner";
import { useSessionTimeout } from "@/lib/auth/useSessionTimeout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const isUserReady = useUserStore((s) => s.isUserReady);
  const logout = useUserStore((s) => s.logout);
  const subscribeCurrentUserRealtime = useUserStore((s) => s.subscribeCurrentUserRealtime);
  const subscribeLeaderboardRealtime = useUserStore((s) => s.subscribeLeaderboardRealtime);
  const { checkDailyStreak } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Activate 1-hour inactivity auto-logout protection
  useSessionTimeout();

  // Close user menu on route change
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
    checkDailyStreak();
    if (!user) {
      router.push("/login");
      return;
    }

    const unsubUser = subscribeCurrentUserRealtime(user.uid);
    const unsubLb = subscribeLeaderboardRealtime();
    return () => {
      unsubUser();
      unsubLb();
    };
  }, [user?.uid, router, checkDailyStreak, subscribeCurrentUserRealtime, subscribeLeaderboardRealtime]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !user || !isUserReady) return <LoadingScreen text="Menghubungkan data TRPL..." fullPage />;

  const menuLinks = [
    { label: "Dasbor", href: "/dashboard", icon: <BookOpen size={18} weight="bold" /> },
    { label: "Sandbox", href: "/sandbox", icon: <Code size={18} weight="bold" /> },
    { label: "Peringkat", href: "/leaderboard", icon: <Trophy size={18} weight="bold" /> },
    { label: "Profil", href: "/profile", icon: <User size={18} weight="bold" /> },
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
        <div className="section-container" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          {/* Brand Logo with Institution Logos */}
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "28px", height: "22px", position: "relative" }}>
                <Image src="/images/logo_kiri_cwe.png" alt="Logo CWE" fill style={{ objectFit: "contain" }} />
              </div>
              <div style={{ width: "20px", height: "20px", position: "relative" }}>
                <Image src="/images/logo_kanan_trpl.png" alt="Logo TRPL" fill style={{ objectFit: "contain" }} />
              </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, position: "relative" }}>
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

            {/* Avatar Dropdown Trigger */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="focus-ring"
                aria-label="Buka menu pengguna"
                aria-expanded={userMenuOpen}
                style={{
                  background: userMenuOpen ? "var(--color-primary-500)" : "var(--bg-page-alt)",
                  color: userMenuOpen ? "#FFFFFF" : "var(--text-primary)",
                  border: "1.5px solid var(--border-color-strong)",
                  borderRadius: "var(--radius-full)",
                  padding: "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{user.name.split(" ")[0]}</span>
                <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>▼</span>
              </button>

              {/* User Dropdown Popover */}
              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "220px",
                    background: "var(--bg-card)",
                    border: "1.5px solid var(--border-color-strong)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-xl)",
                    padding: "8px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-color)", marginBottom: "4px" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email}
                    </div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--color-primary-500)", marginTop: "2px" }}>
                      Level: {user.level}
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      textDecoration: "none",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                    className="dropdown-item-hover"
                  >
                    <User size={16} /> Profil Saya
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      textDecoration: "none",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                    className="dropdown-item-hover"
                  >
                    <ShieldCheck size={16} color="#F59E0B" /> Panel Dosen TRPL
                  </Link>

                  <div style={{ height: "1px", background: "var(--border-color)", margin: "4px 0" }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: "rgba(239, 68, 68, 0.08)",
                      color: "#EF4444",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <SignOut size={16} weight="bold" /> Keluar
                  </button>
                </div>
              )}
            </div>
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
        .dropdown-item-hover:hover {
          background: var(--bg-page-alt);
        }
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
