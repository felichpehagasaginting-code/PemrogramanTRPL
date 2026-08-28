"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  PaperPlaneTilt,
  CheckCircle,
  Warning,
  Info,
  Sparkle,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import { BroadcastData } from "@/app/api/admin/broadcast/route";

export function BroadcastManager() {
  const [broadcast, setBroadcast] = useState<BroadcastData | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "urgent">("info");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const fetchBroadcast = async () => {
    try {
      const res = await fetch("/api/admin/broadcast");
      if (res.ok) {
        const data = await res.json();
        if (data.broadcast) {
          setBroadcast(data.broadcast);
          setTitle(data.broadcast.title);
          setMessage(data.broadcast.message);
          setType(data.broadcast.type);
          setIsActive(data.broadcast.isActive);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchBroadcast();
  }, []);

  const handleSave = async (activeState = isActive) => {
    if (!title.trim() || !message.trim()) {
      setStatusFeedback("⚠️ Judul dan pesan tidak boleh kosong.");
      return;
    }

    setSaving(true);
    setStatusFeedback(null);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          isActive: activeState,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBroadcast(data.broadcast);
        setIsActive(activeState);
        setStatusFeedback("✅ Pengumuman berhasil disiarkan ke seluruh layar mahasiswa!");
        setTimeout(() => setStatusFeedback(null), 4000);
      }
    } catch {
      setStatusFeedback("❌ Gagal menyimpan pengumuman.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    handleSave(nextState);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Header Info */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(56, 189, 248, 0.15)",
              color: "#38BDF8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Megaphone size={24} weight="fill" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Live Broadcast Announcement Manager
            </h3>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0 }}>
              Siarkan pengumuman darurat, deadline kuis, atau instruksi praktikum ke seluruh layar mahasiswa.
            </p>
          </div>
        </div>

        {/* Live Status Badge & Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleToggleActive}
            className="btn btn-sm"
            style={{
              background: isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: isActive ? "#10B981" : "#EF4444",
              border: `1px solid ${isActive ? "#10B98150" : "#EF444450"}`,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 800,
              fontSize: "0.8rem",
            }}
          >
            {isActive ? <Eye size={16} weight="fill" /> : <EyeSlash size={16} />}
            {isActive ? "Status: SEDANG TAYANG" : "Status: DINONAKTIFKAN"}
          </button>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "var(--space-6)" }}>
        {/* Left: Compose Form */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            ✏️ Tulis Pesan Siaran
          </h4>

          {/* Title */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
              Judul Pengumuman:
            </label>
            <input
              type="text"
              placeholder="Contoh: 📢 Info: Perpanjangan Deadline Proyek Kasir M8"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-page)",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
              }}
            />
          </div>

          {/* Type Selector */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Tingkat Urgensi / Tipe Banner:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(
                [
                  { id: "info", label: "ℹ️ Info Akademik (Biru)", color: "#38BDF8" },
                  { id: "warning", label: "⚠️ Peringatan / Deadline (Kuning)", color: "#F59E0B" },
                  { id: "urgent", label: "🚨 Kuis Darurat / Urgent (Merah)", color: "#EF4444" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius-md)",
                    border: `1.5px solid ${type === t.id ? t.color : "var(--border-color)"}`,
                    background: type === t.id ? `${t.color}15` : "var(--bg-secondary)",
                    color: type === t.id ? t.color : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "4px" }}>
              Isi Pesan Detail:
            </label>
            <textarea
              rows={4}
              placeholder="Tuliskan petunjuk lengkap pengumuman di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-page)",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                resize: "vertical",
              }}
            />
          </div>

          {/* Feedback */}
          {statusFeedback && (
            <div style={{ fontSize: "0.825rem", fontWeight: 700, color: statusFeedback.startsWith("✅") ? "#10B981" : "#EF4444" }}>
              {statusFeedback}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="btn btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <PaperPlaneTilt size={18} weight="fill" />
            {saving ? "Menyiarkan..." : "Siarkan Pengumuman Sekarang"}
          </button>
        </div>

        {/* Right: Live Preview on Student Screen */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkle size={16} color="var(--color-primary-500)" weight="fill" />
            Pratinjau Tampilan di Layar Mahasiswa
          </h4>

          <div
            style={{
              background: "var(--bg-page)",
              border: "1.5px dashed var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              Banner akan melayang di atas navbar platform:
            </span>

            {/* Preview Banner */}
            <div
              style={{
                background:
                  type === "urgent"
                    ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.25) 100%)"
                    : type === "warning"
                    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.25) 100%)"
                    : "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.25) 100%)",
                border: `1.5px solid ${type === "urgent" ? "#EF4444" : type === "warning" ? "#F59E0B" : "#38BDF8"}`,
                borderRadius: "var(--radius-md)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div
                style={{
                  color: type === "urgent" ? "#EF4444" : type === "warning" ? "#F59E0B" : "#38BDF8",
                  marginTop: "2px",
                }}
              >
                {type === "urgent" ? (
                  <Warning size={20} weight="fill" />
                ) : type === "warning" ? (
                  <Warning size={20} weight="fill" />
                ) : (
                  <Info size={20} weight="fill" />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "2px" }}>
                  {title || "Judul Pengumuman"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {message || "Isi pesan pengumuman dosen..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
