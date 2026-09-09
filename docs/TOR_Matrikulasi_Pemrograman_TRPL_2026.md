# KERANGKA ACUAN KERJA (TERMS OF REFERENCE)
## PROGRAM MATRIKULASI PEMROGRAMAN DASAR MAHASISWA BARU
### PROGRAM STUDI SARJANA TERAPAN TEKNOLOGI REKAYASA PERANGKAT LUNAK (TRPL)
**ANGKATAN 2026**

---

| Dokumen | Kerangka Acuan Kerja (Terms of Reference / TOR) |
| :--- | :--- |
| **Nama Program** | Matrikulasi Pemrograman Dasar TRPL 2026: *Bridging the Logic Gap* |
| **Unit Penyelenggara** | Divisi Pemrograman — Panitia Matrikulasi Mahasiswa Baru TRPL 2026 |
| **Sasaran Peserta** | Seluruh Mahasiswa Baru TRPL Angkatan 2026 (Estimasi: 100–120 Mahasiswa) |
| **Model Pelaksanaan** | *Two-Phase Blended Bootcamp* (Tatap Muka Intensif 4–6 Jam + Mandiri Asrama) |
| **Periode Pelaksanaan** | Masa Pra-Perkuliahan Semester Ganjil TA 2026/2027 |
| **Platform Pendukung** | Platform Web Matrikulasi TRPL (*Client-Side Pyodide WASM Engine*) |

---

### 1. LATAR BELAKANG (*WHY*)

Setiap awal tahun akademik, Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) menyambut mahasiswa baru dengan latar belakang pendidikan menengah yang sangat heterogen. Fakta lapangan menunjukkan disparitas kesiapan awal (*baseline gap*) yang signifikan:

1. **Lulusan SMK Rekayasa Perangkat Lunak (RPL):** Telah memiliki jam terbang koding, memahami sintaks pemrograman prosedural, dan terbiasa menyusun alur logika.
2. **Lulusan SMA Rumpun IPA / SMK Teknik Non-IT:** Memiliki daya nalar analitis yang kuat, namun belum pernah mentransformasikan logika matematis ke dalam sintaks bahasa pemrograman nyata.
3. **Lulusan SMA Rumpun IPS, Bahasa, atau Kejuruan Non-Teknis:** Belum pernah berinteraksi sama sekali dengan konsep komputasi, terminal konsol, maupun sintaks kode program.

Kesenjangan awal ini memicu rentetan kendala berulang pada minggu-minggu pertama perkuliahan reguler:

* **Kendala Konfigurasi Lingkungan (*Setup Fatigue*):**  
  Pada metode konvensional, pekan-pekan awal kerap terbuang hanya untuk instalasi interpreter Python, konfigurasi variabel lingkungan sistem (`PATH`), serta instalasi ekstensi editor (VS Code). Perbedaan sistem operasi (Windows 10/11, macOS, Linux) dan laptop mahasiswa sering memicu error teknis yang melunturkan antusiasme belajar sebelum materi logika sempat dipahami.
* **Hambatan Psikologis (*Imposter Syndrome*):**  
  Mahasiswa baru tanpa latar belakang IT kerap merasa terintimidasi melihat layar terminal hitam dan pesan *syntax error* berbahasa Inggris, yang berujung pada rasa minder dan keengganan berpartisipasi aktif di kelas.
* **Keterbatasan Rasio Asistensi di Kelas Besar:**  
  Dalam kelas beranggotakan 100+ mahasiswa, tim pengajar dan asisten laboratorium memiliki keterbatasan fisik untuk memeriksa baris kode mahasiswa satu per satu secara manual, memperlambat proses perbaikan logika (*feedback loop*).

Menjawab tantangan tersebut, **Divisi Pemrograman Panitia Matrikulasi TRPL 2026** menyelenggarakan program matrikulasi terstruktur. Program ini mengintegrasikan pengajaran intensif langsung oleh Ketua Divisi Pemrograman bersama jajaran staf divisi dengan eksplorasi mandiri terpandu melalui platform pembelajaran web modern berbasis WebAssembly (*zero-setup environment*).

---

### 2. URAIAN DAN BATASAN KEGIATAN (*WHAT*)

#### 2.1 Uraian Kegiatan
Kegiatan ini merupakan pembekalan intensif logika komputasional dan pemrograman prosedural dasar menggunakan bahasa **Python 3.11** melalui platform web interaktif yang dapat diakses dari browser mana pun tanpa proses instalasi software di laptop peserta.

