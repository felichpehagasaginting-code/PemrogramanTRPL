"use client";

import { useState, useRef } from "react";
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
} from "@phosphor-icons/react";
import { QuizEngine, QuizQuestion } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type PracticeMode = "coding" | "quiz";

const PRACTICE_CONTENT: Record<string, { mode: PracticeMode; description: string; initialCode?: string; questions?: QuizQuestion[] }> = {
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
  M2: {
    mode: "coding",
    description: "Buat program Python pertama kamu! Buat variabel nama dan cetak 'Halo, [nama]!'",
    initialCode: "# Buat variabel nama\n# Cetak 'Halo, [nama]!'\n",
  },
  M3: {
    mode: "coding",
    description: "Buat variabel dengan tipe data string, integer, dan float, lalu cetak semuanya.",
    initialCode: "# String\nnama = \"Budi\"\n# Integer\numur = 18\n# Float\ntinggi = 170.5\n# Cetak semuanya\n",
  },
  M4: {
    mode: "coding",
    description: "Buat program yang meminta input angka dan menentukan apakah angka tersebut genap atau ganjil.",
    initialCode: "# Input angka\n# Cek genap/ganjil dengan if-else\n",
  },
  M5: {
    mode: "coding",
    description: "Buat program yang mencetak angka 1 sampai 10 menggunakan perulangan for.",
    initialCode: "# Gunakan for loop untuk mencetak 1-10\n",
  },
  M6: {
    mode: "coding",
    description: "Buat fungsi bernama 'sapa' yang menerima parameter nama dan mengembalikan string 'Halo, [nama]!'",
    initialCode: "# Definisikan fungsi sapa(nama)\ndef sapa(nama):\n    # return f\"Halo, {nama}!\"\n\n# Panggil fungsi\nprint(sapa(\"TRPL\"))\n",
  },
  M7: {
    mode: "coding",
    description: "Buat list berisi 5 buah favorit, lalu cetak buah ketiga dari list tersebut.",
    initialCode: "# Buat list buah\nbuah = [\"apel\", \"mangga\", \"pisang\", \"anggur\", \"jeruk\"]\n# Cetak buah ketiga (index ke-2)\n",
  },
  M8: {
    mode: "coding",
    description: "Mini Project: Buat program kalkulator sederhana yang bisa menjumlahkan dua angka.",
    initialCode: "# Kalkulator Sederhana\n# 1. Input angka pertama\n# 2. Input angka kedua\n# 3. Cetak hasil penjumlahan\n",
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
  const editorRef = useRef(null);

  if (!user) return <LoadingSpinner text="Memuat latihan..." fullPage />;

  const content = PRACTICE_CONTENT[moduleId as string];
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

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(["Menjalankan kode..."]);

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setOutput(data.output || ["Tidak ada output"]);
    } catch {
      setOutput(["Gagal menjalankan kode. Pastikan server Python berjalan."]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    completeSubModule(moduleId as string, `quiz-${moduleId}`);
    setQuizComplete(true);
    if (moduleId === "M0") {
      completeModule("M0");
      router.push(`/learn/M1`);
    }
  };

  const handleCodingSubmit = () => {
    completeSubModule(moduleId as string, `practice-${moduleId}`);
    router.push(`/learn/${moduleId}`);
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
    <div className="section-container" style={{ maxWidth: "800px", paddingTop: "var(--space-4)" }}>
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
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", height: "calc(100vh - 200px)" }}>
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

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {content.description}
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
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code || content.initialCode}
              onChange={(val) => setCode(val || "")}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
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
            {code.trim() && (
              <button
                onClick={handleCodingSubmit}
                className="btn btn-outline"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px var(--space-5)",
                }}
              >
                <CheckCircle size={16} /> Selesaikan Latihan
              </button>
            )}
          </div>

          <AnimatePresence>
            {output.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: "#111827",
                  color: "#34D399",
                  fontFamily: "var(--font-code)",
                  fontSize: "0.875rem",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  minHeight: "80px",
                  border: "1px solid rgba(255,107,0,0.15)",
                  overflow: "auto",
                }}
              >
                <div style={{ color: "#9CA3AF", fontSize: "0.75rem", marginBottom: "8px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                  <Terminal size={14} /> OUTPUT:
                </div>
                {output.map((line, i) => (
                  <div key={i} style={{ whiteSpace: "pre-wrap" }}>{line}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
