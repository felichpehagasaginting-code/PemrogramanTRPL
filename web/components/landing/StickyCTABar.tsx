"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket, ArrowRight, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export function StickyCTABar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setShow(scrollPercent > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 30, x: "-50%" }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          bottom: "16px",
          left: "50%",
          zIndex: 9990,
          background: "color-mix(in srgb, var(--bg-dark) 90%, transparent)",
          backdropFilter: "blur(16px)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-full)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          maxWidth: "calc(100vw - 32px)",
          width: "max-content",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)", fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap" }}>
          <Rocket size={18} color="var(--color-primary-500)" weight="fill" />
          <span className="hidden sm:inline">Siap Mulai Matrikulasi TRPL 2026?</span>
          <span className="sm:hidden">Matrikulasi TRPL</span>
        </div>

        <Link
          href="/login"
          className="btn btn-primary btn-sm focus-ring"
          aria-label="Mulai matrikulasi"
          style={{
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "0.78rem",
            padding: "6px 14px",
            whiteSpace: "nowrap",
          }}
        >
          Mulai <ArrowRight size={12} weight="bold" />
        </Link>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Tutup bar promosi"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
            transition: "opacity 0.2s ease",
          }}
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

