"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { List, X, Code, Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/components/ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false); // default light now

  useEffect(() => {
    // Check if HTML document has dark class initially
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDark = () => {
    setDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { label: "Tentang", href: "#tentang" },
    { label: "Kurikulum", href: "#kurikulum" },
    { label: "Fitur", href: "#fitur" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "var(--bg-navbar)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-color)" : "none",
      }}
    >
      <div className="section-container">
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "70px",
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "var(--gradient-hero)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-glow-soft)",
              }}
            >
              <Code size={20} color="white" weight="bold" />
            </motion.div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.125rem",
                color: "var(--text-primary)",
              }}
            >
              Matrikulasi<span className="gradient-text"> TRPL</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  position: "relative",
                  paddingBottom: "4px",
                }}
                whileHover={{ color: "var(--color-primary-500)" }}
              >
                {link.label}
                <motion.span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    background: "var(--gradient-hero)",
                    borderRadius: "2px",
                    width: 0,
                  }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}

            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleDark}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: "rgba(255,107,0,0.08)",
                border: "1px solid rgba(255,107,0,0.2)",
                borderRadius: "50%",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--color-primary-500)",
              }}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <Button href="/login" variant="primary" size="sm">
              Mulai Belajar →
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="mobile-nav">
            <motion.button
              onClick={toggleDark}
              whileHover={{ scale: 1.1 }}
              style={{
                background: "rgba(255,107,0,0.08)",
                border: "1px solid rgba(255,107,0,0.2)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--color-primary-500)",
              }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
              style={{
                background: "rgba(255,107,0,0.08)",
                border: "1px solid rgba(255,107,0,0.2)",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </motion.button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "var(--bg-navbar)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid var(--border-color)",
              overflow: "hidden",
            }}
          >
            <div
              className="section-container"
              style={{ paddingTop: "var(--space-4)", paddingBottom: "var(--space-6)" }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "var(--space-3) 0",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div style={{ marginTop: "var(--space-4)" }}>
                <Button href="/login" variant="primary" className="w-full">
                  Mulai Belajar →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </motion.header>
  );
}
