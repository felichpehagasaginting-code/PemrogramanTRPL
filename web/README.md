# 💻 Web Application — Matrikulasi Pemrograman TRPL 2026

Aplikasi Next.js 16 (App Router) untuk platform pembelajaran pemrograman interaktif mahasiswa baru Teknologi Rekayasa Perangkat Lunak.

---

## ⚡ Perintah Penting (Commands)

```bash
# 1. Jalankan server development
npm run dev

# 2. Pengujian tipe data TypeScript
npx tsc --noEmit

# 3. Jalankan unit test (Vitest — 70 tests passed)
npm run test

# 4. Build produksi (Static Pre-rendering 54 Halaman)
npm run build
```

---

## 🚀 Fitur Unggulan Web Core

- **Pyodide WASM Engine**: Pengeksekusi Python 100% client-side di browser (`@/lib/pyodide/pyodideRunner.ts`).
- **PowerShell Lite 7.4 Terminal**: Terminal interaktif khas Windows PowerShell (`@/components/editor/PowerShellTerminal.tsx`).
- **Auto-Grader System**: Penguji koding otomatis (`@/lib/grader/autoGrader.ts`).
- **Visual Debugger**: Melacak nilai variabel memori RAM (`@/components/editor/VisualDebugger.tsx`).
- **AI Error Explainer**: Menerjemahkan error Python ke Bahasa Indonesia (`@/lib/ai/errorExplainer.ts`).
- **Parsons Problem**: Teka-teki susun blok kode acak (`@/components/learning/ParsonsProblem.tsx`).
- **Interactive SVG SkillTree**: Peta jalan kurikulum 2D interaktif (`@/components/learning/SkillTree.tsx`).
- **3D Podium Leaderboard**: Klasemen peringkat kelas (`@/app/(main)/leaderboard/page.tsx`).
- **Firestore Spark Plan Quota Optimizer**: Targeted realtime streaming, atomic single-write batching, dan multi-tab persistent cache (`@/lib/firebase.ts`, `@/lib/store/useUserStore.ts`).
- **Multi-Tier Role & Isolation Engine**: Creator, Staff HIMA, Peserta Maba 2026, dan isolasi otomatis penguji angkatan 2025.
- **Admin Analytics Dashboard**: Dashboard analitik & ekspor laporan PDF/CSV (`@/components/admin/AnalyticsDashboard.tsx`).
