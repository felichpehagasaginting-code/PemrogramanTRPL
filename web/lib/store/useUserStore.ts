import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isMockFirebase, db, auth, googleProvider, signInWithPopup, getRedirectResult, signOut as fbSignOut } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const setAuthCookie = () => { document.cookie = "matrikulasi-auth=true; path=/; max-age=86400; SameSite=Lax"; };
const clearAuthCookie = () => { document.cookie = "matrikulasi-auth=; path=/; max-age=0"; };

const ADMIN_EMAILS = ["felich@mhs.cwe.ac.id", "felichpehagasa@gmail.com"];
export const isAdmin = (user: UserProfile | null): boolean => user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

export interface UserProgress {
  [moduleId: string]: {
    completedSubModules: string[];
    status: "locked" | "active" | "completed";
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: string;
  badges: string[];
  streak: number;
  progress: UserProgress;
}

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

const INITIAL_PROGRESS: UserProgress = {
  M0: { completedSubModules: [], status: "active" },
  M1: { completedSubModules: [], status: "locked" },
  M2: { completedSubModules: [], status: "locked" },
  M3: { completedSubModules: [], status: "locked" },
  M4: { completedSubModules: [], status: "locked" },
  M5: { completedSubModules: [], status: "locked" },
  M6: { completedSubModules: [], status: "locked" },
  M7: { completedSubModules: [], status: "locked" },
  M8: { completedSubModules: [], status: "locked" },
};

export const MODULE_KEYS = Object.keys(INITIAL_PROGRESS);

const DEFAULT_MOCK_LEADERBOARD: LeaderboardUser[] = [
  { uid: "leader-1", name: "Reza TRPL", avatar: "avatar_1", xp: 1150, level: "TRPL Legend" },
  { uid: "leader-2", name: "Aditya Cipta", avatar: "avatar_2", xp: 950, level: "Algorithm Master" },
  { uid: "leader-3", name: "Siti Rahma", avatar: "avatar_3", xp: 820, level: "Algorithm Master" },
  { uid: "leader-4", name: "Robby Hermawan", avatar: "avatar_4", xp: 480, level: "Developer Muda" },
  { uid: "leader-5", name: "Amelia Putri", avatar: "avatar_5", xp: 310, level: "Developer Muda" },
];

const getLevelName = (xp: number): string => {
  const lv = LEVELS.find((l) => xp >= l.minXP && xp <= l.maxXP);
  return lv ? lv.name : "Script Kiddie";
};

interface UserState {
  user: UserProfile | null;
  leaderboard: LeaderboardUser[];
  allUsers: UserProfile[];
  badgePopup: { isOpen: boolean; badge: BadgeInfo | null };
  levelUpPopup: { isOpen: boolean; oldLevel: string; newLevel: string };
  memePopup: { isOpen: boolean; memeUrl: string; caption: string };

  login: (name: string, email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  handleRedirectResult: () => Promise<boolean>;
  fetchLeaderboard: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  logout: () => void;
  addXP: (amount: number) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;
  completeSubModule: (moduleId: string, subModuleId: string) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  closeBadgePopup: () => void;
  closeLevelUpPopup: () => void;
  closeMemePopup: () => void;
  triggerMeme: (memeUrl: string, caption: string) => void;
  updateAvatar: (avatarId: string) => Promise<void>;
  syncUserToFirestore: () => Promise<void>;
  resetUserProgress: (uid: string) => Promise<void>;
  awardXP: (uid: string, amount: number) => Promise<void>;
  addUser: (data: { name: string; email: string; xp?: number; level?: string; badges?: string[]; streak?: number }) => Promise<void>;
  updateUser: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      const processFirebaseUser = async (fbUser: any) => {
        const uid = fbUser.uid;
        const userRef = doc(db, "users", uid);
        const tempProfile: UserProfile = {
          uid, name: fbUser.displayName || "Maba TRPL", email: fbUser.email || "",
          avatar: "avatar_default", xp: 0, level: "Script Kiddie",
          badges: ["langkah_pertama"], streak: 1, progress: INITIAL_PROGRESS,
        };
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            set({ user: userDoc.data() as UserProfile }); setAuthCookie();
          } else {
            await setDoc(userRef, tempProfile);
            set({ user: tempProfile }); setAuthCookie();
          }
          await get().fetchLeaderboard();
        } catch {
          console.warn("Firestore sync failed");
          set({ user: tempProfile }); setAuthCookie();
        }
      };

