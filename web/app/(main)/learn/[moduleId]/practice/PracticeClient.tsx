"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Warning,
  Terminal,
  Sparkle,
  Bug,
  Lightbulb,
  Lightning,
} from "@phosphor-icons/react";
import { QuizEngine, QuizQuestion } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";
import { gradeSubmission, GradingResult } from "@/lib/grader/autoGrader";
import { VisualDebugger } from "@/components/editor/VisualDebugger";
import { explainPythonError, generateHint, ExplainedError } from "@/lib/ai/errorExplainer";
import { ParsonsProblem, ParsonsBlock } from "@/components/learning/ParsonsProblem";

type PracticeMode = "coding" | "quiz" | "parsons";

interface PracticeData {
  mode: PracticeMode;
  description: string;
  initialCode?: string;
  questions?: QuizQuestion[];
  parsonsSolution?: ParsonsBlock[];
  testCases?: Array<{
    id: string;
    description?: string;
    inputs?: string[];
    expectedOutput: string | string[];
    isHidden?: boolean;
  }>;
  structuralRules?: Array<{
    type: "contains_regex" | "forbidden_regex";
    pattern: string;
    errorMessage: string;
  }>;
}

const PRACTICE_CONTENT: Record<string, PracticeData> = {
  M0: {
    mode: "quiz",
    description: "Pre-test diagnostik untuk memetakan kemampuan awal kamu.",
    questions: [
      {
        id: "m0-q1",
        question: "Manakah dari berikut ini yang BUKAN termasuk bahasa pemrograman?",
        options: ["Python", "Java", "Microsoft Word", "JavaScript"],
        correctIndex: 2,
        explanation: "Microsoft Word adalah aplikasi pengolah kata, bukan bahasa pemrograman.",
      },
      {
        id: "m0-q2",
        question: "Apa kepanjangan dari IDE?",
        options: ["Integrated Development Environment", "Internet Data Explorer", "Internal Design Engine", "Integrated Debug Environment"],
        correctIndex: 0,
        explanation: "IDE adalah singkatan dari Integrated Development Environment, software yang menyediakan tools untuk menulis dan menguji kode.",
      },
    ],
  },
  M1: {
    mode: "parsons",
    description: "Susun alur pembuatan folder & file Python pertama kamu dengan benar!",
    parsonsSolution: [
      { id: "b1", code: "# Langkah 1: Buat folder project", indent: 0 },
      { id: "b2", code: "workspace_folder = 'Matrikulasi'", indent: 0 },
      { id: "b3", code: "if workspace_folder:", indent: 0 },
      { id: "b4", code: "print('Folder berhasil dibuat!')", indent: 1 },
      { id: "b5", code: "print('Siap menulis kode Python')", indent: 1 },
    ],
  },
  M2: {
    mode: "coding",
    description: "Buat program Python pertama kamu! Buat variabel nama = 'Maba' dan cetak 'Halo, Maba!'",
    initialCode: "# Buat variabel nama\nnama = 'Maba'\n# Cetak 'Halo, Maba!'\nprint('Halo, ' + nama + '!')\n",
    testCases: [
      {
        id: "tc1",
        description: "Mencetak sapaan Halo, Maba!",
        expectedOutput: "Halo, Maba!",
      },
    ],
  },
  M3: {
    mode: "coding",
    description: "Buat variabel dengan tipe data string, integer, dan float, lalu cetak nilainya.",
    initialCode: "nama = 'Budi'\numur = 18\ntinggi = 170.5\nprint(nama)\nprint(umur)\nprint(tinggi)\n",
    testCases: [
      {
        id: "tc1",
        description: "Output string, int, float",
        expectedOutput: ["Budi", "18", "170.5"],
      },
    ],
  },
  M4: {
    mode: "coding",
    description: "Buat program yang mengecek angka = 10. Jika genap cetak 'Genap', jika ganjil cetak 'Ganjil'.",
    initialCode: "angka = 10\nif angka % 2 == 0:\n    print('Genap')\nelse:\n    print('Ganjil')\n",
    structuralRules: [
      {
        type: "contains_regex",
        pattern: "if\\s+.*:",
        errorMessage: "Wajib menggunakan struktur percabangan `if`!",
      },
    ],
    testCases: [
      {
        id: "tc1",
        description: "Mengecek angka genap 10",
        expectedOutput: "Genap",
      },
    ],
  },
  M5: {
    mode: "coding",
    description: "Buat program yang mencetak angka 1 sampai 5 menggunakan perulangan for.",
    initialCode: "for i in range(1, 6):\n    print(i)\n",
    structuralRules: [
      {
        type: "contains_regex",
        pattern: "for\\s+\\w+\\s+in",
        errorMessage: "Wajib menggunakan perulangan `for`!",
      },
    ],
    testCases: [
      {
        id: "tc1",
        description: "Mencetak angka 1 sampai 5",
        expectedOutput: ["1", "2", "3", "4", "5"],
      },
    ],
  },
  M6: {
    mode: "coding",
    description: "Buat fungsi bernama 'sapa' yang menerima parameter nama dan mengembalikan string 'Halo, [nama]!'",
    initialCode: "def sapa(nama):\n    return 'Halo, ' + nama + '!'\n\nprint(sapa('TRPL'))\n",
    structuralRules: [
      {
        type: "contains_regex",
        pattern: "def\\s+sapa\\s*\\(",
        errorMessage: "Wajib mendefinisikan fungsi `def sapa(nama):`!",
      },
    ],
    testCases: [
      {
        id: "tc1",
        description: "Memanggil sapa('TRPL')",
        expectedOutput: "Halo, TRPL!",
      },
    ],
  },
  M7: {
    mode: "coding",
    description: "Buat list berisi 5 buah favorit, lalu cetak buah ketiga (index 2).",
    initialCode: "buah = ['apel', 'mangga', 'pisang', 'anggur', 'jeruk']\nprint(buah[2])\n",
    testCases: [
      {
        id: "tc1",
        description: "Mencetak buah ketiga",
        expectedOutput: "pisang",
      },
    ],
  },
  M8: {
    mode: "coding",
    description: "Mini Project: Buat program penjumlahan dua angka (a = 5, b = 10) dan cetak hasilnya.",
    initialCode: "a = 5\nb = 10\nhasil = a + b\nprint('Hasil:', hasil)\n",
    testCases: [
      {
        id: "tc1",
        description: "Mencetak Hasil: 15",
        expectedOutput: "Hasil: 15",
      },
    ],
  },
};

