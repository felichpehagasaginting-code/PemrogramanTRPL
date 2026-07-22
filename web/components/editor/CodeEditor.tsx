"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { PowerShellTerminal } from "./PowerShellTerminal";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  initialCode?: string;
  language?: string;
  taskDescription: string;
  expectedOutput?: string;
  onBack?: () => void;
  onSubmit?: () => void;
}

export function CodeEditor({
  initialCode = "# Tulis kode Python kamu di sini\nprint('Hello, TRPL!')",
  language = "python",
  taskDescription,
  onBack,
  onSubmit,
}: Props) {
  const [code, setCode] = useState(initialCode);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        height: "100%",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.875rem",
            fontWeight: 600,
            alignSelf: "flex-start",
          }}
        >
          <ArrowLeft size={16} /> Kembali ke materi
        </button>
      )}

      {/* Task Description Header */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
          {taskDescription}
        </p>

        {onSubmit && (
          <button
            onClick={onSubmit}
            className="btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              background: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
              border: "none",
              color: "#111827",
              fontWeight: 800,
              cursor: "pointer",
              borderRadius: "var(--radius-full)",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
              flexShrink: 0,
            }}
          >
            <CheckCircle size={18} weight="fill" /> Kirim Jawaban
          </button>
        )}
      </div>

      {/* Monaco Code Editor */}
      <div
        style={{
          height: "320px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
        }}
      >
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* PowerShell Lite Terminal Simulator */}
      <PowerShellTerminal code={code} />
    </div>
  );
}
