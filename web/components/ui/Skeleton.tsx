"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Atomic Skeleton Box with embedded shimmer wave
 */
export function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "var(--radius-md)",
  circle = false,
  className = "",
  style,
}: SkeletonProps) {
  return (
    <div
      className={`sk-item ${className}`}
      style={{
        width: circle ? height : width,
        height: height,
        borderRadius: circle ? "50%" : borderRadius,
        backgroundColor: "var(--skeleton-base)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        className="sk-shimmer"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "100%",
          background: "linear-gradient(90deg, transparent 0%, var(--skeleton-shimmer) 50%, transparent 100%)",
          transform: "translateX(-100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function SkeletonCircle({ size = 40, className = "", style }: { size?: number | string; className?: string; style?: React.CSSProperties }) {
  return <Skeleton width={size} height={size} circle className={className} style={style} />;
}

export function SkeletonText({
  lines = 3,
  lineHeight = 16,
  gap = 8,
  lastLineWidth = "60%",
  className = "",
  style,
}: {
  lines?: number;
  lineHeight?: number;
  gap?: number;
  lastLineWidth?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap, width: "100%", ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : i % 2 === 1 ? "90%" : "100%"}
          borderRadius="var(--radius-sm)"
        />
      ))}
    </div>
  );
}

/**
 * Wrapper that attaches GSAP animation to all child skeletons
 */
export function SkeletonGroup({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".sk-item");
      const shimmers = containerRef.current?.querySelectorAll(".sk-shimmer");

      if (items && items.length > 0) {
        // Staggered entrance
        gsap.fromTo(
          items,
          { opacity: 0.4, y: 6 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.03, ease: "power2.out" }
        );
      }

      if (shimmers && shimmers.length > 0) {
        // Continuous smooth shimmer wave
        gsap.fromTo(
          shimmers,
          { xPercent: -100 },
          {
            xPercent: 100,
            duration: 1.4,
            repeat: -1,
            ease: "power1.inOut",
            stagger: {
              each: 0.08,
              repeat: -1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Dashboard Skeleton
 */
export function SkeletonDashboard() {
  return (
    <SkeletonGroup
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "var(--space-6) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Hero Welcome Card Skeleton */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <SkeletonCircle size={56} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Skeleton width="180px" height="24px" />
              <Skeleton width="120px" height="16px" />
            </div>
          </div>
          <Skeleton width="140px" height="36px" borderRadius="var(--radius-full)" />
        </div>
        <Skeleton width="100%" height="12px" borderRadius="var(--radius-full)" />
      </div>

      {/* Metrics Row Skeleton (4 cards) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <SkeletonCircle size={44} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <Skeleton width="60%" height="14px" />
              <Skeleton width="40%" height="22px" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {/* Left: Active Module Card */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Skeleton width="140px" height="20px" />
            <Skeleton width="60px" height="20px" borderRadius="var(--radius-full)" />
          </div>
          <Skeleton width="80%" height="28px" />
          <SkeletonText lines={3} />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Skeleton width="130px" height="40px" borderRadius="var(--radius-full)" />
            <Skeleton width="110px" height="40px" borderRadius="var(--radius-full)" />
          </div>
        </div>

        {/* Right: Leaderboard Preview Card */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <Skeleton width="160px" height="20px" />
            <Skeleton width="70px" height="16px" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-page)",
              }}
            >
              <Skeleton width="24px" height="24px" circle />
              <SkeletonCircle size={32} />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="16px" />
              </div>
              <Skeleton width="40px" height="18px" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonGroup>
  );
}

/**
 * Leaderboard Skeleton
 */
export function SkeletonLeaderboard() {
  return (
    <SkeletonGroup
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "var(--space-8) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Skeleton width="220px" height="32px" />
        <Skeleton width="340px" height="18px" />
      </div>

      {/* Top 3 Podium Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
          marginTop: "var(--space-4)",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6) var(--space-4)",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <SkeletonCircle size={64} />
            <Skeleton width="120px" height="20px" />
            <Skeleton width="80px" height="16px" />
            <Skeleton width="60px" height="24px" borderRadius="var(--radius-full)" />
          </div>
        ))}
      </div>

      {/* Table list */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-4)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-page)",
            }}
          >
            <Skeleton width="28px" height="20px" />
            <SkeletonCircle size={36} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <Skeleton width="50%" height="16px" />
              <Skeleton width="30%" height="12px" />
            </div>
            <Skeleton width="70px" height="20px" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}

/**
 * Editor / Sandbox / Practice Skeleton
 */
export function SkeletonEditor() {
  return (
    <SkeletonGroup
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)",
        width: "100%",
        padding: "var(--space-3)",
        gap: "var(--space-3)",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          height: "48px",
          background: "var(--bg-card)",
          borderRadius: "var(--radius-md)",
          padding: "0 var(--space-4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton width="120px" height="20px" />
          <Skeleton width="80px" height="16px" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Skeleton width="90px" height="32px" borderRadius="var(--radius-full)" />
          <Skeleton width="100px" height="32px" borderRadius="var(--radius-full)" />
        </div>
      </div>

      {/* Main Split Panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          flex: 1,
          gap: "var(--space-3)",
          minHeight: 0,
        }}
      >
        {/* Left Sidebar / Instructions */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            padding: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <Skeleton width="70%" height="22px" />
          <SkeletonText lines={6} gap={10} />
          <div style={{ marginTop: "auto" }}>
            <Skeleton width="100%" height="38px" borderRadius="var(--radius-md)" />
          </div>
        </div>

        {/* Right Code Area + Terminal */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 180px",
            gap: "var(--space-3)",
            minHeight: 0,
          }}
        >
          {/* Code Editor */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: 8 }}>
              <Skeleton width="90px" height="18px" />
              <Skeleton width="60px" height="18px" />
            </div>
            <SkeletonText lines={10} lineHeight={14} gap={8} />
          </div>

          {/* Terminal / Output */}
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              padding: "var(--space-3) var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Skeleton width="110px" height="16px" />
            <Skeleton width="60%" height="14px" />
            <Skeleton width="80%" height="14px" />
          </div>
        </div>
      </div>
    </SkeletonGroup>
  );
}

