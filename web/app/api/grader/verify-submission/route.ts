import { NextResponse } from "next/server";

// Server-side module reward & XP registry
const MODULE_XP_REWARDS: Record<string, { xp: number; badgeId?: string }> = {
  M0: { xp: 50, badgeId: "badge-pretest" },
  M1: { xp: 100, badgeId: "badge-terminal-master" },
  M2: { xp: 100, badgeId: "badge-logic-pioneer" },
  M3: { xp: 120, badgeId: "badge-var-wizard" },
  M4: { xp: 150, badgeId: "badge-branch-navigator" },
  M5: { xp: 150, badgeId: "badge-loop-conqueror" },
  M6: { xp: 180, badgeId: "badge-func-architect" },
  M7: { xp: 200, badgeId: "badge-list-sorcerer" },
  M8: { xp: 300, badgeId: "badge-grandmaster-trpl" },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { moduleId, scorePercentage, passed } = body;

    if (!moduleId || !MODULE_XP_REWARDS[moduleId]) {
      return NextResponse.json(
        { error: "Modul ID tidak valid." },
        { status: 400 }
      );
    }

    if (!passed || scorePercentage < 80) {
      return NextResponse.json({
        verified: false,
        earnedXp: 0,
        message: "Submission belum mencapai ambang batas kelulusan (minimal 80%).",
      });
    }

    const config = MODULE_XP_REWARDS[moduleId];
    // Calculate verified XP scaled with score
    const earnedXp = Math.round(config.xp * (Math.min(100, Math.max(80, scorePercentage)) / 100));

    return NextResponse.json({
      verified: true,
      moduleId,
      earnedXp,
      badgeAwarded: config.badgeId,
      message: "Selamat! Submission terverifikasi oleh sistem.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal memverifikasi submission." },
      { status: 500 }
    );
  }
}