#### 2.2 Batasan Kegiatan (*In-Scope vs Out-of-Scope*)
Untuk menjaga fokus materi dan ketercapaian kompetensi dalam waktu yang terbatas, ditetapkan batasan berikut:

* **Ruang Lingkup Termasuk (*In-Scope*):**
  1. Pengenalan antarmuka konsol/terminal dasar (*PowerShell*) dan hierarki folder proyek.
  2. Logika dekomposisi masalah dan pembacaan diagram alir (*flowchart*).
  3. Variabel, tipe data primitif (*integer, float, string, boolean*), serta operasi input/output dinamis.
  4. Struktur percabangan keputusan (*if, elif, else*) dan ekspresi logika Boolean.
  5. Perulangan (*for-loop, while-loop*) dan mitigasi *infinite loop*.
  6. Modularisasi kode melalui fungsi, parameter, dan nilai balik (*return value*).
  7. Koleksi data terstruktur dasar (*list indexing, slicing, append, iteration*).
  8. Pengerjaan proyek akhir terintegrasi 3 fase (*Sistem Kasir Warkop TRPL 2026*).

* **Ruang Lingkup Dikecualikan (*Out-of-Scope*):**
  1. Pemrograman Berorientasi Objek lanjut (*OOP: Class, Inheritance, Polymorphism*).
  2. Pengembangan antarmuka grafis pengguna (*GUI Desktop/Web Frameworks*).
  3. Manajemen basis data relasional (*SQL/RDBMS*) dan konektivitas jaringan eksternal.
  4. Topik-topik lanjutan ini secara khusus dialokasikan untuk mata kuliah reguler di semester berikutnya.

---

### 3. MAKSUD DAN TUJUAN (*WHY & BENEFIT*)

#### 3.1 Maksud Kegiatan
Menyediakan wadah pembekalan pra-kuliah yang adaptif, ramah pemula, dan terstandar guna menyamakan nalar komputasi seluruh mahasiswa baru TRPL Angkatan 2026.

#### 3.2 Tujuan Khusus
1. **Penyetaraan Baseline Teknis:** Memastikan seluruh mahasiswa baru memahami logika dasar pemrograman secara merata sebelum perkuliahan perdana dimulai.
2. **Efisiensi Waktu Perkuliahan:** Mengeliminasi waktu terbuang untuk instalasi lokal pada pekan pertama kuliah melalui platform berbasis WebAssembly.
3. **Penyampaian Materi Humanis & Terarah:** Memandu mahasiswa baru melalui analogi kehidupan sehari-hari, live-coding langsung, dan dekonstruksi pesan error tanpa jargon yang membingungkan.
4. **Membina Kemandirian & Budaya Konsultasi:** Melatih mahasiswa memanfaatkan alat bantu pengujian otomatis (*Auto-Grader*) dan fitur peninjauan kode jarak jauh (*Code Snapshot*).

#### 3.3 Manfaat Kegiatan
* **Bagi Mahasiswa Baru:** Tumbuhnya rasa percaya diri, hilangnya rasa takut terhadap koding, serta penguasaan portofolio proyek mini pertama.
* **Bagi Dosen Pengampu:** Mahasiswa masuk ke kelas perkuliahan reguler dengan lingkungan laptop yang telah terkonfigurasi dan pemahaman logika yang seragam.
* **Bagi Program Studi TRPL:** Mengurangi angka ketertinggalan akademik (*academic attrition*) pada semester awal.

---

### 4. METODE DAN TAHAPAN PELAKSANAAN (*HOW*)

Pelaksanaan menggunakan metode **Two-Phase Blended Bootcamp**:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ FASE 1: LIVE INTERACTIVE WORKSHOP (DURASI 4 – 6 JAM)                       │
│ Sifat   : Tatap Muka Terpusat (Ruang Pertemuan / Kelas / Auditorium)       │
│ Pemandu : Ketua Divisi Pemrograman (Lead) didampingi Staf Divisi           │
│ Materi  : Modul M0 s.d. M4 (Orientasi, Lingkungan Kerja, Logika, Variabel) │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ FASE 2: GUIDED INDEPENDENT MASTERY (ASRAMA / TEMPAT TINGGAL)               │
│ Sifat   : Pembelajaran Mandiri Fleksibel (Rentang 5 – 7 Hari)              │
│ Bantuan : Auto-Grader Otomatis + Snapshot Kode "Minta Bantuan" ke Asisten  │
│ Materi  : Modul M5 s.d. M8 (Looping, Fungsi, List Data, Proyek Kasir)      │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 4.1 Tahapan Alur Proyek
1. **Tahap Persiapan (H-14 s.d. H-1):**
   - Finalisasi materi kurikulum M0–M8 dan konfigurasi server platform.
   - Pendaftaran dan sinkronisasi akun mahasiswa baru ke dalam database Firestore.
   - Pengujian beban (*load test*) koneksi dan caching asset static Pyodide.
