# KERANGKA ACUAN KERJA (TERMS OF REFERENCE)
## PROGRAM MATRIKULASI PEMROGRAMAN DASAR MAHASISWA BARU
### PROGRAM STUDI SARJANA TERAPAN TEKNOLOGI REKAYASA PERANGKAT LUNAK (TRPL)
### POLITEKNIK KELAPA SAWIT CITRA WIDYA EDUKASI
**ANGKATAN 2026**

---

| Dokumen | Kerangka Acuan Kerja (Terms of Reference / TOR) |
| :--- | :--- |
| **Nama Program** | Matrikulasi Pemrograman Dasar TRPL 2026 |
| **Institusi** | Politeknik Kelapa Sawit Citra Widya Edukasi (CWE) |
| **Program Studi** | Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) |
| **Unit Penyelenggara** | Divisi Pemrograman — Panitia Matrikulasi Angkatan 2026 |
| **Sasaran Peserta** | Mahasiswa Baru TRPL Angkatan 2026 (100–120 Mahasiswa) |
| **Bentuk Kegiatan** | Pembelajaran Terpadu 3 Fase (Teori Kelas, Praktik Langsung, dan Proyek Daring) |
| **Waktu Pelaksanaan** | Masa Pra-Perkuliahan Semester Ganjil TA 2026/2027 |
| **Media Belajar** | Ruang Kelas / Lab Komputer dan Platform Web Matrikulasi TRPL (Pyodide Python WASM) |

---

### 1. LATAR BELAKANG

Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) Politeknik Kelapa Sawit Citra Widya Edukasi menyiapkan lulusan yang mampu membangun perangkat lunak dan otomasi sistem, termasuk digitalisasi operasional perkebunan kelapa sawit. Kemampuan dasar yang menopang seluruh mata kuliah lanjutan adalah pemrograman, yaitu kecakapan menerjemahkan logika pemecahan masalah ke dalam instruksi komputer.

Pada masa matrikulasi, sesi Pemrograman dijadwalkan langsung setelah sesi Algoritma agar mahasiswa dapat mempraktikkan alur diagram alir menjadi kode program nyata. Namun, mahasiswa baru TRPL 2026 memiliki latar belakang pendidikan yang beragam:
1. **Lulusan SMK RPL:** Sudah mengenal sintaks kode dan alur pemrograman dasar.
2. **Lulusan SMA IPA / SMK Teknik Non-IT:** Memiliki dasar logika analitis, tetapi belum pernah menulis kode program.
3. **Lulusan SMA IPS / Bahasa / Non-Teknis:** Belum pernah berinteraksi dengan terminal perintah maupun sintaks pemrograman.

Perbedaan latar belakang ini berpotensi menimbulkan kendala pada minggu-minggu pertama kuliah:
* **Waktu perkuliahan tersita untuk teknis instalasi:** Menyiapkan Python, VS Code, dan konfigurasi sistem operasi yang berbeda-beda sering memakan waktu lama.
* **Keraguan bagi pemula:** Mahasiswa non-IT kerap merasa tertinggal saat berhadapan langsung dengan sintaks kode dan pesan eror.
* **Keterbatasan pendampingan kelas:** Dosen dan asisten memiliki keterbatasan waktu untuk memeriksa kode setiap mahasiswa satu per satu di kelas besar.

Untuk mengatasi hal tersebut, Divisi Pemrograman menyelenggarakan program matrikulasi terstruktur dengan platform web interaktif tanpa instalasi lokal (*zero-setup*). Program ini membekali mahasiswa secara bertahap: pemahaman konsep di kelas, praktik koding langsung dengan bimbingan asisten, serta latihan mandiri terarah hingga penyelesaian proyek akhir.

---

### 2. TUJUAN KEGIATAN

1. **Menyamakan Pemahaman Dasar:** Memastikan seluruh mahasiswa baru memahami logika pemrograman sebelum perkuliahan semester ganjil dimulai.
2. **Kesiapan Lingkungan Praktik:** Mengeliminasi kendala instalasi lokal melalui platform koding berbasis web yang langsung dapat dijalankan dari peramban.
3. **Penyampaian Materi Komunikatif:** Menjelaskan konsep pemrograman melalui analogi kontekstual sehari-hari dan demonstrasi kode langsung (*live coding*).
4. **Evaluasi Pemahaman Terukur:** Mengukur lonjakan kemampuan peserta secara objektif melalui *pre-test* di awal sesi dan *post-test* di akhir sesi tatap muka.
5. **Kemandirian dan Portofolio:** Melatih mahasiswa memanfaatkan penguji otomatis (*auto-grader*), sistem peninjauan kode (*snapshot* bantuan), serta menghasilkan portofolio proyek mini pertama.

