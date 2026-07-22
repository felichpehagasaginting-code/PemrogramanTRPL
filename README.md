# 🚀 Platform Matrikulasi Pemrograman TRPL 2026

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-WASM%20Pyodide-yellow?style=for-the-badge&logo=python)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange?style=for-the-badge&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Platform pembelajaran pemrograman interaktif, adaptif, dan tergamifikasi modern yang dirancang khusus untuk mahasiswa baru Program Studi **Teknologi Rekayasa Perangkat Lunak (TRPL) 2026**.

Dibangun menggunakan **Next.js 16 (App Router)**, **Pyodide WebAssembly (WASM)**, **Monaco Editor**, **PowerShell Lite Terminal Simulator**, **Auto-Grader**, dan **Firebase Suite**.

---

## 🌟 Fitur Utama & Sistem Unggulan

### 💻 1. Client-Side Python WASM Engine (Pyodide)
- Executing Python code 100% di browser pengguna berbasis WebAssembly (0ms latency).
- Bebas dari ketergantungan server backend eksternal dan aman dari sandbox escape.

### 🖥️ 2. PowerShell Lite 7.4 Terminal Simulator
- Terminal interaktif gaya **Windows PowerShell 7.4** (`PS D:\TRPL\Pemrograman>`).
- Mendukung eksekusi perintah CLI (`python main.py`, `cls`, `dir`, `ls`, `help`).
- **Interactive Scanner Input**: Mendukung input interaktif step-by-step untuk fungsi `input()` secara real-time di terminal console.

### 🎯 3. Adaptive VS Code Sandbox IDE
- Layout VS Code 100% dinamis dengan panel kontrol fleksibel:
  - Toggle Primary Sidebar (Left Explorer & Marketplace)
  - Toggle Bottom Panel (PowerShell Terminal)
  - Toggle Secondary Panel (Misi Sandbox & Help)
- **100% Responsive & Mobile Adaptive**: Tampilan sempurna pada rasio layar Smartphone (1080x2400) hingga Desktop 4K tanpa ada elemen yang terpotong.

### 🤖 4. Auto-Grader & Automated Submission Checker
- Penguji koding otomatis berbasis *Multi-Test-Case Verification* & *Structural Rule Check* (memeriksa keberadaan `for`, `while`, `def`, `return`).
- Penilaian transparan lengkap dengan skor kecocokan output.

### 🧠 5. Visual Execution Debugger & AI Error Explainer
- **Visual Debugger**: Melacak eksekusi variabel baris-demi-baris dengan pemantau memori RAM visual.
- **AI Error Explainer**: Menerjemahkan pesan error Python teknis menjadi penjelasan Bahasa Indonesia ramah maba beserta saran perbaikan langsung.

### 🧩 6. Parsons Problems (Teka-Teki Kode)
- Latihan menyusun blok kode acak dengan drag-and-drop dan pengontrol indentasi untuk mengasah logika dasar.

### 🗺️ 7. Interactive SVG Skill-Tree Roadmap
- Peta jalan kurikulum 2D interaktif berbasis SVG grafis yang menghubungkan modul **M0 hingga M8**.
- Dilengkapi **Module Preview Drawer** untuk melihat estimasi waktu, reward XP, slide materi, dan teaser kuis.

### 🏆 8. Gamifikasi & Dynamic 3D Leaderboard
- **Podium 3D Leaderboard**: Tampilan podium kelas dengan efek berkilau untuk peringkat 3 besar.
- **Avatar Customizer**: Ubah avatar profil dan kumpulkan 13 badge prestasi eksklusif.
- **Meme Widget & Daily Streak**: Meme pemrograman kontekstual yang muncul secara dinamis saat kuis dan latihan selesai.

### 📊 9. Admin Dashboard & Report Exporter
- Dashboard analitik khusus pengajar/dosen untuk memantau statistik kelulusan mahasiswa, distribusi nilai, dan fitur ekspor laporan ke format **CSV & PDF**.

---

## 📚 Kurikulum Modul Matrikulasi TRPL 2026

