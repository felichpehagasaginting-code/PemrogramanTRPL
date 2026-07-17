"use client";

import {
  Footprints, Folder, Brain, Package, GitBranch,
  ArrowsClockwise, MagicWand, ChartBar, TerminalWindow,
  GraduationCap, Diamond, Rocket, Handshake, Question,
} from "@phosphor-icons/react";

interface BadgeIconProps {
  id: string;
  color?: string;
  size?: number;
}

export function BadgeIcon({ id, color = "#FF6B00", size = 40 }: BadgeIconProps) {
  const iconSize = Math.round(size * 0.55);
  const iconProps = { size: iconSize, weight: "bold" as const, color };

  const icon = (() => {
    switch (id) {
      case "langkah_pertama": return <FootstepsIcon {...iconProps} />;
      case "workspace_master": return <Folder {...iconProps} />;
      case "pemikir_logis": return <Brain {...iconProps} />;
      case "penampung_data": return <Package {...iconProps} />;
      case "pembuat_keputusan": return <GitBranch {...iconProps} />;
      case "master_loop": return <ArrowsClockwise {...iconProps} />;
      case "function_wizard": return <MagicWand {...iconProps} />;
      case "data_collector": return <ChartBar {...iconProps} />;
      case "junior_developer": return <TerminalWindow {...iconProps} />;
      case "graduated": return <GraduationCap {...iconProps} />;
      case "perfectionist": return <Diamond {...iconProps} />;
      case "speed_runner": return <Rocket {...iconProps} />;
      case "helping_hand": return <Handshake {...iconProps} />;
      default: return <Question {...iconProps} />;
    }
  })();

  return (
    <div
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "32%",
        background: `linear-gradient(135deg, ${color}10, ${color}20)`,
        border: `1.5px solid ${color}80`,
        boxShadow: `0 4px 12px ${color}15, inset 0 2px 4px rgba(255,255,255,0.1)`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {icon}
    </div>
  );
}

function FootstepsIcon(props: { size: number; weight: "bold"; color: string }) {
  return <Footprints {...props} />;
}
