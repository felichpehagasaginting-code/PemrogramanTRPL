import { NextRequest, NextResponse } from "next/server";

const DAILY_BONUS_XP = 10;
const STREAK_BONUS_THRESHOLD = 7;
const STREAK_BONUS_XP = 50;

interface StreakData {
  uid: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalDaysActive: number;
}

const streaks = new Map<string, StreakData>();

export async function POST(req: NextRequest) {
  try {
    const { uid, action } = await req.json();
    if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    let data = streaks.get(uid) || {
      uid,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
      totalDaysActive: 0,
    };

    if (action === "daily_login") {
      if (data.lastActiveDate === today) {
        return NextResponse.json({ message: "Already claimed today", ...data });
      }

      data.totalDaysActive += 1;

      if (data.lastActiveDate === yesterday) {
        data.currentStreak += 1;
      } else {
        data.currentStreak = 1;
      }

      if (data.currentStreak > data.longestStreak) {
        data.longestStreak = data.currentStreak;
      }

      data.lastActiveDate = today;
      streaks.set(uid, data);

      let bonusXP = DAILY_BONUS_XP;
      let messages = [`+${DAILY_BONUS_XP} XP for daily login`];

      if (data.currentStreak % STREAK_BONUS_THRESHOLD === 0) {
        bonusXP += STREAK_BONUS_XP;
        messages.push(`🔥 ${STREAK_BONUS_THRESHOLD}-day streak bonus: +${STREAK_BONUS_XP} XP`);
      }

      if (data.currentStreak >= 7 && !data.uid.includes("badge_7day")) {
        messages.push("🏆 Unlocked: 7-Day Streak badge!");
      }

      return NextResponse.json({
        xpAwarded: bonusXP,
        streak: data.currentStreak,
        longestStreak: data.longestStreak,
        messages,
      });
    }

    if (action === "check_streak") {
      const isActiveToday = data.lastActiveDate === today;
      const isStreakBroken = data.lastActiveDate !== today && data.lastActiveDate !== yesterday;

      return NextResponse.json({
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
        isActiveToday,
        isStreakBroken,
        totalDaysActive: data.totalDaysActive,
        timeUntilReset: isActiveToday
          ? `${24 - new Date().getHours()}h ${59 - new Date().getMinutes()}m`
          : null,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });

  const data = streaks.get(uid);
  return NextResponse.json(data || {
    uid, currentStreak: 0, longestStreak: 0,
    lastActiveDate: "", totalDaysActive: 0,
  });
}
