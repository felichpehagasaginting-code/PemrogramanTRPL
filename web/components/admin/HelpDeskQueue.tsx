"use client";

import React, { useState, useEffect } from "react";
import {
  Lifebuoy,
  Clock,
  CheckCircle,
  ChatCircleDots,
  User,
  Code,
  ArrowSquareOut,
  Sparkle,
  PencilSimple,
  Check,
} from "@phosphor-icons/react";

export interface HelpTicket {
  id: string;
  authorName: string;
  moduleId: string;
  error?: string | null;
  code: string;
  createdAt: string;
  status?: "waiting" | "in_progress" | "resolved";
  mentorNote?: string;
}

export function HelpDeskQueue() {
  const [tickets, setTickets] = useState<HelpTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<HelpTicket | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "in_progress" | "resolved">("all");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/help/list");
      if (res.ok) {
        const data = await res.json();
        if (data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets);
          return;
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
    
    // default demo tickets
    setTickets([
      {
        id: "help-demo-1",
        authorName: "Budi Santoso",
        moduleId: "M4 (Percabangan)",
        error: "SyntaxError: expected ':' at line 3",
        code: "usia = int(input())\nif usia >= 17\n    print('Boleh nonton')",
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        status: "waiting",
      },
      {
        id: "help-demo-2",
        authorName: "Siti Rahma",
        moduleId: "M5 (Perulangan)",
        error: "IndexError: list index out of range",
        code: "angka = [10, 20, 30]\nfor i in range(5):\n    print(angka[i])",
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        status: "in_progress",
        mentorNote: "Perhatikan panjang array `len(angka)` ya Siti, jangan hardcode range(5).",
      },
    ]);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, status: "waiting" | "in_progress" | "resolved", note?: string) => {
    try {
      await fetch("/api/help/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status, mentorNote: note }),
      });
    } catch {
      // offline optimistic
    }
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status, mentorNote: note !== undefined ? note : t.mentorNote } : t
      )
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) =>
        prev ? { ...prev, status, mentorNote: note !== undefined ? note : prev.mentorNote } : null
      );
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === "all") return true;
    return (t.status || "waiting") === statusFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Header Info & Filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-4) var(--space-6)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lifebuoy size={24} weight="fill" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Live Help Desk & Antrean Bantuan Maba
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              Pantau dan bimbing mahasiswa yang mengalami error koding secara real-time.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(["all", "waiting", "in_progress", "resolved"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-color)",
                background: statusFilter === st ? "var(--color-primary-500)" : "var(--bg-secondary)",
                color: statusFilter === st ? "#ffffff" : "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all var(--transition-fast)",
              }}
            >
              {st === "all" ? "Semua Antrean" : st === "waiting" ? "⏳ Menunggu" : st === "in_progress" ? "💬 Dibimbing" : "✅ Selesai"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Ticket List + Selected Ticket Detail */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-6)" }}>
        {/* Left Column: Tickets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredTickets.length === 0 ? (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px dashed var(--border-color)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-8)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <CheckCircle size={32} color="#10B981" weight="fill" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontWeight: 700, margin: 0 }}>Tidak ada tiket bantuan yang tertunda!</p>
              <span style={{ fontSize: "0.8rem" }}>Semua maba sedang asyik koding dengan lancar.</span>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              const statusColor =
                ticket.status === "resolved"
                  ? "#10B981"
                  : ticket.status === "in_progress"
                  ? "#F59E0B"
                  : "#EF4444";

              return (
                <div
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setFeedbackInput(ticket.mentorNote || "");
                  }}
                  style={{
                    background: isSelected ? "var(--bg-secondary)" : "var(--bg-card)",
                    border: `1.5px solid ${isSelected ? "var(--color-primary-500)" : "var(--border-color)"}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-4)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    boxShadow: isSelected ? "var(--shadow-glow-soft)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                        {ticket.authorName}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          background: "var(--bg-page)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-color)",
                        }}
                      >
                        {ticket.moduleId}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: `${statusColor}20`,
                        color: statusColor,
                        border: `1px solid ${statusColor}40`,
                      }}
                    >
                      {ticket.status === "resolved" ? "Selesai" : ticket.status === "in_progress" ? "Dibimbing" : "Menunggu"}
                    </span>
                  </div>

                  {ticket.error && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#EF4444",
                        background: "rgba(239, 68, 68, 0.08)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontFamily: "monospace",
                        marginBottom: "8px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ticket.error}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} />
                      {new Date(ticket.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>Klik untuk review kodingan ➔</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Code & Mentor Action Workbench */}
        {selectedTicket ? (
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Review Kodingan: {selectedTicket.authorName}
                </h4>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Modul: {selectedTicket.moduleId} • ID: {selectedTicket.id}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.id, "in_progress", feedbackInput)}
                  className="btn btn-sm"
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(245, 158, 11, 0.15)",
                    color: "#F59E0B",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                  }}
                >
                  💬 Bimbing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.id, "resolved", feedbackInput)}
                  className="btn btn-sm"
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10B981",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <Check size={14} weight="bold" /> Selesai
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {selectedTicket.error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: "0.8rem",
                  color: "#EF4444",
                  fontFamily: "monospace",
                }}
              >
                🚨 Error Maba: {selectedTicket.error}
              </div>
            )}

            {/* Code Snippet Box */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                💻 Kode yang Ditulis Mahasiswa:
              </span>
              <pre
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px",
                  fontSize: "0.825rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--text-primary)",
                  overflowX: "auto",
                  margin: 0,
                  maxHeight: "220px",
                }}
              >
                <code>{selectedTicket.code}</code>
              </pre>
            </div>

            {/* Mentor Feedback / Annotation Box */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkle size={14} color="var(--color-primary-500)" weight="fill" />
                Catatan & Solusi Senior Mentor:
              </span>
              <textarea
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Tuliskan petunjuk atau catatan koreksi untuk mahasiswa di sini..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-page)",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => handleUpdateStatus(selectedTicket.id, selectedTicket.status || "in_progress", feedbackInput)}
                className="btn btn-sm btn-primary"
                style={{ alignSelf: "flex-end", marginTop: "4px" }}
              >
                Simpan Catatan Mentor
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-8)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            <Code size={40} style={{ opacity: 0.4, marginBottom: "12px" }} />
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>Pilih salah satu tiket di sebelah kiri</p>
            <span style={{ fontSize: "0.8rem" }}>
              Kamu bisa langsung meninjau baris kode, pesan error, dan mengirimkan catatan bimbingan.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
