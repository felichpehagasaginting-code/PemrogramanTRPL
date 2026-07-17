"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { FeatureInfo, isFeatureDismissed, dismissFeature } from "@/lib/features";

interface FeaturePopupProps {
  feature: FeatureInfo;
  delay?: number;
}

export function FeaturePopup({ feature, delay = 4000 }: FeaturePopupProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isFeatureDismissed(feature.id)) {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [feature.id, delay]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    dismissFeature(feature.id);
  }, [feature.id]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="feature-popup"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9998,
        maxWidth: "320px",
        width: "100%",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        padding: "var(--space-4)",
        animation: "fadeInUp 0.4s ease",
        display: "flex",
        gap: "12px",
      }}
    >
      <div style={{ fontSize: "1.5rem", lineHeight: 1, flexShrink: 0, marginTop: "2px" }}>
        {feature.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            {feature.title}
          </h4>
          <button
            onClick={handleDismiss}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 0,
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Tutup"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "6px 0 10px", lineHeight: 1.4 }}>
          {feature.description}
        </p>
        {feature.href ? (
          <Link
            href={feature.href}
            onClick={handleDismiss}
            className="btn btn-primary btn-sm"
            style={{ fontSize: "0.8rem", padding: "6px 16px", textDecoration: "none", display: "inline-flex" }}
          >
            {feature.cta}
          </Link>
        ) : (
          <button onClick={handleDismiss} className="btn btn-primary btn-sm" style={{ fontSize: "0.8rem", padding: "6px 16px" }}>
            {feature.cta}
          </button>
        )}
      </div>
    </div>
  );
}
