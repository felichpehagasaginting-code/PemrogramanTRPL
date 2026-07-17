export type ThemeFamily = "orange" | "purple";
export type ThemeMode = "light" | "dark";

export interface Theme {
  family: ThemeFamily;
  mode: ThemeMode;
}

const STORAGE_KEY = "matrikulasi-theme";

const FAMILY_LABELS: Record<ThemeFamily, string> = { orange: "Orange", purple: "Ungu" };
const FAMILY_ORDER: ThemeFamily[] = ["orange", "purple"];
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

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.family);
  root.classList.toggle("dark", theme.mode === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {}
}