2. **Tahap Eksekusi Fase 1 — Sesi Live Workshop (Hari-H, 4–6 Jam):**
   - Pembukaan, aktivasi akun serempak, dan pemetaan awal (Modul M0 & M1).
   - Live demo logika algoritma dan variabel (Modul M2 & M3).
   - Praktik intensif logika percabangan keputusan *if-else* (Modul M4).
   - Sosialisasi tata cara pengerjaan mandiri dan demo tombol "Minta Bantuan".
3. **Tahap Eksekusi Fase 2 — Mandiri di Asrama (Hari ke-2 s.d. Hari ke-7):**
   - Eksplorasi mandiri Modul M5 (Looping), M6 (Fungsi), dan M7 (List Data).
   - Pengerjaan Capstone Mini Project Kasir Warkop TRPL (Modul M8) melalui scaffolding 3 fase.
   - Pendampingan asinkron oleh tim asisten via tautan kode snapshot.
4. **Tahap Evaluasi & Pelaporan (Hari ke-8 s.d. Hari ke-10):**
   - Verifikasi data submission oleh tim panitia.
   - Penerbitan Sertifikat Digital Kelulusan resmi ber-QR Code.
   - Penyusunan Laporan Pertanggungjawaban (LPJ) dan profil kesiapan angkatan.

---

### 5. JADWAL DAN TEMPAT PELAKSANAAN (*WHEN & WHERE*)

#### 5.1 Tempat Pelaksanaan
* **Fase 1 (Live Workshop):** Ruang Pertemuan Terpusat Kampus / Auditorium / Ruang Kelas Bersama (Disesuaikan dengan ketersediaan ruang prodi, dilengkapi proyektor, terminal stopkontak, dan koneksi internet stabil).
* **Fase 2 (Mandiri):** Asrama Mahasiswa / Tempat Tinggal masing-masing peserta.

#### 5.2 Matriks Jadwal Kegiatan (Time Table)

| No | Fase / Rangkaian Agenda | Durasi | Estimasi Tanggal | Tempat / Lokasi |
| :---: | :--- | :---: | :---: | :--- |
| 1 | Pengecekan Kesiapan Platform & Briefing Staf Divisi | 1 Hari | H-3 Pelaksanaan | Ruang Sekretariat / Daring |
| 2 | **Fase 1: Live Interactive Workshop (M0–M4)** | 5 Jam | Hari-H (Pkl 08.00–13.00) | Ruang Tatap Muka Terpusat |
| 3 | **Fase 2: Pengerjaan Mandiri Terpandu (M5–M8)** | 5 Hari | Hari-H+1 s.d. Hari-H+5 | Asrama / Kediaman Peserta |
| 4 | Batas Akhir (*Deadline*) Submission Proyek M8 | — | Hari-H+5 (Pkl 23.59 WIB) | Platform Web Matrikulasi |
| 5 | Rekapitulasi Nilai & Penerbitan Sertifikat Digital | 2 Hari | Hari-H+6 s.d. Hari-H+7 | Sistem Verifikasi Sertifikat |
| 6 | Penyerahan Laporan Pertanggungjawaban ke Kaprodi | 1 Hari | Hari-H+8 | Ruang Prodi TRPL |

---

### 6. PRODUK DAN LUARAN KEGIATAN (*DELIVERABLES*)

1. **Sertifikat Digital Resmi Kelulusan Matrikulasi TRPL 2026:**
   - Diterbitkan bagi peserta yang menuntaskan seluruh latihan M0–M8 dengan validasi 100% test cases.
   - Dilengkapi nomor sertifikat unik dan QR Code verifikasi publik.
2. **Karya Portofolio Proyek Konsol Mahasiswa:**
   - Program aplikasi *Kasir Warkop TRPL 2026* fungsional karya masing-masing mahasiswa baru.
3. **Laporan Pemetaan Profil Kesiapan Angkatan:**
   - Dokumen analitik performa angkatan (rata-rata waktu penyelesaian modul, modul paling menantang, grafik sebaran nilai) sebagai rekomendasi awal bagi dosen pengampu mata kuliah semester ganjil.

