"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, ArrowLeft } from "@phosphor-icons/react";

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
  expectedOutput,
  onBack,
  onSubmit,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput(["Menjalankan kode..."]);

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setOutput(data.output || ["Tidak ada output"]);
    } catch {
      setOutput(["Gagal menjalankan kode. Pastikan server Python berjalan."]);
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

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

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4)",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
          {taskDescription}
        </p>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: "300px",
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

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <button
          onClick={runCode}
          disabled={isRunning}
          className="btn btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px var(--space-5)",
          }}
        >
          <Play size={16} weight="fill" /> {isRunning ? "Menjalankan..." : "Jalankan Kode"}
        </button>

        {onSubmit && (
          <button
            onClick={onSubmit}
            className="btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px var(--space-6)",
              background: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
              border: "none",
              color: "#111827",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: "var(--radius-full)",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
            }}
          >
            Kirim Jawaban
          </button>
        )}
      </div>

      {output.length > 0 && (
        <div
          style={{
            background: "#111827",
            color: "#34D399",
            fontFamily: "var(--font-code)",
            fontSize: "0.875rem",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            minHeight: "80px",
            border: "1px solid rgba(255,107,0,0.15)",
          }}
        >
          <div style={{ color: "#9CA3AF", fontSize: "0.75rem", marginBottom: "8px", fontWeight: 600 }}>
            OUTPUT:
          </div>
          {output.map((line, i) => (
            <div key={i} style={{ whiteSpace: "pre-wrap" }}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