---

### 3. RUANG LINGKUP MATERI

#### 3.1 Materi yang Dicakup (*In-Scope*)
1. Korelasi alur algoritma dengan sintaks pemrograman Python 3.11.
2. Pengenalan antarmuka terminal konsol (*PowerShell*) dan hierarki penyimpanan berkas.
3. Variabel, tipe data dasar (*integer, float, string, boolean*), serta operasi input/output interaktif.
4. Struktur percabangan logika (*if, elif, else*) dan operator perbandingan.
5. Struktur perulangan (*for-loop, while-loop*) dan pencegahan eror *infinite loop*.
6. Modularisasi kode melalui fungsi dasar, parameter, dan nilai balik (*return value*).
7. Penggunaan struktur data *list* (*indexing, slicing, append*).
8. Pembacaan dan analisis pesan eror umum pemula (*syntax error, runtime error*).
9. Pengerjaan proyek akhir bertahap (*Sistem Kasir Warkop TRPL 2026*).

#### 3.2 Materi di Luar Cakupan (*Out-of-Scope*)
1. Pemrograman Berorientasi Objek lanjut (*Class, Inheritance, Polymorphism*).
2. Pengembangan antarmuka grafis pengguna (*GUI Desktop/Web*).
3. Pengelolaan basis data relasional (*SQL/RDBMS*) dan jaringan eksternal.  
*(Topik lanjutan tersebut menjadi materi mata kuliah resmi pada semester berjalan).*

---

### 4. METODE PELAKSANAAN (3 FASE)

Kegiatan dilaksanakan dalam tiga tahapan berurutan:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ FASE 1: TEORI & LOGIKA DASAR (TATAP MUKA / OFFLINE)                        │
│ Waktu   : Hari Ke-1 Matrikulasi (Pukul 10.55 – 11.55 WIB / 60 Menit)       │
│ Tempat  : Ruang 7.3, Lantai 7, Gedung 2 Politeknik Kelapa Sawit CWE        │
│ Pemandu : Ketua Divisi Pemrograman (Instruktur Utama)                      │
│ Materi  : Logika pemrograman, analogi variabel, percabangan, dan otomasi   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ FASE 2: PRAKTIK KODING, GAMES & TANYA JAWAB (TATAP MUKA / OFFLINE)         │
│ Waktu   : Hari Ke-1 Matrikulasi (Pukul 11.55 – 12.25 WIB) dilanjutkan      │
│           Post-Test (Pukul 12.25 – 12.40 WIB)                              │
│ Tempat  : Ruang 7.3, Lantai 7, Gedung 2 Politeknik Kelapa Sawit CWE        │
│ Pemandu : Instruktur Utama didampingi 4–6 Staf Asisten Divisi             │
│ Aktivitas: Praktik koding di laptop, live demo, games kuis, dan tanya jawab│
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ FASE 3: LATIHAN MANDIRI & SERTIFIKASI KELULUSAN (DARING / VIA WEBSITE)     │
│ Waktu   : Hari Ke-2 s.d. Hari Ke-6 (Rentang 5 Hari Kerja di Asrama/Rumah)  │
│ Media   : Platform Web Matrikulasi TRPL (Didukung Auto-Grader Otomatis)    │
│ Aktivitas: Pengerjaan modul M5–M7, proyek akhir M8, tiket bantuan asisten, │
│           dan penerbitan Sertifikat Kelulusan Resmi TRPL 2026 ber-QR Code  │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1 Rincian Tahapan
1. **Fase 1 — Teori dan Konsep (Offline, 60 Menit):**
   Instruktur menyampaikan pengantar pemrograman secara komunikatif: mengapa Python digunakan di TRPL, bagaimana komputer memproses data, konsep variabel dan tipe data, serta cara membaca pesan eror tanpa panik.
2. **Fase 2 — Praktik Terbimbing dan Evaluasi (Offline, 45 Menit):**
   Peserta membuka laptop untuk mempraktikkan kode dasar pada peramban web dan simulator terminal. Instruktur memandu *live-coding*, didampingi asisten yang berkeliling memberikan bimbingan teknis langsung meja ke meja. Sesi dilanjutkan kuis games logika singkat, tanya jawab, dan pengerjaan *post-test*.
