"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ElementType } from "react";

/* ============================================================
   Shared UI Primitives
   Theme-aware, keyboard accessible, Framer Motion micro-interactions.
   ============================================================ */

export interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: "center" | "start";
  className?: string;
}

export function SectionHeader({ eyebrow, title, sub, align = "center", className = "" }: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
      className={`section-header ${className}`}
      style={{
        textAlign: align,
        marginBottom: "var(--space-12)",
      }}
    >
      {eyebrow && (
        <span className="section-label" style={{ marginBottom: "var(--space-4)", justifyContent: align === "center" ? "center" : "flex-start" }}>
          {eyebrow}
        </span>
      )}
      <h2
        className="section-title"
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          color: "var(--text-primary)",
          margin: sub ? "var(--space-3) 0" : 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="section-sub"
          style={{
            color: "var(--text-secondary)",
            maxWidth: align === "center" ? "560px" : "none",
            margin: "0 auto",
            fontSize: "1.0625rem",
            lineHeight: 1.7,
          }}
        >
          {sub}
        </p>
      )}
    </motion.header>
  );
}

export interface StatCardProps {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
  accent?: string;
  className?: string;
}

export function StatCard({ icon, value, label, accent = "var(--color-primary-500)", className = "" }: StatCardProps) {
  return (
    <motion.div
      className={`stat-card ${className}`}
      whileHover={{ y: -2 }}
      style={{ accentColor: accent }}
    >
      {icon && <div style={{ marginBottom: "4px" }}>{icon}</div>}
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: accent,
          fontFamily: "var(--font-heading)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginTop: "2px" }}>{label}</div>
    </motion.div>
  );
}

export interface LiveBadgeProps {
  children?: ReactNode;
  color?: string;
  className?: string;
}

export function LiveBadge({ children = "LIVE", color = "var(--color-primary-500)", className = "" }: LiveBadgeProps) {
  return (
    <span
      className={`live-badge ${className}`}
      style={{
        background: "var(--gradient-hero)",
        color: "#fff",
        boxShadow: `0 0 12px ${color}55`,
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "#fff",
          display: "inline-block",
          marginRight: "2px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      {children}
    </span>
  );
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max = 100, color, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const gradient = color
    ? `linear-gradient(90deg, ${color} 0%, ${color} 100%)`
    : "var(--gradient-hero)";
  return (
    <div className="progress-bar-group" style={{ width: "100%" }}>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginBottom: "4px",
          }}
        >
          <span>{label}</span>
          <strong style={{ color: "var(--color-primary-600)", fontWeight: 700 }}>{Math.round(pct)}%</strong>
        </div>
      )}
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: gradient }}
        />
      </div>
    </div>
  );
}

export interface IconButtonProps {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  size?: "sm" | "md";
  variant?: "ghost" | "filled";
  className?: string;
}

export function IconButton({
  icon,
  label,
  onClick,
  active = false,
  size = "md",
  variant = "ghost",
  className = "",
}: IconButtonProps) {
  const sz = size === "sm" ? "30px" : "38px";
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      className={`icon-btn focus-ring ${active ? "active" : ""} ${className}`}
      style={{
        width: sz,
        height: sz,
        fontSize: size === "sm" ? "0.8rem" : "0.875rem",
        background: active || variant === "filled" ? "var(--color-primary-500)" : "transparent",
        color: active || variant === "filled" ? "#fff" : "var(--text-secondary)",
        border: active || variant === "filled"
          ? `1.5px solid var(--color-primary-500)`
          : "1.5px solid var(--border-color)",
      }}
    >
      {icon}
    </motion.button>
  );
}

export interface PillTabGroupProps {
  tabs: { id: string; label: ReactNode; icon?: ReactNode }[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabGroup({ tabs, value, onChange, className = "" }: PillTabGroupProps) {
  return (
    <div className={`pill-tab-group ${className}`} style={{ display: "inline-flex", gap: "3px", background: "var(--bg-page-alt)", padding: "3px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)" }}>
      {tabs.map((t) => {
        const isActive = value === t.id;
        return (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="pill-btn focus-ring"
            style={{
              background: isActive ? "var(--color-neutral-900)" : "transparent",
              color: isActive ? "#fff" : "var(--text-muted)",
              borderRadius: "var(--radius-full)",
            }}
            whileTap={{ scale: 0.96 }}
          >
            {t.icon}
            {t.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Re-export Element type for consumers
export type { ElementType };
