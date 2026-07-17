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
        <nav className="flex items-center justify-between h-[70px]">
          <Link href="/" className="flex items-center gap-[10px] no-underline">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center"
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
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="no-underline font-semibold text-[0.9375rem] relative pb-1"
                style={{ color: "var(--text-secondary)" }}
                whileHover={{ color: "var(--color-primary-500)" }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] rounded-sm"
                  style={{
                    background: "var(--gradient-hero)",
                    width: 0,
                  }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}

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
              className="w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer"
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
                  className="block py-3 no-underline font-semibold border-b"
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
