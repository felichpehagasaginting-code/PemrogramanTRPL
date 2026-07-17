"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useUserStore, BADGES } from "@/lib/store/useUserStore";
import { QuizEngine, QuizQuestion } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import confetti from "canvas-confetti";
import { BadgeIcon } from "@/components/ui";
import { Trophy, Smiley } from "@phosphor-icons/react";

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

const MEME_CONTENT: Record<string, { emoji: string; caption: string }> = {
  M2: { emoji: "🧠", caption: "Me explaining my algorithm to my cat" },
  M3: { emoji: "📦", caption: "Me naming variables: x, xx, xxx, xFinal..." },
  M4: { emoji: "🔀", caption: "If-else: Decisions, decisions, decisions everywhere!" },
  M5: { emoji: "🔄", caption: "While (alive): eat(), sleep(), code(), repeat()" },
  M6: { emoji: "🪄", caption: "DRY: Don't Repeat Yourself (Why write 3 lines when 1 function works?)" },
  M7: { emoji: "📊", caption: "Me organizing data in Python lists like a pro" },
  M8: { emoji: "⛑️", caption: "It's not much, but it's honest coding work!" },
};

export default function PracticePage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeSubModule, completeModule } = useUserStore();
  const [quizComplete, setQuizComplete] = useState(false);
  const [codingComplete, setCodingComplete] = useState(false);

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
    // 1. Mark sub-module and full module as completed
    completeSubModule(moduleId as string, `practice-${moduleId}`);
    completeModule(moduleId as string);
    
    // 2. Trigger confetti spray
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    // 3. Mark state as complete to show success visual screen
    setCodingComplete(true);
  };

  const moduleBadgeMap: Record<string, string> = {
    M1: "workspace_master",
    M2: "pemikir_logis",
    M3: "penampung_data",
    M4: "pembuat_keputusan",
    M5: "master_loop",
    M6: "function_wizard",
    M7: "data_collector",
    M8: "junior_developer",
  };

  const currentBadgeId = moduleBadgeMap[moduleId as string];
  const badgeInfo = BADGES.find((b) => b.id === currentBadgeId);
  const memeInfo = MEME_CONTENT[moduleId as string];

  if (quizComplete || codingComplete) {
    return (
      <div className="section-container" style={{ maxWidth: "600px", paddingTop: "var(--space-8)", textAlign: "center" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-8)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-4)" }}>
            <Trophy size={64} color="var(--color-primary-500)" weight="fill" />
          </div>
          <h3 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Latihan Selesai & Lulus!
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginBottom: "var(--space-6)" }}>
            Kerja bagus! Kamu telah berhasil memecahkan tantangan pemrograman pada <strong>Modul {moduleId}</strong>.
          </p>

          {/* Badge Showcase Box */}
          {badgeInfo && (
            <div
              style={{
                background: "var(--bg-page-alt)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                marginBottom: "var(--space-6)",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <BadgeIcon id={badgeInfo.id} color={badgeInfo.color} size={56} />
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase" }}>
                  Badge Baru Unlocked!
                </span>
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)", margin: "2px 0" }}>
                  {badgeInfo.name}
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", margin: 0 }}>
                  {badgeInfo.description}
                </p>
              </div>
            </div>
          )}

          {/* Meme Box */}
          {memeInfo && (
            <div
              style={{
                border: "2px solid var(--text-primary)",
                borderRadius: "var(--radius-md)",
                background: "#000000",
                padding: "20px",
                color: "#FFFFFF",
                fontFamily: "var(--font-heading)",
                fontWeight: 900,
                fontSize: "1rem",
                textTransform: "uppercase",
                textAlign: "center",
                marginBottom: "var(--space-6)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                <Smiley size={36} color="#FF6B00" weight="fill" />
              </div>
              {memeInfo.caption}
            </div>
          )}

          <div
            style={{
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              color: "#15803D",
              fontWeight: 700,
              fontSize: "0.875rem",
              marginBottom: "var(--space-6)",
            }}
          >
            ✨ +50 XP Poin Bonus & +15 XP Latihan didapatkan!
          </div>

          <button onClick={() => router.push("/dashboard")} className="btn btn-primary" style={{ width: "100%" }}>
            Kembali ke Dashboard
          </button>
        </div>
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
            onSubmit={handleCodingSubmit}
          />
        </div>
      )}
    </div>
  );
}


