"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal, Play, ArrowClockwise, Trash } from "@phosphor-icons/react";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";
import { explainPythonError, ExplainedError } from "@/lib/ai/errorExplainer";

interface PowerShellTerminalProps {
  code: string;
  onExplainedError?: (err: ExplainedError | null) => void;
}

interface HistoryItem {
  id: string;
  text: string;
  type: "header" | "prompt" | "user-command" | "input-prompt" | "user-input" | "output" | "error" | "system";
}

export function PowerShellTerminal({ code, onExplainedError }: PowerShellTerminalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "hdr-1",
      text: "Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.\n\nTry the new cross-platform PowerShell https://aka.ms/pscore6\n",
      type: "header",
    },
  ]);
  const [typedInput, setTypedInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  // Interactive input states
  const [pendingPrompts, setPendingPrompts] = useState<string[]>([]);
  const [currentPromptIdx, setCurrentPromptIdx] = useState<number | null>(null);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom when history updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, currentPromptIdx, typedInput]);

  function extractPrompts(codeStr: string): string[] {
    const results: string[] = [];
    const regex = /input\s*\(\s*(?:["'](.*?)["'])?\s*\)/g;
    let match;
    while ((match = regex.exec(codeStr)) !== null) {
      results.push(match[1] || "");
    }
    return results;
  }

  const executePythonScript = async (inputsToPass: string[]) => {
    setIsExecuting(true);
    if (onExplainedError) onExplainedError(null);

    try {
      const res = await runPythonCodeClient(code, inputsToPass);

      setHistory((prev) => [
        ...prev,
        ...res.output.map((line, i) => ({
          id: `out-${Date.now()}-${i}`,
          text: line,
          type: res.error ? ("error" as const) : ("output" as const),
        })),
      ]);

      if (res.error && onExplainedError) {
        onExplainedError(explainPythonError(res.error));
      }
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, text: `Error: ${err.message}`, type: "error" },
      ]);
    } finally {
      setIsExecuting(false);
      setPendingPrompts([]);
      setCurrentPromptIdx(null);
      setCollectedInputs([]);
    }
  };

  const startScriptExecution = () => {
    const prompts = extractPrompts(code);

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        text: "PS D:\\TRPL\\Pemrograman> python main.py",
        type: "user-command",
      },
    ]);

    if (prompts.length > 0) {
      setPendingPrompts(prompts);
      setCurrentPromptIdx(0);
      setCollectedInputs([]);
      setHistory((prev) => [
        ...prev,
        {
          id: `prmpt-0-${Date.now()}`,
          text: prompts[0],
          type: "input-prompt",
        },
      ]);
    } else {
      executePythonScript([]);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = typedInput;
    setTypedInput("");

    // If waiting for python input() prompt
    if (currentPromptIdx !== null && currentPromptIdx < pendingPrompts.length) {
      const nextInputs = [...collectedInputs, val];
      setCollectedInputs(nextInputs);

      setHistory((prev) => [
        ...prev,
        {
          id: `user-inp-${Date.now()}`,
          text: val,
          type: "user-input",
        },
      ]);

      if (currentPromptIdx + 1 < pendingPrompts.length) {
        const nextIdx = currentPromptIdx + 1;
        setCurrentPromptIdx(nextIdx);
        setHistory((prev) => [
          ...prev,
          {
            id: `prmpt-${nextIdx}-${Date.now()}`,
            text: pendingPrompts[nextIdx],
            type: "input-prompt",
          },
        ]);
      } else {
        // Finished all interactive inputs! Execute script now!
        setCurrentPromptIdx(null);
        executePythonScript(nextInputs);
      }
      return;
    }

    // Shell CLI command mode (e.g. python main.py, cls, clear, dir, help)
    const cmd = val.trim().toLowerCase();
    if (cmd === "cls" || cmd === "clear") {
      setHistory([
        {
          id: `hdr-cleared-${Date.now()}`,
          text: "Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.\n",
          type: "header",
        },
      ]);
    } else if (cmd === "python main.py" || cmd === "python" || cmd === "run") {
      startScriptExecution();
    } else if (cmd === "dir" || cmd === "ls") {
      setHistory((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `PS D:\\TRPL\\Pemrograman> ${val}`, type: "user-command" },
        { id: `dir-${Date.now()}`, text: "    Directory: D:\\TRPL\\Pemrograman\n\nMode                LastWriteTime         Length Name\n----                -------------         ------ ----\n-a----       22/07/2026     12:00            450 main.py\n-a----       22/07/2026     12:00            120 README.md", type: "output" },
      ]);
    } else if (cmd === "help") {
      setHistory((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `PS D:\\TRPL\\Pemrograman> ${val}`, type: "user-command" },
        { id: `hlp-${Date.now()}`, text: "Perintah PowerShell TRPL Lite:\n  python main.py  - Jalankan script Python aktif\n  cls / clear     - Bersihkan layar terminal\n  dir / ls        - Tampilkan daftar file folder", type: "system" },
      ]);
    } else if (cmd !== "") {
      setHistory((prev) => [
        ...prev,
        { id: `cmd-${Date.now()}`, text: `PS D:\\TRPL\\Pemrograman> ${val}`, type: "user-command" },
        { id: `unkn-${Date.now()}`, text: `'${val}' is not recognized as an internal or external command. Ketik 'python main.py' untuk menjalankan kode.`, type: "error" },
      ]);
    }
  };

  return (
    <div
      style={{
        background: "#012456", // Classic PowerShell Blue Background
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        fontFamily: "'Consolas', 'Cascadia Code', 'Fira Code', monospace",
        fontSize: "0.875rem",
        color: "#EEEDF0",
      }}
    >
      {/* PowerShell Window Header Bar */}
      <div
        style={{
          background: "#0C1017",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>
          <Terminal size={16} color="#38BDF8" />
          <span>PowerShell 7.4.1 — (TRPL Interactive Console)</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={startScriptExecution}
            disabled={isExecuting}
            className="btn btn-sm btn-primary"
            style={{ padding: "4px 10px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <Play size={12} weight="fill" /> Jalankan (python main.py)
          </button>
          <button
            type="button"
            onClick={() =>
              setHistory([
                {
                  id: `hdr-clr-${Date.now()}`,
                  text: "Windows PowerShell\nCopyright (C) Microsoft Corporation. All rights reserved.\n",
                  type: "header",
                },
              ])
            }
            title="Bersihkan Terminal (cls)"
            style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          padding: "14px 16px",
          minHeight: "220px",
          maxHeight: "380px",
          overflowY: "auto",
          lineHeight: 1.6,
          cursor: "text",
        }}
      >
        {history.map((item) => {
          if (item.type === "header") {
            return (
              <div key={item.id} style={{ color: "#CCCCCC", whiteSpace: "pre-wrap", marginBottom: "8px" }}>
                {item.text}
              </div>
            );
          }
          if (item.type === "user-command") {
            return (
              <div key={item.id} style={{ color: "#FACC15", fontWeight: 700 }}>
                {item.text}
              </div>
            );
          }
          if (item.type === "input-prompt") {
            return (
              <span key={item.id} style={{ color: "#38BDF8", fontWeight: 600 }}>
                {item.text}
              </span>
            );
          }
          if (item.type === "user-input") {
            return (
              <span key={item.id} style={{ color: "#4ADE80", fontWeight: 700, marginLeft: "4px" }}>
                {item.text}
                <br />
              </span>
            );
          }
          if (item.type === "error") {
            return (
              <div key={item.id} style={{ color: "#F87171" }}>
                {item.text}
              </div>
            );
          }
          if (item.type === "system") {
            return (
              <div key={item.id} style={{ color: "#A7F3D0", whiteSpace: "pre-wrap" }}>
                {item.text}
              </div>
            );
          }
          return (
            <div key={item.id} style={{ color: "#F1F5F9", whiteSpace: "pre-wrap" }}>
              {item.text}
            </div>
          );
        })}

        {/* Interactive Active Line */}
        <form onSubmit={handleInputSubmit} style={{ display: "inline-flex", width: "100%", marginTop: "4px" }}>
          {currentPromptIdx === null ? (
            <span style={{ color: "#FACC15", fontWeight: 700, marginRight: "8px", whiteSpace: "nowrap" }}>
              PS D:\TRPL\Pemrograman&gt;
            </span>
          ) : (
            <span style={{ color: "#38BDF8", fontWeight: 700, marginRight: "4px", whiteSpace: "nowrap" }}>
              👉 {pendingPrompts[currentPromptIdx]}
            </span>
          )}

          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            disabled={isExecuting}
            placeholder={
              currentPromptIdx !== null
                ? "Ketik angka/teks lalu tekan Enter..."
                : "Ketik 'python main.py' atau tekan Enter..."
            }
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: currentPromptIdx !== null ? "#4ADE80" : "#FFFFFF",
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: 600,
            }}
          />
        </form>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
