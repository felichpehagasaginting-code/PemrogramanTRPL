"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlass,
  BookOpen,
  Terminal,
  Trophy,
  User,
  Certificate,
  Lightning,
  X,
  Keyboard,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  title: string;
  category: "Modul Pembelajaran" | "Navigasi Cepat" | "Tools & Editor";
  url: string;
  icon: React.ReactNode;
}

const COMMANDS: CommandItem[] = [
  { id: "m0", title: "M0: Pre-Test & Orientasi TRPL", category: "Modul Pembelajaran", url: "/learn/M0", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m1", title: "M1: Dasar Komputer & Workspace", category: "Modul Pembelajaran", url: "/learn/M1", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m2", title: "M2: Logika & Algoritma", category: "Modul Pembelajaran", url: "/learn/M2", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m3", title: "M3: Variabel & Tipe Data", category: "Modul Pembelajaran", url: "/learn/M3", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m4", title: "M4: Percabangan (If-Else)", category: "Modul Pembelajaran", url: "/learn/M4", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m5", title: "M5: Perulangan (Loops)", category: "Modul Pembelajaran", url: "/learn/M5", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m6", title: "M6: Fungsi & Prosedur", category: "Modul Pembelajaran", url: "/learn/M6", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m7", title: "M7: Array & List Data", category: "Modul Pembelajaran", url: "/learn/M7", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "m8", title: "M8: Mini Project Akhir", category: "Modul Pembelajaran", url: "/learn/M8", icon: <Lightning size={16} color="#F59E0B" /> },
  { id: "dash", title: "Buka Dashboard Utama", category: "Navigasi Cepat", url: "/dashboard", icon: <BookOpen size={16} color="#38BDF8" /> },
  { id: "lead", title: "Podium Leaderboard & Ranking", category: "Navigasi Cepat", url: "/leaderboard", icon: <Trophy size={16} color="#F59E0B" /> },
  { id: "prof", title: "Profil Mahasiswa & Avatar", category: "Navigasi Cepat", url: "/profile", icon: <User size={16} color="#10B981" /> },
  { id: "cert", title: "Klaim Sertifikat Kelulusan", category: "Navigasi Cepat", url: "/certificate", icon: <Certificate size={16} color="#A855F7" /> },
  { id: "sand", title: "VS Code Sandbox IDE", category: "Tools & Editor", url: "/sandbox", icon: <Terminal size={16} color="#38BDF8" /> },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Global Ctrl+K or Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "15vh",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "580px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
              overflow: "hidden",
            }}
          >
            {/* Search Input Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              <MagnifyingGlass size={20} color="var(--text-muted)" />
              <input
                type="text"
                autoFocus
                placeholder="Ketik untuk mencari modul atau fitur... (contoh: M5, loop, sertifikat)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,0.06)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color)",
                }}
              >
                ESC
              </span>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: "340px", overflowY: "auto", padding: "8px" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Tidak ada modul atau menu yang cocok dengan "{query}".
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      background: idx === selectedIndex ? "rgba(255,107,0,0.1)" : "transparent",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ display: "flex" }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>Buka ↵</span>
                  </div>
                ))
              )}
            </div>

            {/* Footer Tip */}
            <div
              style={{
                padding: "8px 16px",
                background: "var(--bg-card-hover)",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Keyboard size={14} /> Tip: Gunakan <kbd style={{ padding: "1px 4px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>Ctrl + K</kbd> kapan saja untuk membuka menu ini
              </span>
              <span>TRPL 2026</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
