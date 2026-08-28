"use client";

import React, { useState } from "react";
import { ChatCircleDots, PaperPlaneTilt, Sparkle, X, CheckCircle, User } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export interface AnnotationComment {
  id: string;
  author: string;
  role: "mentor" | "student";
  text: string;
  time: string;
}

interface InlineAnnotationThreadProps {
  snippetTitle: string;
  initialComments?: AnnotationComment[];
}

const DEFAULT_COMMENTS: AnnotationComment[] = [
  {
    id: "1",
    author: "Kak Mentor TRPL",
    role: "mentor",
    text: "💡 Catatan Penting: Jangan lupa spasi setelah tanda titik dua `:` ya! Di Python, indentasi 4 spasi adalah penanda blok kode.",
    time: "Hari ini",
  },
];

export function InlineAnnotationThread({
  snippetTitle,
  initialComments = DEFAULT_COMMENTS,
}: InlineAnnotationThreadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<AnnotationComment[]>(initialComments);
  const [inputVal, setInputVal] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newComment: AnnotationComment = {
      id: `c-${Date.now()}`,
      author: "Kamu (Maba)",
      role: "student",
      text: inputVal,
      time: "Baru saja",
    };

    setComments([...comments, newComment]);
    setInputVal("");
  };

  return (
    <div style={{ margin: "8px 0" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-xs btn-secondary"
        style={{
          gap: "6px",
          fontSize: "0.75rem",
          color: "var(--primary)",
          border: "1px dashed var(--border-color)",
        }}
      >
        <ChatCircleDots size={14} />
        {isOpen ? "Tutup Catatan Diskusi" : `💬 Diskusi & Tips Bagian Ini (${comments.length})`}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: "hidden",
              marginTop: "8px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "14px",
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "10px" }}>
              Diskusi tentang: <span style={{ color: "#38BDF8" }}>{snippetTitle}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
              {comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: c.role === "mentor" ? "rgba(56, 189, 248, 0.1)" : "var(--bg-card)",
                    border: c.role === "mentor" ? "1px solid rgba(56, 189, 248, 0.3)" : "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 12px",
                    fontSize: "0.8rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "2px" }}>
                    <span style={{ fontWeight: 700, color: c.role === "mentor" ? "#38BDF8" : "var(--text-primary)" }}>
                      {c.author} {c.role === "mentor" && "⭐"}
                    </span>
                    <span>{c.time}</span>
                  </div>
                  <div style={{ color: "var(--text-primary)", lineHeight: 1.5 }}>{c.text}</div>
                </div>
              ))}
            </div>

            {/* Input comment */}
            <form onSubmit={handleAddComment} style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                placeholder="Tanyakan hal yang membingungkan di bagian ini..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  flex: 1,
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  fontSize: "0.78rem",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
              <button type="submit" className="btn btn-xs btn-primary" style={{ padding: "0 10px" }}>
                <PaperPlaneTilt size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
