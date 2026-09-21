"use client";

import { SkeletonDashboard } from "@/components/ui/Skeleton";
import { Code } from "@phosphor-icons/react";

interface Props {
  text?: string;
  fullPage?: boolean;
}

export function LoadingScreen({ text = "Memuat...", fullPage = true }: Props) {
  if (fullPage) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-page)", position: "relative", overflow: "hidden" }}>
        {/* Subtle floating branding overlay at the top */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              background: "var(--gradient-hero)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Code size={12} color="white" weight="bold" />
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
            {text}
          </span>
        </div>

        {/* GSAP Skeleton Dashboard Layout */}
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8)" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "var(--gradient-hero)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-3)",
            boxShadow: "var(--shadow-glow-soft)",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        >
          <Code size={22} color="white" weight="bold" />
        </div>
        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          {text}
        </p>
      </div>
    </div>
  );
}