3. **Fase 3 — Mandiri dan Sertifikasi (Online, 5 Hari):**
   Peserta melanjutkan modul lanjutan (perulangan, fungsi, dan *list*) serta proyek aplikasi kasir secara mandiri dari asrama. Apabila mahasiswa mengalami kebuntuan, mereka dapat menekan tombol **"Minta Bantuan"** di platform web untuk membagikan tautan kode ke asisten. Mahasiswa yang lulus pengujian kode 100% berhak mengunduh sertifikat digital kelulusan.

---

### 5. JADWAL, TEMPAT, DAN KETENTUAN PERANGKAT

#### 5.1 Tempat Pelaksanaan
* **Sesi Tatap Muka (Fase 1 & 2):** Ruang 7.3, Lantai 7, Gedung 2, Kampus Politeknik Kelapa Sawit Citra Widya Edukasi (CWE).
* **Sesi Mandiri (Fase 3):** Asrama mahasiswa atau kediaman masing-masing peserta melalui peramban web.

#### 5.2 Susunan Acara Sesi Pemrograman (Hari Ke-1)

| Waktu (WIB) | Durasi | Agenda Kegiatan | Keterangan & Pelaksana |
| :---: | :---: | :--- | :--- |
| **10.40 – 10.55** | 15 menit | **Pre-Test Pemrograman** | Pengerjaan soal awal untuk memetakan pemahaman dasar peserta *(Panitia)* |
| **10.55 – 11.55** | **60 menit** | **Fase 1: Pemaparan Materi Teori** | Penyampaian konsep logika pemrograman dan sintaks dasar *(Instruktur Utama)* |
| **11.55 – 12.25** | **30 menit** | **Fase 2: Praktik Koding & Diskusi** | Latihan koding langsung di laptop, games logika, dan tanya jawab *(Instruktur & Asisten)* |
| **12.25 – 12.40** | 15 menit | **Post-Test Pemrograman** | Evaluasi hasil belajar sesi tatap muka *(Peserta)* |
| **12.40 – 12.50** | 10 menit | **Penutupan & Pengarahan Fase 3** | Informasi pengerjaan mandiri daring di asrama *(MC & Divisi Pemrograman)* |

#### 5.3 Linimasa Program Keseluruhan

| No | Agenda / Tahapan | Rentang Waktu | Tempat / Sarana |
| :---: | :--- | :---: | :--- |
| 1 | Uji Coba Platform Web & Briefing Asisten | H-3 | Ruang Panitia / Daring |
| 2 | Koordinasi Soal Pre/Post-Test & Materi | H-1 | Ruang Sekretariat Acara |
| 3 | **Pelaksanaan Fase 1 & 2 (Tatap Muka)** | **Hari-H (10.40–12.50 WIB)** | **Ruang 7.3 Gedung 2 CWE** |
| 4 | **Pelaksanaan Fase 3 (Mandiri di Asrama)** | **Hari-H+1 s.d. Hari-H+5** | **Platform Web Matrikulasi** |
| 5 | Batas Akhir (*Deadline*) Proyek Akhir Kasir | Hari-H+5 (Pukul 23.59 WIB) | Platform Web Matrikulasi |
| 6 | Rekapitulasi Nilai & Verifikasi Sertifikat | Hari-H+6 s.d. Hari-H+7 | Database Verifikasi Web |
| 7 | Penyerahan Laporan Hasil ke Kaprodi TRPL | Hari-H+8 | Ruang Prodi TRPL CWE |

#### 5.4 Kebijakan Perangkat Koding
1. **Laptop adalah Perangkat Utama:** Setiap mahasiswa baru diwajibkan menggunakan laptop saat sesi praktik koding tatap muka.
2. **Penyediaan Laptop oleh Panitia:** Bagi mahasiswa baru yang belum memiliki atau tidak membawa laptop pada Hari-H, **panitia menyediakan unit laptop cadangan langsung di Ruang 7.3**.
3. **Smartphone (HP) Hanya Sebagai Cadangan Darurat:** Akses melalui smartphone atau tablet hanya diperkenankan sebagai cadangan darurat apabila unit laptop cadangan panitia telah terpakai seluruhnya, didukung skema belajar berpasangan (*pair-programming*).

---

### 6. LUARAN PROGRAM (*DELIVERABLES*)

