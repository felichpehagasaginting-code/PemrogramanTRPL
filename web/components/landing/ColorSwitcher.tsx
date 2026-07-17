"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredTheme, applyTheme, type ThemeFamily } from "@/lib/theme";

const COLORS: { family: ThemeFamily; name: string; hex: string }[] = [
  { family: "purple", name: "Ungu", hex: "#7B1FA2" },
  { family: "orange", name: "Orange", hex: "#FF6B00" },
  { family: "blue", name: "Biru", hex: "#1565C0" },
  { family: "emerald", name: "Zamrud", hex: "#2E7D32" },
];

export function ColorSwitcher() {
  const [active, setActive] = useState<ThemeFamily>("purple");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setActive(stored.family);
    setMounted(true);
  }, []);

  const select = (family: ThemeFamily) => {
    const stored = getStoredTheme();
    const next = { ...stored, family };
    setActive(family);
    applyTheme(next);
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-full)",
        padding: "6px 14px 6px 18px",
      }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}
      >
        Warna
      </span>

      <div style={{ display: "flex", gap: "6px" }}>
        {COLORS.map((c) => (
          <motion.button
            key={c.family}
            onClick={() => select(c.family)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            title={c.name}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              border: active === c.family ? "2px solid rgba(255,255,255,0.9)" : "2px solid transparent",
              background: c.hex,
              cursor: "pointer",
              position: "relative",
              transition: "border-color 0.2s ease",
              outline: "none",
              boxShadow: active === c.family
                ? `0 0 0 2px ${c.hex}, 0 0 16px ${c.hex}55`
                : "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {active === c.family && (
              <motion.div
                layoutId="color-ring"
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.5)",
                  pointerEvents: "none",
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
