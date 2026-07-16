import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isMockFirebase, db, auth, googleProvider, signInWithPopup, getRedirectResult, signOut as fbSignOut } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export const ADMIN_NAME = "Felich Pehagasa Ginting";
export const isAdmin = (user: UserProfile | null): boolean => user?.name === ADMIN_NAME;

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

const getLevelName = (xp: number): string => {
  const lv = LEVELS.find((l) => xp >= l.minXP && xp <= l.maxXP);
  return lv ? lv.name : "Script Kiddie";
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => {
      const processFirebaseUser = async (fbUser: any) => {
        const uid = fbUser.uid;
        const userRef = doc(db, "users", uid);
        const tempProfile: UserProfile = {
          uid,
          name: fbUser.displayName || "Maba TRPL",
          email: fbUser.email || "",
          avatar: "avatar_default",
          xp: 0,
          level: "Script Kiddie",
          badges: ["langkah_pertama"],
          streak: 1,
          progress: INITIAL_PROGRESS,
        };

        try {
          const firestorePromise = getDoc(userRef).then(async (userDoc) => {
            if (userDoc.exists()) {
              set({ user: userDoc.data() as UserProfile });
            } else {
              await setDoc(userRef, tempProfile);
              set({ user: tempProfile });
            }
          });

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Firestore timeout")), 2500)
          );

          await Promise.race([firestorePromise, timeoutPromise]);
          await get().fetchLeaderboard();
        } catch (fsError) {
          console.warn("Firestore sync failed or timed out, using local profile:", fsError);
          set({ user: tempProfile });
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
          uid,
          name,
          email,
          avatar: "avatar_default",
          xp: 0,
          level: "Script Kiddie",
          badges: ["langkah_pertama"],
          streak: 1,
          progress: INITIAL_PROGRESS,
        };

        // Sync with Firestore if active
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            
            const firestorePromise = getDoc(userRef).then(async (userDoc) => {
              if (userDoc.exists()) {
                set({ user: userDoc.data() as UserProfile });
              } else {
                await setDoc(userRef, mockProfile);
                set({ user: mockProfile });
              }
            });

            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Firestore timeout")), 2500)
            );

            await Promise.race([firestorePromise, timeoutPromise]);
            await get().fetchLeaderboard();
            return;
          } catch (e) {
            console.error("Firebase write failed, using local mock storage", e);
          }
        }

        set({ user: mockProfile });
        await get().fetchLeaderboard();
      },

      loginWithGoogle: async () => {
        if (isMockFirebase) {
          await get().login("Budi Google Fallback", "budi.fallback@student.polsri.ac.id");
          return;
        }
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        if (!fbUser) return;
        await processFirebaseUser(fbUser);
      },

      handleRedirectResult: async () => {
        try {
          const result = await getRedirectResult(auth);
          if (!result || !result.user) return false;
          await processFirebaseUser(result.user);
          return true;
        } catch (e) {
          console.error("Redirect result error:", e);
          return false;
        }
      },

      fetchLeaderboard: async () => {
        if (isMockFirebase) return;
        try {
          const usersColl = collection(db, "users");
          const q = query(usersColl, orderBy("xp", "desc"), limit(20));
          const querySnapshot = await getDocs(q);
          const leaderboardList: LeaderboardUser[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboardList.push({
              uid: data.uid || doc.id,
              name: data.name || "Anonymous",
              avatar: data.avatar || "avatar_default",
              xp: data.xp || 0,
              level: data.level || "Script Kiddie",
            });
          });
          set({ leaderboard: leaderboardList });
        } catch (e) {
          console.error("Failed to fetch leaderboard from Firestore", e);
        }
      },

      fetchAllUsers: async () => {
        if (isMockFirebase) {
          const mockUsers: UserProfile[] = DEFAULT_MOCK_LEADERBOARD.map((lb) => ({
            uid: lb.uid,
            name: lb.name,
            email: `${lb.name.toLowerCase().replace(/\s/g, ".")}@student.polsri.ac.id`,
            avatar: lb.avatar,
            xp: lb.xp,
            level: lb.level,
            badges: (lb.xp > 800 ? BADGES.slice(0, 5) : BADGES.slice(0, 3)).map((b) => b.id),
            streak: Math.floor(Math.random() * 10) + 1,
            progress: Object.keys(INITIAL_PROGRESS).reduce((acc, key, idx) => {
              const moduleKeys = Object.keys(INITIAL_PROGRESS);
              const completed = moduleKeys.filter((_, i) => i < idx && lb.xp > (i + 1) * 100);
              acc[key] = {
                completedSubModules: completed.slice(0, 2).map((_, i) => `sub-${i}`),
                status: idx === 0 ? "completed" : lb.xp > idx * 100 ? "completed" : lb.xp > (idx - 1) * 100 ? "active" : "locked",
              } as any;
              return acc;
            }, {} as UserProgress),
          }));
          set({ allUsers: mockUsers });
          return;
        }
        try {
          const usersColl = collection(db, "users");
          const querySnapshot = await getDocs(usersColl);
          const userList: UserProfile[] = [];
          querySnapshot.forEach((doc) => {
            userList.push(doc.data() as UserProfile);
          });
          set({ allUsers: userList });
        } catch (e) {
          console.error("Failed to fetch all users", e);
        }
      },

      logout: () => {
        if (!isMockFirebase) {
          fbSignOut(auth).catch((e) => console.error("Firebase logout failed", e));
        }
        set({ user: null });
      },

      addXP: async (amount) => {
        const { user } = get();
        if (!user) return;

        const newXP = user.xp + amount;
        const oldLevel = user.level;
        const newLevel = getLevelName(newXP);
        
        const updatedUser: UserProfile = {
          ...user,
          xp: newXP,
          level: newLevel,
        };

        set({ user: updatedUser });

        // Trigger level up popup if level changed
        if (oldLevel !== newLevel) {
          set({ levelUpPopup: { isOpen: true, oldLevel, newLevel } });
        }

        // Sync with Firestore if active
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { xp: newXP, level: newLevel });
            await get().fetchLeaderboard();
          } catch (e) {
            console.error("Firestore update failed", e);
          }
        }
      },

      unlockBadge: async (badgeId) => {
        const { user } = get();
        if (!user || user.badges.includes(badgeId)) return;

        const badge = BADGES.find((b) => b.id === badgeId) || null;
        if (!badge) return;

        const updatedUser: UserProfile = {
          ...user,
          badges: [...user.badges, badgeId],
        };

        set({ 
          user: updatedUser,
          badgePopup: { isOpen: true, badge }
        });

        // Add bonus XP (e.g., 50 XP per badge)
        get().addXP(50);

        // Sync with Firestore if active
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { badges: updatedUser.badges });
          } catch (e) {
            console.error("Firestore update failed", e);
          }
        }
      },

      completeSubModule: async (moduleId, subModuleId) => {
        const { user } = get();
        if (!user) return;

        const currentModule = user.progress[moduleId] || { completedSubModules: [], status: "locked" };
        
        if (currentModule.completedSubModules.includes(subModuleId)) return;

        const updatedSubModules = [...currentModule.completedSubModules, subModuleId];
        
        const updatedProgress = {
          ...user.progress,
          [moduleId]: {
            ...currentModule,
            completedSubModules: updatedSubModules,
          },
        };

        const updatedUser = {
          ...user,
          progress: updatedProgress,
        };

        set({ user: updatedUser });

        // Award 15 XP for sub-module completion
        get().addXP(15);

        // Sync with Firestore if active
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { progress: updatedProgress });
          } catch (e) {
            console.error("Firestore update failed", e);
          }
        }
      },

      completeModule: async (moduleId) => {
        const { user } = get();
        if (!user) return;

        const currentModule = user.progress[moduleId];
        if (!currentModule || currentModule.status === "completed") return;

        // Mark current as completed
        const updatedProgress = { ...user.progress };
        updatedProgress[moduleId] = {
          ...currentModule,
          status: "completed",
        };

        // Unlock next module in the sequence (e.g., M0 -> M1 -> M2...)
        const moduleKeys = Object.keys(INITIAL_PROGRESS);
        const currentIndex = moduleKeys.indexOf(moduleId);
        if (currentIndex !== -1 && currentIndex + 1 < moduleKeys.length) {
          const nextModuleId = moduleKeys[currentIndex + 1];
          const nextModule = updatedProgress[nextModuleId];
          if (nextModule && nextModule.status === "locked") {
            updatedProgress[nextModuleId] = {
              ...nextModule,
              status: "active",
            };
          }
        }

        const updatedUser = {
          ...user,
          progress: updatedProgress,
        };

        set({ user: updatedUser });

        // Award 50 XP for module completion
        await get().addXP(50);

        // Check for module-specific badge unlocks
        if (moduleId === "M1") await get().unlockBadge("workspace_master");
        if (moduleId === "M2") await get().unlockBadge("pemikir_logis");
        if (moduleId === "M3") await get().unlockBadge("penampung_data");
        if (moduleId === "M4") await get().unlockBadge("pembuat_keputusan");
        if (moduleId === "M5") await get().unlockBadge("master_loop");
        if (moduleId === "M6") await get().unlockBadge("function_wizard");
        if (moduleId === "M7") await get().unlockBadge("data_collector");
        if (moduleId === "M8") {
          await get().unlockBadge("junior_developer");
          await get().unlockBadge("graduated");
        }

        // Sync with Firestore if active
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { progress: updatedProgress });
          } catch (e) {
            console.error("Firestore update failed", e);
          }
        }
      },

      closeBadgePopup: () => set({ badgePopup: { isOpen: false, badge: null } }),
      closeLevelUpPopup: () => set({ levelUpPopup: { isOpen: false, oldLevel: "", newLevel: "" } }),
      closeMemePopup: () => set({ memePopup: { isOpen: false, memeUrl: "", caption: "" } }),
      
      triggerMeme: (memeUrl, caption) => set({ memePopup: { isOpen: true, memeUrl, caption } }),

      resetUserProgress: async (uid) => {
        const { allUsers } = get();
        const updated = allUsers.map((u) =>
          u.uid === uid ? { ...u, xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"], progress: INITIAL_PROGRESS } : u
        );
        set({ allUsers: updated });
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"], progress: INITIAL_PROGRESS });
          } catch (e) {
            console.error("Failed to reset user", e);
          }
        }
      },

      awardXP: async (uid, amount) => {
        const { allUsers } = get();
        const updated = allUsers.map((u) => {
          if (u.uid !== uid) return u;
          const newXP = u.xp + amount;
          const newLevel = getLevelName(newXP);
          return { ...u, xp: newXP, level: newLevel };
        });
        set({ allUsers: updated });
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            const user = allUsers.find((u) => u.uid === uid);
            if (user) {
              const newXP = user.xp + amount;
              await updateDoc(userRef, { xp: newXP, level: getLevelName(newXP) });
            }
          } catch (e) {
            console.error("Failed to award XP", e);
          }
        }
      },

      addUser: async (data) => {
        const uid = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newUser: UserProfile = {
          uid,
          name: data.name,
          email: data.email,
          avatar: "avatar_default",
          xp: data.xp ?? 0,
          level: data.level ?? getLevelName(data.xp ?? 0),
          badges: data.badges ?? ["langkah_pertama"],
          streak: data.streak ?? 1,
          progress: INITIAL_PROGRESS,
        };
        const { allUsers } = get();
        set({ allUsers: [...allUsers, newUser] });
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, newUser);
          } catch (e) {
            console.error("Firestore addUser failed", e);
          }
        }
      },

      updateUser: async (uid, data) => {
        const { allUsers } = get();
        const updated = allUsers.map((u) =>
          u.uid === uid ? { ...u, ...data } : u
        );
        set({ allUsers: updated });
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, data);
          } catch (e) {
            console.error("Firestore updateUser failed", e);
          }
        }
      },

      deleteUser: async (uid) => {
        const { allUsers } = get();
        set({ allUsers: allUsers.filter((u) => u.uid !== uid) });
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { deleted: true });
          } catch (e) {
            console.error("Firestore deleteUser failed", e);
          }
        }
      },

      updateAvatar: async (avatarId) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, avatar: avatarId } });
        if (!isMockFirebase) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { avatar: avatarId });
          } catch (e) {
            console.error("Firestore avatar sync failed", e);
          }
        }
      },

      syncUserToFirestore: async () => {
        const { user } = get();
        if (!user || isMockFirebase) return;
        try {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, user, { merge: true });
        } catch (e) {
          console.error("Firestore sync failed", e);
        }
      },
    };
  },
  {
    name: "matrikulasi-user-storage",
  }
  )
);
