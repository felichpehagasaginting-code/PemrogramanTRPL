"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore, isAdmin } from "@/lib/store/useUserStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code, SignOut, User, Trophy, BookOpen, Sun, Moon, ShieldCheck } from "@phosphor-icons/react";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect to login if user is not logged in
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  if (!mounted || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-page)",
          fontFamily: "var(--font-heading)",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-secondary)",
        }}
      >
        Loading Platform...
      </div>
    );
  }

  const menuLinks = [
    { label: "Dashboard", href: "/dashboard", icon: <BookOpen size={20} /> },
    { label: "Leaderboard", href: "/leaderboard", icon: <Trophy size={20} /> },
    { label: "Profil", href: "/profile", icon: <User size={20} /> },
    ...(user && isAdmin(user) ? [{ label: "Admin", href: "/admin", icon: <ShieldCheck size={20} /> }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      {/* Platform Header / Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: "var(--bg-navbar)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-color)",
          height: "65px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="section-container" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                background: "var(--gradient-hero)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-glow-soft)",
              }}
            >
              <Code size={18} color="white" weight="bold" />
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
              Matrikulasi <span className="gradient-text">TRPL</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }} className="platform-nav">
            {menuLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: isActive ? "var(--color-primary-500)" : "var(--text-secondary)",
                    textDecoration: "none",
                    fontWeight: isActive ? 700 : 600,
                    fontSize: "0.875rem",
                    transition: "color var(--transition-fast)",
                  }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Widget */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* XP indicator */}
            <div
              style={{
                background: "rgba(255,107,0,0.08)",
                border: "1.5px solid var(--border-color)",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "var(--color-primary-600)",
              }}
            >
              ⚡ {user.xp} XP
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent-red)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <SignOut size={20} />
              <span className="logout-text">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "var(--space-6) 0" }}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      <style jsx>{`
        @media (max-width: 640px) {
          .logout-text, .logout-text + span { display: none !important; }
          .platform-nav span { display: none !important; }
        }
      `}</style>
    </div>
  );
}
