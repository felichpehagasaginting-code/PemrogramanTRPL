"use client";

import React, { useState, useEffect } from "react";
import { Keyboard, X, Sparkle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const SHORTCUT_LIST = [
  { key: "Ctrl + K", desc: "Buka Command Palette / Lompat Cepat Antar Modul" },
  { key: "Ctrl + Enter", desc: "Jalankan Kode Python di Browser (WASM Run)" },
  { key: "Ctrl + Shift + S", desc: "Submit Kodingan ke Auto-Grader" },
  { key: "Ctrl + Shift + H", desc: "Buka Petunjuk (Hint) Senior Mentor" },
  { key: "Ctrl + Shift + B", desc: "Buka Modal Minta Bantuan / Diskusi" },
  { key: "F11 / Zen Mode", desc: "Aktifkan Mode Fokus Layar Penuh di Editor" },
  { key: "Ctrl + / atau ?", desc: "Buka Panduan Pintasan Keyboard ini" },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === "?" || (e.ctrlKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            padding: "16px",
          }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Keyboard size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Pintasan Keyboard (Shortcuts)
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {SHORTCUT_LIST.map((sc, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "var(--bg-card-hover)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{sc.desc}</span>
                  <kbd
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid var(--border-color)",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#38BDF8",
                      fontFamily: "monospace",
                    }}
                  >
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(59, 130, 246, 0.08)",
                borderTop: "1px solid var(--border-color)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              Tekan <kbd style={{ padding: "1px 4px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>?</kbd> kapan saja untuk membuka panduan ini.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
