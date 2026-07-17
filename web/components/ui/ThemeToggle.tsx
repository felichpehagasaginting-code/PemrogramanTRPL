"use client";

import { useEffect, useState } from "react";
import { getStoredTheme, applyTheme, getNextFamily, getNextMode, getThemeLabel, type Theme } from "@/lib/theme";
import { Sun, Moon, Palette } from "@phosphor-icons/react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>({ family: "orange", mode: "light" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  const toggleFamily = () => {
    const next = { ...theme, family: getNextFamily(theme.family) };
    setTheme(next);
    applyTheme(next);
  };

  const toggleMode = () => {
    const next = { ...theme, mode: getNextMode(theme.mode) };
    setTheme(next);
    applyTheme(next);
  };

  if (!mounted) return <div style={{ width: "90px", height: "34px" }} />;

  return (
    <div data-theme-toggle="true" style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: "var(--bg-page-alt)",
      border: "1px solid var(--border-color)",
      borderRadius: "var(--radius-full)",
      padding: "3px",
    }}>
      <button
        onClick={toggleFamily}
        title={`Tema: ${getThemeLabel(theme.family)}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
          border: "none",
          background: "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: "0.75rem",
          fontWeight: 700,
          fontFamily: "var(--font-heading)",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--border-color)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <Palette size={14} weight="bold" />
        {getThemeLabel(theme.family)}
      </button>

      <button
        onClick={toggleMode}
        title={theme.mode === "light" ? "Mode Terang" : "Mode Gelap"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          color: "var(--text-secondary)",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--border-color)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        {theme.mode === "light" ? <Sun size={14} weight="bold" /> : <Moon size={14} weight="fill" />}
      </button>
    </div>
  );
}
