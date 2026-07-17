"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "@phosphor-icons/react";
import { dismissFeature, isFeatureDismissed } from "@/lib/features";

type Position = "top" | "bottom" | "left" | "right";

interface PointingPopupProps {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  emoji: string;
  position?: Position;
  offset?: number;
  delay?: number;
}

export function PointingPopup({
  id,
  targetSelector,
  title,
  description,
  emoji,
  position = "bottom",
  offset = 12,
  delay = 3000,
}: PointingPopupProps) {
  const [coords, setCoords] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isFeatureDismissed(id)) {
      setDismissed(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [id, delay]);

  const updatePosition = useCallback(() => {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
  }, [targetSelector]);

  useEffect(() => {
    if (!visible || !coords) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [visible, coords, updatePosition]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    dismissFeature(id);
  }, [id]);

  if (dismissed || !visible || !coords) return null;

  const getPopupStyle = (): React.CSSProperties => {
    const gap = offset;
    switch (position) {
      case "bottom":
        return {
          top: coords.y + coords.h + gap,
          left: coords.x + coords.w / 2,
          transform: "translateX(-50%)",
        };
      case "top":
        return {
          top: coords.y - gap,
          left: coords.x + coords.w / 2,
          transform: "translateX(-50%) translateY(-100%)",
        };
      case "left":
        return {
          top: coords.y + coords.h / 2,
          left: coords.x - gap,
          transform: "translateY(-50%) translateX(-100%)",
        };
      case "right":
        return {
          top: coords.y + coords.h / 2,
          left: coords.x + coords.w + gap,
          transform: "translateY(-50%)",
        };
    }
  };

  const beakStyle = (): React.CSSProperties => {
    const size = 8;
    const color = "var(--bg-card)";
    switch (position) {
      case "bottom":
        return {
          top: -size + 1,
          left: "50%",
          marginLeft: -size,
          border: `${size}px solid transparent`,
          borderBottomColor: color,
        };
      case "top":
        return {
          bottom: -size + 1,
          left: "50%",
          marginLeft: -size,
          border: `${size}px solid transparent`,
          borderTopColor: color,
        };
      case "left":
        return {
          right: -size + 1,
          top: "50%",
          marginTop: -size,
          border: `${size}px solid transparent`,
          borderLeftColor: color,
        };
      case "right":
        return {
          left: -size + 1,
          top: "50%",
          marginTop: -size,
          border: `${size}px solid transparent`,
          borderRightColor: color,
        };
    }
  };

  return (
    <div
      className="pointing-popup"
      style={{
        position: "fixed",
        zIndex: 9999,
        animation: "fadeInUp 0.35s ease",
        ...getPopupStyle(),
      }}
    >
      {/* Beak */}
      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          filter: "drop-shadow(0 -1px 1px var(--border-color))",
          ...beakStyle(),
        }}
      />
      {/* Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: "var(--space-4)",
          maxWidth: "280px",
          display: "flex",
          gap: "10px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: "1.25rem", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              {title}
            </h4>
            <button
              onClick={handleDismiss}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", padding: 0, lineHeight: 1, flexShrink: 0,
              }}
              aria-label="Tutup"
            >
              <X size={13} weight="bold" />
            </button>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "5px 0 0", lineHeight: 1.4 }}>
            {description}
          </p>
          <button
            onClick={handleDismiss}
            className="btn btn-primary btn-sm"
            style={{ fontSize: "0.75rem", padding: "4px 14px", marginTop: "8px" }}
          >
            Oke, Mengerti!
          </button>
        </div>
      </div>
    </div>
  );
}
