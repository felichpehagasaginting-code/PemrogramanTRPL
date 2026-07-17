export interface FeatureInfo {
  id: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
  emoji: string;
}

const STORAGE_KEY = "matrikulasi-feature-dismissed";

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setDismissed(ids: string[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
}

export function isFeatureDismissed(id: string): boolean {
  return getDismissed().includes(id);
}

export function dismissFeature(id: string) {
  const list = getDismissed();
  if (!list.includes(id)) setDismissed([...list, id]);
}

export const LANDING_FEATURES: FeatureInfo[] = [
  {
    id: "sandbox-online",
    title: "Coding Langsung di Browser",
    description: "Gak perlu install Python — langsung coding + run di VS Code Sandbox built-in!",
    cta: "Coba Sandbox",
    href: "/sandbox",
    emoji: "💻",
  },
  {
    id: "leaderboard-compete",
    title: "Bersaing dengan Teman",
    description: "SetiapXP yang kamu kumpulin masuk ke leaderboard — siapa jadi Legend TRPL?",
    cta: "Lihat Papan Skor",
    href: "/leaderboard",
    emoji: "🏆",
  },
  {
    id: "badge-collection",
    title: "Koleksi Badge Eksklusif",
    description: "Selesaikan modul, raih streak, buka 16 badge rahasia. Semakin rajin, semakin banyak!",
    cta: "Lihat Badge",
    href: "/profile",
    emoji: "🎖️",
  },
];

export const DASHBOARD_FEATURES: FeatureInfo[] = [
  {
    id: "practice-quiz",
    title: "Latihan + Quiz Interaktif",
    description: "Setiap modul ada latihan praktik dan quiz — feedback langsung, nilai keluar otomatis.",
    cta: "Coba Latihan",
    emoji: "✏️",
  },
  {
    id: "streak-tracker",
    title: "Streak Harian",
    description: "Login tiap hari buat jaga streak — 7 hari streak bonus 50 XP!",
    cta: "Jaga Streak",
    emoji: "🔥",
  },
];

export const PROFILE_FEATURES: FeatureInfo[] = [
  {
    id: "avatar-custom",
    title: "Avatar & Badge",
    description: "Ganti avatar, lihat badge yang udah kamu buka, dan lacak progress modul.",
    cta: "Explore",
    emoji: "🎨",
  },
];

export const SANDBOX_FEATURES: FeatureInfo[] = [
  {
    id: "python-exec",
    title: "Python di Browser",
    description: "Tulis dan jalankan kode Python langsung — gak perlu install apa-apa!",
    cta: "Coba Coding",
    emoji: "🐍",
  },
];

export const LEADERBOARD_FEATURES: FeatureInfo[] = [
  {
    id: "top-rank",
    title: "Naik ke Puncak",
    description: "Kumpulin XP lewat quiz dan latihan buat naikin peringkat kamu!",
    cta: "Mulai Belajar",
    href: "/dashboard",
    emoji: "📈",
  },
];

export const POINTING_FEATURES = {
  themeToggle: {
    id: "theme-toggle-pointer",
    targetSelector: "[data-theme-toggle]",
    title: "Ganti Tema",
    description: "Klik di sini buat ganti tema Orange / Ungu, atau mode Terang / Gelap!",
    emoji: "🎨",
  },
  moduleStart: {
    id: "module-start-pointer",
    targetSelector: ".module-card-inner",
    title: "Mulai Belajar",
    description: "Klik modul di atas untuk memulai petualangan coding-mu!",
    emoji: "🚀",
  },
};

export const LOGIN_FEATURES: FeatureInfo[] = [
  {
    id: "welcome-intro",
    title: "Selamat Datang!",
    description: "Platform belajar coding interaktif untuk Mahasiswa TRPL. Daftar atau login untuk mulai!",
    cta: "Mulai",
    emoji: "👋",
  },
];
