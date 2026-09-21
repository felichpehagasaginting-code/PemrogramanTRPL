"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Users,
  Play,
  ChatCircleDots,
  PaperPlaneTilt,
  Copy,
  Check,
  Circle,
  Sparkle,
} from "@phosphor-icons/react";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";
import { db, isMockFirebase } from "@/lib/firebase";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useUserStore } from "@/lib/store/useUserStore";

import { SkeletonEditor } from "@/components/ui/Skeleton";

interface PeerMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe?: boolean;
}

const DEFAULT_CODE = `# Ruang Kolaborasi Live TRPL 2026
# Tulis kode Python bersama di sini secara real-time!

def sapa_kelompok(anggota):
    for nama in anggota:
        print(f"Halo {nama}, selamat belajar di TRPL!")

tim = ["Kamu", "Rekan"]
sapa_kelompok(tim)
`;

export function PairProgrammingRoom() {
  const user = useUserStore((s) => s.user);
  const [roomCode] = useState("TRPL-LAB-404");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<PeerMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isRoomReady, setIsRoomReady] = useState(isMockFirebase);
  const isLocalEditRef = useRef(false);

  // Detect and observe dark/light theme mode
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Real-time Firestore sync for code and messages
  useEffect(() => {
    if (isMockFirebase) {
      setIsRoomReady(true);
      return;
    }

    // 1. Listen to shared code
    const roomRef = doc(db, "pair_rooms", roomCode);
    const unsubRoom = onSnapshot(
      roomRef,
      (snapshot) => {
        setIsRoomReady(true);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data?.code && !isLocalEditRef.current) {
            setCode(data.code);
          }
        } else {
          // Initialize room in Firestore if not present
          setDoc(roomRef, {
            code: DEFAULT_CODE,
            updatedAt: serverTimestamp(),
          }).catch(() => {});
        }
      },
      (err) => {
        console.warn("Firestore pair_rooms snapshot error:", err);
        setIsRoomReady(true);
      }
    );

    // 2. Listen to real-time chat messages
    const messagesCol = collection(db, "pair_rooms", roomCode, "messages");
    const q = query(messagesCol, orderBy("createdAt", "asc"));
    const unsubMessages = onSnapshot(
      q,
      (snapshot) => {
        const loaded: PeerMessage[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          const createdAtDate = d.createdAt?.toDate ? d.createdAt.toDate() : new Date();
          const timeStr = createdAtDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          loaded.push({
            id: docSnap.id,
            sender: d.sender || "Mahasiswa",
            text: d.text || "",
            time: timeStr,
            isMe: user?.uid ? d.uid === user.uid : d.sender === (user?.name || "Kamu"),
          });
        });
        setMessages(loaded);
      },
      (err) => {
        console.warn("Firestore messages snapshot error:", err);
      }
    );

    return () => {
      unsubRoom();
      unsubMessages();
    };
  }, [roomCode, user?.uid, user?.name]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeChange = (val: string | undefined) => {
    const newCode = val || "";
    setCode(newCode);

    if (!isMockFirebase) {
      isLocalEditRef.current = true;
      const roomRef = doc(db, "pair_rooms", roomCode);
      setDoc(
        roomRef,
        { code: newCode, updatedAt: serverTimestamp() },
        { merge: true }
      ).finally(() => {
        setTimeout(() => {
          isLocalEditRef.current = false;
        }, 300);
      });
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = chatInput.trim();
    if (!textToSend) return;

    setChatInput("");

    if (!isMockFirebase) {
      try {
        const messagesCol = collection(db, "pair_rooms", roomCode, "messages");
        await addDoc(messagesCol, {
          sender: user?.name || "Mahasiswa",
          uid: user?.uid || "anon",
          text: textToSend,
          createdAt: serverTimestamp(),
        });
        return;
      } catch (e) {
        console.warn("Gagal mengirim pesan chat:", e);
      }
    }

    // Local fallback if offline
    const fallbackMsg: PeerMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.name || "Kamu",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };
    setMessages((prev) => [...prev, fallbackMsg]);
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

  if (!isRoomReady) {
    return <SkeletonEditor />;
  }

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        height: "620px",
      }}
    >
      {/* Minimalist Room Header */}
      <div
        style={{
          background: "var(--bg-card)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-color)",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background: "var(--color-primary-500)",
              padding: "6px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              color: "#ffffff",
            }}
          >
            <Users size={16} weight="bold" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Ruang Kolaborasi
              </h3>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.72rem",
                  color: "#10B981",
                  fontWeight: 600,
                }}
              >
                <Circle size={7} weight="fill" color="#10B981" /> 2 Terhubung
              </span>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              ID: <strong style={{ color: "var(--color-primary-500)" }}>{roomCode}</strong>
            </span>
          </div>
        </div>

        {/* Minimalist Action Buttons */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            onClick={handleCopyCode}
            className="btn btn-xs btn-secondary"
            title="Salin ID Ruangan"
            style={{ gap: "4px", fontSize: "0.75rem", padding: "4px 10px" }}
          >
            {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
            <span>{copied ? "Tersalin!" : "Salin ID"}</span>
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="btn btn-xs btn-primary"
            title="Jalankan kode Python"
            style={{ gap: "4px", fontSize: "0.75rem", padding: "4px 12px" }}
          >
            {isRunning ? (
              <Sparkle size={13} className="animate-spin" />
            ) : (
              <Play size={13} weight="fill" />
            )}
            <span>{isRunning ? "Proses..." : "Jalankan"}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: Editor & Peer Chat */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1fr",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Editor Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid var(--border-color)",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            <Editor
              height="100%"
              language="python"
              theme={isDark ? "vs-dark" : "vs"}
              value={code}
              onChange={handleCodeChange}
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
              background: isDark ? "#0A101D" : "var(--bg-page-alt)",
              padding: "10px 14px",
              borderTop: "1px solid var(--border-color)",
              fontFamily: "var(--font-code)",
              fontSize: "0.78rem",
              color: "var(--text-primary)",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--color-primary-500)",
                marginBottom: "4px",
              }}
            >
              Konsol Terminal:
            </div>
            {output.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                Klik "Jalankan" untuk mengeksekusi kode Python ini bersama...
              </div>
            ) : (
              output.map((line, i) => <div key={i}>{line}</div>)
            )}
          </div>
        </div>

        {/* Peer Chat Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-page-alt)",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-card)",
              borderBottom: "1px solid var(--border-color)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ChatCircleDots size={16} color="var(--color-primary-500)" />
            <span>Diskusi Langsung</span>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  margin: "auto",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  padding: "16px",
                  lineHeight: 1.5,
                }}
              >
                Belum ada pesan.
                <br />
                Mulai obrolan bersama rekan kodingmu!
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isMe ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    background: m.isMe ? "var(--color-primary-500)" : "var(--bg-card)",
                    color: m.isMe ? "#ffffff" : "var(--text-primary)",
                    border: m.isMe ? "none" : "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "6px 10px",
                    fontSize: "0.78rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {!m.isMe && (
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--color-primary-500)",
                        fontWeight: 700,
                        marginBottom: "2px",
                      }}
                    >
                      {m.sender}
                    </div>
                  )}
                  <div>{m.text}</div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      opacity: m.isMe ? 0.8 : 0.6,
                      textAlign: "right",
                      marginTop: "2px",
                    }}
                  >
                    {m.time}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Minimalist Chat Input Form */}
          <form
            onSubmit={handleSendChat}
            style={{
              padding: "6px 8px",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "6px",
              background: "var(--bg-card)",
            }}
          >
            <input
              type="text"
              placeholder="Tulis pesan..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                flex: 1,
                background: "var(--bg-page)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 10px",
                color: "var(--text-primary)",
                fontSize: "0.78rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="btn btn-xs btn-primary"
              title="Kirim Pesan"
              aria-label="Kirim Pesan"
              style={{ padding: "0 10px", borderRadius: "var(--radius-sm)" }}
            >
              <PaperPlaneTilt size={14} weight="fill" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
