"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserProgress } from "@/lib/store/useUserStore";
import { CheckCircle, LockKey, Lightning, Sparkle, Rocket } from "@phosphor-icons/react";
import { soundFX } from "@/lib/audio";

interface SkillTreeProps {
  progress: UserProgress;
}

interface NodeMeta {
  id: string;
  title: string;
  x: number; // percentage
  y: number; // px
  xp: number;
  icon: string;
}

const NODES: NodeMeta[] = [
  { id: "M0", title: "Pre-Test & Orientasi", x: 50, y: 30, xp: 50, icon: "🐣" },
  { id: "M1", title: "Dasar Komputer & Workspace", x: 25, y: 120, xp: 100, icon: "📁" },
  { id: "M2", title: "Logika & Algoritma", x: 75, y: 120, xp: 100, icon: "🧠" },
  { id: "M3", title: "Variabel & Tipe Data", x: 50, y: 210, xp: 120, icon: "📦" },
  { id: "M4", title: "Percabangan Logic", x: 20, y: 300, xp: 150, icon: "🔀" },
  { id: "M5", title: "Perulangan (Loop)", x: 80, y: 300, xp: 150, icon: "🔄" },
  { id: "M6", title: "Fungsi & Prosedur", x: 35, y: 390, xp: 180, icon: "🪄" },
  { id: "M7", title: "Array & List Data", x: 65, y: 390, xp: 200, icon: "📊" },
  { id: "M8", title: "Mini Project Akhir", x: 50, y: 480, xp: 300, icon: "🏆" },
];

const CONNECTIONS = [
  ["M0", "M1"], ["M0", "M2"],
  ["M1", "M3"], ["M2", "M3"],
  ["M3", "M4"], ["M3", "M5"],
  ["M4", "M6"], ["M5", "M7"],
  ["M6", "M8"], ["M7", "M8"],
];

export function SkillTree({ progress }: SkillTreeProps) {
  const nodeStatuses = useMemo(() => {
    const map: Record<string, "completed" | "active" | "locked"> = {};
    NODES.forEach((n) => {
      map[n.id] = progress?.[n.id]?.status || "locked";
    });
    return map;
  }, [progress]);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
            🗺️ Peta Perjalanan Belajar (Skill Tree)
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Selesaikan setiap modul untuk membuka simpul modul berikutnya!
          </p>
        </div>
        <span
          style={{
            background: "rgba(255, 157, 0, 0.15)",
            border: "1px solid var(--primary-color)",
            color: "var(--primary-color)",
            padding: "4px 12px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          TRPL 2026 ROADMAP
        </span>
      </div>

      {/* Canvas container */}
      <div style={{ position: "relative", width: "100%", height: "550px", marginTop: "20px" }}>
        {/* SVG Connecting lines */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="gradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9D00" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
            <linearGradient id="gradientCompleted" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {CONNECTIONS.map(([fromId, toId], idx) => {
            const fromNode = NODES.find((n) => n.id === fromId)!;
            const toNode = NODES.find((n) => n.id === toId)!;

            const isCompletedConnection =
              nodeStatuses[fromId] === "completed" && nodeStatuses[toId] !== "locked";

            return (
              <line
                key={idx}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y + 25}px`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y + 25}px`}
                stroke={isCompletedConnection ? "url(#gradientCompleted)" : "var(--border-color)"}
                strokeWidth={isCompletedConnection ? "3" : "2"}
                strokeDasharray={isCompletedConnection ? "none" : "5,5"}
                style={{
                  transition: "all 0.3s ease",
                  filter: isCompletedConnection ? "drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))" : "none",
                }}
              />
            );
          })}
        </svg>

        {/* Nodes rendering */}
        {NODES.map((node) => {
          const status = nodeStatuses[node.id];
          const isLocked = status === "locked";
          const isCompleted = status === "completed";
          const isActive = status === "active";

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: isLocked ? 1 : 1.1 }}
              onClick={() => {
                if (!isLocked) soundFX.playClick();
              }}
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: `${node.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              {isLocked ? (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--bg-secondary)",
                    border: "2px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    cursor: "not-allowed",
                    opacity: 0.7,
                  }}
                  title={`${node.id}: ${node.title} (Terkunci)`}
                >
                  <LockKey size={22} />
                </div>
              ) : (
                <Link
                  href={`/learn/${node.id}`}
                  style={{ textDecoration: "none" }}
                  title={`${node.id}: ${node.title} (${node.xp} XP)`}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: isCompleted
                        ? "linear-gradient(135deg, #22C55E, #10B981)"
                        : "linear-gradient(135deg, #FF9D00, #FF6B00)",
                      boxShadow: isCompleted
                        ? "0 0 20px rgba(34, 197, 94, 0.6)"
                        : "0 0 20px rgba(255, 157, 0, 0.7)",
                      border: "3px solid #FFF",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFF",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{node.icon}</span>
                  </div>
                </Link>
              )}

              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  top: "65px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: isActive ? "var(--primary-color)" : isCompleted ? "var(--success-color)" : "var(--text-muted)",
                  }}
                >
                  {node.id}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    maxWidth: "110px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {node.title}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
