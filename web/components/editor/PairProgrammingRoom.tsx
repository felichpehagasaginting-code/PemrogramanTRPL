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
  DoorOpen,
  ArrowsClockwise,
  X,
  Plus,
} from "@phosphor-icons/react";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";
import { db, isMockFirebase } from "@/lib/firebase";
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
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

interface PeerInfo {
  id: string;
  name: string;
  lastSeen?: any;
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
  const [roomCode, setRoomCode] = useState("TRPL-LAB-404");
  const [isChangeRoomOpen, setIsChangeRoomOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [activePeers, setActivePeers] = useState<PeerInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<PeerMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isRoomReady, setIsRoomReady] = useState(isMockFirebase);

  const isLocalEditRef = useRef(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const myPeerIdRef = useRef<string>("");

  // Initialize unique client peer ID
  useEffect(() => {
    if (!myPeerIdRef.current) {
      myPeerIdRef.current = user?.uid || `peer-${Math.random().toString(36).substring(2, 9)}`;
    }
  }, [user?.uid]);

  // Read initial room code from URL query param if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get("room");
      if (urlRoom && urlRoom.trim()) {
        setRoomCode(urlRoom.trim().toUpperCase());
      }
    }
  }, []);

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

  // Real-time Firestore sync for code, messages, and live peer presence
  useEffect(() => {
    if (isMockFirebase) {
      setIsRoomReady(true);
      setActivePeers([{ id: "mock-1", name: user?.name || "Kamu" }]);
      return;
    }

    const currentPeerId = myPeerIdRef.current || `peer-${Date.now()}`;
    const peerRef = doc(db, "pair_rooms", roomCode, "peers", currentPeerId);

    // Heartbeat function to announce peer presence
    const sendHeartbeat = () => {
      setDoc(
        peerRef,
        {
          name: user?.name || "Mahasiswa",
          uid: currentPeerId,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      ).catch(() => {});
    };

    sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 15000);

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
    const qMessages = query(messagesCol, orderBy("createdAt", "asc"));
    const unsubMessages = onSnapshot(
      qMessages,
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

    // 3. Listen to live active peers in room
    const peersCol = collection(db, "pair_rooms", roomCode, "peers");
    const unsubPeers = onSnapshot(
      peersCol,
      (snapshot) => {
        const peers: PeerInfo[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          peers.push({
            id: docSnap.id,
            name: d.name || "Mahasiswa",
            lastSeen: d.lastSeen,
          });
        });
        setActivePeers(peers.length > 0 ? peers : [{ id: currentPeerId, name: user?.name || "Kamu" }]);
      },
      (err) => {
        console.warn("Firestore peers snapshot error:", err);
      }
    );

    return () => {
      clearInterval(heartbeatTimer);
      unsubRoom();
      unsubMessages();
      unsubPeers();
      // Clean up peer presence on leave
      deleteDoc(peerRef).catch(() => {});
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [roomCode, user?.uid, user?.name]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = roomInput.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!cleaned) return;
    setRoomCode(cleaned);
    setIsChangeRoomOpen(false);
    setRoomInput("");

    // Update URL without full page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("room", cleaned);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleCodeChange = (val: string | undefined) => {
    const newCode = val || "";
    setCode(newCode);

    if (!isMockFirebase) {
      isLocalEditRef.current = true;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Debounce Firestore write by 350ms to eliminate rate limit exhaustion
      syncTimeoutRef.current = setTimeout(() => {
        const roomRef = doc(db, "pair_rooms", roomCode);
        setDoc(
          roomRef,
          { code: newCode, updatedAt: serverTimestamp() },
          { merge: true }
        )
          .catch((err) => console.warn("Sync code error:", err))
          .finally(() => {
            setTimeout(() => {
              isLocalEditRef.current = false;
            }, 200);
          });
      }, 350);
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
          uid: user?.uid || myPeerIdRef.current || "anon",
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
        height: "640px",
        position: "relative",
      }}
    >
      {/* Change Room Modal / Overlay */}
      {isChangeRoomOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <DoorOpen size={20} color="var(--color-primary-500)" weight="bold" />
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Ganti atau Buat Ruangan
                </h4>
              </div>
              <button
                onClick={() => setIsChangeRoomOpen(false)}
                className="btn btn-ghost btn-xs"
                style={{ padding: "4px" }}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: 1.5 }}>
              Masukkan kode ruangan baru untuk terhubung dengan rekan kelompok Anda. Contoh: <code>TIM-ALGO-A</code>
            </p>

            <form onSubmit={handleSwitchRoom}>
              <input
                type="text"
                placeholder="Misal: TRPL-PROJEK-01"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-page)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "14px",
                  outline: "none",
                  letterSpacing: "0.5px",
                }}
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsChangeRoomOpen(false)}
                  className="btn btn-sm btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!roomInput.trim()}
                  className="btn btn-sm btn-primary"
                  style={{ gap: "6px" }}
                >
                  <ArrowsClockwise size={15} weight="bold" />
                  <span>Gabung Ruangan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Header */}
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
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
                title={activePeers.map((p) => p.name).join(", ")}
              >
                <Circle size={7} weight="fill" color="#10B981" /> {activePeers.length} Terhubung
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              <span>ID:</span>
              <strong style={{ color: "var(--color-primary-500)" }}>{roomCode}</strong>
              <button
                onClick={() => setIsChangeRoomOpen(true)}
                className="btn btn-ghost btn-xs"
                style={{
                  padding: "1px 6px",
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  height: "auto",
                }}
                title="Ganti Ruangan"
              >
                [Ganti]
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Action Buttons */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            onClick={() => setIsChangeRoomOpen(true)}
            className="btn btn-xs btn-secondary"
            title="Masuk atau Buat Ruangan Lain"
            style={{ gap: "4px", fontSize: "0.75rem", padding: "4px 10px" }}
          >
            <DoorOpen size={13} weight="bold" />
            <span>Ruangan</span>
          </button>
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

          {/* Terminal / Output View */}
          <div
            style={{
              height: "140px",
              borderTop: "1px solid var(--border-color)",
              background: isDark ? "#0d1117" : "#f6f8fa",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "4px 10px",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Terminal Output (Python 3)</span>
              {output.length > 0 && (
                <button
                  onClick={() => setOutput([])}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "0.68rem",
                  }}
                >
                  Bersihkan
                </button>
              )}
            </div>
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.75rem",
                color: isDark ? "#58a6ff" : "#0969da",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {output.length === 0 ? (
                <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  Klik &apos;Jalankan&apos; untuk mengeksekusi kode Python...
                </span>
              ) : (
                output.map((line, idx) => <div key={idx}>{line}</div>)
              )}
            </div>
          </div>
        </div>

        {/* Live Peer Chat Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-card)",
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid var(--border-color)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ChatCircleDots size={16} color="var(--color-primary-500)" />
              <span>Diskusi Langsung</span>
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {activePeers.length} rekan di ruang ini
            </span>
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
