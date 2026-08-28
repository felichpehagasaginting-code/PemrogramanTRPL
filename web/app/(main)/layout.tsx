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

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const { checkDailyStreak } = useGameStore();
  const [mounted, setMounted] = useState(false);

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
    { label: "Dashboard", href: "/dashboard", icon: <BookOpen size={20} /> },
    { label: "VS Code Sandbox", href: "/sandbox", icon: <Code size={20} /> },
    { label: "Leaderboard", href: "/leaderboard", icon: <Trophy size={20} /> },
    { label: "Profil", href: "/profile", icon: <User size={20} /> },
    { label: "Admin", href: "/admin", icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 90,
          background: "var(--bg-navbar)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-color)", height: "65px",
          display: "flex", alignItems: "center",
        }}
      >
        <div className="section-container" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "var(--gradient-hero)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-glow-soft)" }}>
              <Code size={18} color="white" weight="bold" />
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
              Matrikulasi <span className="gradient-text">TRPL</span>
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }} className="platform-nav" aria-label="Navigasi platform">
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "var(--bg-page-alt)",
                border: "1.5px solid var(--border-color-strong)",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              aria-label="Poin pengguna"
            >
              <span style={{ color: "var(--color-primary-500)" }}>⚡</span> {user.xp} XP
            </div>
            <ThemeToggle />
            <button onClick={handleLogout}
              className="nav-link no-underline focus-ring"
              aria-label="Keluar"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-accent-red)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <SignOut size={20} />
              <span className="logout-text">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "var(--space-6) 0" }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      <style jsx>{`
        @media (max-width: 640px) {
          .logout-text { display: none !important; }
          .platform-nav span { display: none !important; }
        }
      `}</style>
    </div>
  );
}
