"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  ArrowClockwise,
  Gauge,
  CheckCircle,
  Bug,
} from "@phosphor-icons/react";

export interface ExecutionStep {
  line: number;
  vars: Record<string, { type: string; value: string }>;
  stdout: string[];
}

interface VisualDebuggerProps {
  code: string;
  onSelectLine?: (line: number) => void;
}

export function VisualDebugger({ code, onSelectLine }: VisualDebuggerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1000);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trace execution by parsing lines and tracking state changes
  const steps = useMemo<ExecutionStep[]>(() => {
    const lines = code.split("\n");
    const traceSteps: ExecutionStep[] = [];
    const currentVars: Record<string, { type: string; value: string }> = {};
    const stdoutAccumulator: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i].trim();
      if (!lineText || lineText.startsWith("#")) continue;

      // Detect assignments (e.g. x = 10, nama = "Budi")
      const assignMatch = lineText.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const [, varName, rawVal] = assignMatch;
        const valTrimmed = rawVal.trim();
        let varType = "str";
        let varVal = valTrimmed;

        if (/^\d+$/.test(valTrimmed)) {
          varType = "int";
        } else if (/^\d+\.\d+$/.test(valTrimmed)) {
          varType = "float";
        } else if (valTrimmed === "True" || valTrimmed === "False") {
          varType = "bool";
        } else if (valTrimmed.startsWith("[") && valTrimmed.endsWith("]")) {
          varType = "list";
        }

        currentVars[varName] = { type: varType, value: varVal };
      }

      // Detect print statements
      if (/^print\s*\(/.test(lineText)) {
        const inner = lineText.slice(lineText.indexOf("(") + 1, lineText.lastIndexOf(")")).trim();
        let printedVal = inner;
        if (currentVars[inner]) {
          printedVal = currentVars[inner].value;
        } else if ((inner.startsWith('"') && inner.endsWith('"')) || (inner.startsWith("'") && inner.endsWith("'"))) {
          printedVal = inner.slice(1, -1);
        }
        stdoutAccumulator.push(printedVal);
      }

      traceSteps.push({
        line: i + 1,
        vars: { ...currentVars },
        stdout: [...stdoutAccumulator],
      });
    }

    if (traceSteps.length === 0) {
      traceSteps.push({
        line: 1,
        vars: {},
        stdout: ["(Tidak ada baris eksekusi)"],
      });
    }

    return traceSteps;
  }, [code]);

  const activeStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    if (onSelectLine && activeStep) {
      onSelectLine(activeStep.line);
    }
  }, [currentStepIndex, activeStep, onSelectLine]);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev + 1 >= steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, speedMs, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Bug size={20} color="var(--primary-color)" />
          <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Visual Debugger Step-by-Step</h4>
        </div>
        <span
          style={{
            fontSize: "0.8125rem",
            background: "var(--bg-tertiary)",
            padding: "4px 10px",
            borderRadius: "var(--radius-full)",
            color: "var(--text-secondary)",
          }}
        >
          Langkah {currentStepIndex + 1} dari {steps.length}
        </span>
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-secondary)",
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="btn btn-sm btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="btn btn-sm btn-secondary"
          style={{ opacity: currentStepIndex === 0 ? 0.5 : 1 }}
        >
          <ArrowLeft size={16} /> Prev
        </button>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className="btn btn-sm btn-secondary"
          style={{ opacity: currentStepIndex === steps.length - 1 ? 0.5 : 1 }}
        >
          Next <ArrowRight size={16} />
        </button>

        <button onClick={handleReset} className="btn btn-sm btn-ghost" title="Reset Step">
          <ArrowClockwise size={16} /> Reset
        </button>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem" }}>
          <Gauge size={16} color="var(--text-secondary)" />
          <select
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "0.8125rem",
            }}
          >
            <option value={1500}>Lambat (1.5s)</option>
            <option value={1000}>Normal (1.0s)</option>
            <option value={500}>Cepat (0.5s)</option>
          </select>
        </div>
      </div>

      {/* Line Indicator */}
      <div
        style={{
          fontSize: "0.875rem",
          padding: "8px 12px",
          background: "rgba(255, 107, 0, 0.1)",
          borderLeft: "4px solid var(--primary-color)",
          borderRadius: "4px",
          color: "var(--text-primary)",
        }}
      >
        📌 Baris Aktif: <strong>Baris #{activeStep?.line || 1}</strong>
      </div>

      {/* Variable Memory State Table */}
      <div>
        <h5 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          💾 Status Variabel di Memori (RAM):
        </h5>
        {Object.keys(activeStep.vars).length === 0 ? (
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
            Belum ada variabel yang dideklarasikan pada langkah ini.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.8125rem",
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-tertiary)", textAlign: "left" }}>
                <th style={{ padding: "6px 12px" }}>Nama Variabel</th>
                <th style={{ padding: "6px 12px" }}>Tipe Data</th>
                <th style={{ padding: "6px 12px" }}>Nilai saat ini</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(activeStep.vars).map(([name, info]) => (
                <tr key={name} style={{ borderTop: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "6px 12px", fontFamily: "monospace", color: "var(--primary-color)", fontWeight: 700 }}>
                    {name}
                  </td>
                  <td style={{ padding: "6px 12px" }}>
                    <span
                      style={{
                        background: "var(--bg-card)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color)",
                        fontFamily: "monospace",
                      }}
                    >
                      {info.type}
                    </span>
                  </td>
                  <td style={{ padding: "6px 12px", fontFamily: "monospace", color: "var(--accent-color)" }}>
                    {info.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stdout Output Stream */}
      <div>
        <h5 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          🖥️ Output Layar (Terminal Output):
        </h5>
        <div
          style={{
            background: "#1E1E1E",
            color: "#D4D4D4",
            padding: "10px",
            borderRadius: "var(--radius-md)",
            fontFamily: "monospace",
            fontSize: "0.8125rem",
            minHeight: "50px",
            maxHeight: "100px",
            overflowY: "auto",
          }}
        >
          {activeStep.stdout.length === 0 ? (
            <span style={{ opacity: 0.5 }}>(Belum ada output cetakan)</span>
          ) : (
            activeStep.stdout.map((line, idx) => <div key={idx}>{line}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
