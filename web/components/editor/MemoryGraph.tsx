"use client";

import React, { useState } from "react";
import { Cpu, Database, ArrowsLeftRight, Sparkle, Info } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export interface MemoryVariable {
  name: string;
  type: "int" | "float" | "str" | "bool" | "list" | "dict";
  value: any;
  address?: string;
}

interface MemoryGraphProps {
  variables: Record<string, any>;
  currentLine?: number;
}

export function MemoryGraph({ variables, currentLine }: MemoryGraphProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "table">("visual");

  const parsedVars: MemoryVariable[] = Object.entries(variables).map(([name, val], idx) => {
    let type: MemoryVariable["type"] = "str";
    if (typeof val === "number") {
      type = Number.isInteger(val) ? "int" : "float";
    } else if (typeof val === "boolean") {
      type = "bool";
    } else if (Array.isArray(val)) {
      type = "list";
    } else if (typeof val === "object" && val !== null) {
      type = "dict";
    }

    return {
      name,
      type,
      value: val,
      address: `0x7FFE${(idx + 1) * 16}`,
    };
  });

  const primitives = parsedVars.filter((v) => v.type !== "list" && v.type !== "dict");
  const references = parsedVars.filter((v) => v.type === "list" || v.type === "dict");

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--bg-card-hover)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
          <Cpu size={18} color="var(--primary)" weight="fill" />
          <span>Visual Memory Inspector (RAM & Pointers)</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`btn btn-xs ${activeTab === "visual" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.75rem", padding: "3px 8px" }}
          >
            Diagram RAM
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`btn btn-xs ${activeTab === "table" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.75rem", padding: "3px 8px" }}
          >
            Tabel Nilai
          </button>
        </div>
      </div>

      <div style={{ padding: "14px" }}>
        {parsedVars.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            <Info size={28} style={{ margin: "0 auto 8px", opacity: 0.6 }} />
            <p>Belum ada variabel aktif di memori.</p>
            <p style={{ fontSize: "0.75rem", marginTop: "4px", color: "var(--text-muted)" }}>
              Jalankan kode atau gunakan tombol Step Debugger untuk melihat isi memori RAM secara real-time.
            </p>
          </div>
        ) : activeTab === "visual" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* STACK FRAME */}
            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#38BDF8", marginBottom: "8px", textTransform: "uppercase" }}>
                <Database size={14} />
                <span>Stack Memory (Variables)</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {parsedVars.map((v) => (
                  <motion.div
                    key={v.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      padding: "6px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.8rem",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: "var(--primary)" }}>{v.name}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "6px" }}>({v.type})</span>
                    </div>
                    {v.type === "list" || v.type === "dict" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontSize: "0.75rem", fontFamily: "monospace" }}>
                        <span>pointer</span>
                        <ArrowsLeftRight size={12} />
                        <span style={{ color: "#38BDF8" }}>{v.address}</span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: "monospace", color: "var(--text-primary)", fontWeight: 600 }}>
                        {JSON.stringify(v.value)}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* HEAP MEMORY */}
            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 700, color: "#10B981", marginBottom: "8px", textTransform: "uppercase" }}>
                <Database size={14} />
                <span>Heap Memory (Objects & Lists)</span>
              </div>
              {references.length === 0 ? (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", padding: "12px 0", textAlign: "center" }}>
                  Tidak ada objek referensi dinamis (List/Dict) di Heap saat ini.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {references.map((r) => (
                    <motion.div
                      key={r.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid #10B981",
                        borderRadius: "var(--radius-sm)",
                        padding: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                        <span>Lokasi: {r.address}</span>
                        <span style={{ color: "#10B981", fontWeight: 600 }}>{r.type.toUpperCase()} ({Array.isArray(r.value) ? r.value.length : Object.keys(r.value).length} item)</span>
                      </div>
                      {Array.isArray(r.value) ? (
                        <div style={{ display: "flex", gap: "4px", overflowX: "auto", padding: "4px 0" }}>
                          {r.value.map((item, i) => (
                            <div
                              key={i}
                              style={{
                                background: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                textAlign: "center",
                                minWidth: "32px",
                              }}
                            >
                              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>[{i}]</div>
                              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>
                                {JSON.stringify(item)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--text-primary)" }}>
                          {JSON.stringify(r.value, null, 2)}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "6px" }}>Nama</th>
                <th style={{ padding: "6px" }}>Tipe Data</th>
                <th style={{ padding: "6px" }}>Nilai Saat Ini</th>
              </tr>
            </thead>
            <tbody>
              {parsedVars.map((v) => (
                <tr key={v.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "6px", fontWeight: 700, color: "var(--primary)" }}>{v.name}</td>
                  <td style={{ padding: "6px", color: "var(--text-secondary)" }}>{v.type}</td>
                  <td style={{ padding: "6px", fontFamily: "monospace", color: "var(--text-primary)" }}>
                    {JSON.stringify(v.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
          <Sparkle size={13} color="var(--primary)" />
          <span>Senior Tip: Tipe data primitif (angka, boolean) tersimpan di Stack, sedangkan List & Dictionary disimpan di Heap!</span>
        </div>
      </div>
    </div>
  );
}