      return {
      user: null,
      leaderboard: DEFAULT_MOCK_LEADERBOARD,
      allUsers: [],
      badgePopup: { isOpen: false, badge: null },
      levelUpPopup: { isOpen: false, oldLevel: "", newLevel: "" },
      memePopup: { isOpen: false, memeUrl: "", caption: "" },

      login: async (name, email) => {
        const uid = `user-${Date.now()}`;
        const mockProfile: UserProfile = {
          uid, name, email, avatar: "avatar_default", xp: 0, level: "Script Kiddie",
          badges: ["langkah_pertama"], streak: 1, progress: INITIAL_PROGRESS,
        };
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              set({ user: userDoc.data() as UserProfile }); setAuthCookie();
            } else {
              await setDoc(userRef, mockProfile);
              set({ user: mockProfile }); setAuthCookie();
            }
            await get().fetchLeaderboard();
            return;
          } catch {}
        }
        set({ user: mockProfile }); setAuthCookie();
        await get().fetchLeaderboard();
      },

      loginWithGoogle: async () => {
        if (isMockFirebase) {
          await get().login("Budi Google Fallback", "budi.fallback@student.polsri.ac.id");
          return;
        }
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) await processFirebaseUser(result.user);
      },

      handleRedirectResult: async () => {
        try {
          const result = await getRedirectResult(auth);
          if (!result?.user) return false;
          await processFirebaseUser(result.user);
          return true;
        } catch { return false; }
      },

      fetchLeaderboard: async () => {
        if (isMockFirebase) return;
        try {
          const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(20));
          const snapshot = await getDocs(q);
          const list: LeaderboardUser[] = [];
          snapshot.forEach((doc) => {
            const d = doc.data();
            list.push({ uid: d.uid || doc.id, name: d.name || "Anonymous", avatar: d.avatar || "avatar_default", xp: d.xp || 0, level: d.level || "Script Kiddie" });
          });
          set({ leaderboard: list });
        } catch {}
      },

      fetchAllUsers: async () => {
        if (isMockFirebase) {
          const mockUsers: UserProfile[] = DEFAULT_MOCK_LEADERBOARD.map((lb) => ({
            uid: lb.uid, name: lb.name,
            email: `${lb.name.toLowerCase().replace(/\s/g, ".")}@student.polsri.ac.id`,
            avatar: lb.avatar, xp: lb.xp, level: lb.level,
            badges: (lb.xp > 800 ? BADGES.slice(0, 5) : BADGES.slice(0, 3)).map((b) => b.id),
            streak: Math.floor(Math.random() * 10) + 1,
            progress: Object.keys(INITIAL_PROGRESS).reduce((acc, key, idx) => {
              acc[key] = {
                completedSubModules: [],
                status: idx === 0 ? "completed" : lb.xp > idx * 100 ? "completed" : lb.xp > (idx - 1) * 100 ? "active" : "locked",
              } as any;
              return acc;
            }, {} as UserProgress),
          }));
          set({ allUsers: mockUsers });
          return;
        }
        try {
          const snapshot = await getDocs(collection(db, "users"));
          const list: UserProfile[] = [];
          snapshot.forEach((doc) => list.push(doc.data() as UserProfile));
          set({ allUsers: list });
        } catch {}
      },

      logout: () => {
        if (!isMockFirebase) fbSignOut(auth).catch(() => {});
        clearAuthCookie();
        set({ user: null });
      },

      addXP: async (amount) => {
        const { user } = get();
        if (!user) return;
        const newXP = user.xp + amount;
        const oldLevel = user.level;
        const newLevel = getLevelName(newXP);
        set({ user: { ...user, xp: newXP, level: newLevel } });
        if (oldLevel !== newLevel) set({ levelUpPopup: { isOpen: true, oldLevel, newLevel } });
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", user.uid), { xp: newXP, level: newLevel }); } catch {}
        }
      },

      unlockBadge: async (badgeId) => {
        const { user } = get();
        if (!user || user.badges.includes(badgeId)) return;
        const badge = BADGES.find((b) => b.id === badgeId);
        if (!badge) return;
        set({ user: { ...user, badges: [...user.badges, badgeId] }, badgePopup: { isOpen: true, badge } });
        get().addXP(50);
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", user.uid), { badges: [...user.badges, badgeId] }); } catch {}
        }
      },

      completeSubModule: async (moduleId, subModuleId) => {
        const { user } = get();
        if (!user) return;
        const currentModule = user.progress[moduleId] || { completedSubModules: [], status: "locked" as const };
        if (currentModule.completedSubModules.includes(subModuleId)) return;
        const updated = { ...user.progress, [moduleId]: { ...currentModule, completedSubModules: [...currentModule.completedSubModules, subModuleId] } };
        set({ user: { ...user, progress: updated } });
        await get().addXP(15);
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", user.uid), { progress: updated }); } catch {}
        }
      },

      completeModule: async (moduleId) => {
        const { user } = get();
        if (!user) return;
        const currentModule = user.progress[moduleId];
        if (!currentModule || currentModule.status === "completed") return;
        const updatedProgress = { ...user.progress };
        updatedProgress[moduleId] = { ...currentModule, status: "completed" };
        const idx = MODULE_KEYS.indexOf(moduleId);
        if (idx !== -1 && idx + 1 < MODULE_KEYS.length) {
          const nextId = MODULE_KEYS[idx + 1];
          if (updatedProgress[nextId]?.status === "locked") updatedProgress[nextId] = { ...updatedProgress[nextId], status: "active" };
        }
        set({ user: { ...user, progress: updatedProgress } });
        await get().addXP(50);
        const badgeMap: Record<string, string> = { M1: "workspace_master", M2: "pemikir_logis", M3: "penampung_data", M4: "pembuat_keputusan", M5: "master_loop", M6: "function_wizard", M7: "data_collector" };
        if (badgeMap[moduleId]) await get().unlockBadge(badgeMap[moduleId]);
        if (moduleId === "M8") { await get().unlockBadge("junior_developer"); await get().unlockBadge("graduated"); }
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", user.uid), { progress: updatedProgress }); } catch {}
        }
      },

      closeBadgePopup: () => set({ badgePopup: { isOpen: false, badge: null } }),
      closeLevelUpPopup: () => set({ levelUpPopup: { isOpen: false, oldLevel: "", newLevel: "" } }),
      closeMemePopup: () => set({ memePopup: { isOpen: false, memeUrl: "", caption: "" } }),
      triggerMeme: (memeUrl, caption) => set({ memePopup: { isOpen: true, memeUrl, caption } }),

      resetUserProgress: async (uid) => {
        const { allUsers } = get();
        set({ allUsers: allUsers.map((u) => u.uid === uid ? { ...u, xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"], progress: INITIAL_PROGRESS } : u) });
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", uid), { xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"], progress: INITIAL_PROGRESS }); } catch {}
        }
      },

      awardXP: async (uid, amount) => {
        const { allUsers } = get();
        const updated = allUsers.map((u) => {
          if (u.uid !== uid) return u;
          const newXP = u.xp + amount;
          return { ...u, xp: newXP, level: getLevelName(newXP) };
        });
        set({ allUsers: updated });
        if (!isMockFirebase) {
          try {
            const user = allUsers.find((u) => u.uid === uid);
            if (user) await updateDoc(doc(db, "users", uid), { xp: user.xp + amount, level: getLevelName(user.xp + amount) });
          } catch {}
        }
      },

      addUser: async (data) => {
        const uid = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newUser: UserProfile = {
          uid, name: data.name, email: data.email, avatar: "avatar_default",
          xp: data.xp ?? 0, level: data.level ?? getLevelName(data.xp ?? 0),
          badges: data.badges ?? ["langkah_pertama"], streak: data.streak ?? 1, progress: INITIAL_PROGRESS,
        };
        set((s) => ({ allUsers: [...s.allUsers, newUser] }));
        if (!isMockFirebase) {
          try { await setDoc(doc(db, "users", uid), newUser); } catch {}
        }
      },

      updateUser: async (uid, data) => {
        set((s) => ({ allUsers: s.allUsers.map((u) => u.uid === uid ? { ...u, ...data } : u) }));
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", uid), data); } catch {}
        }
      },

      deleteUser: async (uid) => {
        const { allUsers, leaderboard } = get();
        set({ allUsers: allUsers.filter((u) => u.uid !== uid), leaderboard: leaderboard.filter((u) => u.uid !== uid) });
        if (!isMockFirebase) {
          try { await deleteDoc(doc(db, "users", uid)); } catch {}
        }
      },

      updateAvatar: async (avatarId) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, avatar: avatarId } });
        if (!isMockFirebase) {
          try { await updateDoc(doc(db, "users", user.uid), { avatar: avatarId }); } catch {}
        }
      },

      syncUserToFirestore: async () => {
        const { user } = get();
        if (!user || isMockFirebase) return;
        try { await setDoc(doc(db, "users", user.uid), user, { merge: true }); } catch {}
      },
    }},
    { name: "matrikulasi-user-storage" }
  )
);
