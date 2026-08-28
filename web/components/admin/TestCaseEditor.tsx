"use client";

import React, { useState } from "react";
import {
  Flask,
  Plus,
  Trash,
  Play,
  CheckCircle,
  Eye,
  EyeSlash,
  Code,
  Sparkle,
  Warning,
  Sliders,
} from "@phosphor-icons/react";
import { gradeSubmission, TestCase, StructuralRule, GradingResult } from "@/lib/grader/autoGrader";

interface DynamicModuleGraderConfig {
  moduleId: string;
  moduleName: string;
  testCases: TestCase[];
  structuralRules: StructuralRule[];
  sampleCode: string;
}

const INITIAL_GRADER_CONFIGS: Record<string, DynamicModuleGraderConfig> = {
  M2: {
    moduleId: "M2",
    moduleName: "M2: Logika & Algoritma",
    testCases: [
      { id: "m2-tc1", description: "Cetak sapaan Halo, Maba!", expectedOutput: "Halo, Maba!" },
      { id: "m2-tc2", description: "Cetak baris kedua siap ngoding", expectedOutput: "Saya siap belajar Python di TRPL 2026", isHidden: true },
    ],
    structuralRules: [
      { type: "contains_regex", pattern: "print", errorMessage: "Wajib menggunakan fungsi print()" },
    ],
    sampleCode: "print('Halo, Maba!')\nprint('Saya siap belajar Python di TRPL 2026')",
  },
  M4: {
    moduleId: "M4",
    moduleName: "M4: Percabangan (If-Else)",
    testCases: [
      { id: "m4-tc1", description: "Usia 18 (Boleh Nonton)", inputs: ["18"], expectedOutput: "Boleh Nonton" },
      { id: "m4-tc2", description: "Usia 15 (Belum Cukup Umur)", inputs: ["15"], expectedOutput: "Belum Cukup Umur" },
      { id: "m4-tc3", description: "Boundary test: Usia 17 tepat", inputs: ["17"], expectedOutput: "Boleh Nonton", isHidden: true },
    ],
    structuralRules: [
      { type: "contains_regex", pattern: "if\\s+", errorMessage: "Wajib menggunakan struktur if" },
      { type: "contains_regex", pattern: "else\\s*:", errorMessage: "Wajib menggunakan blok else:" },
    ],
    sampleCode: "usia = int(input())\nif usia >= 17:\n    print('Boleh Nonton')\nelse:\n    print('Belum Cukup Umur')",
  },
  M5: {
    moduleId: "M5",
    moduleName: "M5: Perulangan (Loops)",
    testCases: [
      { id: "m5-tc1", description: "Mencetak angka 1 sampai 5", expectedOutput: ["1", "2", "3", "4", "5"] },
      { id: "m5-tc2", description: "Menguji efisiensi perulangan", expectedOutput: ["1", "2", "3", "4", "5"], isHidden: true },
    ],
    structuralRules: [
      { type: "contains_regex", pattern: "for\\s+|while\\s+", errorMessage: "Wajib menggunakan for atau while loop" },
    ],
    sampleCode: "for i in range(1, 6):\n    print(i)",
  },
  M8: {
    moduleId: "M8",
    moduleName: "M8: Mini Project Kasir Warkop TRPL",
    testCases: [
      { id: "m8-tc1", description: "Pesanan 2 kopi @5000 (Tanpa Diskon)", inputs: ["2", "kopi"], expectedOutput: ["Total Belanja: 10000", "Total Bayar: 10000"] },
      { id: "m8-tc2", description: "Pesanan 4 mie @10000 (Diskon 10%)", inputs: ["4", "mie"], expectedOutput: ["Total Belanja: 40000", "Total Bayar: 36000"] },
    ],
    structuralRules: [
      { type: "contains_regex", pattern: "def\\s+", errorMessage: "Wajib membuat fungsi modular minimal 1 'def'" },
      { type: "contains_regex", pattern: "if\\s+", errorMessage: "Wajib memiliki validasi diskon menggunakan 'if'" },
    ],
    sampleCode: "def hitung(item, qty):\n    harga = 10000 if item == 'mie' else 5000\n    total = harga * qty\n    diskon = 0.1 if total >= 20000 else 0\n    bayar = total - (total * diskon)\n    print(f'Total Belanja: {total}')\n    print(f'Total Bayar: {int(bayar)}')\n\nqty = int(input())\nitem = input()\nhitung(item, qty)",
  },
};