1. **Sertifikat Kelulusan Resmi Matrikulasi TRPL 2026:**
   Diterbitkan digital bagi peserta yang menuntaskan seluruh latihan modul dan proyek akhir dengan validasi 100% pengujian *auto-grader*, lengkap dengan nomor registrasi dan QR Code verifikasi publik.
2. **Karya Portofolio Kode Mahasiswa:**
   Program aplikasi *Kasir Warkop TRPL 2026* fungsional karya mandiri setiap mahasiswa sebagai portofolio awal perkuliahan.
3. **Laporan Pemetaan Kesiapan Angkatan:**
   Dokumen analisis hasil belajar (perbandingan nilai *pre-test* dan *post-test*, modul yang paling membutuhkan pendampingan, serta rekapitulasi waktu penyelesaian) yang diserahkan kepada dosen pengampu semester ganjil.

---

### 7. STRUKTUR PELAKSANA DAN KOORDINASI

| Peran | Pelaksana (PIC) | Tugas Utama |
| :--- | :--- | :--- |
| **Penanggung Jawab** | Ketua Program Studi Sarjana Terapan TRPL | Mengarahkan kebijakan dan melegalkan sertifikat kelulusan. |
| **Pembina Program** | Dosen Pembina Kemahasiswaan TRPL | Memastikan materi selaras dengan kurikulum semester ganjil. |
| **Instruktur Utama** | **Ketua Divisi Pemrograman Matrikulasi 2026**<br>*(Felich Pehagasa Ginting)* | Menyusun kurikulum, membawakan materi teori 60 menit, memandu praktik, dan mengarahkan asisten. |
| **Asisten Lapangan** | **Staf Divisi Pemrograman TRPL**<br>*(4–6 Mahasiswa Senior)* | Memberikan asistensi meja ke meja saat praktik kelas, memandu games kuis, dan memantau tiket bantuan daring. |
| **Tim Teknis Web** | Divisi Teknis Platform | Memastikan keandalan server peramban (Pyodide), database Firestore, dan generator sertifikat. |
| **Narahubung Acara** | Dika Prasetyawan *(0821-6241-1486)* | Koordinasi integrasi susunan acara, tata tertib, dan logistik Ruang 7.3. |

---

### 8. MANAJEMEN RISIKO DAN MITIGASI

| Potensi Kendala | Lokasi/Fase | Dampak | Rencana Mitigasi |
| :--- | :---: | :--- | :--- |
| **Koneksi Internet Kampus Lambat** | Ruang 7.3 (Fase 2) | Pemuatan awal platform web terhambat. | Aset web telah dioptimasi dengan sistem penyimpanan lokal (*browser caching*); panitia menyiapkan hotspot tethering cadangan untuk darurat. |
| **Daya Baterai Laptop Habis** | Ruang 7.3 (Fase 2) | Praktik koding terhenti. | Panitia menyediakan kabel roll dan colokan ekstensi di setiap baris meja Ruang 7.3; peserta diimbau mengisi penuh baterai sebelum hadir. |
| **Peserta Tidak Membawa Laptop** | Ruang 7.3 (Fase 2) | Peserta kesulitan praktik mandiri. | Panitia meminjamkan unit laptop cadangan di ruangan; opsi akses via smartphone atau belajar berpasangan disiapkan sebagai cadangan darurat. |
| **Eror Perulangan Tak Berujung (*Infinite Loop*)** | Fase 2 & 3 | Peramban membeku (*freeze*). | Engine web dilengkapi pembatas waktu otomatis 7 detik (*timeout*) yang memutus eksekusi dan memunculkan petunjuk perbaikan kode. |
| **Kebuntuan Logika saat Belajar di Asrama** | Asrama (Fase 3) | Mahasiswa berhenti mengerjakan tugas. | Mahasiswa dapat menekan tombol **"Minta Bantuan"** di web editor untuk mengirimkan snapshot kode ke asisten divisi secara asinkron. |

---

### 9. PELAPORAN DAN KEBERLANJUTAN

1. **Laporan Pertanggungjawaban (LPJ):** Disusun setelah penutupan pengumpulan tugas, memuat dokumentasi kegiatan, statistik kenaikan nilai *pre-test* ke *post-test*, persentase kelulusan (target minimal 85%), serta catatan evaluasi teknis.
2. **Keberlanjutan Sistem:** Platform koding dan modul pembelajaran web tetap dibuka sepanjang semester ganjil sebagai sarana latihan mandiri dan diintegrasikan ke dalam program klinik bimbingan Himpunan Mahasiswa TRPL Politeknik Kelapa Sawit CWE.
