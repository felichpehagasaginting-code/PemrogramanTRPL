"use client";

import React, { useState, useEffect } from "react";
import {
  GitCommit,
  ArrowsSplit,
  ArrowsClockwise,
  TextT,
  Play,
  CheckCircle,
  Plus,
  Trash,
  Sparkle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export type FlowNodeType = "start" | "input" | "condition" | "loop" | "output" | "end";

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  label: string;
  variableName?: string;
  conditionExpr?: string;
  trueAction?: string;
  falseAction?: string;
  loopTimes?: number;
}

const INITIAL_NODES: FlowNode[] = [
  { id: "1", type: "start", label: "Mulai Program" },
  { id: "2", type: "input", label: "Input Nilai", variableName: "skor" },
  {
    id: "3",
    type: "condition",
    label: "Cek Kelulusan",
    conditionExpr: "skor >= 75",
    trueAction: 'print("Selamat, Kamu Lulus!")',
    falseAction: 'print("Tetap semangat, coba lagi ya!")',
  },
  { id: "4", type: "end", label: "Selesai" },
];

export function generatePythonFromFlow(nodes: FlowNode[]): string {
  const lines: string[] = ["# Kode Python hasil rancangan visual Flowchart", ""];

  for (const node of nodes) {
    if (node.type === "start") {
      lines.push("# --- Mulai ---");
    } else if (node.type === "input") {
      const varName = node.variableName || "data";
      lines.push(`${varName} = int(input("Masukkan nilai ${varName}: "))`);
    } else if (node.type === "condition") {
      const cond = node.conditionExpr || "x > 0";
      lines.push(`if ${cond}:`);
      lines.push(`    ${node.trueAction || 'print("Kondisi Terpenuhi")'}`);
      lines.push("else:");
      lines.push(`    ${node.falseAction || 'print("Kondisi Tidak Terpenuhi")'}`);
    } else if (node.type === "loop") {
      const times = node.loopTimes || 3;
      lines.push(`for i in range(${times}):`);
      lines.push(`    print(f"Perulangan ke-{i + 1}")`);
    } else if (node.type === "output") {
      lines.push(`print(${node.label ? `"${node.label}"` : '"Selesai"'})`);
    } else if (node.type === "end") {
      lines.push("# --- Selesai ---");
    }
  }

  return lines.join("\n");
}

interface FlowchartBuilderProps {
  onCodeGenerated?: (pythonCode: string) => void;
}