---

### 7. TIM PELAKSANA, EVALUASI, DAN IDENTIFIKASI KEAHLIAN (*WHO & SKILLS*)

Keberhasilan program ditopang oleh pembagian peran terstruktur dan kualifikasi keahlian yang spesifik:

| Peran / Posisi | Person In Charge (PIC) | Tanggung Jawab Utama | Standar Kualifikasi & Keahlian |
| :--- | :--- | :--- | :--- |
| **Penanggung Jawab** | Ketua Program Studi Sarjana Terapan TRPL | Pengarah kebijakan dan pengesah legalitas sertifikat kelulusan. | Pimpinan Prodi / Dosen Tetap |
| **Pembina Program** | Dosen Pembina Kemahasiswaan / Dosen Pengampu | Supervisi keselarasan materi dengan kurikulum perkuliahan resmi. | Dosen Rumpun Rekayasa PL |
| **Instruktur Utama (*Lead Instructor*)** | **Ketua Divisi Pemrograman Matrikulasi 2026** | Memimpin pengajaran langsung sesi live workshop (M0–M4), merancang kurikulum, dan mengarahkan live-coding. | • Mahasiswa Senior TRPL<br>• Keahlian Python, Web Dev, & Komputasi Awan<br>• Kemampuan *Public Speaking* & Mentoring Humanis |
| **Fasilitator Lapangan (*Teaching Assistants*)** | **Staff Divisi Pemrograman TRPL** (4–6 Personil) | Memberikan asistensi teknis *one-on-one* saat sesi live dan memantau kode snapshot saat fase asrama. | • Mahasiswa TRPL Aktif<br>• Pemahaman sintaks Python & logika debugging<br>• Ketelitian analisis error algoritma |
| **Tim Teknis & Infrastruktur** | Divisi Teknis Platform | Mengawal keandalan server Firestore, CDN Pyodide, dan monitoring performa web. | • Keahlian Next.js, Firebase, & Web Worker optimization |

---

### 8. MANAJEMEN RISIKO DAN MITIGASI ISU (*RISK MANAGEMENT*)

Untuk memastikan kegiatan berjalan lancar tanpa kendala fatal di lapangan, diidentifikasi potensi risiko serta rencana kontinjensi berikut:

| Potensi Isu / Masalah | Tingkat Risiko | Dampak Operasional | Tindakan Pencegahan & Rencana Mitigasi |
| :--- | :---: | :--- | :--- |
| **Jaringan Internet Kampus Drop / Lambat** | Sedang | Mahasiswa lambat mengunduh runtime Pyodide pertama kali. | • Engine Pyodide dan worker script telah dioptimasi dengan *browser caching immutable* dan CDN preconnect.<br>• Panitia menyediakan cadangan dedicated tethering hotspot untuk akses darurat. |
| **Baterai Laptop Habis / Stopkontak Terbatas** | Tinggi | Laptop peserta mati di tengah sesi praktik koding. | • Panitia logistik menyediakan 10–15 unit kabel roll / colokan ekstensi di setiap deretan meja peserta.<br>• Mahasiswa diimbau mengisi daya penuh laptop sebelum hadir. |
| **Peserta Tidak Memiliki Laptop pada Hari-H** | Rendah | Tidak bisa mengikuti sesi live koding mandiri. | • Platform responsif di tablet/smartphone via browser Safari/Chrome.<br>• Disediakan 3–5 unit laptop cadangan panitia atau diarahkan berpasangan (*pair-programming*). |
| **Infinite Loop pada Kode Mahasiswa** | Tinggi | Browser tab membeku (*freeze*) akibat loop tak berujung. | • Sistem *pyodideRunner* dilengkapi Web Worker sandbox dengan timeout otomatis 7 detik yang memutus eksekusi dan memunculkan tips solusi. |
| **Kebuntuan Logika saat di Asrama** | Sedang | Mahasiswa frustrasi dan berhenti melanjutkan tugas. | • Disediakan tombol **"Minta Bantuan"** yang merekam snapshot kode permanen untuk langsung dibahas bersama mentor di grup pendampingan. |

---

### 9. LOGISTIK DAN RENCANA ANGGARAN BIAYA (*HOW MUCH*)

Berikut adalah proyeksi Rencana Anggaran Biaya (RAB) operasional kegiatan matrikulasi:

