"use client";

import { Sparkle } from "@phosphor-icons/react";

interface Props {
  text?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ text = "Memuat...", fullPage }: Props) {
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
        padding: "var(--space-8)",
        color: "var(--text-secondary)",
      }}
    >
      <div style={{ position: "relative", width: 40, height: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid var(--color-neutral-150)",
            borderTopColor: "var(--color-primary-500)",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
      <span style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkle size={16} weight="fill" color="var(--color-primary-500)" /> {text}
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-page)",
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
