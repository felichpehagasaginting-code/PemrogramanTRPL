"use client";

interface GlassSkeletonProps {
  height?: string;
  width?: string;
  borderRadius?: string;
}

export function GlassSkeleton({
  height = "120px",
  width = "100%",
  borderRadius = "var(--radius-lg)",
}: GlassSkeletonProps) {
  return (
    <div
      className="glass-shimmer"
      style={{
        height,
        width,
        borderRadius,
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
      }}
    />
  );
}
