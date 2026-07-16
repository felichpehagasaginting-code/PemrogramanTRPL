# Roadmap
## Matrikulasi TRPL - Timeline & Milestone Pengerjaan

---

## Daftar Isi

1. [Gambaran Timeline](#1-gambaran-timeline)
2. [Fase Pengembangan](#2-fase-pengembangan)
3. [Detail per Minggu (8 Minggu)](#3-detail-per-minggu-8-minggu)
4. [Sprint Backlog](#4-sprint-backlog)
5. [Dependensi & Critical Path](#5-dependensi--critical-path)
6. [Risk Register](#6-risk-register)
7. [Definition of Done](#7-definition-of-done)

---

## 1. Gambaran Timeline

```
TOTAL DURASI: 8 Minggu (56 Hari)
TARGET LAUNCH: Sebelum hari pertama matrikulasi
METODOLOGI: Agile Scrum (sprint 1 minggu)
TEAM SIZE: 3-5 orang

MINGGU:  1    2    3    4    5    6    7    8
         |----|----|----|----|----|----|----|----|
FASE:    [PLAN+DESIGN][---DEVELOPMENT----][TEST][DEPLOY]
         M1   M2   M3  M4   M5   M6   M7   M8
```

### 1.1 Ringkasan Milestone

| Milestone | Target | Deliverable |
|-----------|--------|-------------|
| M1 - Kickoff | Akhir Minggu 1 | PRD final, desain approved, task terdistribusi |
| M2 - Design Done | Akhir Minggu 2 | Figma/design system selesai, API spec ready |
| M3 - Core MVP | Akhir Minggu 4 | Auth + 3 modul pertama + editor bisa jalan |
| M4 - Feature Complete | Akhir Minggu 6 | Semua 7 modul + gamifikasi + admin dashboard |
| M5 - Release Candidate | Akhir Minggu 7 | Bug fix, security audit, load testing selesai |
| M6 - LAUNCH | Minggu 8 | Platform live, siap dipakai maba |

---

## 2. Fase Pengembangan

### Phase 1: Planning & Discovery (Minggu 1)

**Tujuan**: Fondasi solid sebelum koding dimulai.

Aktivitas:
- Kick-off meeting dengan semua stakeholder
- Finalisasi PRD dan user stories
- Workshop desain (moodboard, palet warna, komponen utama)
- Setup repositori, tools, dan environment development
- Pembagian tugas ke semua anggota tim
- Validasi kurikulum matrikulasi dengan dosen TRPL

Output:
- PRD.md final (ditandatangani stakeholder)
- design.md approved
- Repositori GitHub + project board siap
- Environment dev semua anggota bisa running

### Phase 2: Design & Architecture (Minggu 2)

**Tujuan**: Spesifikasi teknis lengkap sebelum coding.

Aktivitas:
- Design system (komponen, token, style guide)
- Wireframe interaktif (Figma atau langsung Storybook)
- Database schema design + review
- API specification (OpenAPI) untuk semua endpoint
- Setup infrastruktur: Vercel, Supabase, Redis, Piston

Output:
- Design system dokumentasi
- API spec lengkap
- Database schema di Supabase (staging)
- Infrastruktur staging running

### Phase 3: Development – Sprint 1 (Minggu 3-4)

**Tujuan**: Core functionality - Authentication + Modul 1-3.

Aktivitas:
- Implementasi SSO login
- Komponen UI dasar (Button, Card, Layout, Nav)
- Halaman Landing Page
- Dashboard mahasiswa (skeleton dulu)
- Backend: API auth, user management, progress tracking
- Modul 1 (Algoritma) + Modul 2 (Variabel) content + kuis
- Live code editor (Monaco Editor) - basic version

Output:
- Halaman login SSO bisa digunakan
- 2 modul bisa diakses dan diselesaikan
- Code editor bisa run Python

### Phase 4: Development – Sprint 2 (Minggu 5-6)

**Tujuan**: Feature complete - Semua modul + gamifikasi.

Aktivitas:
- Modul 3-7 (termasuk mini project)
- Sistem gamifikasi (poin, badge, level) frontend + backend
- Leaderboard real-time
- Dashboard admin (monitoring mahasiswa)
- Kuis drag-and-drop
- Animasi dan micro-interaction
- Meme integration
- Dark mode
- Notifikasi

Output:
- Semua 7 modul bisa diakses
- Sistem gamifikasi berjalan
- Dashboard admin fungsional
- Platform terasa "finished" dari user perspective

### Phase 5: Testing & Hardening (Minggu 7)

**Tujuan**: Platform siap produksi - aman, cepat, stabil.

Aktivitas:
- Unit testing semua komponen kritis
- E2E testing user journey (Playwright)
- Security audit (SecurityAgent review + manual pentest)
- Load testing (simulasi 250 user bersamaan)
- Bug fix dari semua testing
- Performance optimization (Lighthouse score >= 90)
- Aksesibilitas audit

Output:
- Test coverage >= 70%
- 0 critical bug, 0 security vulnerability
- Lighthouse score >= 90
- Load test passed (250 concurrent user)

### Phase 6: Deployment & Launch (Minggu 8)

**Tujuan**: Platform live dan siap dipakai hari pertama matrikulasi.

Aktivitas:
- Final deployment ke production
- DNS konfigurasi + SSL setup
- Seed data (konten modul, kuis, badge)
- Onboarding panitia + admin training
- Monitoring setup (Sentry, Uptime Robot)
- Buat panduan user (PDF singkat)
- Soft launch dengan sebagian maba untuk UAT
- Full launch + sosialisasi

Output:
- Platform live di domain resmi
- Admin bisa login dan monitor
- Materi semua modul sudah ada
- Backup dan monitoring aktif

---

## 3. Detail per Minggu (8 Minggu)

### Minggu 1 – Kickoff & Planning

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Kick-off meeting, presentasi PRD draft | Semua | [ ] |
| Senin | Setup GitHub repo, project board, branch convention | DevOps | [ ] |
| Selasa | Workshop desain: moodboard + palet warna + tipografi | Designer | [ ] |
| Selasa | Finalisasi user stories + acceptance criteria | AnalystAgent | [ ] |
| Rabu | Validasi kurikulum dengan dosen TRPL | ContentAgent | [ ] |
| Rabu | Setup environment (Node.js, pnpm, Next.js, Supabase) | Backend | [ ] |
| Kamis | PRD review dan sign-off | PM/Koordinator | [ ] |
| Kamis | Bagi task sprint ke semua anggota | OrchestratorAgent | [ ] |
| Jumat | Demo setup: semua anggota bisa run project locally | Semua | [ ] |
| Jumat | Retrospective & planning Minggu 2 | Semua | [ ] |

### Minggu 2 – Design & Architecture

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Buat design system: komponen dasar di Storybook | Frontend | [ ] |
| Senin | Database schema design + review | Backend | [ ] |
| Selasa | Wireframe halaman utama (Landing, Dashboard, Editor, Kuis) | Frontend | [ ] |
| Selasa | API specification (OpenAPI) untuk endpoint auth & progress | Backend | [ ] |
| Rabu | Setup Supabase staging + schema migration | Backend | [ ] |
| Rabu | Setup Vercel staging environment | DevOps | [ ] |
| Kamis | Design review + feedback | Semua | [ ] |
| Kamis | API spec review + feedback | Semua | [ ] |
| Jumat | Setup Piston API sandbox | Backend | [ ] |
| Jumat | Retrospective & planning Minggu 3 | Semua | [ ] |

### Minggu 3 – Development Sprint 1A (Auth + Landing)

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Implementasi komponen UI dasar (Button, Card, Input, Badge) | Frontend | [ ] |
| Senin | Implementasi API auth dengan Supabase | Backend | [ ] |
| Selasa | Landing page (hero, fitur highlights, footer) | Frontend | [ ] |
| Selasa | SSO adapter (OAuth 2.0 flow) | Backend | [ ] |
| Rabu | Halaman login + redirect SSO | Frontend | [ ] |
| Rabu | User model + session management | Backend | [ ] |
| Kamis | Navbar + sidebar komponen | Frontend | [ ] |
| Kamis | API progress tracking (buat, update, read) | Backend | [ ] |
| Jumat | Integrasi auth frontend-backend | Frontend + Backend | [ ] |
| Jumat | Testing auth flow end-to-end | QA | [ ] |

### Minggu 4 – Development Sprint 1B (Modul 1-2 + Editor)

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Monaco Editor integration + Python syntax highlight | Frontend | [ ] |
| Senin | API code execution (Piston integration) | Backend | [ ] |
| Selasa | Dashboard mahasiswa (progress, modul list) | Frontend | [ ] |
| Selasa | Konten Modul 1 (teks + kuis JSON) | ContentAgent | [ ] |
| Rabu | Halaman modul: layout + konten renderer | Frontend | [ ] |
| Rabu | Konten Modul 2 (teks + kuis JSON) | ContentAgent | [ ] |
| Kamis | Kuis engine (pilihan ganda + scoring) | Frontend | [ ] |
| Kamis | API kuis: submit, scoring, simpan attempt | Backend | [ ] |
| Jumat | Integration test: Modul 1 full flow | QA | [ ] |
| Jumat | Deploy staging M1 + M2 untuk internal review | DevOps | [ ] |

### Minggu 5 – Development Sprint 2A (Modul 3-5 + Gamifikasi)

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Konten Modul 3, 4, 5 (teks + kuis) | ContentAgent | [ ] |
| Senin | Sistem gamifikasi backend (poin, level, badge logic) | Backend | [ ] |
| Selasa | Halaman modul M3, M4, M5 | Frontend | [ ] |
| Selasa | Badge UI component + achievement popup | Frontend | [ ] |
| Rabu | Drag-and-drop kuis (logika, flowchart) | Frontend | [ ] |
| Rabu | Confetti animation + meme popup component | Frontend | [ ] |
| Kamis | Leaderboard UI + real-time update | Frontend | [ ] |
| Kamis | API leaderboard + Supabase Realtime | Backend | [ ] |
| Jumat | Integration test gamifikasi | QA | [ ] |
| Jumat | Security review Sprint 2A | SecurityAgent | [ ] |

### Minggu 6 – Development Sprint 2B (Modul 6-7 + Admin)

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Konten Modul 6, 7 (teks + mini project spec) | ContentAgent | [ ] |
| Senin | Dashboard admin: overview mahasiswa | Backend + Frontend | [ ] |
| Selasa | Mini project submission flow | Frontend | [ ] |
| Selasa | Admin: tabel progres per mahasiswa | Frontend | [ ] |
| Rabu | Export laporan (PDF/Excel) | Backend | [ ] |
| Rabu | Dark mode implementation | Frontend | [ ] |
| Kamis | Notifikasi system | Backend + Frontend | [ ] |
| Kamis | Profil halaman + badge showcase | Frontend | [ ] |
| Jumat | Full regression test (semua modul) | QA | [ ] |
| Jumat | Content review semua meme + copy | ContentAgent | [ ] |

### Minggu 7 – Testing & Hardening

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Unit test kritis (auth, scoring, gamifikasi) | QA | [ ] |
| Senin | E2E test full user journey (Playwright) | QA | [ ] |
| Selasa | Security audit: OWASP checklist | SecurityAgent | [ ] |
| Selasa | Penetration test: XSS, SQL injection, CSRF | SecurityAgent | [ ] |
| Rabu | Load test: k6 simulasi 250 user bersamaan | QA + DevOps | [ ] |
| Rabu | Fix semua critical & high bugs | Semua | [ ] |
| Kamis | Performance optimization (Lighthouse, bundle) | Frontend | [ ] |
| Kamis | Aksesibilitas audit (WCAG 2.1) | Frontend | [ ] |
| Jumat | Final staging review dengan koordinator matrikulasi | Semua | [ ] |
| Jumat | Go/No-go decision untuk production deploy | PM | [ ] |

### Minggu 8 – Deployment & Launch

| Hari | Task | PIC | Status |
|------|------|-----|--------|
| Senin | Production deployment + DNS setup | DevOps | [ ] |
| Senin | Setup monitoring (Sentry, Uptime Robot) | DevOps | [ ] |
| Selasa | Seed data: konten modul, kuis, badge ke production | Backend | [ ] |
| Selasa | Admin & panitia onboarding + training | PM | [ ] |
| Rabu | Soft launch: 20 maba untuk UAT | PM | [ ] |
| Rabu | Bug fix dari UAT feedback | Dev | [ ] |
| Kamis | Full launch: sosialisasi ke semua maba | PM + Marketing | [ ] |
| Kamis | Pantau metrics (uptime, error, engagement) | DevOps | [ ] |
| Jumat | Post-launch review meeting | Semua | [ ] |
| Jumat | Dokumentasi post-mortem + lessons learned | Semua | [ ] |

---

## 4. Sprint Backlog

### Prioritas Backlog (MoSCoW)

**MUST HAVE (MVP)**
- [ ] Login SSO kampus
- [ ] 7 modul konten lengkap dengan kuis
- [ ] Live code editor (Python)
- [ ] Progress tracking
- [ ] Gamifikasi dasar (poin + badge)
- [ ] Dashboard admin
- [ ] Responsive design

**SHOULD HAVE**
- [ ] Leaderboard real-time
- [ ] Meme popup
- [ ] Confetti animation
- [ ] Dark mode
- [ ] Export laporan admin

**COULD HAVE**
- [ ] Notifikasi reminder
- [ ] Drag-and-drop kuis
- [ ] Forum diskusi (post-MVP)
- [ ] AI Tutor hint

**WON'T HAVE (fase ini)**
- Mobile app native
- Video konten (hanya teks + GIF untuk MVP)
- Live session streaming

---

## 5. Dependensi & Critical Path

### 5.1 Dependency Tree

```
[PRD Final] ──────────────┐
                           v
[Design System] ──────> [Frontend Components]
                               |
[Database Schema] ──> [API Endpoints] ──> [Frontend Integration]
        |
[SSO Config] ──────> [Auth System] ──> [Protected Routes]
        |
[Piston Setup] ────> [Code Exec API] ──> [Code Editor Integration]
```

### 5.2 Critical Path

1. PRD Final (**Minggu 1**) - Semua bergantung ini
2. SSO Kampus API tersedia (**Minggu 2**) - Jika terlambat, blocker besar
3. Database Schema di Supabase (**Minggu 2**) - Backend tidak bisa mulai
4. Auth System (**Minggu 3**) - Semua fitur protected bergantung ini
5. Konten Modul (**Minggu 3-4**) - Halaman modul tidak bisa diisi
6. Load Testing (**Minggu 7**) - Harus passed sebelum launch

---

## 6. Risk Register

| ID | Risiko | Probabilitas | Dampak | Strategi Mitigasi | Owner |
|----|--------|-------------|--------|-------------------|-------|
| R1 | SSO kampus tidak bisa diakses | Sedang | Tinggi | Siapkan fallback email auth | Backend |
| R2 | Maba tidak adopt platform | Sedang | Tinggi | Gamifikasi + sosialisasi awal | PM |
| R3 | Server down saat launch | Rendah | Sangat Tinggi | Load test + auto-scaling + backup | DevOps |
| R4 | Konten tidak siap sebelum launch | Tinggi | Sedang | CMS untuk konten bisa diisi paralel | Content |
| R5 | Tim kekurangan waktu | Sedang | Sedang | Scope MVP ketat, feature creep dicegah | PM |
| R6 | Kerentanan keamanan code editor | Rendah | Tinggi | Piston sandbox + security review wajib | Security |

---

## 7. Definition of Done

Sebuah task/fitur dianggap "DONE" jika:

- [ ] Kode sudah diimplementasikan sesuai acceptance criteria
- [ ] Unit test sudah ditulis dan passed
- [ ] Kode sudah di-review oleh minimal 1 orang lain
- [ ] SecurityAgent sudah review (untuk fitur yang berkaitan user input)
- [ ] Sudah di-test di staging environment
- [ ] Tidak ada lint error
- [ ] Responsif di mobile dan desktop
- [ ] PR sudah di-merge ke branch develop
- [ ] Dokumentasi diperbarui jika diperlukan

---

## Referensi

- Dokumen terkait: `prd.md`, `agents.md`, `tech-architecture.md`
- Dibuat: Juli 2026
- Versi: 1.0.0