| No | Uraian Pengeluaran | Kuantitas / Satuan | Harga Satuan (Rp) | Total Estimasi (Rp) | Sumber Kebutuhan |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **A** | **Logistik & Perlengkapan Acara** | | | | |
| 1 | Stopkontak Ekstensi (Kabel Roll 10m) | 8 Unit | 75.000 | 600.000 | Inventaris Panitia / Sewa |
| 2 | Banner / Backdrop Panggung Kegiatan (4x2 m) | 1 Buah | 200.000 | 200.000 | Percetakan |
| 3 | ID Card Panitia & Tanda Pengenal Peserta | 120 Paket | 5.000 | 600.000 | ATK & Kesekretariatan |
| **B** | **Konsumsi Sesi Tatap Muka (Live Workshop)** | | | | |
| 4 | Snack Box Mahasiswa Baru & Panitia | 130 Kotak | 15.000 | 1.950.000 | Konsumsi Sesi Istirahat |
| 5 | Air Mineral Gelas (Dus) | 6 Dus | 35.000 | 210.000 | Konsumsi Peserta |
| 6 | Konsumsi Makan Siang Panitia & Instruktur | 15 Porsi | 30.000 | 450.000 | Pasca Sesi Live |
| **C** | **Infrastruktur & Digital Rewards** | | | | |
| 7 | Server Caching & Kuota Kupon API Firestore | 1 Paket | 300.000 | 300.000 | Operasional Cloud Web |
| 8 | Reward Top 3 Angkatan di Leaderboard (Merchandise) | 3 Paket | 100.000 | 300.000 | Apresiasi Mahasiswa Terbaik |
| 9 | Biaya Tak Terduga / Medis Ringan | 1 Paket | 300.000 | 300.000 | Kontinjensi Lapangan |
| **TOTAL ESTIMASI ANGGARAN (RAB)** | | | | **Rp 4.910.000** | *(Empat Juta Sembilan Ratus Sepuluh Ribu Rupiah)* |

---

### 10. PELAKSANA DAN PENANGGUNG JAWAB (*WHO*)

* **Penanggung Jawab Umum:** Ketua Program Studi Sarjana Terapan TRPL
* **Pengarah Teknis:** Dosen Pembina Kemahasiswaan TRPL
* **Ketua Pelaksana Matrikulasi TRPL 2026:** Mahasiswa TRPL yang ditunjuk prodi/himpunan
* **Ketua Divisi Pemrograman (*Lead Instructor*):** **Felich Pehagasa Ginting**
* **Staf Divisi Pemrograman (*Teaching Assistants*):** Jajaran staf divisi mahasiswa senior TRPL
* **Divisi Logistik & Konsumsi:** Staf Panitia Matrikulasi Angkatan 2026

---

### 11. PELAPORAN DAN KEBERLANJUTAN PROGRAM (*SUSTAINABILITY*)

#### 11.1 Penyusunan Laporan
Setelah seluruh rangkaian Fase 1 dan Fase 2 rampung, Divisi Pemrograman menyusun **Laporan Pertanggungjawaban (LPJ)** yang memuat:
1. Laporan realisasi anggaran dan dokumentasi pelaksanaan kegiatan.
2. Statistik kelulusan mahasiswa baru (persentase kelulusan target: minimal 85%).
3. Rekapitulasi submission proyek Kasir Warkop TRPL beserta catatan evaluasi kode.

#### 11.2 Keberlanjutan Program (*Sustainability*)
* **Transisi Menuju Perkuliahan Reguler:** Platform dan repository koding mahasiswa akan tetap aktif selama satu semester penuh sebagai media latihan (*sandbox*) dan referensi materi mandiri.
* **Klinik Pemrograman HIMA TRPL:** Mekanisme snapshot "Minta Bantuan" akan diadopsi secara berkelanjutan sebagai infrastruktur *peer-mentoring* mingguan yang difasilitasi oleh Himpunan Mahasiswa TRPL.

---

### LEMBAR PENGESAHAN

Ditetapkan di : ____________________  
Pada tanggal  : ____________________ 2026  

<br>

Menyetujui dan Mengesahkan,

| Mengetahui,<br>Ketua Program Studi Sarjana Terapan TRPL | Menyetujui,<br>Ketua Pelaksana Matrikulasi 2026 | Yang Mengajukan,<br>Ketua Divisi Pemrograman Matrikulasi 2026 *(Lead Instructor)* |
| :---: | :---: | :---: |
| <br><br><br><br>____________________________________<br>**NIP. ........................................** | <br><br><br><br>____________________________________<br>**NIM. ........................................** | <br><br><br><br>____________________________________<br>**NIM. ........................................** |
