"use client";

import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useUserStore } from "@/lib/store/useUserStore";
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
  ClockCounterClockwise,
  ArrowsOut,
  ArrowsIn,
  FloppyDisk,
  ArrowsClockwise,
  DotsThreeVertical,
  Gear,
} from "@phosphor-icons/react";
import { QuizEngine, QuizQuestion } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { runPythonCodeClient } from "@/lib/pyodide/pyodideRunner";
import { gradeSubmission, GradingResult } from "@/lib/grader/autoGrader";
import { SkeletonEditor } from "@/components/ui/Skeleton";
import { explainPythonError, generateHint, ExplainedError } from "@/lib/ai/errorExplainer";
import { ParsonsProblem, ParsonsBlock } from "@/components/learning/ParsonsProblem";
import { PowerShellTerminal } from "@/components/editor/PowerShellTerminal";
import { KeystrokeRecorder } from "@/lib/recorder/keystrokeRecorder";
import { MONACO_CUSTOM_THEMES, defineMonacoThemes } from "@/lib/editorThemes";
import { lintPythonCode, LintWarning } from "@/lib/linter/simplePythonLinter";
import { PaintBrush } from "@phosphor-icons/react";
import { useCodeHistory } from "@/lib/recorder/useCodeHistory";
import { EVALUATION_QUESTIONS } from "@/lib/content/modules-data";

// Performance Optimization: Dynamic import for Monaco Editor without SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <SkeletonEditor />,
});

