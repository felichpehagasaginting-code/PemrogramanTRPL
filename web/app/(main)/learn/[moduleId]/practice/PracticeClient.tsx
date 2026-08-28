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
  Lifebuoy,
  Cpu,
  GitCommit,
  Flask,
} from "@phosphor-icons/react";
import { QuizEngine, QuizQuestion } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";
import { gradeSubmission, GradingResult } from "@/lib/grader/autoGrader";
import { VisualDebugger } from "@/components/editor/VisualDebugger";
import { MemoryGraph } from "@/components/editor/MemoryGraph";
import { FlowchartBuilder } from "@/components/editor/FlowchartBuilder";
import { TddTestBuilder } from "@/components/editor/TddTestBuilder";
import { AskHelpModal } from "@/components/learning/AskHelpModal";
import { explainPythonError, generateHint, ExplainedError } from "@/lib/ai/errorExplainer";
import { ParsonsProblem, ParsonsBlock } from "@/components/learning/ParsonsProblem";
import { PowerShellTerminal } from "@/components/editor/PowerShellTerminal";
import { KeystrokeRecorder } from "@/lib/recorder/keystrokeRecorder";

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
    description: "Mini Project: Sistem Kasir Warkop TRPL 2026. Hitung total pesanan kopi dan mie, berikan diskon 10% jika total >= Rp 30.000, lalu cetak Total Bayar.",
    initialCode: `# Mini Project: Kasir Warkop TRPL 2026
harga_kopi = 5000
harga_mie = 10000

jumlah_kopi = 2
jumlah_mie = 3

total = (jumlah_kopi * harga_kopi) + (jumlah_mie * harga_mie)

if total >= 30000:
    diskon = total * 0.10
    total_bayar = total - diskon
else:
    diskon = 0
    total_bayar = total

print("Total Belanja:", total)
print("Total Bayar:", int(total_bayar))
`,
    testCases: [
      {
        id: "tc1",
        description: "Mencetak Total Belanja dan Total Bayar",
        expectedOutput: ["Total Belanja: 40000", "Total Bayar: 36000"],
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
  const [activeTab, setActiveTab] = useState<"terminal" | "debugger" | "ram" | "grader" | "flowchart" | "tdd">("terminal");
  const [askHelpOpen, setAskHelpOpen] = useState(false);

  // Grading & AI states
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [explainedError, setExplainedError] = useState<ExplainedError | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const editorRef = useRef(null);

  // Interactive Terminal Input States
  const [interactivePrompts, setInteractivePrompts] = useState<string[]>([]);
  const [promptIndex, setPromptIndex] = useState<number | null>(null);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);
  const [currentInputValue, setCurrentInputValue] = useState("");

  const content = PRACTICE_CONTENT[moduleId as string];

  const recorderRef = useRef<KeystrokeRecorder | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      recorderRef.current = new KeystrokeRecorder(moduleId as string, user?.uid || "maba-user");
    }
  }, [moduleId, user?.uid]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.key === "Enter") {
        e.preventDefault();
        runCode();
      } else if (isCtrlOrCmd && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        handleRunAutoGrader();
      } else if (isCtrlOrCmd && e.shiftKey && (e.key === "H" || e.key === "h")) {
        e.preventDefault();
        handleShowHint();
      } else if (isCtrlOrCmd && e.shiftKey && (e.key === "B" || e.key === "b")) {
        e.preventDefault();
        setAskHelpOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, isRunning]);

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

  function extractPrompts(codeStr: string): string[] {
    const results: string[] = [];
    const regex = /input\s*\(\s*(?:["'](.*?)["'])?\s*\)/g;
    let match;
    while ((match = regex.exec(codeStr)) !== null) {
      results.push(match[1] || "Masukkan nilai input:");
    }
    return results;
  }

  const runCode = async () => {
    setExplainedError(null);
    setActiveTab("terminal");

    const prompts = extractPrompts(code);
    if (prompts.length > 0) {
      setInteractivePrompts(prompts);
      setPromptIndex(0);
      setCollectedInputs([]);
      setCurrentInputValue("");
      setOutput([
        "⚡ Program interaktif dimulai...",
        `👉 Masukkan input ke-1 dari ${prompts.length}: ${prompts[0]}`,
      ]);
      return;
    }

    setIsRunning(true);
    setPromptIndex(null);
    setOutput(["⚡ Menjalankan kode via Python WASM..."]);

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

  const handleSendInput = async (val: string) => {
    if (promptIndex === null) return;
    const inputValueToUse = val.trim() || "0";
    const nextInputs = [...collectedInputs, inputValueToUse];
    setCollectedInputs(nextInputs);
    setCurrentInputValue("");

    if (promptIndex + 1 < interactivePrompts.length) {
      const nextIdx = promptIndex + 1;
      setPromptIndex(nextIdx);
      setOutput((prev) => [
        ...prev,
        `✓ [Input ${promptIndex + 1}]: ${inputValueToUse}`,
        `👉 Masukkan input ke-${nextIdx + 1} dari ${interactivePrompts.length}: ${interactivePrompts[nextIdx]}`,
      ]);
    } else {
      // All inputs gathered! Execute Python code via Pyodide WASM!
      setPromptIndex(null);
      setIsRunning(true);
      setOutput((prev) => [
        ...prev,
        `✓ [Input ${promptIndex + 1}]: ${inputValueToUse}`,
        "⚡ Mengkalkulasi hasil program...",
      ]);

      try {
        const res = await runPythonCodeClient(code, nextInputs);
        setOutput(res.output);

        if (res.error) {
          const explained = explainPythonError(res.error);
          setExplainedError(explained);
        }
      } catch {
        setOutput(["Gagal mengeksekusi program."]);
      } finally {
        setIsRunning(false);
      }
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
            className="nav-link no-underline focus-ring"
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
            className="nav-link no-underline focus-ring"
            aria-label="Kembali ke materi"
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
            <button onClick={handleShowHint} className="btn btn-sm btn-ghost focus-ring" style={{ color: "var(--color-primary-600)" }} aria-label="Dapatkan hint AI">
              <Lightbulb size={16} /> Hint
            </button>
          </div>

          {/* AI Hint Notification */}
          {aiHint && (
            <div
              style={{
                background: "rgba(255, 157, 0, 0.1)",
                border: "1px solid var(--color-primary-500)",
                color: "var(--color-primary-600)",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
              role="note"
              aria-live="polite"
            >
              <Lightbulb size={16} weight="fill" style={{ marginRight: "6px", verticalAlign: "middle" }} aria-hidden="true" /> {aiHint}
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
              onChange={(val) => {
                const newCode = val || "";
                setCode(newCode);
                recorderRef.current?.recordChange(newCode);
              }}
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

            <button
              onClick={() => setAskHelpOpen(true)}
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38BDF8" }}
              title="Minta Bantuan ke Mentor atau Teman"
            >
              <Lifebuoy size={18} weight="fill" />
              Minta Bantuan
            </button>
          </div>

          {/* Tabs header: Terminal | Visual Debugger | Visual RAM | Auto-Grader */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-color)", flexWrap: "wrap" }}>
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
              onClick={() => setActiveTab("ram")}
              style={{
                padding: "8px 16px",
                background: activeTab === "ram" ? "var(--bg-card)" : "transparent",
                border: "none",
                borderBottom: activeTab === "ram" ? "2px solid var(--primary-color)" : "none",
                color: activeTab === "ram" ? "var(--primary-color)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Cpu size={16} /> Visual Memory RAM
            </button>
            <button
              onClick={() => setActiveTab("flowchart")}
              style={{
                padding: "8px 16px",
                background: activeTab === "flowchart" ? "var(--bg-card)" : "transparent",
                border: "none",
                borderBottom: activeTab === "flowchart" ? "2px solid var(--primary-color)" : "none",
                color: activeTab === "flowchart" ? "var(--primary-color)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <GitCommit size={16} /> Flowchart Builder
            </button>
            <button
              onClick={() => setActiveTab("tdd")}
              style={{
                padding: "8px 16px",
                background: activeTab === "tdd" ? "var(--bg-card)" : "transparent",
                border: "none",
                borderBottom: activeTab === "tdd" ? "2px solid var(--primary-color)" : "none",
                color: activeTab === "tdd" ? "var(--primary-color)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Flask size={16} /> Mini TDD Explorer
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
            <div>
              <PowerShellTerminal code={code} onExplainedError={setExplainedError} />

              {/* AI Error Explainer Notification */}
              {explainedError && (
                <div
                  style={{
                    marginTop: "12px",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--error-color)", fontWeight: 700, fontSize: "0.95rem" }}>
                    <span>{explainedError.icon}</span>
                    <span>{explainedError.title}</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: "8px 0", lineHeight: 1.6 }}>
                    {explainedError.explanation}
                  </p>
                  <div style={{ background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", color: "var(--text-primary)" }}>
                    💡 <strong>Saran perbaikan:</strong> {explainedError.suggestion}
                  </div>
                  {explainedError.mentorNote && (
                    <div style={{ marginTop: "8px", fontSize: "0.8rem", color: "#38BDF8", fontStyle: "italic" }}>
                      {explainedError.mentorNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "debugger" && <VisualDebugger code={code} />}

          {activeTab === "ram" && (
            <MemoryGraph variables={{ x: 10, total: 25.5, items: ["Python", "TRPL"], aktif: true }} />
          )}

          {activeTab === "flowchart" && (
            <FlowchartBuilder onCodeGenerated={(py) => setCode(py)} />
          )}

          {activeTab === "tdd" && (
            <TddTestBuilder studentCode={code} />
          )}

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

      {/* Ask Help Modal */}
      <AskHelpModal
        isOpen={askHelpOpen}
        onClose={() => setAskHelpOpen(false)}
        code={code}
        moduleId={moduleId as string}
        lastError={explainedError?.title}
        userName={user.name}
      />
    </div>
  );
}
