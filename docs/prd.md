# 📋 Product Requirements Document (PRD)
## Matrikulasi TRPL – Platform Belajar Pemrograman Interaktif

---

## 📑 Daftar Isi

1. [Latar Belakang](#1-latar-belakang)
2. [Problem Statement](#2-problem-statement)
3. [Target Pengguna](#3-target-pengguna)
4. [User Stories](#4-user-stories)
5. [Fitur Utama](#5-fitur-utama)
6. [Kriteria Sukses (KPI)](#6-kriteria-sukses-kpi)
7. [Kebutuhan Non-Fungsional](#7-kebutuhan-non-fungsional)
8. [Asumsi & Risiko](#8-asumsi--risiko)

---

## 1. Latar Belakang

Program Studi **Teknologi Rekayasa Perangkat Lunak (TRPL)** menerima mahasiswa baru setiap tahun dengan latar belakang yang beragam – ada yang sudah punya pengalaman coding, ada yang baru pertama kali dengar kata "variabel". Kegiatan matrikulasi sering kali terasa membosankan: slide PowerPoint tebal, bahasa akademik berat, dan tidak ada interaksi nyata.

**Matrikulasi TRPL** hadir sebagai solusi platform web interaktif yang mengubah pengalaman belajar perdana mahasiswa baru menjadi pengalaman yang menyenangkan, relevan, dan berkesan. Dengan pendekatan *gamified learning*, visual kekinian, dan konten yang relatable (termasuk meme pemrograman yang not-cringe), platform ini dirancang agar mahasiswa baru langsung *jatuh cinta* dengan dunia coding sejak hari pertama.

---

## 2. Problem Statement

| # | Masalah | Dampak |
|---|---------|--------|
| P1 | Mahasiswa baru tanpa background coding merasa terintimidasi | Drop motivasi di minggu pertama |
| P2 | Materi matrikulasi konvensional bersifat satu arah (ceramah) | Rendahnya retensi materi |
| P3 | Tidak ada cara untuk mengukur pemahaman mahasiswa secara real-time | Panitia tidak tahu siapa yang butuh bantuan |
| P4 | Tidak ada platform terpusat untuk materi matrikulasi TRPL | Materi tersebar di grup WA, GDrive, dsb. |
| P5 | Mahasiswa Gen-Z mudah bosan dengan metode konvensional | Partisipasi rendah, engagement drop |

---

## 3. Target Pengguna

### 3.1 Persona Utama – Mahasiswa Baru (Maba)

| Atribut | Detail |
|---------|--------|
| **Nama Persona** | Reza & Dinda (representatif) |
| **Usia** | 18–20 tahun |
| **Latar Belakang** | SMA/SMK, beragam (ada yang pernah coding, ada yang belum) |
| **Tech Savvy** | Tinggi – aktif di TikTok, Instagram, YouTube |
| **Motivasi** | Ingin berhasil di perkuliahan, takut ketinggalan teman |
| **Pain Point** | Takut salah, malu bertanya, cepat bosan |
| **Device** | Smartphone utama, laptop/PC saat belajar serius |

### 3.2 Persona Sekunder – Panitia/Dosen

| Atribut | Detail |
|---------|--------|
| **Nama Persona** | Kak Budi (Koordinator Matrikulasi) |
| **Usia** | 22–45 tahun |
| **Motivasi** | Menyampaikan materi efisien, memantau progres maba |
| **Kebutuhan** | Dashboard admin, laporan progres, kontrol konten |
| **Pain Point** | Tidak punya waktu banyak untuk rekap manual |

---

## 4. User Stories

### 4.1 Mahasiswa Baru (Maba)

- **US-01**: Sebagai maba, aku ingin login dengan akun SSO kampus agar aku tidak perlu buat akun baru.
- **US-02**: Sebagai maba, aku ingin melihat progress belajarku dalam bentuk visual agar aku tahu sudah seberapa jauh perjalananku.
- **US-03**: Sebagai maba, aku ingin mencoba menulis kode langsung di browser agar aku bisa latihan tanpa install apapun.
- **US-04**: Sebagai maba, aku ingin mengerjakan kuis interaktif setelah tiap modul agar aku tahu apakah aku sudah paham materi.
- **US-05**: Sebagai maba, aku ingin dapat badge dan poin setiap selesai modul agar belajar terasa seperti main game.
- **US-06**: Sebagai maba, aku ingin lihat leaderboard kelas agar ada motivasi bersaing secara sehat.
- **US-07**: Sebagai maba, aku ingin drag-and-drop blok kode agar belajar logika pemrograman terasa intuitif.
- **US-08**: Sebagai maba, aku ingin ada meme lucu yang muncul saat aku berhasil agar belajar terasa fun.

### 4.2 Panitia/Dosen

- **US-09**: Sebagai panitia, aku ingin lihat dashboard progres seluruh maba agar aku bisa identifikasi siapa yang butuh bantuan ekstra.
- **US-10**: Sebagai dosen, aku ingin upload dan edit konten modul agar materi bisa diperbarui dengan mudah.
- **US-11**: Sebagai panitia, aku ingin export laporan progres ke PDF/Excel agar bisa dilaporkan ke program studi.
- **US-12**: Sebagai admin, aku ingin atur role dan akses pengguna agar keamanan platform terjaga.

---

## 5. Fitur Utama

### 5.1 Core Features (Wajib Ada – MVP)

| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| F01 | SSO Login | Autentikasi via Single Sign-On kampus | Critical |
| F02 | Module System | Struktur modul pembelajaran bertahap | Critical |
| F03 | Live Code Editor | Editor kode in-browser (Python & JS dasar) | Critical |
| F04 | Interactive Quiz | Kuis pilihan ganda, isian, dan drag-and-drop | Critical |
| F05 | Progress Tracker | Visualisasi kemajuan belajar per modul | Critical |
| F06 | Gamification | Sistem poin, badge, dan level | Critical |
| F07 | Dashboard Admin | Monitoring progres seluruh maba | Critical |
| F08 | Responsive Design | Optimal di desktop dan mobile | Critical |

### 5.2 Secondary Features (Nice to Have)

| ID | Fitur | Deskripsi | Prioritas |
|----|-------|-----------|-----------|
| F09 | Leaderboard | Papan peringkat kelas | High |
| F10 | Meme Integration | Meme relevan muncul kontekstual | High |
| F11 | Confetti Effect | Animasi konfeti saat selesai modul | High |
| F12 | Mini Project Submission | Upload/submit kode mini project | High |
| F13 | Notification System | Notifikasi reminder belajar | Medium |
| F14 | Dark Mode | Tampilan gelap untuk kenyamanan | Medium |
| F15 | Export Laporan | Export progres ke PDF/Excel | Medium |

### 5.3 Future Features (Post-MVP)

| ID | Fitur | Deskripsi |
|----|-------|-----------|
| F16 | AI Tutor | Chatbot AI untuk menjawab pertanyaan coding |
| F17 | Code Review Peer | Review kode sesama mahasiswa |
| F18 | Mobile App | Versi native Android/iOS |
| F19 | Live Session | Sesi coding live bersama panitia |
| F20 | Forum Diskusi | Thread diskusi per modul |

---

## 6. Kriteria Sukses (KPI)

### 6.1 KPI Engagement

| Metrik | Target Minimum | Target Ideal |
|--------|---------------|--------------|
| Completion Rate per Modul | >= 70% | >= 85% |
| Daily Active Users (selama matrikulasi) | >= 60% maba | >= 80% maba |
| Rata-rata waktu belajar per sesi | >= 20 menit | >= 35 menit |
| Skor pre-test vs post-test | Peningkatan >= 30% | Peningkatan >= 50% |

### 6.2 KPI Teknis

| Metrik | Target |
|--------|--------|
| Page Load Time (LCP) | < 2.5 detik |
| Uptime | >= 99.5% selama periode matrikulasi |
| Mobile Responsiveness Score | >= 90/100 |
| Concurrent Users tanpa degradasi | >= 200 user |
| Zero Security Incident | 0 insiden selama matrikulasi |

### 6.3 KPI Kepuasan

| Metrik | Target |
|--------|--------|
| NPS (Net Promoter Score) | >= 40 |
| Post-matrikulasi survey score | >= 4.0/5.0 |
| "Akan merekomendasikan platform ini" | >= 75% responden |

---

## 7. Kebutuhan Non-Fungsional

### 7.1 Performa

- Response Time: API response < 500ms untuk 95% request
- Concurrent Load: Mendukung 200+ user bersamaan tanpa crash
- Code Execution: Eksekusi kode di sandbox < 5 detik
- Bundle Size: Initial bundle < 500KB (gzip)
- Caching: Implementasi CDN untuk aset statis

### 7.2 Keamanan

- Autentikasi: OAuth 2.0 / SAML via SSO kampus
- Enkripsi: HTTPS/TLS 1.3 untuk semua komunikasi
- Data: Enkripsi at-rest untuk data sensitif mahasiswa
- Input Sanitization: Pencegahan XSS, SQL Injection, Command Injection
- Code Sandbox: Eksekusi kode user terisolasi (tidak bisa akses server)
- Rate Limiting: Proteksi endpoint dari brute force & DDoS
- RBAC: Role-Based Access Control (maba, panitia, admin)
- Audit Log: Log semua aksi sensitif

### 7.3 Kompatibilitas

| Platform | Versi Minimum |
|----------|---------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Chrome (Android) | 90+ |
| Resolusi minimum | 375px (mobile) |

### 7.4 Aksesibilitas

- WCAG 2.1 Level AA compliance
- Kontras warna minimum 4.5:1
- Keyboard navigable
- Screen reader friendly (ARIA labels)

---

## 8. Asumsi & Risiko

### 8.1 Asumsi

| # | Asumsi |
|---|--------|
| A1 | Kampus menyediakan API/endpoint SSO yang bisa diintegrasikan |
| A2 | Mahasiswa baru memiliki akun SSO kampus sebelum matrikulasi dimulai |
| A3 | Tersedia server/hosting yang bisa di-deploy oleh tim |
| A4 | Tim pengembang terdiri dari 3-5 orang dengan waktu pengerjaan 6-8 minggu |
| A5 | Koneksi internet mahasiswa cukup stabil (minimal 4G/WiFi kampus) |
| A6 | Materi kurikulum sudah divalidasi dosen TRPL sebelum development |

### 8.2 Risiko & Mitigasi

| # | Risiko | Probabilitas | Dampak | Mitigasi |
|---|--------|-------------|--------|----------|
| R1 | API SSO kampus tidak tersedia | Sedang | Tinggi | Sediakan fallback login manual (email kampus) |
| R2 | Traffic spike saat semua maba login bersamaan | Tinggi | Tinggi | Load testing sebelum launch, auto-scaling |
| R3 | Maba tidak mau pakai platform (adoption rendah) | Sedang | Tinggi | Gamifikasi kuat, sosialisasi via medsos |
| R4 | Konten kuis/modul belum siap saat launch | Tinggi | Sedang | Buat CMS sederhana agar konten bisa diisi sambil jalan |
| R5 | Kerentanan keamanan pada code editor | Rendah | Sangat Tinggi | Gunakan sandbox terisolasi (Judge0/Piston API) |
| R6 | Timeline mepet, fitur tidak selesai | Sedang | Sedang | Prioritaskan MVP, fitur sekunder post-launch |

---

## Referensi

- Dokumen terkait: `design.md`, `tech-architecture.md`, `matrikulasi.md`
- Dibuat: Juli 2026
- Versi: 1.0.0
- Tim: Divisi Pemrograman Matrikulasi TRPL