export default function PracticeClient() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeSubModule, completeModule } = useUserStore();

  const [quizComplete, setQuizComplete] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "debugger" | "grader">("terminal");

  // Grading & AI states
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [explainedError, setExplainedError] = useState<ExplainedError | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const editorRef = useRef(null);

  const content = PRACTICE_CONTENT[moduleId as string];

  useEffect(() => {
    if (content?.initialCode) {
      setCode(content.initialCode);
    }
  }, [content]);

  if (!user) return <LoadingSpinner text="Memuat latihan..." fullPage />;

  if (!content) {
    return (
      <div className="section-container" style={{ textAlign: "center", paddingTop: "var(--space-8)" }}>
        <p style={{ color: "var(--text-secondary)" }}>Latihan untuk modul ini belum tersedia.</p>
        <button onClick={() => router.push(`/learn/${moduleId}`)} className="btn btn-primary" style={{ marginTop: "var(--space-4)" }}>
          Kembali ke Materi
        </button>
      </div>
    );
  }

  const runCode = async () => {
    setIsRunning(true);
    setOutput(["⚡ Menjalankan kode via Python WASM..."]);
    setExplainedError(null);

    try {
      const res = await runPythonCodeClient(code);
      setOutput(res.output);

      if (res.error) {
        const explained = explainPythonError(res.error);
        setExplainedError(explained);
      }
    } catch {
      setOutput(["Gagal menjalankan kode. Periksa koneksi atau syntax."]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunAutoGrader = async () => {
    setIsRunning(true);
    setActiveTab("grader");
    setGradingResult(null);

    if (!content.testCases) {
      // Fallback simple execution
      await runCode();
      setIsRunning(false);
      return;
    }

    try {
      const res = await gradeSubmission(code, {
        testCases: content.testCases,
        rules: content.structuralRules,
      });
      setGradingResult(res);

      if (res.passed) {
        completeSubModule(moduleId as string, `practice-${moduleId}`);
      }
    } catch (err: any) {
      setOutput([`Error Auto-Grader: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleShowHint = () => {
    const hint = generateHint(code, content.description);
    setAiHint(hint);
  };

  const handleQuizComplete = (score: number, total: number) => {
    completeSubModule(moduleId as string, `quiz-${moduleId}`);
    setQuizComplete(true);
    if (moduleId === "M0") {
      completeModule("M0");
      router.push(`/learn/M1`);
    }
  };

  const handleParsonsSuccess = () => {
    completeSubModule(moduleId as string, `practice-${moduleId}`);
    setTimeout(() => {
      router.push(`/learn/${moduleId}`);
    }, 1500);
  };

  if (quizComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-container"
        style={{ maxWidth: "680px", paddingTop: "var(--space-8)", textAlign: "center" }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
          {moduleId === "M0" ? <Sparkle size={48} /> : <CheckCircle size={48} weight="fill" color="var(--color-accent)" />}
        </div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Latihan Selesai!
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
          {moduleId === "M0" ? "Pre-test selesai. Lanjut ke Modul 1!" : "Kamu sudah menyelesaikan latihan modul ini."}
        </p>
        <button onClick={() => router.push(`/learn/${moduleId}`)} className="btn btn-primary">
          Kembali ke Materi
        </button>
      </motion.div>
    );
  }

  return (
    <div className="section-container" style={{ maxWidth: "900px", paddingTop: "var(--space-4)" }}>
      {content.mode === "quiz" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-6)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
            📝 Pre-Test Diagnostik
          </h2>
          <QuizEngine
            questions={content.questions!}
            moduleId={moduleId as string}
            onComplete={handleQuizComplete}
            onBack={() => router.push(`/learn/${moduleId}`)}
          />
        </motion.div>
      ) : content.mode === "parsons" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <button
            onClick={() => router.push(`/learn/${moduleId}`)}
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
          <ParsonsProblem
            description={content.description}
            solutionBlocks={content.parsonsSolution!}
            onSuccess={handleParsonsSuccess}
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <button
            onClick={() => router.push(`/learn/${moduleId}`)}
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

          {/* Description */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {content.description}
            </p>
            <button onClick={handleShowHint} className="btn btn-sm btn-ghost" style={{ color: "var(--primary-color)" }}>
              <Lightbulb size={16} /> Hint
            </button>
          </div>

          {/* AI Hint Notification */}
          {aiHint && (
            <div
              style={{
                background: "rgba(255, 157, 0, 0.1)",
                border: "1px solid var(--primary-color)",
                color: "var(--primary-color)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {aiHint}
            </div>
          )}

          {/* Code Editor Container */}
          <div
            style={{
              height: "320px",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
            }}
          >
            <Editor
              height="100%"
              language="python"
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

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Play size={18} weight="fill" />
              {isRunning ? "Menjalankan..." : "Jalankan Kode (WASM)"}
            </button>

            <button
              onClick={handleRunAutoGrader}
              disabled={isRunning}
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <CheckCircle size={18} color="var(--success-color)" />
              Submit & Auto-Grade
            </button>
          </div>

          {/* Tabs header: Terminal | Visual Debugger | Auto-Grader */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-color)" }}>
            <button
              onClick={() => setActiveTab("terminal")}
              style={{
                padding: "8px 16px",
                background: activeTab === "terminal" ? "var(--bg-card)" : "transparent",
                border: "none",
                borderBottom: activeTab === "terminal" ? "2px solid var(--primary-color)" : "none",
                color: activeTab === "terminal" ? "var(--primary-color)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Terminal size={16} /> Terminal Output
            </button>
            <button
              onClick={() => setActiveTab("debugger")}
              style={{
                padding: "8px 16px",
                background: activeTab === "debugger" ? "var(--bg-card)" : "transparent",
                border: "none",
                borderBottom: activeTab === "debugger" ? "2px solid var(--primary-color)" : "none",
                color: activeTab === "debugger" ? "var(--primary-color)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Bug size={16} /> Visual Debugger
            </button>
            <button
              onClick={() => setActiveTab("grader")}
              style={{
                padding: "8px 16px",
                background: activeTab === "grader" ? "var(--bg-card)" : "transparent",
                border: "none",
                borderBottom: activeTab === "grader" ? "2px solid var(--primary-color)" : "none",
                color: activeTab === "grader" ? "var(--primary-color)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle size={16} /> Auto-Grader Report
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "terminal" && (
            <div
              style={{
                background: "#1E1E1E",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                fontFamily: "monospace",
                fontSize: "0.875rem",
                minHeight: "120px",
                color: "#D4D4D4",
              }}
            >
              {output.length === 0 ? (
                <span style={{ opacity: 0.5 }}>Klik 'Jalankan Kode' untuk melihat output...</span>
              ) : (
                output.map((line, idx) => <div key={idx}>{line}</div>)
              )}

              {/* AI Error Explainer Notification */}
              {explainedError && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid var(--error-color)",
                    borderRadius: "var(--radius-md)",
                    fontFamily: "sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "var(--error-color)", marginBottom: "4px" }}>
                    {explainedError.icon} {explainedError.title}
                  </div>
                  <p style={{ fontSize: "0.8125rem", margin: "0 0 6px 0", color: "var(--text-secondary)" }}>
                    {explainedError.explanation}
                  </p>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--primary-color)" }}>
                    💡 Saran perbaikan: {explainedError.suggestion}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "debugger" && <VisualDebugger code={code} />}

          {activeTab === "grader" && (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
              }}
            >
              {!gradingResult ? (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0 }}>
                  Klik 'Submit & Auto-Grade' untuk menjalankan evaluasi otomatis.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                      Hasil Evaluasi Auto-Grader
                    </h4>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        background: gradingResult.passed ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: gradingResult.passed ? "var(--success-color)" : "var(--error-color)",
                      }}
                    >
                      Skor: {gradingResult.scorePercentage}% ({gradingResult.passedCases}/{gradingResult.totalCases} Test Cases)
                    </span>
                  </div>

                  {/* Rule Violations */}
                  {gradingResult.ruleViolations.length > 0 && (
                    <div
                      style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid var(--error-color)",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.8125rem",
                        color: "var(--error-color)",
                      }}
                    >
                      ⚠️ <strong>Pelanggaran Syarat Kode:</strong>
                      <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                        {gradingResult.ruleViolations.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Test Cases Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {gradingResult.details.map((tc) => (
                      <div
                        key={tc.id}
                        style={{
                          background: "var(--bg-secondary)",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          borderLeft: `4px solid ${tc.passed ? "var(--success-color)" : "var(--error-color)"}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{tc.description}</span>
                          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: tc.passed ? "var(--success-color)" : "var(--error-color)" }}>
                            {tc.passed ? "PASSED" : "FAILED"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
