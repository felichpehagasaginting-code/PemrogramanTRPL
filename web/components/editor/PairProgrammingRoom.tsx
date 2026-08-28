"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Users,
  Play,
  ChatCircleDots,
  PaperPlaneTilt,
  Copy,
  Check,
  Sparkle,
  Terminal,
  Circle,
} from "@phosphor-icons/react";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";

interface PeerMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;
}

export function PairProgrammingRoom() {
  const [roomCode, setRoomCode] = useState("TRPL-LAB-404");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(
    `# Ruang Kolaborasi Koding TRPL 2026\n# Kamu dan rekanmu sedang mengerjakan program bersama secara real-time!\n\ndef hitung_rata_rata(nilai_list):\n    total = sum(nilai_list)\n    return total / len(nilai_list)\n\nskor_maba = [85, 90, 78, 92, 88]\nprint("Rata-rata kelas:", hitung_rata_rata(skor_maba))\n`
  );
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Simulated peer chat
  const [messages, setMessages] = useState<PeerMessage[]>([
    { id: "1", sender: "Budi (Rekan)", text: "Halo! Aku lagi cek fungsi hitung_rata_rata ya", time: "14:30" },
    { id: "2", sender: "Kamu", text: "Siap, aku tambahin data list-nya ya!", time: "14:31", isMe: true },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: PeerMessage = {
      id: `msg-${Date.now()}`,
      sender: "Kamu",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await runPythonCodeClient(code);
      setOutput(res.output);
    } catch (err: any) {
      setOutput([`Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        height: "620px",
      }}
    >
      {/* Room Header */}
      <div
        style={{
          background: "#0D1117",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "#2563EB", padding: "6px", borderRadius: "6px", display: "flex" }}>
            <Users size={18} color="white" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "white" }}>
                Live Pair Programming Room
              </h3>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "#10B981" }}>
                <Circle size={8} weight="fill" color="#10B981" /> 2 Orang Terhubung
              </span>
            </div>
            <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
              Room ID: <strong style={{ color: "#38BDF8" }}>{roomCode}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleCopyCode}
            className="btn btn-xs btn-secondary"
            style={{ gap: "4px", fontSize: "0.75rem" }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "ID Tersalin!" : "Salin ID Room"}
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="btn btn-xs btn-primary"
            style={{ gap: "4px", fontSize: "0.75rem" }}
          >
            <Play size={12} weight="fill" />
            {isRunning ? "Menjalankan..." : "Jalankan Bersama"}
          </button>
        </div>
      </div>

      {/* Main Split Body: Editor & Peer Chat */}
      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", flex: 1, overflow: "hidden" }}>
        {/* Editor Area */}
        <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 13,
                lineNumbers: "on",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Terminal Output */}
          <div
            style={{
              height: "140px",
              background: "#012456",
              padding: "10px 14px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: "#EEEDF0",
              overflowY: "auto",
            }}
          >
            <div style={{ fontSize: "0.7rem", color: "#38BDF8", marginBottom: "4px" }}>
              Terminal Console Bersama:
            </div>
            {output.length === 0 ? (
              <div style={{ color: "#94A3B8", fontStyle: "italic" }}>
                Klik "Jalankan Bersama" untuk mengeksekusi kode ini di terminal bersama...
              </div>
            ) : (
              output.map((line, i) => <div key={i}>{line}</div>)
            )}
          </div>
        </div>

        {/* Peer Chat Area */}
        <div style={{ display: "flex", flexDirection: "column", background: "var(--bg-secondary)" }}>
          <div
            style={{
              padding: "8px 12px",
              background: "rgba(0,0,0,0.2)",
              borderBottom: "1px solid var(--border-color)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ChatCircleDots size={16} color="var(--primary)" />
            <span>Diskusi Koding Langsung</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.isMe ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: m.isMe ? "var(--primary)" : "var(--bg-card)",
                  color: m.isMe ? "white" : "var(--text-primary)",
                  border: m.isMe ? "none" : "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "6px 10px",
                  fontSize: "0.78rem",
                }}
              >
                {!m.isMe && (
                  <div style={{ fontSize: "0.68rem", color: "#38BDF8", fontWeight: 700, marginBottom: "2px" }}>
                    {m.sender}
                  </div>
                )}
                <div>{m.text}</div>
                <div style={{ fontSize: "0.62rem", opacity: 0.7, textAlign: "right", marginTop: "2px" }}>
                  {m.time}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendChat}
            style={{
              padding: "8px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "6px",
            }}
          >
            <input
              type="text"
              placeholder="Tulis pesan ke rekan..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                background: "var(--bg-page)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                padding: "6px 10px",
                color: "var(--text-primary)",
                fontSize: "0.78rem",
                outline: "none",
              }}
            />
            <button type="submit" className="btn btn-xs btn-primary" style={{ padding: "0 10px" }}>
              <PaperPlaneTilt size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