/**
 * Admin Panel Skeleton
 */
export function SkeletonAdmin() {
  return (
    <SkeletonGroup
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "var(--space-8) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width="260px" height="28px" />
          <Skeleton width="180px" height="16px" />
        </div>
        <Skeleton width="110px" height="36px" borderRadius="var(--radius-full)" />
      </div>

      {/* Broadcast Banner Input skeleton */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Skeleton width="190px" height="20px" />
        <Skeleton width="100%" height="40px" borderRadius="var(--radius-md)" />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Skeleton width="120px" height="36px" borderRadius="var(--radius-full)" />
        </div>
      </div>

      {/* Tickets queue skeleton */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Skeleton width="170px" height="20px" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: "var(--space-4)",
              background: "var(--bg-page)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton width="140px" height="18px" />
              <Skeleton width="60px" height="18px" borderRadius="var(--radius-full)" />
            </div>
            <Skeleton width="70%" height="14px" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}

/**
 * Snapshot Help Desk Skeleton
 */
export function SkeletonSnapshot() {
  return (
    <SkeletonGroup
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "var(--space-8) var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton width="160px" height="20px" />
        <Skeleton width="90px" height="32px" borderRadius="var(--radius-full)" />
      </div>

      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SkeletonCircle size={44} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Skeleton width="140px" height="18px" />
            <Skeleton width="90px" height="14px" />
          </div>
        </div>
        <Skeleton width="100%" height="240px" borderRadius="var(--radius-lg)" />
        <SkeletonText lines={3} />
      </div>
    </SkeletonGroup>
  );
}

/**
 * Student Profile Skeleton
 */
export function SkeletonProfile() {
  return (
    <SkeletonGroup
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      {/* Banner + Avatar */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
        }}
      >
        <Skeleton width="100%" height="140px" borderRadius={0} />
        <div style={{ padding: "var(--space-6)", paddingTop: "50px", position: "relative" }}>
          <div style={{ position: "absolute", top: "-42px", left: "24px" }}>
            <SkeletonCircle size={84} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Skeleton width="220px" height="26px" />
            <Skeleton width="160px" height="16px" />
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <Skeleton width="50%" height="14px" />
            <Skeleton width="70%" height="22px" />
          </div>
        ))}
      </div>

      {/* Badge collection grid */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Skeleton width="180px" height="22px" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <SkeletonCircle size={56} />
              <Skeleton width="60px" height="12px" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonGroup>
  );
}

