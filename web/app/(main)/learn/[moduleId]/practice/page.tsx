"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useUserStore, BADGES } from "@/lib/store/useUserStore";
import { useGameStore } from "@/lib/store/useGameStore";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PRACTICE_CONTENT } from "@/lib/content/modules-data";
import { getRandomMemes } from "@/lib/content/memes";
import { fireConfetti } from "@/lib/confetti";
import { BadgeIcon } from "@/components/ui";
import { Trophy } from "@phosphor-icons/react";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <LoadingSpinner text="Memuat editor kode..." />,
});

type PracticeMode = "coding" | "quiz";

export default function PracticePage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeSubModule, completeModule } = useUserStore();
  const gameApi = useGameStore.getState();
  const [quizComplete, setQuizComplete] = useState(false);
  const [codingComplete, setCodingComplete] = useState(false);

  if (!user) return <LoadingSpinner text="Memuat latihan..." fullPage />;

  const content = PRACTICE_CONTENT[moduleId as string];
  if (!content) {
    return (
      <div className="section-container text-center pt-8">
        <p className="text-[var(--text-secondary)]">Latihan untuk modul ini belum tersedia.</p>
        <button onClick={() => router.push(`/learn/${moduleId}`)} className="btn btn-primary mt-4">
          Kembali ke Materi
        </button>
      </div>
    );
  }

  const handleQuizComplete = (score: number, total: number) => {
    completeSubModule(moduleId as string, `quiz-${moduleId}`);
    setQuizComplete(true);
    const meme = getRandomMemes(moduleId as string, 1)[0];
    if (meme) gameApi.triggerMeme(meme.emoji, meme.caption);
    if (moduleId === "M0") {
      completeModule("M0");
      router.push("/learn/M1");
    }
  };

  const handleCodingSubmit = () => {
    completeSubModule(moduleId as string, `practice-${moduleId}`);
    completeModule(moduleId as string);
    fireConfetti();
    const meme = getRandomMemes(moduleId as string, 1)[0];
    if (meme) gameApi.triggerMeme(meme.emoji, meme.caption);
    setCodingComplete(true);
  };

  const moduleBadgeMap: Record<string, string> = {
    M1: "workspace_master", M2: "pemikir_logis", M3: "penampung_data",
    M4: "pembuat_keputusan", M5: "master_loop", M6: "function_wizard",
    M7: "data_collector", M8: "junior_developer",
  };

  const currentBadgeId = moduleBadgeMap[moduleId as string];
  const badgeInfo = BADGES.find((b) => b.id === currentBadgeId);
  const practiceMemes = getRandomMemes(moduleId as string, 3);

  if (quizComplete || codingComplete) {
    return (
      <div className="section-container max-w-[600px] pt-8 text-center">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-card)]">
          <div className="flex justify-center mb-4">
            <Trophy size={64} color="var(--color-primary-500)" weight="fill" />
          </div>
          <h3 className="text-[1.375rem] font-extrabold text-[var(--text-primary)] mb-2">
            Latihan Selesai & Lulus!
          </h3>
          <p className="text-[var(--text-secondary)] text-[0.9375rem] mb-6">
            Kerja bagus! Kamu telah berhasil memecahkan tantangan pemrograman pada <strong>Modul {moduleId}</strong>.
          </p>

          {badgeInfo && (
            <div className="bg-[var(--bg-page-alt)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-4 mb-6 text-left flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                <BadgeIcon id={badgeInfo.id} color={badgeInfo.color} size={56} />
              </div>
              <div>
                <span className="text-[0.7rem] font-bold text-[var(--color-primary-500)] uppercase tracking-wide">
                  Badge Baru Unlocked!
                </span>
                <h4 className="text-[0.9375rem] font-extrabold text-[var(--text-primary)] my-0.5">
                  {badgeInfo.name}
                </h4>
                <p className="text-[0.75rem] text-[var(--text-secondary)] m-0">
                  {badgeInfo.description}
                </p>
              </div>
            </div>
          )}

          {practiceMemes.length > 0 && (
            <div className="space-y-3 mb-6">
              {practiceMemes.map((meme, i) => (
                <div key={meme.id} className="border-2 border-[var(--text-primary)] rounded-[var(--radius-md)] bg-black p-4 text-white font-bold text-[0.9rem] text-center" style={{ opacity: i === 0 ? 1 : 0.85 }}>
                  <div className="text-[1.5rem] mb-1">{meme.emoji}</div>
                  {meme.caption}
                </div>
              ))}
            </div>
          )}

          <div className="bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] px-4 py-3 rounded-[var(--radius-md)] text-[#15803D] font-bold text-[0.875rem] mb-6">
            ✨ +50 XP Poin Bonus & +15 XP Latihan didapatkan!
          </div>

          <button onClick={() => router.push("/dashboard")} className="btn btn-primary w-full">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container max-w-[800px] pt-4">
      {content.mode === "quiz" ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-xl)] p-6">
          <h2 className="text-[1.25rem] font-extrabold text-[var(--text-primary)] mb-4">
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
        <div className="flex flex-col gap-4" style={{ height: "calc(100vh - 200px)" }}>
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
