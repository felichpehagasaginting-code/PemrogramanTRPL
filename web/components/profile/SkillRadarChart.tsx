"use client";

import React from "react";
import { Sparkle, Trophy, CheckCircle, ShieldCheck } from "@phosphor-icons/react";

interface SkillMetrics {
  cleanCode: number;
  modularity: number;
  logic: number;
  efficiency: number;
  errorHandling: number;
}

interface SkillRadarChartProps {
  metrics?: SkillMetrics;
  studentLevel?: string;
}

const DEFAULT_METRICS: SkillMetrics = {
  cleanCode: 85,
  modularity: 78,
  logic: 92,
  efficiency: 88,
  errorHandling: 80,
};

export function SkillRadarChart({
  metrics = DEFAULT_METRICS,
  studentLevel = "TRPL Cadet",
}: SkillRadarChartProps) {
  // SVG Radar Polygon calculations (Center at 150, 150, radius 100)
  const cx = 150;
  const cy = 150;
  const r = 90;

  const categories = [
    { key: "logic", label: "Logika Dasar", val: metrics.logic },
    { key: "modularity", label: "Modularitas", val: metrics.modularity },
    { key: "cleanCode", label: "Clean Code", val: metrics.cleanCode },
    { key: "efficiency", label: "Efisiensi", val: metrics.efficiency },
    { key: "errorHandling", label: "Error Safety", val: metrics.errorHandling },
  ];

  const totalPoints = categories.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalPoints - Math.PI / 2;
    const distance = (value / 100) * r;
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    };
  };

  const polygonPoints = categories
    .map((c, i) => {
      const { x, y } = getCoordinates(i, c.val);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <span className="badge badge-primary" style={{ marginBottom: "6px" }}>
          <Sparkle size={12} weight="fill" /> Radar Kompetensi
        </span>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
          Peta Keahlian Software Engineering
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "4px 0 0" }}>
          Tingkat: <strong style={{ color: "#38BDF8" }}>{studentLevel}</strong>
        </p>
      </div>

      {/* SVG Radar Polygon */}
      <div style={{ position: "relative", width: "300px", height: "300px" }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Background concentric guide webs */}
          {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
            const guidePoints = categories
              .map((_, i) => {
                const { x, y } = getCoordinates(i, 100 * scale);
                return `${x},${y}`;
              })
              .join(" ");
            return (
              <polygon
                key={sIdx}
                points={guidePoints}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axes lines */}
          {categories.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Filled Data Polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(255, 107, 0, 0.25)"
            stroke="#FF6B00"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {categories.map((c, i) => {
            const { x, y } = getCoordinates(i, c.val);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#38BDF8"
                stroke="#FFF"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          {categories.map((c, i) => {
            const labelCoord = getCoordinates(i, 118);
            return (
              <text
                key={i}
                x={labelCoord.x}
                y={labelCoord.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#CBD5E1"
                fontSize="11"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {c.label} ({c.val}%)
              </text>
            );
          })}
        </svg>
      </div>

      {/* Senior Mentor Clean Code Advice */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          background: "rgba(56, 189, 248, 0.08)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          borderRadius: "var(--radius-lg)",
          fontSize: "0.8rem",
          color: "var(--text-primary)",
          width: "100%",
          display: "flex",
          gap: "8px",
        }}
      >
        <Sparkle size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong>Tips Senior:</strong> Logika dasar kamu sudah sangat solid! Terus pertahankan penamaan variabel yang ekspresif dan pemecahan fungsi modular di modul-modul berikutnya ya!
        </div>
      </div>
    </div>
  );
}
