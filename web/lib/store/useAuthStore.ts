import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isMockFirebase, db, auth, googleProvider, signInWithPopup, getRedirectResult, signOut as fbSignOut } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

export interface UserProgress {
  [moduleId: string]: {
    completedSubModules: string[];
    status: "locked" | "active" | "completed";
  };
}

const ADMIN_EMAILS = ["felich@mhs.cwe.ac.id", "felichpehagasa@gmail.com"];
export const isAdmin = (user: UserProfile | null): boolean => user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

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

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  login: (name: string, email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  handleRedirectResult: () => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  setUser: (user: UserProfile | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (name, email) => {
        set({ isLoading: true, error: null });
        try {
          const uid = `user-${Date.now()}`;
          const profile: UserProfile = {
            uid, name, email, avatar: "avatar_default",
            xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"],
            streak: 1, progress: INITIAL_PROGRESS,
          };
          if (!isMockFirebase) {
            const userRef = doc(db, "users", uid);
            const exists = await getDoc(userRef);
            if (exists.exists()) {
              set({ user: exists.data() as UserProfile, isLoading: false });
              return;
            }
            await setDoc(userRef, profile);
          }
          set({ user: profile, isLoading: false });
        } catch (e) {
          set({ error: "Gagal login. Silakan coba lagi.", isLoading: false });
        }
      },

      loginWithGoogle: async () => {
        if (isMockFirebase) {
          await get().login("Budi Google Fallback", "budi.fallback@student.polsri.ac.id");
          return;
        }
        set({ isLoading: true });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (!result.user) return;
          const fbUser = result.user;
          const uid = fbUser.uid;
          const userRef = doc(db, "users", uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            set({ user: userDoc.data() as UserProfile, isLoading: false });
          } else {
            const profile: UserProfile = {
              uid, name: fbUser.displayName || "Maba TRPL",
              email: fbUser.email || "", avatar: "avatar_default",
              xp: 0, level: "Script Kiddie", badges: ["langkah_pertama"],
              streak: 1, progress: INITIAL_PROGRESS,
            };
            await setDoc(userRef, profile);
            set({ user: profile, isLoading: false });
          }
        } catch (e) {
          set({ error: "Gagal login dengan Google.", isLoading: false });
        }
      },

      handleRedirectResult: async () => {
        try {
          const result = await getRedirectResult(auth);
          if (!result?.user) return false;
          const fbUser = result.user;
          const uid = fbUser.uid;
          const userRef = doc(db, "users", uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            set({ user: userDoc.data() as UserProfile });
          }
          return true;
        } catch {
          return false;
        }
      },

      logout: () => {
        if (!isMockFirebase) fbSignOut(auth).catch(() => {});
        set({ user: null });
      },

      updateUser: (data) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...data } });
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    { name: "matrikulasi-auth-storage" }
  )
);
