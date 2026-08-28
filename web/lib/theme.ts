export type ThemeFamily = "orange" | "purple" | "blue" | "emerald";
export type ThemeMode = "light" | "dark";

export interface Theme {
  family: ThemeFamily;
  mode: ThemeMode;
}

const STORAGE_KEY = "matrikulasi-theme";

const FAMILY_LABELS: Record<ThemeFamily, string> = { orange: "Orange", purple: "Ungu", blue: "Biru", emerald: "Zamrud" };
const FAMILY_ORDER: ThemeFamily[] = ["orange", "purple", "blue", "emerald"];
const MODE_ORDER: ThemeMode[] = ["light", "dark"];

export function getThemeLabel(family: ThemeFamily): string {
  return FAMILY_LABELS[family];
}

export function getNextFamily(family: ThemeFamily): ThemeFamily {
  const idx = FAMILY_ORDER.indexOf(family);
  return FAMILY_ORDER[(idx + 1) % FAMILY_ORDER.length];
}

export function getNextMode(mode: ThemeMode): ThemeMode {
  const idx = MODE_ORDER.indexOf(mode);
  return MODE_ORDER[(idx + 1) % MODE_ORDER.length];
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return { family: "purple", mode: "light" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && FAMILY_ORDER.includes(parsed.family) && MODE_ORDER.includes(parsed.mode)) {
        return parsed as Theme;
      }
    }
  } catch {}
  return { family: "purple", mode: "light" };
}

export const THEME_PALETTES: Record<ThemeFamily, { name: string; primary1: string; primary2: string }> = {
  orange: { name: "Orange", primary1: "#FF6B00", primary2: "#FF9D00" },
  purple: { name: "Ungu", primary1: "#7C3AED", primary2: "#A855F7" },
  blue: { name: "Biru", primary1: "#0284C7", primary2: "#38BDF8" },
  emerald: { name: "Zamrud", primary1: "#059669", primary2: "#10B981" },
};

export function updateFavicon(family: ThemeFamily): void {
  if (typeof document === "undefined") return;
  const palette = THEME_PALETTES[family] || THEME_PALETTES.orange;
  const c1 = palette.primary1;
  const c2 = palette.primary2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><path d="M11 11L6 16L11 21M21 11L26 16L21 21M18 9L14 23" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  const faviconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  const links = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
  if (links.length > 0) {
    links.forEach((l) => {
      l.type = "image/svg+xml";
      l.href = faviconUrl;
    });
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = faviconUrl;
    document.head.appendChild(link);
  }
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.family);
  root.classList.toggle("dark", theme.mode === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {}
  updateFavicon(theme.family);
}
