"use client";

import { Code } from "@phosphor-icons/react";

interface Props {
  text?: string;
  fullPage?: boolean;
}

export function LoadingScreen({ text = "Loading...", fullPage = true }: Props) {
  const containerStyle: React.CSSProperties = fullPage
    ? { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)" }
    : { display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-8)" };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "var(--gradient-hero)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-4)",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        >
          <Code size={24} color="white" weight="bold" />
        </div>
        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          {text}
        </p>
      </div>
    </div>
  );
}