export function TestCaseEditor() {
  const [configs, setConfigs] = useState(INITIAL_GRADER_CONFIGS);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("M4");

  // New Test Case Form
  const [newDesc, setNewDesc] = useState("");
  const [newInputs, setNewInputs] = useState("");
  const [newExpected, setNewExpected] = useState("");
  const [newIsHidden, setNewIsHidden] = useState(false);

  // Dry Run Playground States
  const [dryRunCode, setDryRunCode] = useState(INITIAL_GRADER_CONFIGS["M4"].sampleCode);
  const [dryRunResult, setDryRunResult] = useState<GradingResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const currentConfig = configs[selectedModuleId] || configs["M4"];

  const handleSelectModule = (mId: string) => {
    setSelectedModuleId(mId);
    if (configs[mId]) {
      setDryRunCode(configs[mId].sampleCode);
      setDryRunResult(null);
    }
  };

  const handleAddTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newExpected.trim()) return;

    const newTC: TestCase = {
      id: `${selectedModuleId.toLowerCase()}-tc-${Date.now()}`,
      description: newDesc.trim(),
      inputs: newInputs.trim() ? newInputs.split(",").map((s) => s.trim()) : undefined,
      expectedOutput: newExpected.includes("\n") ? newExpected.split("\n").map((s) => s.trim()) : newExpected.trim(),
      isHidden: newIsHidden,
    };

    setConfigs((prev) => ({
      ...prev,
      [selectedModuleId]: {
        ...prev[selectedModuleId],
        testCases: [...prev[selectedModuleId].testCases, newTC],
      },
    }));

    setNewDesc("");
    setNewInputs("");
    setNewExpected("");
    setNewIsHidden(false);
  };

  const handleDeleteTestCase = (tcId: string) => {
    setConfigs((prev) => ({
      ...prev,
      [selectedModuleId]: {
        ...prev[selectedModuleId],
        testCases: prev[selectedModuleId].testCases.filter((tc) => tc.id !== tcId),
      },
    }));
  };

  const handleRunDryRun = async () => {
    setIsTesting(true);
    setDryRunResult(null);
    try {
      const res = await gradeSubmission(dryRunCode, {
        testCases: currentConfig.testCases,
        rules: currentConfig.structuralRules,
      });
      setDryRunResult(res);
    } catch (err: any) {
      // ignore
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Top Header */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-lg)",
              background: "rgba(168, 85, 247, 0.15)",
              color: "#A855F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flask size={24} weight="fill" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Dynamic Auto-Grader Test Case & Rule Editor
            </h3>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0 }}>
              Ubah atau tambahkan test cases dan aturan sintaks modul koding secara instan.
            </p>
          </div>
        </div>

        {/* Module Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Pilih Modul:</span>
          <select
            value={selectedModuleId}
            onChange={(e) => handleSelectModule(e.target.value)}
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "6px 12px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {Object.keys(configs).map((k) => (
              <option key={k} value={k}>
                {configs[k].moduleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Test Cases Table + Live Dry-Run Sandbox */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "var(--space-6)" }}>
        {/* Left: Test Cases Management */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                📋 Daftar Test Case ({currentConfig.testCases.length})
              </h4>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {currentConfig.testCases.filter((t) => t.isHidden).length} Hidden Test Case
              </span>
            </div>

            {/* Test Case Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentConfig.testCases.map((tc, idx) => (
                <div
                  key={tc.id}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-primary)" }}>
                        #{idx + 1}. {tc.description}
                      </span>
                      {tc.isHidden && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: "var(--radius-full)",
                            background: "rgba(168, 85, 247, 0.15)",
                            color: "#A855F7",
                            border: "1px solid rgba(168, 85, 247, 0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <EyeSlash size={10} /> Hidden
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                      {tc.inputs && <span>Input: [{tc.inputs.join(", ")}] • </span>}
                      <span>Expected: {Array.isArray(tc.expectedOutput) ? tc.expectedOutput.join(" | ") : tc.expectedOutput}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTestCase(tc.id)}
                    className="btn btn-sm btn-ghost"
                    style={{ color: "#EF4444", padding: "4px" }}
                    title="Hapus Test Case"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Test Case Form */}
            <form
              onSubmit={handleAddTestCase}
              style={{
                background: "var(--bg-page)",
                border: "1.5px dashed var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Plus size={14} weight="bold" /> Tambah Test Case Baru
              </span>

              <input
                type="text"
                placeholder="Deskripsi uji (misal: Usia di bawah batas minimal 17 tahun)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem" }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Input (pisahkan koma jika >1)"
                  value={newInputs}
                  onChange={(e) => setNewInputs(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem" }}
                />
                <input
                  type="text"
                  placeholder="Expected Output cetakan"
                  value={newExpected}
                  onChange={(e) => setNewExpected(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newIsHidden}
                    onChange={(e) => setNewIsHidden(e.target.checked)}
                  />
                  Jadikan Hidden Test Case (Hanya dievaluasi di grader)
                </label>

                <button type="submit" className="btn btn-sm btn-primary" style={{ fontSize: "0.75rem" }}>
                  Simpan Test Case
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Live Dry-Run Playground */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Code size={16} color="var(--color-primary-500)" />
              Live Dry-Run Sandbox Tester
            </h4>
            <button
              onClick={handleRunDryRun}
              disabled={isTesting}
              className="btn btn-sm btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}
            >
              <Play size={14} weight="fill" />
              {isTesting ? "Menguji..." : "Uji Auto-Grader Sekarang"}
            </button>
          </div>

          <textarea
            rows={8}
            value={dryRunCode}
            onChange={(e) => setDryRunCode(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontFamily: "monospace",
              fontSize: "0.825rem",
              lineHeight: 1.5,
              resize: "vertical",
            }}
          />

          {/* Dry Run Result Feedback */}
          {dryRunResult && (
            <div
              style={{
                background: dryRunResult.passed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                border: `1.5px solid ${dryRunResult.passed ? "#10B981" : "#EF4444"}`,
                borderRadius: "var(--radius-md)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "0.85rem", color: dryRunResult.passed ? "#10B981" : "#EF4444" }}>
                  {dryRunResult.passed ? "✅ LULUS SEMUA TEST CASES (100%)" : `❌ BELUM LULUS (${dryRunResult.scorePercentage}%)`}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {dryRunResult.passedCases}/{dryRunResult.totalCases} Lolos
                </span>
              </div>

              {/* Violations */}
              {dryRunResult.ruleViolations.length > 0 && (
                <div style={{ fontSize: "0.75rem", color: "#EF4444" }}>
                  ⚠️ {dryRunResult.ruleViolations.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