export function FlowchartBuilder({ onCodeGenerated }: FlowchartBuilderProps) {
  const [nodes, setNodes] = useState<FlowNode[]>(INITIAL_NODES);

  useEffect(() => {
    const code = generatePythonFromFlow(nodes);
    if (onCodeGenerated) {
      onCodeGenerated(code);
    }
  }, [nodes, onCodeGenerated]);

  const addNode = (type: FlowNodeType) => {
    const id = `node-${Date.now()}`;
    let newNode: FlowNode;

    if (type === "input") {
      newNode = { id, type, label: "Input Data Baru", variableName: "angka" };
    } else if (type === "condition") {
      newNode = {
        id,
        type,
        label: "Percabangan Logika",
        conditionExpr: "angka % 2 == 0",
        trueAction: 'print("Angka Genap")',
        falseAction: 'print("Angka Ganjil")',
      };
    } else if (type === "loop") {
      newNode = { id, type, label: "Perulangan Loop", loopTimes: 5 };
    } else {
      newNode = { id, type, label: "Cetak Pesan" };
    }

    // Insert before the last "end" node
    const next = [...nodes];
    next.splice(next.length - 1, 0, newNode);
    setNodes(next);
  };

  const removeNode = (id: string) => {
    if (nodes.length <= 2) return; // Keep start & end
    setNodes(nodes.filter((n) => n.id !== id));
  };

  const updateNode = (id: string, updates: Partial<FlowNode>) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--bg-secondary)",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <GitCommit size={20} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Visual Flowchart-to-Python Builder
          </h4>
        </div>

        {/* Add Node Dropdown buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => addNode("input")}
            className="btn btn-xs btn-secondary"
            style={{ gap: "4px" }}
          >
            <Plus size={12} /> + Input
          </button>
          <button
            onClick={() => addNode("condition")}
            className="btn btn-xs btn-secondary"
            style={{ gap: "4px" }}
          >
            <ArrowsSplit size={12} /> + If-Else
          </button>
          <button
            onClick={() => addNode("loop")}
            className="btn btn-xs btn-secondary"
            style={{ gap: "4px" }}
          >
            <ArrowsClockwise size={12} /> + Loop
          </button>
        </div>
      </div>

      {/* Visual Flow Node Sequence */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          maxHeight: "360px",
          overflowY: "auto",
          background: "rgba(0,0,0,0.15)",
        }}
      >
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {index > 0 && (
              <div
                style={{
                  width: "2px",
                  height: "16px",
                  background: "var(--color-primary-500)",
                  opacity: 0.6,
                }}
              />
            )}

            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                width: "100%",
                maxWidth: "460px",
                background:
                  node.type === "start" || node.type === "end"
                    ? "linear-gradient(135deg, #10B981, #059669)"
                    : node.type === "condition"
                    ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))"
                    : node.type === "loop"
                    ? "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.05))"
                    : "var(--bg-card)",
                border:
                  node.type === "condition"
                    ? "1.5px solid #F59E0B"
                    : node.type === "loop"
                    ? "1.5px solid #38BDF8"
                    : "1px solid var(--border-color)",
                borderRadius: node.type === "start" || node.type === "end" ? "var(--radius-full)" : "var(--radius-lg)",
                padding: "10px 16px",
                color: node.type === "start" || node.type === "end" ? "white" : "var(--text-primary)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                {node.type === "condition" ? (
                  <ArrowsSplit size={18} color="#F59E0B" />
                ) : node.type === "loop" ? (
                  <ArrowsClockwise size={18} color="#38BDF8" />
                ) : (
                  <GitCommit size={18} />
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                    {node.type === "start"
                      ? "🟢 Start"
                      : node.type === "end"
                      ? "🔴 End"
                      : node.type === "input"
                      ? `Input: ${node.variableName}`
                      : node.type === "condition"
                      ? `Kondisi: ${node.conditionExpr}`
                      : `Perulangan (${node.loopTimes}x)`}
                  </div>

                  {node.type === "input" && (
                    <input
                      type="text"
                      value={node.variableName || ""}
                      onChange={(e) => updateNode(node.id, { variableName: e.target.value })}
                      placeholder="nama_variabel"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "4px",
                        color: "#38BDF8",
                        padding: "2px 6px",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        marginTop: "4px",
                        width: "120px",
                      }}
                    />
                  )}

                  {node.type === "condition" && (
                    <input
                      type="text"
                      value={node.conditionExpr || ""}
                      onChange={(e) => updateNode(node.id, { conditionExpr: e.target.value })}
                      placeholder="skor >= 75"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid #F59E0B",
                        borderRadius: "4px",
                        color: "#FDE68A",
                        padding: "2px 6px",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        marginTop: "4px",
                        width: "180px",
                      }}
                    />
                  )}
                </div>
              </div>

              {node.type !== "start" && node.type !== "end" && (
                <button
                  onClick={() => removeNode(node.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                  title="Hapus blok"
                >
                  <Trash size={14} />
                </button>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      {/* Senior Hint Footer */}
      <div
        style={{
          padding: "8px 16px",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}
      >
        <Sparkle size={14} color="var(--primary)" />
        <span>Senior Tip: Susun blok logika alur programmu di sini, lalu salin kodenya ke editor untuk diuji!</span>
      </div>
    </div>
  );
}
