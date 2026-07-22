"use client";

import { useState, useRef } from "react";
import { ArrowsOutSimple, ArrowsInSimple, DotsSixVertical } from "@phosphor-icons/react";

interface SplitWorkspaceProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  initialLeftWidthPercent?: number;
}

export function SplitWorkspace({
  leftContent,
  rightContent,
  initialLeftWidthPercent = 40,
}: SplitWorkspaceProps) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidthPercent);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const isDraggingRef = useRef(false);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const windowWidth = window.innerWidth;
    const newPercent = Math.max(20, Math.min(70, (e.clientX / windowWidth) * 100));
    setLeftWidth(newPercent);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      style={{
        position: isFocusMode ? "fixed" : "relative",
        inset: isFocusMode ? 0 : "auto",
        zIndex: isFocusMode ? 9999 : "auto",
        background: "var(--bg-page)",
        height: isFocusMode ? "100vh" : "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Bar with Focus Mode Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 16px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-color)",
          fontSize: "0.8125rem",
        }}
      >
        <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
          🖥️ Interactive All-in-One IDE Workspace
        </span>
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="btn btn-sm btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {isFocusMode ? <ArrowsInSimple size={16} /> : <ArrowsOutSimple size={16} />}
          {isFocusMode ? "Keluar Mode Fokus" : "Mode Fokus (Layar Penuh)"}
        </button>
      </div>

      {/* Split Panels */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Left Panel */}
        <div
          style={{
            width: `${leftWidth}%`,
            height: "100%",
            overflowY: "auto",
            padding: "var(--space-4)",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          {leftContent}
        </div>

        {/* Drag Divider */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "8px",
            height: "100%",
            background: "var(--bg-secondary)",
            cursor: "col-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            zIndex: 10,
          }}
          title="Geser untuk mengatur lebar panel"
        >
          <DotsSixVertical size={16} color="var(--text-muted)" />
        </div>

        {/* Right Panel */}
        <div
          style={{
            width: `${100 - leftWidth}%`,
            height: "100%",
            overflowY: "auto",
            padding: "var(--space-4)",
          }}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
}
