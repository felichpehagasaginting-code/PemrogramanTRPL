"use client";

import React, { useId } from "react";

export interface CreatorIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  ariaHidden?: boolean;
}

/**
 * Bespoke vector SVG emblem for Platform Creator.
 * Precision-faceted royal tech crest with gradient depth, apex jewel, and core radiant spark.
 */
export function CreatorIcon({
  size = 16,
  className,
  style,
  title = "Platform Creator Emblem",
  ariaHidden = true,
}: CreatorIconProps) {
  const id = useId();
  const gradGold = `creator-gold-${id}`;
  const gradShine = `creator-shine-${id}`;
  const gradDark = `creator-dark-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        filter: "drop-shadow(0 1px 2px rgba(230, 81, 0, 0.35))",
        ...style,
      }}
      aria-hidden={ariaHidden}
      role={ariaHidden ? "presentation" : "img"}
    >
      {!ariaHidden && <title>{title}</title>}
      <defs>
        {/* Main Amber-Gold Facet Gradient */}
        <linearGradient id={gradGold} x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="35%" stopColor="#FFB300" />
          <stop offset="70%" stopColor="#FF8F00" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>

        {/* Top Facet Highlight */}
        <linearGradient id={gradShine} x1="12" y1="4" x2="12" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFE082" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFB300" stopOpacity="0.25" />
        </linearGradient>

        {/* Deep Angular Shadow Gradient */}
        <linearGradient id={gradDark} x1="12" y1="10" x2="12" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D84315" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#BF360C" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Outer Crown Silhouette */}
      <path
        d="M3.5 8.2L6.8 16.5H17.2L20.5 8.2L15.8 11.8L12 4.2L8.2 11.8L3.5 8.2Z"
        fill={`url(#${gradGold})`}
        stroke="#FFE082"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* Left Wing Facet Shadow */}
      <path
        d="M8.2 11.8L3.5 8.2L6.8 16.5L10 11.5L8.2 11.8Z"
        fill={`url(#${gradDark})`}
      />

      {/* Right Wing Facet Shadow */}
      <path
        d="M15.8 11.8L20.5 8.2L17.2 16.5L14 11.5L15.8 11.8Z"
        fill={`url(#${gradDark})`}
      />

      {/* Central Diamond Facet */}
      <path
        d="M12 5.5L14.4 11.2L12 16.5L9.6 11.2L12 5.5Z"
        fill={`url(#${gradShine})`}
        stroke="#FFF8E1"
        strokeWidth="0.4"
      />

      {/* Base Foundation Bar */}
      <rect
        x="6"
        y="17"
        width="12"
        height="2.8"
        rx="1"
        fill={`url(#${gradGold})`}
        stroke="#FFE082"
        strokeWidth="0.5"
      />

      {/* 3 Inset Micro Jewels */}
      <circle cx="8.5" cy="18.4" r="0.75" fill="#FFFFFF" />
      <circle cx="12" cy="18.4" r="0.9" fill="#FFFFFF" />
      <circle cx="15.5" cy="18.4" r="0.75" fill="#FFFFFF" />

      {/* Central Core Star Spark */}
      <path
        d="M12 9.2C12 10.3 12.4 10.8 13.5 11.2C12.4 11.6 12 12.1 12 13.2C12 12.1 11.6 11.6 10.5 11.2C11.6 10.8 12 10.3 12 9.2Z"
        fill="#FFFFFF"
      />

      {/* Crown Apex Gem Highlights */}
      <circle cx="12" cy="4.2" r="1.15" fill="#FFFFFF" />
      <circle cx="3.5" cy="8.2" r="0.9" fill="#FFE082" />
      <circle cx="20.5" cy="8.2" r="0.9" fill="#FFE082" />
    </svg>
  );
}

export interface CreatorBadgeProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "pill" | "hero" | "subtle" | "solid";
  label?: string;
  showIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

const SIZE_CONFIGS = {
  xs: { fontSize: "0.65rem", padding: "1px 6px", iconSize: 12, gap: "3px" },
  sm: { fontSize: "0.7rem", padding: "2px 8px", iconSize: 14, gap: "4px" },
  md: { fontSize: "0.78rem", padding: "3px 10px", iconSize: 16, gap: "5px" },
  lg: { fontSize: "0.85rem", padding: "5px 14px", iconSize: 18, gap: "6px" },
};

/**
 * High-end Creator Badge component designed according to taste-skill standards.
 * Eliminates generic AI emoji styling with custom SVG crest and high-contrast typography.
 */
export function CreatorBadge({
  size = "sm",
  variant = "pill",
  label = "Creator",
  showIcon = true,
  className,
  style,
  title = "Platform Creator & Lead Architect",
}: CreatorBadgeProps) {
  const conf = SIZE_CONFIGS[size];

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "hero":
        return {
          background: "linear-gradient(135deg, #FF6B00 0%, #F59E0B 100%)",
          color: "#160600",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 2px 14px rgba(245, 158, 11, 0.4), 0 1px 3px rgba(0,0,0,0.12)",
          fontWeight: 900,
          letterSpacing: "0.02em",
        };
      case "solid":
        return {
          background: "linear-gradient(135deg, #FF6B00 0%, #F59E0B 100%)",
          color: "#160600",
          border: "1px solid rgba(255, 217, 61, 0.5)",
          boxShadow: "0 2px 8px rgba(255, 107, 0, 0.25)",
          fontWeight: 800,
        };
      case "subtle":
        return {
          background: "rgba(255, 107, 0, 0.08)",
          color: "var(--color-primary-500)",
          border: "1px solid rgba(255, 107, 0, 0.22)",
          fontWeight: 800,
        };
      case "pill":
      default:
        return {
          background: "linear-gradient(135deg, rgba(255, 107, 0, 0.14) 0%, rgba(245, 158, 11, 0.09) 100%)",
          color: "var(--color-primary-500)",
          border: "1px solid rgba(255, 166, 0, 0.35)",
          boxShadow: "0 1px 3px rgba(255, 107, 0, 0.08)",
          fontWeight: 800,
        };
    }
  };

  return (
    <span
      className={className}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: conf.gap,
        fontSize: conf.fontSize,
        padding: conf.padding,
        borderRadius: "var(--radius-full)",
        lineHeight: 1.3,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        userSelect: "none",
        ...getVariantStyles(),
        ...style,
      }}
    >
      {showIcon && <CreatorIcon size={conf.iconSize} />}
      {label && <span>{label}</span>}
    </span>
  );
}
