import { create } from "zustand";
import { isMockFirebase, db } from "../firebase";
import { doc, setDoc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { UserProfile } from "./useAuthStore";
import { LEVELS } from "./useGameStore";

interface AdminState {
  allUsers: UserProfile[];
  isLoading: boolean;

  fetchAllUsers: () => Promise<void>;
  addUser: (data: { name: string; email: string; xp?: number }) => Promise<void>;
  updateUser: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  resetUserProgress: (uid: string) => Promise<void>;
  awardXP: (uid: string, amount: number) => Promise<void>;
}

const getLevelName = (xp: number): string => {
  const lv = LEVELS.find((l) => xp >= l.minXP && xp <= l.maxXP);
  return lv ? lv.name : "Script Kiddie";
};

const INITIAL_PROGRESS = {
  M0: { completedSubModules: [], status: "active" as const },
  M1: { completedSubModules: [], status: "locked" as const },
  M2: { completedSubModules: [], status: "locked" as const },
  M3: { completedSubModules: [], status: "locked" as const },
  M4: { completedSubModules: [], status: "locked" as const },
  M5: { completedSubModules: [], status: "locked" as const },
  M6: { completedSubModules: [], status: "locked" as const },
  M7: { completedSubModules: [], status: "locked" as const },
  M8: { completedSubModules: [], status: "locked" as const },
};

export const useAdminStore = create<AdminState>()((set, get) => ({
  allUsers: [],
  isLoading: false,

  fetchAllUsers: async () => {
    if (isMockFirebase) return;
    set({ isLoading: true });
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const list: UserProfile[] = [];
      snapshot.forEach((doc) => list.push(doc.data() as UserProfile));
      set({ allUsers: list, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addUser: async (data) => {
    const uid = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newUser: UserProfile = {
      uid, name: data.name, email: data.email, avatar: "avatar_default",
      xp: data.xp ?? 0, level: getLevelName(data.xp ?? 0),
      badges: ["langkah_pertama"], streak: 1, progress: INITIAL_PROGRESS,
    };
    set((s) => ({ allUsers: [...s.allUsers, newUser] }));
    if (!isMockFirebase) {
      try { await setDoc(doc(db, "users", uid), newUser); } catch {}
    }
  },

  updateUser: async (uid, data) => {
    set((s) => ({ allUsers: s.allUsers.map((u) => (u.uid === uid ? { ...u, ...data } : u)) }));
    if (!isMockFirebase) {
      try { await updateDoc(doc(db, "users", uid), data); } catch {}
    }
  },

  deleteUser: async (uid) => {
    set((s) => ({ allUsers: s.allUsers.filter((u) => u.uid !== uid) }));
    if (!isMockFirebase) {
      try { await deleteDoc(doc(db, "users", uid)); } catch {}
    }
  },

  resetUserProgress: async (uid) => {
    const reset: Partial<UserProfile> = {
      xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"], progress: INITIAL_PROGRESS,
    };
    set((s) => ({ allUsers: s.allUsers.map((u) => (u.uid === uid ? { ...u, ...reset } : u)) }));
    if (!isMockFirebase) {
      try { await updateDoc(doc(db, "users", uid), reset); } catch {}
    }
  },

  awardXP: async (uid, amount) => {
    set((s) => ({
      allUsers: s.allUsers.map((u) => {
        if (u.uid !== uid) return u;
        const newXP = u.xp + amount;
        return { ...u, xp: newXP, level: getLevelName(newXP) };
      }),
    }));
    if (!isMockFirebase) {
      try {
        const user = get().allUsers.find((u) => u.uid === uid);
        if (user) {
          const newXP = user.xp + amount;
          await updateDoc(doc(db, "users", uid), { xp: newXP, level: getLevelName(newXP) });
        }
      } catch {}
    }
  },
}));
