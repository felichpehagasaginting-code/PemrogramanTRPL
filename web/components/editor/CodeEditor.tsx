"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, CheckCircle, Warning, Sparkle, PaintBrush, Check, Info } from "@phosphor-icons/react";
import { PowerShellTerminal } from "./PowerShellTerminal";
import { MONACO_CUSTOM_THEMES, defineMonacoThemes } from "@/lib/editorThemes";
import { lintPythonCode, LintWarning } from "@/lib/linter/simplePythonLinter";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  initialCode?: string;
  language?: string;
  taskDescription: string;
  expectedOutput?: string;
  onBack?: () => void;
  onSubmit?: () => void;
  virtualFiles?: Record<string, string>;
}

export function CodeEditor({
  initialCode = "# Tulis kode Python kamu di sini\nprint('Hello, TRPL!')",
  language = "python",
  taskDescription,
  onBack,
  onSubmit,
  virtualFiles,
}: Props) {
  const [code, setCode] = useState(initialCode);
  const [selectedTheme, setSelectedTheme] = useState<string>("dracula");
  const [showPasteToast, setShowPasteToast] = useState(false);

  // Real-time linting
  const lintWarnings: LintWarning[] = useMemo(() => {
    if (language !== "python") return [];
    return lintPythonCode(code);
  }, [code, language]);

  const handleEditorWillMount = (monaco: any) => {
    defineMonacoThemes(monaco);
  };

  const handleEditorChange = (newVal?: string) => {
    const nextVal = newVal || "";
    // Anti-paste muscle memory check: if length delta > 40 chars in single stroke
    if (nextVal.length - code.length > 40) {
      setShowPasteToast(true);
      setTimeout(() => setShowPasteToast(false), 5000);
    }
    setCode(nextVal);
  };

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
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, lineHeight: 1.6, margin: 0, flex: 1 }}>
          {taskDescription}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Theme Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <PaintBrush size={16} color="var(--text-muted)" />
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "4px 8px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <option value="vs-dark">VS Dark Default</option>
              <option value="dracula">🧛 Dracula Pro</option>
              <option value="one-dark-pro">✨ One Dark Pro</option>
              <option value="monokai">🌴 Monokai Classic</option>
              <option value="github-dark">🐙 GitHub Dark</option>
            </select>
          </div>

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
      </div>

      {/* Anti-Paste Muscle-Memory Toast */}
      {showPasteToast && (
        <div
          style={{
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            fontSize: "0.8rem",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkle size={16} color="#F59E0B" weight="fill" />
          <span>
            <strong>Tips Senior Mentor:</strong> Kamu baru saja paste kode dalam jumlah besar! Coba ketik manual per baris ya biar logikanya nempel di <em>muscle memory</em> kamu. 🧠✨
          </span>
        </div>
      )}

      {/* Real-time Syntax Lint Warning Banner */}
      {lintWarnings.length > 0 && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "var(--radius-md)",
            padding: "8px 12px",
            fontSize: "0.8rem",
            color: "#EF4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Warning size={16} weight="fill" />
            <span>{lintWarnings[0].message} • <em>{lintWarnings[0].fixSuggestion}</em></span>
          </div>
          {lintWarnings.length > 1 && (
            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
              (+{lintWarnings.length - 1} catatan lain)
            </span>
          )}
        </div>
      )}

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
          theme={selectedTheme}
          value={code}
          beforeMount={handleEditorWillMount}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "Fira Code, JetBrains Mono, monospace",
            fontLigatures: true,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* PowerShell Lite Terminal Simulator */}
      <PowerShellTerminal code={code} virtualFiles={virtualFiles} />
    </div>
  );
}
