import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isMockFirebase, db } from "../firebase";
import { doc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export const LEVELS = [
  { name: "Script Kiddie", minXP: 0, maxXP: 99, icon: "🐣" },
  { name: "Code Padawan", minXP: 100, maxXP: 249, icon: "⚡" },
  { name: "Developer Muda", minXP: 250, maxXP: 499, icon: "💻" },
  { name: "Code Warrior", minXP: 500, maxXP: 799, icon: "⚔️" },
  { name: "Algorithm Master", minXP: 800, maxXP: 1099, icon: "🧠" },
  { name: "TRPL Legend", minXP: 1100, maxXP: Infinity, icon: "🏆" },
];

export const BADGES: BadgeInfo[] = [
  { id: "langkah_pertama", name: "Langkah Pertama", emoji: "👟", color: "#FF9D00", description: "Login pertama kali ke platform matrikulasi" },
  { id: "workspace_master", name: "Workspace Master", emoji: "📁", color: "#FF8C42", description: "Menyelesaikan Modul 1 tentang Dasar Komputer & Workspace Setup" },
  { id: "pemikir_logis", name: "Pemikir Logis", emoji: "⭐", color: "#FF6B00", description: "Menyelesaikan Modul 2 tentang Logika & Algoritma" },
  { id: "penampung_data", name: "Si Penampung Data", emoji: "📦", color: "#06B6D4", description: "Menyelesaikan Modul 3 tentang Variabel & Tipe Data" },
  { id: "pembuat_keputusan", name: "Pembuat Keputusan", emoji: "🔀", color: "#EF4444", description: "Menyelesaikan Modul 4 tentang Percabangan" },
  { id: "master_loop", name: "Master of Loop", emoji: "🔄", color: "#22C55E", description: "Menyelesaikan Modul 5 tentang Perulangan" },
  { id: "function_wizard", name: "Function Wizard", emoji: "🪄", color: "#D45900", description: "Menyelesaikan Modul 6 tentang Fungsi & Prosedur" },
  { id: "data_collector", name: "Data Collector", emoji: "📊", color: "#FF8C42", description: "Menyelesaikan Modul 7 tentang Array & List" },
  { id: "junior_developer", name: "Junior Developer", emoji: "⛑️", color: "#FF9D00", description: "Menyelesaikan Mini Project Akhir (Modul 8)" },
  { id: "graduated", name: "Matrikulasi Graduate", emoji: "🎓", color: "#FF6B00", description: "Menyelesaikan seluruh modul matrikulasi TRPL" },
  { id: "perfectionist", name: "Perfectionist", emoji: "💎", color: "#06B6D4", description: "Mendapatkan nilai sempurna 100% pada semua kuis" },
  { id: "speed_runner", name: "Speed Runner", emoji: "🚀", color: "#EF4444", description: "Menyelesaikan seluruh modul dalam waktu kurang dari 3 hari" },
  { id: "helping_hand", name: "Helping Hand", emoji: "🤝", color: "#22C55E", description: "Membantu 3 teman di forum diskusi" },
  { id: "early_bird", name: "Early Bird", emoji: "🐦", color: "#FF6B00", description: "Login sebelum jam 7 pagi" },
  { id: "night_owl", name: "Night Owl", emoji: "🦉", color: "#06B6D4", description: "Belajar setelah jam 10 malam" },
  { id: "perfect_streak_7", name: "7-Day Streak", emoji: "🔥", color: "#EF4444", description: "Belajar 7 hari berturut-turut" },
];

export interface BadgeInfo {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface LeaderboardUser {
  uid: string;
  name: string;
  avatar: string;
  xp: number;
  level: string;
}

const DEFAULT_MOCK_LEADERBOARD: LeaderboardUser[] = [
  { uid: "leader-1", name: "Reza TRPL", avatar: "avatar_1", xp: 1150, level: "TRPL Legend" },
  { uid: "leader-2", name: "Aditya Cipta", avatar: "avatar_2", xp: 950, level: "Algorithm Master" },
  { uid: "leader-3", name: "Siti Rahma", avatar: "avatar_3", xp: 820, level: "Algorithm Master" },
  { uid: "leader-4", name: "Robby Hermawan", avatar: "avatar_4", xp: 480, level: "Developer Muda" },
  { uid: "leader-5", name: "Amelia Putri", avatar: "avatar_5", xp: 310, level: "Developer Muda" },
];

interface PopupState {
  isOpen: boolean;
  badge: BadgeInfo | null;
}

interface LevelUpState {
  isOpen: boolean;
  oldLevel: string;
  newLevel: string;
}

interface MemeState {
  isOpen: boolean;
  memeUrl: string;
  caption: string;
}

interface GameState {
  leaderboard: LeaderboardUser[];
  badgePopup: PopupState;
  levelUpPopup: LevelUpState;
  memePopup: MemeState;
  dailyStreak: number;
  lastActiveDate: string | null;

  fetchLeaderboard: () => Promise<void>;
  triggerBadge: (badge: BadgeInfo) => void;
  triggerLevelUp: (oldLevel: string, newLevel: string) => void;
  triggerMeme: (memeUrl: string, caption: string) => void;
  closeBadgePopup: () => void;
  closeLevelUpPopup: () => void;
  closeMemePopup: () => void;
  checkDailyStreak: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      leaderboard: DEFAULT_MOCK_LEADERBOARD,
      badgePopup: { isOpen: false, badge: null },
      levelUpPopup: { isOpen: false, oldLevel: "", newLevel: "" },
      memePopup: { isOpen: false, memeUrl: "", caption: "" },
      dailyStreak: 0,
      lastActiveDate: null,

      fetchLeaderboard: async () => {
        if (isMockFirebase) return;
        try {
          const usersColl = collection(db, "users");
          const q = query(usersColl, orderBy("xp", "desc"), limit(20));
          const snapshot = await getDocs(q);
          const list: LeaderboardUser[] = [];
          snapshot.forEach((doc) => {
            const d = doc.data();
            list.push({ uid: d.uid || doc.id, name: d.name || "Anonymous", avatar: d.avatar || "avatar_default", xp: d.xp || 0, level: d.level || "Script Kiddie" });
          });
          set({ leaderboard: list });
        } catch {}
      },

      triggerBadge: (badge) => set({ badgePopup: { isOpen: true, badge } }),
      triggerLevelUp: (oldLevel, newLevel) => set({ levelUpPopup: { isOpen: true, oldLevel, newLevel } }),
      triggerMeme: (memeUrl, caption) => set({ memePopup: { isOpen: true, memeUrl, caption } }),
      closeBadgePopup: () => set({ badgePopup: { isOpen: false, badge: null } }),
      closeLevelUpPopup: () => set({ levelUpPopup: { isOpen: false, oldLevel: "", newLevel: "" } }),
      closeMemePopup: () => set({ memePopup: { isOpen: false, memeUrl: "", caption: "" } }),

      checkDailyStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const { lastActiveDate, dailyStreak } = get();
        if (lastActiveDate === today) return;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const newStreak = lastActiveDate === yesterday ? dailyStreak + 1 : 1;
        set({ dailyStreak: newStreak, lastActiveDate: today });
      },
    }),
    { name: "matrikulasi-game-storage" }
  )
);
