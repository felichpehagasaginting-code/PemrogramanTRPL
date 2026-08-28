"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Pause,
  ArrowCounterClockwise,
  FastForward,
  Warning,
  CheckCircle,
  Clock,
  X,
} from "@phosphor-icons/react";
import { KeystrokeSession } from "@/lib/recorder/keystrokeRecorder";

interface CodePlaybackPlayerProps {
  session: KeystrokeSession;
  studentName?: string;
  onClose?: () => void;
}

export function CodePlaybackPlayer({
  session,
  studentName = "Mahasiswa",
  onClose,
}: CodePlaybackPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4 | 8>(2);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalEvents = session.events.length;
  const currentEvent = session.events[currentIndex] || session.events[0] || { code: "" };

  useEffect(() => {
    if (isPlaying) {
      if (currentIndex >= totalEvents - 1) {
        setIsPlaying(false);
        return;
      }

      const nextEvent = session.events[currentIndex + 1];
      const baseDelay = nextEvent ? Math.min(nextEvent.deltaMs, 1000) : 300;
      const actualDelay = Math.max(50, Math.round(baseDelay / playbackSpeed));

      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, actualDelay);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, playbackSpeed, session.events, totalEvents]);

  const handlePlayPause = () => {
    if (currentIndex >= totalEvents - 1) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const progressPct = totalEvents > 1 ? Math.round((currentIndex / (totalEvents - 1)) * 100) : 100;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Player Header */}
      <div
        style={{
          background: "#0D1117",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "#2563EB", padding: "6px", borderRadius: "6px", display: "flex" }}>
            <Clock size={18} color="white" weight="bold" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "white" }}>
              Time-Travel Code Playback: {studentName}
            </h3>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#94A3B8" }}>
              Modul {session.moduleId} • Total {totalEvents} Langkah Ketikan
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {session.hasPasteBurst && (
            <span
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid #EF4444",
                color: "#F87171",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Warning size={13} /> Terdeteksi Paste Instan
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Editor Viewport */}
      <div style={{ height: "360px", background: "#1E1E1E" }}>
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={currentEvent?.code || ""}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Timeline Controls */}
      <div
        style={{
          background: "#161B22",
          padding: "12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Scrubber Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontFamily: "monospace" }}>
            Langkah {currentIndex + 1}/{Math.max(1, totalEvents)}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(0, totalEvents - 1)}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(Number(e.target.value));
            }}
            style={{
              flex: 1,
              accentColor: "#38BDF8",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: "0.75rem", color: "#38BDF8", fontWeight: 700, fontFamily: "monospace" }}>
            {progressPct}%
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handlePlayPause}
              className="btn btn-sm btn-primary"
              style={{ padding: "6px 14px", gap: "6px", fontSize: "0.8rem" }}
            >
              {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
              {isPlaying ? "Jeda" : "Putar Ulang"}
            </button>
            <button
              onClick={handleReset}
              className="btn btn-sm btn-secondary"
              style={{ padding: "6px 10px", gap: "4px", fontSize: "0.8rem" }}
              title="Ulang dari awal"
            >
              <ArrowCounterClockwise size={16} />
              Reset
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8", marginRight: "4px" }}>
              <FastForward size={14} style={{ verticalAlign: "middle" }} /> Kecepatan:
            </span>
            {([1, 2, 4, 8] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                style={{
                  background: playbackSpeed === spd ? "#2563EB" : "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "3px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
