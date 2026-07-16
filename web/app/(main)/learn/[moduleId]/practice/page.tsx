"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useUserStore } from "@/lib/store/useUserStore";
import { QuizEngine, QuizQuestion } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <LoadingSpinner text="Memuat editor kode..." />,
});

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

export default function PracticePage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeSubModule, completeModule } = useUserStore();
  const [quizComplete, setQuizComplete] = useState(false);

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

  const handleQuizComplete = (score: number, total: number) => {
    completeSubModule(moduleId as string, `quiz-${moduleId}`);
    setQuizComplete(true);
    if (moduleId === "M0") {
      const nextModule = "M1";
      completeModule("M0");
      router.push(`/learn/${nextModule}`);
    }
  };

  const handleCodingSubmit = () => {
    completeSubModule(moduleId as string, `practice-${moduleId}`);
    router.push(`/learn/${moduleId}`);
  };

  if (quizComplete) {
    return (
      <div className="section-container" style={{ maxWidth: "680px", paddingTop: "var(--space-8)", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>✅</div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Latihan Selesai!
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
          {moduleId === "M0" ? "Pre-test selesai. Lanjut ke Modul 1!" : "Kamu sudah menyelesaikan latihan modul ini."}
        </p>
        <button onClick={() => router.push(`/learn/${moduleId}`)} className="btn btn-primary">
          Kembali ke Materi
        </button>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ maxWidth: "800px", paddingTop: "var(--space-4)" }}>
      {content.mode === "quiz" ? (
        <div
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
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", height: "calc(100vh - 200px)" }}>
          <CodeEditor
            initialCode={content.initialCode}
            taskDescription={content.description}
            onBack={() => router.push(`/learn/${moduleId}`)}
          />
        </div>
      )}
    </div>
  );
}


