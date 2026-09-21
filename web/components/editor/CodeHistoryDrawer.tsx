"use client";

import React, { useState } from "react";
import {
  ClockCounterClockwise,
  X,
  ArrowUUpLeft,
  Trash,
  FloppyDisk,
  Code,
  Check,
} from "@phosphor-icons/react";
import { CodeRevision } from "@/lib/recorder/useCodeHistory";

interface CodeHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CodeRevision[];
  currentCode: string;
  onRestore: (code: string) => void;
  onSaveSnapshot: (code: string, label?: string) => void;
  onDeleteRevision: (id: string) => void;
  onClearHistory: () => void;
}

export function CodeHistoryDrawer({
  isOpen,
  onClose,
  history,
  currentCode,
  onRestore,
  onSaveSnapshot,
  onDeleteRevision,
  onClearHistory,
}: CodeHistoryDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customLabel, setCustomLabel] = useState("");
  const [restoredId, setRestoredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSnapshot(currentCode, customLabel.trim() || undefined);
    setCustomLabel("");
  };

  const handleRestore = (rev: CodeRevision) => {
    onRestore(rev.code);
    setRestoredId(rev.id);
    setTimeout(() => {
      setRestoredId(null);
      onClose();
    }, 800);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 999,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-xl)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "var(--color-primary-500)",
                padding: "6px",
                borderRadius: "var(--radius-md)",
                color: "#ffffff",
                display: "flex",
              }}
            >
              <ClockCounterClockwise size={18} weight="bold" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Riwayat Versi Kode
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {history.length} snapshot tersimpan
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs"
            style={{ padding: "6px", borderRadius: "50%" }}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Snapshot Creator Form */}
        <form
          onSubmit={handleManualSave}
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--bg-page)",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            placeholder="Label milestone (opsional)..."
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            style={{
              flex: 1,
              padding: "6px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            className="btn btn-xs btn-primary"
            style={{ gap: "4px", padding: "6px 12px" }}
          >
            <FloppyDisk size={14} weight="bold" />
            <span>Simpan</span>
          </button>
        </form>

        {/* History Revisions List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {history.length === 0 ? (
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "24px",
                lineHeight: 1.6,
                fontSize: "0.85rem",
              }}
            >
              <ClockCounterClockwise size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>Belum ada riwayat snapshot tersimpan.</p>
              <p style={{ fontSize: "0.75rem" }}>
                Kode akan otomatis diarsipkan saat Anda menjalankan tes atau menyimpan snapshot manual.
              </p>
            </div>
          ) : (
            history.map((rev) => {
              const date = new Date(rev.timestamp);
              const timeString = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              const isSelected = selectedId === rev.id;
              const isRestored = restoredId === rev.id;

              return (
                <div
                  key={rev.id}
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${isSelected ? "var(--color-primary-500)" : "var(--border-color)"}`,
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    boxShadow: "var(--shadow-sm)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>{rev.label || "Snapshot Kode"}</span>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} &bull; {timeString} &bull; {rev.charCount} karakter
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteRevision(rev.id)}
                      className="btn btn-ghost btn-xs"
                      title="Hapus snapshot ini"
                      style={{ padding: "4px", color: "var(--text-muted)" }}
                    >
                      <Trash size={14} />
                    </button>
                  </div>

                  {/* Code snippet preview */}
                  <div
                    onClick={() => setSelectedId(isSelected ? null : rev.id)}
                    style={{
                      background: "var(--bg-page)",
                      borderRadius: "var(--radius-sm)",
                      padding: "8px 10px",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      maxHeight: isSelected ? "200px" : "60px",
                      overflowY: "auto",
                      whiteSpace: "pre-wrap",
                      border: "1px solid var(--border-color)",
                    }}
                    title="Klik untuk melihat kode lengkap"
                  >
                    {rev.code}
                  </div>

                  {/* Restore button */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                    <button
                      onClick={() => handleRestore(rev)}
                      disabled={isRestored}
                      className="btn btn-xs btn-secondary"
                      style={{
                        gap: "6px",
                        fontSize: "0.75rem",
                        color: isRestored ? "#10B981" : "var(--color-primary-500)",
                        borderColor: isRestored ? "#10B981" : undefined,
                      }}
                    >
                      {isRestored ? (
                        <>
                          <Check size={14} weight="bold" />
                          <span>Dipulihkan!</span>
                        </>
                      ) : (
                        <>
                          <ArrowUUpLeft size={14} weight="bold" />
                          <span>Pulihkan Versi Ini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--bg-page)",
            }}
          >
            <button
              onClick={onClearHistory}
              className="btn btn-ghost btn-xs"
              style={{ color: "#EF4444", fontSize: "0.75rem", gap: "4px" }}
            >
              <Trash size={13} />
              <span>Hapus Semua</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-sm btn-secondary"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
