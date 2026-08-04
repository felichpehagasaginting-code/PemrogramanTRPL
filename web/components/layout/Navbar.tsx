"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { List, X, Code } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const Navbar = memo(function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Tentang", href: "#tentang" },
    { label: "Kurikulum", href: "#kurikulum" },
    { label: "Fitur", href: "#fitur" },
  ];

  const isExternalHash = (href: string) => href.startsWith("#");

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-navbar)] backdrop-blur-lg border-b border-[var(--border-color)]"
          : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-[70px]" aria-label="Navigasi utama">
          <Link href="/" className="flex items-center gap-[10px] no-underline" aria-label="Beranda Matrikulasi TRPL">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center focus-ring"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "var(--shadow-glow-soft)",
              }}
            >
              <Code size={20} color="white" weight="bold" />
            </motion.div>
            <span
              className="font-bold text-[1.125rem]"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--text-primary)",
              }}
            >
              Matrikulasi<span className="gradient-text"> TRPL</span>
            </span>
          </Link>

          <div className="items-center gap-[var(--space-8)] desktop-nav hidden md:flex">
            {navLinks.map((link) => {
              const isActive = typeof window !== "undefined" && window.location.hash === link.href;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  aria-current={isExternalHash(link.href) ? undefined : isActive ? "page" : undefined}
                  className={`nav-link no-underline ${isActive ? "nav-link-active" : ""}`}
                  whileHover={{ color: "var(--color-primary-500)" }}
                >
                  {link.label}
                </motion.a>
              );
            })}

            <ThemeToggle />

            <Button href="/login" variant="primary" size="sm">
              Mulai Belajar →
            </Button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer focus-ring"
              style={{
                background: "rgba(255,107,0,0.08)",
                border: "1px solid rgba(255,107,0,0.2)",
                color: "var(--text-primary)",
              }}
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </motion.button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            style={{
              background: "var(--bg-navbar)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <div className="section-container py-4 pb-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 no-underline font-semibold border-b focus-ring"
                  style={{
                    color: "var(--text-secondary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="mt-4">
                <Button href="/login" variant="primary" className="w-full">
                  Mulai Belajar →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});
