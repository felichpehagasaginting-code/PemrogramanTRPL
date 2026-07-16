# 🎨 Design Document
## Matrikulasi TRPL – UI/UX & Arsitektur Informasi

---

## Daftar Isi

1. [Filosofi Desain](#1-filosofi-desain)
2. [Moodboard & Style Guide](#2-moodboard--style-guide)
3. [Arsitektur Informasi](#3-arsitektur-informasi)
4. [Wireframe Naratif](#4-wireframe-naratif)
5. [Interaksi & Micro-Animation](#5-interaksi--micro-animation)
6. [Panduan Meme](#6-panduan-meme)
7. [Design Tokens](#7-design-tokens)
8. [Responsivitas](#8-responsivitas)

---

## 1. Filosofi Desain

Platform Matrikulasi TRPL dirancang dengan filosofi **"Belajar Itu Asik, Beneran"**:

- **Playful but Purposeful**: Visual yang fun tidak boleh mengorbankan kejelasan informasi.
- **Progressive Disclosure**: Tampilkan informasi secukupnya, jangan banjiri user sekaligus.
- **Reward-Driven**: Setiap aksi positif langsung mendapat feedback visual yang memuaskan.
- **Inclusive by Default**: Desain yang bisa diakses semua orang, termasuk yang baru pertama kali pegang laptop.

---

## 2. Moodboard & Style Guide

### 2.1 Palet Warna Utama

```
Warna Primer:
  --color-primary-500: #6C63FF   (Ungu Elektrik – energi, teknologi)
  --color-primary-400: #8B85FF
  --color-primary-600: #5248CC

Warna Sekunder:
  --color-secondary-500: #FF6584  (Pink Neon – fun, muda)
  --color-secondary-400: #FF85A1
  --color-secondary-600: #CC4D67

Warna Aksen:
  --color-accent-green: #43E97B   (Sukses, selesai)
  --color-accent-yellow: #FFD93D  (Perhatian, hint)
  --color-accent-cyan: #4ECDC4    (Info, interaktif)

Warna Netral:
  --color-neutral-900: #1A1A2E    (Background gelap)
  --color-neutral-800: #16213E    (Card gelap)
  --color-neutral-700: #0F3460    (Border gelap)
  --color-neutral-100: #F8F9FF    (Background terang)
  --color-neutral-50:  #FFFFFF

Gradien Khas:
  --gradient-hero:    linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)
  --gradient-success: linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)
  --gradient-card:    linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)
```

### 2.2 Tipografi

```
Font Utama (Heading):
  - Family: "Space Grotesk" (Google Fonts)
  - Weight: 600 (SemiBold), 700 (Bold)
  - Penggunaan: Judul halaman, heading modul, nama badge

Font Sekunder (Body):
  - Family: "Inter" (Google Fonts)
  - Weight: 400 (Regular), 500 (Medium)
  - Penggunaan: Paragraf, deskripsi, kuis

Font Kode:
  - Family: "Fira Code" (Google Fonts) - mendukung ligature
  - Weight: 400, 500
  - Penggunaan: Live code editor, snippet kode

Skala Tipografi:
  - h1: 2.5rem / 40px  (Hero title)
  - h2: 2rem / 32px    (Section heading)
  - h3: 1.5rem / 24px  (Card title)
  - h4: 1.25rem / 20px (Sub-section)
  - body-lg: 1.125rem / 18px (Paragraf penting)
  - body: 1rem / 16px  (Paragraf biasa)
  - small: 0.875rem / 14px (Caption, label)
```

### 2.3 Tone of Voice

| Konteks | Tone | Contoh |
|---------|------|--------|
| Onboarding | Excited, welcoming | "Heyy! Selamat datang di dunia coding!" |
| Instruksi | Santai tapi jelas | "Oke, coba kamu ketik ini ya..." |
| Kuis | Challenging, fun | "Eh, bisa gak nih? Coba buktiin!" |
| Error/Salah | Encouraging | "Hampir! Coba cek lagi baris ke-3 deh." |
| Sukses | Hype, celebratory | "YEAHH! Kamu berhasil! Badge baru nih!" |
| Admin | Profesional | "Data mahasiswa berhasil diperbarui." |

### 2.4 Ikonografi

- Library: **Phosphor Icons** (konsisten, banyak pilihan, mendukung berbagai weight)
- Style: Duotone untuk aksen, regular untuk UI umum
- Ukuran: 16px (inline), 24px (button), 32px (card), 48px (hero)

### 2.5 Ilustrasi

- Style: Ilustrasi flat 2D dengan aksen gradien, karakter humanoid gender-neutral
- Palette: Mengikuti palet utama (ungu & pink sebagai dominan)
- Sumber: Custom atau dari Undraw.co (disesuaikan warna)
- Penempatan: Hero section, halaman kosong (empty state), modal sukses

---

## 3. Arsitektur Informasi

### 3.1 Sitemap

```
/ (Landing Page)
|
|-- /login          (SSO Redirect)
|
|-- /dashboard      (Dashboard Pribadi Maba) [AUTH]
|   |-- /dashboard/overview
|   |-- /dashboard/leaderboard
|   |-- /dashboard/badges
|
|-- /learn          (Halaman Belajar) [AUTH]
|   |-- /learn/[modul-id]        (Konten Modul)
|   |   |-- /learn/[modul-id]/intro
|   |   |-- /learn/[modul-id]/material
|   |   |-- /learn/[modul-id]/practice  (Live Code Editor)
|   |   |-- /learn/[modul-id]/quiz
|   |   |-- /learn/[modul-id]/complete
|   |
|   |-- /learn/mini-project     (Mini Project Akhir)
|
|-- /profile        (Profil & Pengaturan) [AUTH]
|
|-- /admin          (Dashboard Admin) [ADMIN ONLY]
|   |-- /admin/dashboard
|   |-- /admin/students
|   |-- /admin/content
|   |-- /admin/reports
```

### 3.2 Hierarki Navigasi

- **Level 1 (Global Nav)**: Logo, Beranda, Belajar, Profil, Logout
- **Level 2 (Sidebar/Tabs)**: Modul aktif, sub-modul
- **Level 3 (In-page)**: Step pembelajaran (intro > materi > praktik > kuis)

---

## 4. Wireframe Naratif

### 4.1 Landing Page (`/`)

```
+--------------------------------------------------+
|  NAVBAR: Logo | Tentang | Login Button (CTA)      |
+--------------------------------------------------+
|                                                  |
|  HERO SECTION                                    |
|  Ilustrasi robot coding + teks besar:            |
|  "Coding itu seru. Percaya deh."                 |
|  [Sub]: Platform belajar pemrograman untuk       |
|         maba TRPL yang anti-boring               |
|  [CTA PRIMARY]: "Mulai Belajar →"                |
|  [CTA SECONDARY]: "Lihat Kurikulum"              |
|                                                  |
+--------------------------------------------------+
|  SECTION: KENAPA PLATFORM INI?                   |
|  3 Card horizontal (icon + teks):                |
|  🎮 Gamified  |  💻 Live Coding  |  🏆 Leaderboard |
+--------------------------------------------------+
|  SECTION: KURIKULUM SEKILAS                      |
|  Timeline horizontal 7 modul dengan progress bar |
+--------------------------------------------------+
|  SECTION: TESTIMONI MEME                         |
|  Karousel meme relevan dengan caption humor      |
+--------------------------------------------------+
|  FOOTER: Hak cipta, link sosmed prodi            |
+--------------------------------------------------+
```

### 4.2 Dashboard Belajar (`/dashboard`)

```
+--------------------------------------------------+
|  NAVBAR (logged in): Avatar | Poin: 250 | Bell    |
+--------------------------------------------------+
|  SIDEBAR        |  MAIN CONTENT                  |
|                 |                                |
|  [Avatar]       |  "Heyy Reza! 👋"               |
|  Reza Pratama   |  Lanjutkan belajar:            |
|  Level 3: Padawan                |  [RESUME CARD: Modul 3 – Percabangan]  |
|  Poin: 250      |  Progress: ████████░░ 75%      |
|                 |                                |
|  -- Menu --     |  MODUL LIST (Grid 2 kolom)     |
|  > Overview     |  [M1 DONE ✓] [M2 DONE ✓]      |
|  > Leaderboard  |  [M3 ACTIVE] [M4 LOCKED]       |
|  > Badge        |  [M5 LOCKED] [M6 LOCKED]       |
|  > Profil       |  [M7 MINI PROJECT]             |
|                 |                                |
|                 |  LEADERBOARD MINI (Top 3)      |
|                 |  1. Dinda - 380 poin           |
|                 |  2. Reza  - 250 poin           |
|                 |  3. Andi  - 230 poin           |
+--------------------------------------------------+
```

### 4.3 Halaman Modul – Materi (`/learn/[id]/material`)

```
+--------------------------------------------------+
|  BREADCRUMB: Beranda > Belajar > Modul 3         |
|  PROGRESS BAR: Step 1 > Step 2 [AKTIF] > Step 3  |
+--------------------------------------------------+
|                                                  |
|  JUDUL MODUL: "Percabangan: if-else"             |
|  Durasi: ~30 menit | 🎯 Tujuan: ...              |
|                                                  |
|  KONTEN (Scroll):                                |
|  [Paragraf + ilustrasi GIF kecil]                |
|  [Code snippet highlight syntax]                 |
|  [CALLOUT BOX: "Fun Fact: if-else itu kayak..."] |
|  [Paragraf lanjutan]                             |
|  [MEME STRIP (1x per halaman)]                   |
|                                                  |
|  [TOMBOL: "Coba Praktik Sekarang →"]             |
+--------------------------------------------------+
```

### 4.4 Live Code Editor (`/learn/[id]/practice`)

```
+--------------------------------------------------+
|  INSTRUKSI PANEL (kiri, 35%)                     |
|  "Tugas: Buat program yang..."                   |
|  [Petunjuk langkah demi langkah]                 |
|  [Hint tersembunyi: "Butuh bantuan? 💡"]         |
|                                                  |
|  CODE EDITOR PANEL (kanan, 65%)                  |
|  +------------------------------------------+   |
|  | # Python                              🌙  |   |
|  | name = "Reza"                             |   |
|  | if name == "Reza":                        |   |
|  |     print("Halo!")                        |   |
|  |                                           |   |
|  +------------------------------------------+   |
|  OUTPUT CONSOLE:                                 |
|  > Halo!                                         |
|                                                  |
|  [RUN ▶] [RESET ↺] [HINT 💡] [SUBMIT ✓]         |
+--------------------------------------------------+
```

### 4.5 Kuis Interaktif (`/learn/[id]/quiz`)

```
+--------------------------------------------------+
|  HEADER: "Kuis Modul 3" | Soal 3/10 | Timer: 45s |
|  PROGRESS: ████████████░░░░░░░░                  |
+--------------------------------------------------+
|                                                  |
|  PERTANYAAN:                                     |
|  "Apa output dari kode berikut?"                 |
|  [Code snippet]                                  |
|                                                  |
|  PILIHAN (Klik):                                 |
|  ○ A. "Halo, Dunia!"                            |
|  ○ B. Error                                     |
|  ○ C. None                                      |
|  ○ D. 0                                         |
|                                                  |
|  [SUBMIT JAWABAN]                                |
|                                                  |
|  -- Setelah jawab --                             |
|  [FEEDBACK: ✅ Benar! / ❌ Salah! + penjelasan]  |
|  [NEXT SOAL →]                                   |
+--------------------------------------------------+
```

### 4.6 Profil Mahasiswa (`/profile`)

```
+--------------------------------------------------+
|  COVER GRADIENT (ungu ke pink)                   |
|  [Avatar bulat | Nama | NIM | Prodi]             |
+--------------------------------------------------+
|  STATS STRIP:                                    |
|  Poin: 250 | Level: 3 | Streak: 4 hari | Badge: 6 |
+--------------------------------------------------+
|  BADGE SHOWCASE (Grid):                          |
|  [Badge 1] [Badge 2] [Badge 3] [Badge 4]...      |
+--------------------------------------------------+
|  AKTIVITAS TERAKHIR (Timeline):                  |
|  ✓ Selesai Modul 2 – kemarin                     |
|  ✓ Kuis Modul 1 – 100%                           |
|  ✓ Login pertama – 5 hari lalu                   |
+--------------------------------------------------+
```

---

## 5. Interaksi & Micro-Animation

### 5.1 Tombol & Hover

- **Primary Button**: Hover → scale(1.03) + box-shadow glow ungu; Click → scale(0.97) + ripple effect
- **Card Modul**: Hover → translateY(-4px) + shadow lebih dalam; Locked → grayscale + cursor not-allowed
- **Nav Item**: Hover → underline slide dari kiri

### 5.2 Transisi Halaman

- Page transition: fade-in 200ms + slight slide-up (translateY 8px → 0)
- Modul unlock: Scale bounce animation + star burst particle

### 5.3 Feedback Gamifikasi

| Event | Animasi |
|-------|---------|
| Jawaban Benar | Border hijau pulse + checkmark bounce + poin counter increment |
| Jawaban Salah | Shake horizontal 400ms + border merah flash |
| Selesai Modul | Full-screen confetti (canvas animation, 3 detik) + badge pop-up modal |
| Naik Level | Overlay gelap + level-up animation berkilau + sound optional |
| Submit Kode Berhasil | Terminal output muncul slide-down + "(>_<) Kodenya jalan!" |

### 5.4 Meme Pop-up Modal

```
Trigger: Setelah selesaikan kuis dengan skor >= 80%
Animasi: Scale dari 0.5 ke 1.0 (spring easing) + backdrop blur
Durasi: Auto-dismiss setelah 3 detik, atau klik X
Konten: Gambar meme + caption relevan
```

### 5.5 Loading States

- Skeleton loading untuk kartu modul
- Spinner dengan warna ungu untuk code execution
- Progress bar tipis di atas halaman (NProgress-style) untuk navigasi

---

## 6. Panduan Meme

### 6.1 Aturan Utama

| Aturan | Keterangan |
|--------|------------|
| Maksimal 1 meme per halaman | Tidak boleh mengganggu konsentrasi |
| Hanya muncul di momen positif | Setelah sukses, bukan saat error |
| Relevan dengan materi | Harus nyambung dengan topik modul |
| Format | WebP/GIF, maksimal 500KB |
| Ukuran tampil | Max 400px lebar, tidak full-screen |
| Caption wajib | Menjelaskan relevansi meme dengan materi |
| No offensive content | Tidak boleh ada konten SARA, diskriminasi |

### 6.2 Contoh Meme per Modul

| Modul | Konsep Meme | Contoh Caption |
|-------|-------------|----------------|
| Variabel | "Me naming variables: x, xx, xxx..." | "Nama variabel itu penting buat kamu dan teman-teman yang baca kode!" |
| if-else | Drake meme: No = if; Yes = if-else | "if cuma setengah perjalanan, else yang nyempurnain!" |
| Loop | "Day 1 vs Day 100 of coding" | "Loop bikin kamu tidak perlu nulis 1000 baris!" |
| Function | "Extract method" meme | "Fungsi = DRY (Don't Repeat Yourself)" |
| Array | Meme "me putting things in array" | "Array: Lemari pakaian tapi untuk data" |
| Debug | "It works on my machine" | "Setiap programmer pernah di sini!" |

### 6.3 Kriteria Meme yang Tidak Diterima

- Meme yang mengejek profesi/gender tertentu
- Meme dengan bahasa kasar/vulgar
- Meme yang terlalu niche sehingga tidak dipahami
- Meme yang copyright-sensitif tanpa izin

---

## 7. Design Tokens

```css
/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* Shadow */
--shadow-card: 0 4px 24px rgba(108, 99, 255, 0.12);
--shadow-hover: 0 8px 32px rgba(108, 99, 255, 0.24);
--shadow-glow: 0 0 20px rgba(108, 99, 255, 0.4);

/* Transition */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
--transition-spring: 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

---

## 8. Responsivitas

### 8.1 Breakpoint

| Nama | Lebar | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640px – 1024px | 2 kolom, sidebar collapse |
| Desktop | > 1024px | Full layout, sidebar visible |
| Wide | > 1440px | Max-width container 1280px |

### 8.2 Adaptasi Mobile

- Code editor: Font lebih kecil, output di bawah editor
- Kuis: Full-width pilihan, tombol lebih besar (min 44px touch target)
- Dashboard: Sidebar jadi bottom navigation
- Leaderboard: Horizontal scroll atau compact view

---

## Referensi

- Dokumen terkait: `prd.md`, `tech-architecture.md`
- Dibuat: Juli 2026
- Versi: 1.0.0