// Route & Tab Level Code-Splitting: Lazy load heavy visual tooling components
const VisualDebugger = lazy(() => import("@/components/editor/VisualDebugger").then((m) => ({ default: m.VisualDebugger })));
const MemoryGraph = lazy(() => import("@/components/editor/MemoryGraph").then((m) => ({ default: m.MemoryGraph })));
const FlowchartBuilder = lazy(() => import("@/components/editor/FlowchartBuilder").then((m) => ({ default: m.FlowchartBuilder })));
const TddTestBuilder = lazy(() => import("@/components/editor/TddTestBuilder").then((m) => ({ default: m.TddTestBuilder })));
const AskHelpModal = lazy(() => import("@/components/learning/AskHelpModal").then((m) => ({ default: m.AskHelpModal })));
const ScaffoldedHintDrawer = lazy(() => import("@/components/learning/ScaffoldedHintDrawer").then((m) => ({ default: m.ScaffoldedHintDrawer })));
const CodeHistoryDrawer = lazy(() => import("@/components/editor/CodeHistoryDrawer").then((m) => ({ default: m.CodeHistoryDrawer })));

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
    description: "Pre-Test Diagnostik TRPL 2026: Ukur pemahaman awal logika komputasi & dasar pemrograman kamu.",
    questions: EVALUATION_QUESTIONS.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })),
  },
  M1: {
    mode: "parsons",
    description: "Workspace TRPL CWE: Susun alur pembuatan folder & file Python pertama kamu di partisi D:\\TRPL!",
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
    description: "Studi Kasus Agro-Informatika: Presensi Mandor Lapangan CWE. Buat variabel nama = 'Maba' dan cetak 'Halo, Maba!'",
    initialCode: "# Buat variabel nama mandor / asisten lapangan CWE\nnama = 'Maba'\n# Cetak 'Halo, Maba!'\nprint('Halo, ' + nama + '!')\n",
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
    description: "Studi Kasus Agro-Informatika: Data Operasional Mandor & Sensor PKS CWE. Buat variabel tipe data string (nama = 'Budi'), integer (umur = 18), dan float (tinggi/target tonase = 170.5), lalu cetak nilainya.",
    initialCode: "# Pendataan Mandor Lapangan & Parameter Timbangan PKS CWE\nnama = 'Budi'\numur = 18\ntinggi = 170.5\nprint(nama)\nprint(umur)\nprint(tinggi)\n",
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
    description: "Studi Kasus Agro-Informatika: Sistem Timbangan Jalur Truk TBS PKS CWE. Buat program yang mengecek nomor antrean angka = 10. Jika genap cetak 'Genap' (jalur timbangan A), jika ganjil cetak 'Ganjil' (jalur timbangan B).",
    initialCode: "# Pemeriksaan Jalur Truk TBS Timbangan PKS CWE\nangka = 10\nif angka % 2 == 0:\n    print('Genap')\nelse:\n    print('Ganjil')\n",
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
    description: "Studi Kasus Agro-Informatika: Monitoring Sensor Sterilizer Rebusan Sawit CWE. Buat program yang mencetak urutan pengecekan sensor suhu ruang rebusan 1 sampai 5 menggunakan perulangan for.",
    initialCode: "# Monitoring Sensor Ruang Rebusan Sawit (Sterilizer) 1 sampai 5\nfor i in range(1, 6):\n    print(i)\n",
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
    description: "Studi Kasus Agro-Informatika: Generator Format Sapaan Radio Lapangan Kebun CWE. Buat fungsi bernama 'sapa' yang menerima parameter nama dan mengembalikan string 'Halo, [nama]!'",
    initialCode: "# Format pesan otomatis radio komunikasi kebun CWE\ndef sapa(nama):\n    return 'Halo, ' + nama + '!'\n\nprint(sapa('TRPL'))\n",
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
    description: "Studi Kasus Agro-Informatika: Manajemen Rak Sampel Mutu Laboratorium Panen CWE. Buat list 5 item komoditas 'buah', lalu cetak sampel ketiga (index 2: 'pisang').",
    initialCode: "# Rak Sampel Mutu Panen Laboratorium CWE\nbuah = ['apel', 'mangga', 'pisang', 'anggur', 'jeruk']\nprint(buah[2])\n",
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
    description: "Mini Project Agro-Informatika: Sistem Kasir Koperasi Karyawan Perkebunan Sawit & Kantin TRPL CWE 2026. Hitung total belanja kopi dan mie instan, berikan diskon 10% jika total >= Rp 30.000, lalu cetak Total Belanja dan Total Bayar.",
    initialCode: `# Mini Project: Kasir Koperasi Sawit & Kantin TRPL CWE 2026
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
  const { user, isUserReady, completeSubModule, completeModule, addXP } = useUserStore();

  const [quizComplete, setQuizComplete] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"terminal" | "debugger" | "ram" | "grader" | "flowchart" | "tdd">("terminal");
  const [askHelpOpen, setAskHelpOpen] = useState(false);

  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [explainedError, setExplainedError] = useState<ExplainedError | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [showHintDrawer, setShowHintDrawer] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("dracula");
  const [showPasteToast, setShowPasteToast] = useState(false);
  const editorRef = useRef(null);

  // Split-Pane Resizer & Zen Mode (Recommendation 1)
  const [editorHeight, setEditorHeight] = useState<number>(360);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Auto-Save with Local Conflict Recovery (Recommendation 4)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  // Real-time Python linting
  const lintWarnings = useMemo(() => {
    return lintPythonCode(code);
  }, [code]);

  // Interactive Terminal Input States
  const [interactivePrompts, setInteractivePrompts] = useState<string[]>([]);
  const [promptIndex, setPromptIndex] = useState<number | null>(null);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);
  const [currentInputValue, setCurrentInputValue] = useState("");

  // Code History state and hook
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOptionsMenuOpen]);

  const {
    history,
    saveRevision,
    deleteRevision,
    clearHistory,
  } = useCodeHistory(`practice_${moduleId}`);

  const content = PRACTICE_CONTENT[moduleId as string];

  const draftStorageKey = `draft_code_${moduleId}_${user?.uid || "guest"}`;

  // Initialize code: Check for auto-saved draft or fallback to content.initialCode
  useEffect(() => {
    if (typeof window === "undefined" || !content) return;
    const defaultCode = content.initialCode || "";
    try {
      const savedDraft = localStorage.getItem(draftStorageKey);
      if (savedDraft && savedDraft.trim() && savedDraft !== defaultCode) {
        setCode(savedDraft);
        setHasDraft(true);
      } else {
        setCode(defaultCode);
        setHasDraft(false);
      }
    } catch {
      setCode(defaultCode);
    }
  }, [moduleId, content, draftStorageKey]);

  // Debounced auto-save effect
  useEffect(() => {
    if (typeof window === "undefined" || !code || !content?.initialCode) return;
    setAutoSaveStatus("saving");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftStorageKey, code);
        setAutoSaveStatus("saved");
        if (code !== content.initialCode) {
          setHasDraft(true);
        }
      } catch (err) {
        setAutoSaveStatus("idle");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [code, draftStorageKey, content?.initialCode]);

  const handleResetToInitial = () => {
    if (!content?.initialCode) return;
    if (confirm("Kembalikan kode ke template awal modul? Perubahan draf saat ini akan dibatalkan.")) {
      setCode(content.initialCode);
      try {
        localStorage.removeItem(draftStorageKey);
      } catch {}
      setHasDraft(false);
      setAutoSaveStatus("saved");
    }
  };

  const handleEditorWillMount = (monaco: any) => {
    defineMonacoThemes(monaco);
  };

  const handleEditorCodeChange = (newVal?: string) => {
    const nextVal = newVal || "";
    if (nextVal.length - code.length > 40) {
      setShowPasteToast(true);
      setTimeout(() => setShowPasteToast(false), 5000);
    }
    setCode(nextVal);
    recorderRef.current?.recordChange(nextVal);
  };

  const recorderRef = useRef<KeystrokeRecorder | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      recorderRef.current = new KeystrokeRecorder(moduleId as string, user?.uid || "maba-user");
    }
  }, [moduleId, user?.uid]);

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
    saveRevision(code, "Snapshot Sebelum Eksekusi");
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
    saveRevision(code, "Snapshot Sebelum Evaluasi");
    setIsRunning(true);
    setActiveTab("grader");
    setGradingResult(null);

    if (!content?.testCases) {
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
        completeSubModule(moduleId as string, `practice-${moduleId}`, 50);
      }
    } catch (err: any) {
      setOutput([`Error Auto-Grader: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleShowHint = () => {
    const hint = generateHint(code, content?.description || "");
    setAiHint(hint);
  };

  const handleQuizComplete = (score: number, total: number, answers?: Record<number, number>) => {
    const xpReward = score > 0 ? score * 10 : 0;
    completeSubModule(moduleId as string, `quiz-${moduleId}`, xpReward);
    setQuizComplete(true);
    if (moduleId === "M0") {
      completeModule("M0");
      useUserStore.getState().saveTestResult("preTest", {
        completed: true,
        score,
        totalQuestions: total,
        percentage: Math.round((score / total) * 100),
        submittedAt: new Date().toISOString(),
        answers: answers || {},
      });
      router.push(`/learn/M1`);
    }
  };

  const handleParsonsSuccess = () => {
    completeSubModule(moduleId as string, `practice-${moduleId}`, 50);
    setTimeout(() => {
      router.push(`/learn/${moduleId}`);
    }, 1500);
  };

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

  if (!user || !isUserReady) {
    return <SkeletonEditor />;
  }

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

          {/* Description & Compact Action Toolbar */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-3) var(--space-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                {content.description}
              </p>
              <div
                title={autoSaveStatus === "saving" ? "Menyimpan draf..." : "Draf otomatis tersimpan lokal"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  flexShrink: 0,
                }}
              >
                <FloppyDisk size={12} color={autoSaveStatus === "saving" ? "#F59E0B" : "#22C55E"} weight="fill" />
                <span className="hidden sm:inline">{autoSaveStatus === "saving" ? "Menyimpan..." : "Draf tersimpan"}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setShowHintDrawer(true)}
                className="btn btn-sm btn-ghost focus-ring"
                style={{
                  color: "var(--color-primary-600)",
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                }}
                aria-label="Buka Petunjuk Bertingkat (3-Tier Hint)"
              >
                <Lightbulb size={15} weight="fill" color="#F59E0B" /> 💡 3-Tier Hint
              </button>

              {/* Zen Fullscreen Mode Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="btn btn-sm btn-ghost focus-ring"
                style={{
                  color: isFullscreen ? "#F59E0B" : "var(--text-primary)",
                  background: isFullscreen ? "rgba(245, 158, 11, 0.15)" : "var(--bg-card)",
                  border: isFullscreen ? "1px solid #F59E0B" : "1px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                }}
                aria-label={isFullscreen ? "Keluar dari Zen Focus Mode" : "Aktifkan Zen Focus Mode"}
                title={isFullscreen ? "Keluar dari Zen Mode (Esc)" : "Masuk ke Zen Focus Mode (Editor Penuh)"}
              >
                {isFullscreen ? <ArrowsIn size={15} weight="bold" /> : <ArrowsOut size={15} weight="bold" />}
                <span>{isFullscreen ? "Keluar" : "Zen Mode"}</span>
              </button>

              {/* Options Popover Menu (Theme, History, Reset) */}
              <div style={{ position: "relative" }} ref={optionsMenuRef}>
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="btn btn-sm btn-ghost focus-ring"
                  style={{
                    color: "var(--text-primary)",
                    background: isOptionsMenuOpen ? "var(--bg-secondary)" : "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    padding: "4px 10px",
                  }}
                  title="Opsi & Pengaturan Editor"
                >
                  <DotsThreeVertical size={16} weight="bold" />
                  <span>Opsi</span>
                </button>

                {isOptionsMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 6px)",
                      zIndex: 50,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.25)",
                      minWidth: "220px",
                      padding: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ padding: "4px 8px", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                      Tema Monaco
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 8px 6px" }}>
                      <PaintBrush size={14} color="var(--text-muted)" />
                      <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        style={{
                          width: "100%",
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
                        <option value="vs-dark">VS Dark</option>
                        <option value="dracula">🧛 Dracula Pro</option>
                        <option value="one-dark-pro">✨ One Dark Pro</option>
                        <option value="monokai">🌴 Monokai Classic</option>
                        <option value="github-dark">🐙 GitHub Dark</option>
                      </select>
                    </div>

                    <div style={{ height: "1px", background: "var(--border-color)", margin: "2px 0" }} />

                    <button
                      onClick={() => {
                        setIsOptionsMenuOpen(false);
                        setIsHistoryOpen(true);
                      }}
                      className="dropdown-item-hover"
                      style={{
                        background: "none",
                        border: "none",
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 8px",
                        fontSize: "0.78rem",
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                      }}
                    >
                      <ClockCounterClockwise size={15} weight="bold" />
                      <span>Riwayat Versi Kode</span>
                    </button>

                    {hasDraft && (
                      <button
                        onClick={() => {
                          setIsOptionsMenuOpen(false);
                          handleResetToInitial();
                        }}
                        className="dropdown-item-hover"
                        style={{
                          background: "none",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 8px",
                          fontSize: "0.78rem",
                          color: "#EF4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                        }}
                      >
                        <ArrowsClockwise size={15} weight="bold" />
                        <span>Reset ke Kode Awal</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor Container with Zen Mode & Split Resizer */}
          <div
            style={
              isFullscreen
                ? {
                    position: "fixed",
                    inset: 0,
                    zIndex: 99999,
                    background: "#030712",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                  }
                : {
                    position: "relative",
                  }
            }
          >
            {/* Floating Non-Shifting Overlay for Anti-Paste & Linter Toasts */}
            <div
              style={{
                position: "absolute",
                bottom: isFullscreen ? "30px" : "24px",
                right: "16px",
                zIndex: 35,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxWidth: "420px",
                pointerEvents: "none",
              }}
            >
              {showPasteToast && (
                <div
                  style={{
                    pointerEvents: "auto",
                    background: "var(--bg-card)",
                    border: "1px solid #F59E0B",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 14px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                    fontSize: "0.8rem",
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Sparkle size={18} color="#F59E0B" weight="fill" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Tips Senior Mentor:</strong> Paste kode besar terdeteksi. Coba ketik mandiri per baris agar melatih ingatan sintaks Python ya! 🧠✨
                  </span>
                </div>
              )}

              {lintWarnings.length > 0 && (
                <div
                  style={{
                    pointerEvents: "auto",
                    background: "var(--bg-card)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 12px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                    fontSize: "0.78rem",
                    color: "#EF4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Warning size={16} weight="fill" style={{ flexShrink: 0 }} />
                    <span>{lintWarnings[0].message} • <em>{lintWarnings[0].fixSuggestion}</em></span>
                  </div>
                  {lintWarnings.length > 1 && (
                    <span style={{ fontSize: "0.72rem", opacity: 0.8, whiteSpace: "nowrap" }}>
                      (+{lintWarnings.length - 1})
                    </span>
                  )}
                </div>
              )}
            </div>
            {isFullscreen && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", background: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F8FAFC", fontWeight: 700, fontSize: "0.9rem" }}>
                  <span>🧘 Zen Focus Mode: {content.description}</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button onClick={runCode} disabled={isRunning} className="btn btn-primary btn-sm" style={{ gap: "6px" }}>
                    <Play size={14} weight="fill" /> {isRunning ? "Menjalankan..." : "Jalankan Kode"}
                  </button>
                  <button onClick={() => setIsFullscreen(false)} className="btn btn-secondary btn-sm" style={{ gap: "6px" }}>
                    <ArrowsIn size={14} weight="bold" /> Keluar Zen (Esc)
                  </button>
                </div>
              </div>
            )}

            <div
              style={{
                height: isFullscreen ? "calc(100vh - 100px)" : `${editorHeight}px`,
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1.5px solid var(--border-color)",
                boxShadow: "var(--shadow-md)",
                transition: isResizing ? "none" : "height 0.2s ease",
              }}
            >
              <MonacoEditor
                height="100%"
                language="python"
                theme={selectedTheme}
                value={code}
                beforeMount={handleEditorWillMount}
                onChange={handleEditorCodeChange}
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

            {/* Split Resizer Handle */}
            {!isFullscreen && (
              <div
                role="separator"
                aria-orientation="horizontal"
                aria-label="Tarik untuk mengubah tinggi editor koding"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsResizing(true);
                  const startY = e.clientY;
                  const startHeight = editorHeight;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const newHeight = Math.max(220, Math.min(750, startHeight + (moveEvent.clientY - startY)));
                    setEditorHeight(newHeight);
                  };

                  const handleMouseUp = () => {
                    setIsResizing(false);
                    window.removeEventListener("mousemove", handleMouseMove);
                    window.removeEventListener("mouseup", handleMouseUp);
                  };

                  window.addEventListener("mousemove", handleMouseMove);
                  window.addEventListener("mouseup", handleMouseUp);
                }}
                style={{
                  height: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "row-resize",
                  margin: "4px 0",
                  opacity: 0.6,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
                title="Tarik ke atas/bawah untuk mengatur tinggi editor"
              >
                <div style={{ width: "48px", height: "4px", borderRadius: "2px", background: "var(--border-color-strong)" }} />
              </div>
            )}
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

          {/* Tabs header: Terminal | Visual Debugger | Auto-Grader | Alat Visual */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => setActiveTab("terminal")}
                style={{
                  padding: "8px 14px",
                  background: activeTab === "terminal" ? "var(--bg-card)" : "transparent",
                  border: "none",
                  borderBottom: activeTab === "terminal" ? "2px solid var(--primary-color)" : "2px solid transparent",
                  color: activeTab === "terminal" ? "var(--primary-color)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Terminal size={15} /> Terminal Output
              </button>
              <button
                onClick={() => setActiveTab("debugger")}
                style={{
                  padding: "8px 14px",
                  background: activeTab === "debugger" ? "var(--bg-card)" : "transparent",
                  border: "none",
                  borderBottom: activeTab === "debugger" ? "2px solid var(--primary-color)" : "2px solid transparent",
                  color: activeTab === "debugger" ? "var(--primary-color)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Bug size={15} /> Visual Debugger
              </button>
              <button
                onClick={() => setActiveTab("grader")}
                style={{
                  padding: "8px 14px",
                  background: activeTab === "grader" ? "var(--bg-card)" : "transparent",
                  border: "none",
                  borderBottom: activeTab === "grader" ? "2px solid var(--primary-color)" : "2px solid transparent",
                  color: activeTab === "grader" ? "var(--primary-color)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle size={15} /> Auto-Grader
              </button>
              <button
                onClick={() => {
                  if (activeTab !== "ram" && activeTab !== "flowchart" && activeTab !== "tdd") {
                    setActiveTab("ram");
                  }
                }}
                style={{
                  padding: "8px 14px",
                  background: (activeTab === "ram" || activeTab === "flowchart" || activeTab === "tdd") ? "var(--bg-card)" : "transparent",
                  border: "none",
                  borderBottom: (activeTab === "ram" || activeTab === "flowchart" || activeTab === "tdd") ? "2px solid var(--primary-color)" : "2px solid transparent",
                  color: (activeTab === "ram" || activeTab === "flowchart" || activeTab === "tdd") ? "var(--primary-color)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Cpu size={15} /> Alat Visual & TDD
              </button>
            </div>

            {/* Sub-tools Pill Selector when Alat Visual is Active */}
            {(activeTab === "ram" || activeTab === "flowchart" || activeTab === "tdd") && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 0" }}>
                <button
                  onClick={() => setActiveTab("ram")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    border: "1px solid var(--border-color)",
                    background: activeTab === "ram" ? "var(--color-primary-500)" : "var(--bg-card)",
                    color: activeTab === "ram" ? "white" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  RAM Explorer
                </button>
                <button
                  onClick={() => setActiveTab("flowchart")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    border: "1px solid var(--border-color)",
                    background: activeTab === "flowchart" ? "var(--color-primary-500)" : "var(--bg-card)",
                    color: activeTab === "flowchart" ? "white" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Flowchart
                </button>
                <button
                  onClick={() => setActiveTab("tdd")}
                  style={{
                    padding: "3px 8px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    border: "1px solid var(--border-color)",
                    background: activeTab === "tdd" ? "var(--color-primary-500)" : "var(--bg-card)",
                    color: activeTab === "tdd" ? "white" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Mini TDD
                </button>
              </div>
            )}
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

          {activeTab === "debugger" && (
            <Suspense fallback={<div style={{ padding: "32px", display: "flex", justifyContent: "center" }}><LoadingSpinner /></div>}>
              <VisualDebugger code={code} />
            </Suspense>
          )}

          {activeTab === "ram" && (
            <Suspense fallback={<div style={{ padding: "32px", display: "flex", justifyContent: "center" }}><LoadingSpinner /></div>}>
              <MemoryGraph variables={{ x: 10, total: 25.5, items: ["Python", "TRPL"], aktif: true }} />
            </Suspense>
          )}

          {activeTab === "flowchart" && (
            <Suspense fallback={<div style={{ padding: "32px", display: "flex", justifyContent: "center" }}><LoadingSpinner /></div>}>
              <FlowchartBuilder onCodeGenerated={(py) => setCode(py)} />
            </Suspense>
          )}

          {activeTab === "tdd" && (
            <Suspense fallback={<div style={{ padding: "32px", display: "flex", justifyContent: "center" }}><LoadingSpinner /></div>}>
              <TddTestBuilder studentCode={code} />
            </Suspense>
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
      {askHelpOpen && (
        <Suspense fallback={null}>
          <AskHelpModal
            isOpen={askHelpOpen}
            onClose={() => setAskHelpOpen(false)}
            code={code}
            moduleId={moduleId as string}
            lastError={explainedError?.title}
            userName={user.name}
          />
        </Suspense>
      )}

      {/* 3-Tier Scaffolding Hint Drawer */}
      {showHintDrawer && (
        <Suspense fallback={null}>
          <ScaffoldedHintDrawer
            isOpen={showHintDrawer}
            onClose={() => setShowHintDrawer(false)}
            moduleTitle={`Latihan Modul ${moduleId}`}
          />
        </Suspense>
      )}

      {/* Code History Drawer */}
      {isHistoryOpen && (
        <Suspense fallback={null}>
          <CodeHistoryDrawer
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            history={history}
            currentCode={code}
            onRestore={(restoredCode) => setCode(restoredCode)}
            onSaveSnapshot={(codeToSave, label) => saveRevision(codeToSave, label)}
            onDeleteRevision={deleteRevision}
            onClearHistory={clearHistory}
          />
        </Suspense>
      )}
    </div>
  );
}
