"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Plus, Trash, Play, Flask, Sparkle } from "@phosphor-icons/react";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";

export interface CustomTestCase {
  id: string;
  funcCall: string;
  expectedResult: string;
  status?: "idle" | "passed" | "failed";
  actualResult?: string;
}

const DEFAULT_TESTS: CustomTestCase[] = [
  { id: "1", funcCall: "hitung_diskon(100000, 10)", expectedResult: "90000", status: "idle" },
  { id: "2", funcCall: "hitung_diskon(50000, 50)", expectedResult: "25000", status: "idle" },
];

export function TddTestBuilder({ studentCode }: { studentCode: string }) {
  const [tests, setTests] = useState<CustomTestCase[]>(DEFAULT_TESTS);
  const [isRunning, setIsRunning] = useState(false);

  const addTest = () => {
    const newTest: CustomTestCase = {
      id: `test-${Date.now()}`,
      funcCall: "nama_fungsi(arg1, arg2)",
      expectedResult: "nilai_ekspektasi",
      status: "idle",
    };
    setTests([...tests, newTest]);
  };

  const removeTest = (id: string) => {
    setTests(tests.filter((t) => t.id !== id));
  };

  const updateTest = (id: string, updates: Partial<CustomTestCase>) => {
    setTests(tests.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const updatedTests: CustomTestCase[] = [];

    for (const t of tests) {
      const testPyScript = `
${studentCode}

try:
    _res = str(${t.funcCall})
    print("RESULT:" + _res)
except Exception as _e:
    print("ERROR:" + str(_e))
`;

      try {
        const res = await runPythonCodeClient(testPyScript);
        const resultLine = res.output.find((l) => l.startsWith("RESULT:")) || "";
        const actualVal = resultLine.replace("RESULT:", "").trim();

        const passed = actualVal === t.expectedResult.trim();

        updatedTests.push({
          ...t,
          status: passed ? "passed" : "failed",
          actualResult: actualVal || res.error || "Gagal dieksekusi",
        });
      } catch (err: any) {
        updatedTests.push({
          ...t,
          status: "failed",
          actualResult: err.message,
        });
      }
    }

    setTests(updatedTests);
    setIsRunning(false);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--bg-secondary)",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Flask size={20} color="#10B981" weight="fill" />
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Mini TDD Explorer (Uji Fungsi Mandiri)
            </h4>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Tulis test case buatanmu sendiri sebelum menyelesaikan fungsi!
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={addTest} className="btn btn-xs btn-secondary" style={{ gap: "4px" }}>
            <Plus size={12} /> Tambah Test
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="btn btn-xs btn-primary"
            style={{ gap: "4px" }}
          >
            <Play size={12} weight="fill" />
            {isRunning ? "Menguji..." : "Jalankan Test"}
          </button>
        </div>
      </div>

      {/* Test cases list */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {tests.map((t, idx) => (
          <div
            key={t.id}
            style={{
              background: "var(--bg-page)",
              border: `1px solid ${
                t.status === "passed"
                  ? "#10B981"
                  : t.status === "failed"
                  ? "#EF4444"
                  : "var(--border-color)"
              }`,
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
                #{idx + 1}
              </span>
              <input
                type="text"
                value={t.funcCall}
                onChange={(e) => updateTest(t.id, { funcCall: e.target.value })}
                placeholder="fungsi(input)"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                  color: "#38BDF8",
                  flex: 1,
                  minWidth: "160px",
                }}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>==</span>
              <input
                type="text"
                value={t.expectedResult}
                onChange={(e) => updateTest(t.id, { expectedResult: e.target.value })}
                placeholder="hasil_ekspektasi"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                  color: "#F59E0B",
                  width: "100px",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {t.status === "passed" && (
                <span style={{ color: "#10B981", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle size={16} weight="fill" /> LOLOS
                </span>
              )}
              {t.status === "failed" && (
                <span style={{ color: "#EF4444", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <XCircle size={16} weight="fill" /> GAGAL (Dapat: {t.actualResult})
                </span>
              )}
              <button
                onClick={() => removeTest(t.id)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
          <Sparkle size={13} color="var(--primary)" />
          <span>Senior Tip: Di dunia industri nyata, programmer selalu membuat unit test terlebih dahulu agar program bebas dari bug tersembunyi!</span>
        </div>
      </div>
    </div>
  );
}
