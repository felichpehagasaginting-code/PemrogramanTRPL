"use client";

import React, { useState } from "react";
import { Lifebuoy, Copy, Check, WhatsappLogo, X, Sparkle, ChatCircleDots } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface AskHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  moduleId: string;
  lastError?: string;
  userName?: string;
}

export function AskHelpModal({
  isOpen,
  onClose,
  code,
  moduleId,
  lastError,
  userName = "Mahasiswa TRPL",
}: AskHelpModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/help/create-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          moduleId,
          error: lastError,
          authorName: userName,
        }),
      });
      const data = await res.json();
      if (data.success && data.snapshotId) {
        const fullUrl = `${window.location.origin}/help/${data.snapshotId}`;
        setShareLink(fullUrl);
      }
    } catch {
      // fallback
      const fallbackUrl = `${window.location.origin}/sandbox?help=1`;
      setShareLink(fallbackUrl);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waMessage = encodeURIComponent(
    `Halo mentor / teman-teman! Saya ${userName} lagi stuck di Modul ${moduleId}.\nBoleh minta tolong bantu review kodingan saya di link ini?\n${shareLink || ""}`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              width: "100%",
              maxWidth: "540px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(59,130,246,0.1) 100%)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    padding: "8px",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                  }}
                >
                  <Lifebuoy size={20} weight="fill" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Minta Bantuan & Diskusi Kode
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Stuck atau bingung? Bagikan cuplikan kodemu ke mentor atau teman!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  background: "rgba(59, 130, 246, 0.08)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  marginBottom: "16px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Sparkle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Tips Senior:</strong> Wajar banget kok kalau stuck saat awal belajar koding. Diskusi bareng mentor atau teman kelompok itu bagian paling seru dari kuliah IT!
                </div>
              </div>

              {/* Snapshot Info */}
              <div style={{ marginBottom: "16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <div><strong>Modul:</strong> {moduleId}</div>
                {lastError && (
                  <div style={{ marginTop: "4px", color: "#EF4444" }}>
                    <strong>Pesan Terakhir:</strong> {lastError.substring(0, 80)}...
                  </div>
                )}
              </div>

              {!shareLink ? (
                <button
                  type="button"
                  onClick={handleGenerateLink}
                  disabled={isGenerating}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                >
                  <ChatCircleDots size={18} />
                  {isGenerating ? "Membuat Link Diskusi..." : "Buat Link Snapshot Kode"}
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        color: "#38BDF8",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {shareLink}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="btn btn-xs btn-primary"
                      style={{ flexShrink: 0, gap: "4px" }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Tersalin!" : "Salin"}
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <a
                      href={`https://wa.me/?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ justifyContent: "center", gap: "6px", color: "#10B981" }}
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      Kirim WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="btn btn-secondary"
                      style={{ justifyContent: "center", gap: "6px" }}
                    >
                      <Copy size={18} />
                      Salin Tautan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