| Modul | Judul Modul | Estimasi Waktu | Reward XP | Topik Utama |
|---|---|---|---|---|
| **M0** | Pre-Test & Orientasi | 15 Menit | 50 XP | Pemetaan awal & pengenalan TRPL |
| **M1** | Dasar Komputer & Workspace | 30 Menit | 100 XP | File system, path, VS Code setup |
| **M2** | Logika & Algoritma | 40 Menit | 100 XP | Flowchart & Pseudocode |
| **M3** | Variabel & Tipe Data | 45 Menit | 120 XP | Integer, float, string, casting |
| **M4** | Percabangan (If-Else) | 50 Menit | 150 XP | Logic conditions & nested if |
| **M5** | Perulangan (Loops) | 55 Menit | 150 XP | `for` loop, `while` loop, `range()` |
| **M6** | Fungsi & Prosedur | 60 Menit | 180 XP | Modular code (`def`) & `return` |
| **M7** | Array & List Data | 60 Menit | 200 XP | Struktur data list & iterasi |
| **M8** | Mini Project Akhir | 90 Menit | 300 XP | Aplikasi Kalkulator / Sistem Kasir |

---

## 🛠️ Teknologi & Arsitektur

### Core Stack
- **Framework**: Next.js 16 (App Router, Turbopack, SSG static pre-rendering)
- **Language**: TypeScript 5.0
- **Execution Engine**: Pyodide WebAssembly (Client-Side WASM Python 3.11)
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Icons & Animation**: `@phosphor-icons/react`, `framer-motion`, `canvas-confetti`
- **Database & Auth**: Firebase Authentication & Firestore Cloud Database

### Automated Quality Assurance
- **Unit Testing**: Vitest test runner (`npm run test`)
- **Static Type Safety**: `npx tsc --noEmit` (0 errors)
- **CI/CD Pipeline**: GitHub Actions workflow (`.github/workflows/ci.yml`)

---

## 📂 Struktur Repositori

```
PemrogramanTRPL/
├── .github/
│   └── workflows/ci.yml       # Automated CI testing pipeline
├── docs/                      # PRD & Arsitektur dokumentasi
├── firestore.rules            # Aturan keamanan database Firestore
└── web/                       # Aplikasi Utama Next.js
    ├── app/                   # Next.js App Router Pages
    │   ├── (auth)/            # Login & Registrasi
    │   ├── (main)/            # Dashboard, Learn, Sandbox, Leaderboard, Admin, Profile
    │   └── api/               # API Routes (Run-code, Gamification)
    ├── components/
    │   ├── admin/             # Analytics Dashboard & PDF Exporter
    │   ├── editor/            # Monaco Editor, PowerShellTerminal, CodeDiffViewer, VisualDebugger
    │   ├── landing/           # Hero Sandbox, Cyber Background, XP Calculator, FAQ, CTA
    │   ├── learning/          # SkillTree, ParsonsProblem, QuizEngine
    │   ├── profile/           # AvatarCustomizer
    │   └── ui/                # Audio Web FX, Floating XP, GlassSkeleton
    ├── lib/
    │   ├── ai/                # AI Error Explainer
    │   ├── grader/            # Auto-Grader Engine
    │   ├── pyodide/           # Pyodide WASM Client Runner
    │   └── store/             # Zustand Game & User Progress Store
    └── __tests__/             # Suite Pengujian Unit
```

---

## ⚡ Panduan Memulai (Quick Start)

### Prerequisites
- Node.js `v18.0.0` atau lebih baru
- npm `v9.0.0` atau lebih baru

### Langkah Instalasi & Pengecekan

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/felichpehagasaginting-code/PemrogramanTRPL.git
   cd PemrogramanTRPL/web
   ```

2. **Instal Dependencies**:
   ```bash
   npm install
   ```

3. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser Anda.

4. **Verifikasi Build Production**:
   ```bash
   npm run build
   ```

5. **Jalankan Suite Pengujian Unit**:
   ```bash
   npm run test
   ```

---

## 📜 Lisensi & Kontribusi

Proyek ini dikembangkan oleh **Divisi Pemrograman HIMA TRPL** untuk Kegiatan Matrikulasi Mahasiswa Baru Teknologi Rekayasa Perangkat Lunak 2026.

Dilisensikan di bawah [MIT License](LICENSE).
