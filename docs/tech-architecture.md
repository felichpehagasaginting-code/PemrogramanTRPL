# Tech Architecture
## Matrikulasi TRPL - Rencana Arsitektur Teknis, Keamanan & Infrastruktur

---

## Daftar Isi

1. [Stack Teknologi](#1-stack-teknologi)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Rencana Database](#3-rencana-database)
4. [Keamanan & Compliance](#4-keamanan--compliance)
5. [Infrastruktur & Hosting](#5-infrastruktur--hosting)
6. [Skalabilitas](#6-skalabilitas)
7. [Monitoring & Observability](#7-monitoring--observability)
8. [CI/CD Pipeline](#8-cicd-pipeline)

---

## 1. Stack Teknologi

### 1.1 Frontend

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| Next.js | 14+ (App Router) | SSR, ISR, optimasi gambar bawaan, routing yang powerful |
| React | 18+ | Ecosystem terluas, Server Components untuk performa |
| TypeScript | 5+ | Type safety, refactoring aman, DX lebih baik |
| Tailwind CSS | 3+ | Utility-first, cepat prototipe, konsisten |
| Framer Motion | 11+ | Animasi deklaratif, spring physics, gesture support |
| Monaco Editor | Latest | Code editor VSCode-grade di browser, syntax highlight |
| Zustand | 4+ | State management ringan, tidak boilerplate |
| React Query | 5+ | Server state management, caching, background sync |
| Phosphor Icons | 2+ | Ikon konsisten, ringan, banyak pilihan |

### 1.2 Backend

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| Next.js API Routes | 14+ | Monorepo, tidak perlu server terpisah untuk MVP |
| Hono | 4+ | Ultrafast edge runtime jika perlu microservice |
| Supabase | Latest | BaaS: PostgreSQL + Auth + Storage + Realtime |
| Drizzle ORM | 0.30+ | Typesafe, performant, migration yang clean |
| Piston API | v2 | Code execution sandbox yang aman dan sudah tested |
| Upstash Redis | Latest | Serverless Redis untuk caching & rate limiting |
| Resend | Latest | Email transaksional (notifikasi, laporan) |

### 1.3 Infrastructure

| Teknologi | Alasan Pemilihan |
|-----------|-----------------|
| Vercel | Deploy Next.js zero-config, CDN global, edge functions |
| Supabase Cloud | Managed PostgreSQL, auto-backup, Realtime, Auth |
| Cloudflare | CDN, DDoS protection, DNS, WAF |
| Upstash | Serverless Redis, pay-per-use, cocok tim kecil |

### 1.4 Dev Tools & DX

| Tool | Kegunaan |
|------|---------|
| pnpm | Package manager cepat, efficient disk usage |
| ESLint + Prettier | Linting dan formatting konsisten |
| Husky + lint-staged | Pre-commit hooks (tidak bisa commit kode kotor) |
| Vitest | Unit testing, integrasi dengan Vite ecosystem |
| Playwright | E2E testing |
| Storybook | Dokumentasi dan isolasi komponen UI |
| GitHub Actions | CI/CD automation |

---

## 2. Arsitektur Sistem

### 2.1 Arsitektur Overview (Deskripsi Mermaid)

```
[User Browser]
     |
     | HTTPS/TLS 1.3
     v
[Cloudflare CDN + WAF]
     |
     | (Filtered Traffic)
     v
[Vercel Edge Network]
     |
     +-- [Static Assets] --> CDN Cache
     |
     +-- [Next.js App Server]
          |
          +-- [Page Rendering (SSR/ISR)]
          |
          +-- [API Routes]
               |
               +-- [Auth Service] <-------> [Supabase Auth + SSO Adapter]
               |
               +-- [Content Service] <----> [Supabase Database]
               |
               +-- [Progress Service] <---> [Supabase Database + Redis Cache]
               |
               +-- [Gamification Service] -> [Supabase Database]
               |
               +-- [Code Execution] -------> [Piston API (Sandbox)]
               |
               +-- [Admin Service] <-------> [Supabase Database]
```

### 2.2 Data Flow – Proses Login SSO

```
Mahasiswa klik "Login dengan SSO Kampus"
    |
    v
Next.js redirect ke SSO endpoint kampus
    |
    v
SSO Kampus validasi kredensial
    |
    v
SSO return OAuth2 Authorization Code
    |
    v
Next.js exchange code dengan Access Token
    |
    v
Backend validasi token + ambil info user
    |
    v
Buat/update user record di Supabase
    |
    v
Set session cookie (httpOnly, secure, sameSite=strict)
    |
    v
Redirect ke /dashboard
```

### 2.3 Data Flow – Code Execution

```
User tulis kode di Monaco Editor (client)
    |
    v
User klik "Run"
    |
    v
POST /api/execute dengan payload { language, code, stdin }
    |
    v
API Route validasi input (sanitize, length check)
    |
    v
Rate limiter cek (max 10 req/menit per user)
    |
    v
Forward ke Piston API (sandbox terisolasi)
    |
    v
Piston execute kode dalam container terisolasi
(timeout: 10 detik, memory: 128MB, no network access)
    |
    v
Return { stdout, stderr, exitCode, execTime }
    |
    v
API Route log eksekusi + return ke client
    |
    v
Monaco Editor tampilkan output
```

---

## 3. Rencana Database

### 3.1 Schema Utama

```sql
-- Users (sync dari SSO)
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sso_id      VARCHAR(100) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  nim         VARCHAR(20),
  role        ENUM('student', 'admin', 'coordinator') DEFAULT 'student',
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Modules (konten kurikulum)
CREATE TABLE modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(10) UNIQUE NOT NULL,  -- M01, M02, dst
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  points_max  INTEGER DEFAULT 100,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Submodules (konten per modul)
CREATE TABLE submodules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID REFERENCES modules(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  content     JSONB,  -- { type: 'text'|'video'|'code', data: ... }
  order_index INTEGER NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID REFERENCES modules(id) ON DELETE CASCADE,
  questions   JSONB NOT NULL,  -- array of question objects
  passing_score INTEGER DEFAULT 60,
  time_limit  INTEGER,  -- detik, null = tidak ada batas
  created_at  TIMESTAMP DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id     UUID REFERENCES modules(id) ON DELETE CASCADE,
  submodule_id  UUID REFERENCES submodules(id),
  status        ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  completed_at  TIMESTAMP,
  UNIQUE(user_id, module_id, submodule_id)
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  quiz_id     UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  answers     JSONB NOT NULL,
  score       INTEGER NOT NULL,
  passed      BOOLEAN NOT NULL,
  attempt_no  INTEGER DEFAULT 1,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Gamification
CREATE TABLE user_points (
  user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  level        INTEGER DEFAULT 1,
  streak_days  INTEGER DEFAULT 0,
  last_active  DATE
);

CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url    TEXT,
  points_reward INTEGER DEFAULT 0
);

CREATE TABLE user_badges (
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id    UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   UUID,
  metadata    JSONB,
  ip_address  INET,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Indexing Strategy

```sql
-- Performa query progress
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_module ON user_progress(module_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);

-- Leaderboard
CREATE INDEX idx_user_points_total ON user_points(total_points DESC);

-- Audit log search
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

---

## 4. Keamanan & Compliance

### 4.1 Autentikasi & Otorisasi

**SSO Integration**:
- Protocol: OAuth 2.0 Authorization Code Flow dengan PKCE
- Fallback: Email/Password login dengan email domain kampus
- Session: JWT dengan expiry 8 jam + refresh token
- Cookie: httpOnly, Secure, SameSite=Strict

**RBAC (Role-Based Access Control)**:
```
student     --> read own progress, submit code, take quizzes
coordinator --> read all student progress, export reports
admin       --> full CRUD on content, users, configuration
```

**Implementation**:
- Middleware autentikasi di setiap API route
- Row Level Security (RLS) di Supabase untuk database-level protection
- Server-side validation di setiap endpoint

### 4.2 OWASP Top 10 Prevention

| Risiko | Pencegahan |
|--------|-----------|
| A01 – Broken Access Control | RBAC + RLS Supabase + route middleware |
| A02 – Cryptographic Failures | TLS 1.3, bcrypt password (jika fallback), enkripsi field sensitif |
| A03 – Injection | Drizzle ORM parameterized query, Zod validation, DOMPurify untuk HTML |
| A04 – Insecure Design | Threat modeling di awal, security review tiap sprint |
| A05 – Security Misconfiguration | Hardened headers, env var management, disable debug di prod |
| A06 – Vulnerable Components | Dependabot alerts, pnpm audit wajib di CI |
| A07 – Auth Failures | Rate limiting login, lockout setelah 5 gagal, session invalidation |
| A08 – Software Integrity | Code review wajib, signed commits, SBOM |
| A09 – Logging Failures | Audit log semua aksi sensitif, structured logging |
| A10 – SSRF | Whitelist URL, tidak pernah fetch URL dari user input |

### 4.3 HTTP Security Headers

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' *.vercel.app; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; connect-src 'self' *.supabase.co; img-src 'self' data: blob:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### 4.4 Rate Limiting

```
Endpoint Login:         5 requests / 15 menit per IP
Endpoint Code Execute:  10 requests / menit per user
API Umum:               100 requests / menit per user
Admin Endpoints:        20 requests / menit per admin
```

### 4.5 Code Execution Sandbox (Piston)

- Eksekusi di container terisolasi (Docker)
- Tidak ada akses network dari dalam sandbox
- Memory limit: 128MB per eksekusi
- CPU time limit: 10 detik
- Disk I/O dibatasi
- Tidak bisa spawn subprocess atau akses filesystem host

### 4.6 Data Privacy

- Data mahasiswa hanya disimpan yang diperlukan (data minimization)
- Tidak ada third-party analytics yang mengumpulkan PII
- Data dihapus otomatis 2 tahun setelah matrikulasi selesai
- Backup terenkripsi AES-256

---

## 5. Infrastruktur & Hosting

### 5.1 Environment

| Environment | Platform | Tujuan |
|-------------|----------|--------|
| Development | Local (localhost:3000) | Development harian |
| Staging | Vercel Preview | Testing sebelum produksi |
| Production | Vercel Production | Platform hidup |

### 5.2 Estimasi Biaya (per bulan)

| Service | Tier | Estimasi Biaya |
|---------|------|---------------|
| Vercel | Pro ($20/bln) | $20 |
| Supabase | Pro ($25/bln) | $25 |
| Upstash Redis | Pay-per-use | < $5 |
| Cloudflare | Free/Pro | $0–$20 |
| Piston (self-host) | VPS 2GB RAM | $10–$15 |
| **TOTAL** | | **~$60–85/bulan** |

> Untuk saat matrikulasi berlangsung (~2 minggu), biaya dapat dioptimalkan.

### 5.3 Domain & DNS

```
matrikulasi-trpl.kampus.ac.id  --> Vercel (A Record / CNAME)
api.matrikulasi-trpl.kampus.ac.id  --> Vercel API Routes
cdn.matrikulasi-trpl.kampus.ac.id  --> Cloudflare CDN
```

---

## 6. Skalabilitas

### 6.1 Strategi Menangani 200+ Concurrent Users

**Frontend (Vercel Edge)**:
- Static page di-serve dari CDN edge (milisecond latency)
- ISR (Incremental Static Regeneration) untuk konten modul yang jarang berubah
- Image optimization otomatis dari Vercel

**Backend (API Routes)**:
- Vercel serverless functions auto-scale (tidak perlu konfigurasi manual)
- Connection pooling ke Supabase via Supavisor (built-in di Supabase)
- Redis caching untuk query yang sering (leaderboard, daftar modul)

**Database (Supabase)**:
- PostgreSQL dengan connection pooler
- Read replicas untuk query berat (admin dashboard)
- Supabase Realtime untuk live leaderboard update

**Caching Strategy**:
```
Level 1: Browser cache (static assets, 1 tahun)
Level 2: CDN cache (halaman statis, 5 menit)
Level 3: Redis cache (leaderboard, 30 detik; daftar modul, 10 menit)
Level 4: DB query cache (PostgreSQL)
```

### 6.2 Load Testing Plan

- Tool: k6 atau Artillery
- Scenario: 250 user login bersamaan, 200 user akses kuis bersamaan
- Target: P95 response time < 500ms, 0 error
- Jadwal: 1 minggu sebelum launch

---

## 7. Monitoring & Observability

### 7.1 Tools

| Tool | Kegunaan |
|------|---------|
| Vercel Analytics | Web vitals, performance, traffic |
| Sentry | Error tracking, exception monitoring |
| Supabase Dashboard | Database metrics, slow queries |
| Upstash Console | Redis usage dan latency |
| PagerDuty / Uptime Robot | Uptime monitoring, alerting |

### 7.2 Alert Thresholds

| Metrik | Alert Level | Tindakan |
|--------|-------------|---------|
| Error rate > 1% | Warning | Cek Sentry |
| Error rate > 5% | Critical | Rollback deployment |
| P95 latency > 1s | Warning | Cek bottleneck |
| Uptime < 99% | Critical | Eskalasi ke DevOps |
| Memory usage > 80% | Warning | Review code |

---

## 8. CI/CD Pipeline

### 8.1 GitHub Actions Workflow

```yaml
# Ringkasan alur CI/CD

ON: Push to main/develop, Pull Request

STEPS:
1. Checkout code
2. Setup Node.js 20 + pnpm
3. Install dependencies (pnpm install --frozen-lockfile)
4. Type check (pnpm tsc --noEmit)
5. Lint (pnpm eslint)
6. Unit Tests (pnpm vitest run)
7. Build (pnpm build)
8. Security audit (pnpm audit --audit-level=high)
9. [IF PR] Preview deployment ke Vercel
10. [IF MAIN] Deploy ke Vercel Production
11. [IF MAIN] Run E2E tests (Playwright) di staging
12. Notify Slack/Discord
```

### 8.2 Deployment Strategy

- **Blue-Green Deployment** via Vercel (instant rollback)
- Feature flags untuk fitur eksperimental
- Database migration dijalankan sebelum deployment (tidak breaking)
- Rollback prosedur: `vercel rollback` dalam 30 detik

---

## Referensi

- Dokumen terkait: `prd.md`, `design.md`, `agents.md`
- Dibuat: Juli 2026
- Versi: 1.0.0
