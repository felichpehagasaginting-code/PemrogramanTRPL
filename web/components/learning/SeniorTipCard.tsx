"use client";

import React, { useState } from "react";
import { Sparkle, Code, BookOpen, GlobeHemisphereWest, CaretDown, CaretUp } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export interface SeniorTipData {
  cheatSheet?: string;
  analogy?: string;
  glossary?: { term: string; meaning: string }[];
  industryContext?: string;
}

interface SeniorTipCardProps {
  data: SeniorTipData;
}

export function SeniorTipCard({ data }: SeniorTipCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data.cheatSheet && !data.analogy && !data.glossary && !data.industryContext) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "16px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "10px 16px",
          background: "var(--bg-secondary)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          color: "var(--text-primary)",
          fontSize: "0.85rem",
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkle size={16} color="var(--color-primary-500)" weight="fill" />
          <span>💡 Tips Senior & Contekan Cepat</span>
        </div>
        {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "0.85rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            {/* Analogi Kehidupan Nyata */}
            {data.analogy && (
              <div
                style={{
                  background: "var(--bg-page-alt)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--color-primary-500)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <BookOpen size={16} /> Analogi Santai Senior:
                </div>
                <p style={{ margin: 0, color: "var(--text-primary)", lineHeight: 1.5 }}>
                  {data.analogy}
                </p>
              </div>
            )}

            {/* Cheat Sheet Code Snippet */}
            {data.cheatSheet && (
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}>
                  <Code size={14} /> CONTEKAN KODE KILAT:
                </div>
                <div
                  style={{
                    background: "#0D1117",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 12px",
                    fontFamily: "var(--font-code)",
                    fontSize: "0.8rem",
                    color: "#38BDF8",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {data.cheatSheet}
                </div>
              </div>
            )}

            {/* Relevansi Industri */}
            {data.industryContext && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <GlobeHemisphereWest size={16} color="#10B981" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong style={{ color: "var(--text-primary)" }}>Kenapa ini ada di dunia kerja?</strong> {data.industryContext}
                </span>
              </div>
            )}

            {/* Glosarium Gaul */}
            {data.glossary && data.glossary.length > 0 && (
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px" }}>
                  📖 KAMUS KATA GAUL PEMROGRAMAN:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {data.glossary.map((g, i) => (
                    <div key={i} style={{ fontSize: "0.78rem" }}>
                      <strong style={{ color: "#F59E0B" }}>{g.term}</strong>: <span style={{ color: "var(--text-primary)" }}>{g.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
