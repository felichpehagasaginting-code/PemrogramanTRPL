"use client";

import React from "react";
import {
  Footprints,
  Folder,
  Brain,
  Package,
  GitBranch,
  ArrowsClockwise,
  MagicWand,
  ChartBar,
  TerminalWindow,
  GraduationCap,
  Diamond,
  Rocket,
  Handshake,
  Question,
} from "@phosphor-icons/react";

interface BadgeIconProps {
  id: string;
  color?: string;
  size?: number;
}

export function BadgeIcon({ id, color = "#FF6B00", size = 40 }: BadgeIconProps) {
  // Map badge IDs to respective Phosphor SVG Icons
  const getIcon = () => {
    const iconSize = Math.round(size * 0.55);
    const props = { size: iconSize, weight: "bold" as const, color: color };

    switch (id) {
      case "langkah_pertama":
        return <Footprints {...props} />;
      case "workspace_master":
        return <Folder {...props} />;
      case "pemikir_logis":
        return <Brain {...props} />;
      case "penampung_data":
        return <Package {...props} />;
      case "pembuat_keputusan":
        return <GitBranch {...props} />;
      case "master_loop":
        return <ArrowsClockwise {...props} />;
      case "function_wizard":
        return <MagicWand {...props} />;
      case "data_collector":
        return <ChartBar {...props} />;
      case "junior_developer":
        return <TerminalWindow {...props} />;
      case "graduated":
        return <GraduationCap {...props} />;
      case "perfectionist":
        return <Diamond {...props} />;
      case "speed_runner":
        return <Rocket {...props} />;
      case "helping_hand":
        return <Handshake {...props} />;
      default:
        return <Question {...props} />;
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "32%", // Rounded squircle shape
        background: `linear-gradient(135deg, ${color}10, ${color}20)`,
        border: `1.5px solid ${color}80`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 12px ${color}15, inset 0 2px 4px rgba(255,255,255,0.1)`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        flexShrink: 0,
      }}
    >
      {getIcon()}
    </div>
  );
}
