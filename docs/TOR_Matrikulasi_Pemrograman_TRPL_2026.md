# KERANGKA ACUAN KERJA (TERMS OF REFERENCE)
## KEGIATAN MATRIKULASI PEMROGRAMAN DASAR
### PROGRAM STUDI SARJANA TERAPAN TEKNOLOGI REKAYASA PERANGKAT LUNAK (TRPL)
**ANGKATAN 2026**

---

| Dokumen | Kerangka Acuan Kerja (Terms of Reference) |
| :--- | :--- |
| **Unit Penyelenggara** | Divisi Pemrograman — Panitia Matrikulasi Mahasiswa Baru TRPL 2026 |
| **Sasaran Peserta** | Seluruh Mahasiswa Baru TRPL Angkatan 2026 |
| **Metode Pelaksanaan** | *Two-Phase Blended Bootcamp* (Sesi Live Terbimbing & Belajar Mandiri Terpandu) |
| **Waktu Pelaksanaan** | Periode Pra-Perkuliahan Semester Ganjil TA 2026/2027 |
| **Platform Pendukung** | Platform Matrikulasi Pemrograman TRPL 2026 (*Browser-based WASM*) |

---

### 1. LATAR BELAKANG

Setiap awal tahun akademik, Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) menerima mahasiswa baru dengan latar belakang pendidikan menengah yang sangat beragam. Kondisi riil di lapangan menunjukkan bahwa input mahasiswa terbagi ke dalam beberapa kelompok dengan tingkat kesiapan teknis yang timpang:

1. **Lulusan SMK Rekayasa Perangkat Lunak (RPL):** Telah memiliki jam terbang menulis baris kode, memahami sintaks dasar, dan terbiasa dengan struktur logika percabangan/perulangan.
2. **Lulusan SMA Rumpun IPA / SMK Non-IT:** Memiliki daya nalar matematika yang cukup baik, namun belum pernah mengimplementasikan logika berpikir tersebut ke dalam sintaks bahasa pemrograman nyata.
3. **Lulusan SMA Rumpun IPS, Bahasa, atau Kejuruan Lain:** Belum pernah berinteraksi sama sekali dengan konsep komputasi, terminal konsol, maupun bahasa pemrograman.

Kesenjangan awal (*baseline gap*) yang lebar ini kerap menimbulkan kendala klasik pada pekan-pekan awal perkuliahan mata kuliah inti seperti **Algoritma dan Pemrograman**:

* **Hambatan Konfigurasi Lingkungan (*Setup Fatigue*):**  
  Pada metode pengajaran konvensional, hari-hari pertama kerap habis hanya untuk memandu instalasi interpreter Python, konfigurasi *Environment Variables* (`PATH`), serta instalasi ekstensi editor kode (VS Code). Perbedaan sistem operasi (Windows 10/11, macOS, Linux) dan spesifikasi laptop mahasiswa sering kali memicu error instalasi yang menurunkan antusiasme belajar sebelum materi logika dimulai.
* **Sindrom Minder dan Hambatan Mental (*Imposter Syndrome*):**  
  Mahasiswa tanpa latar belakang IT kerap merasa terintimidasi saat melihat layar hitam antarmuka baris perintah (*Command Line Interface* / CLI) dan pesan *syntax error* berbahasa Inggris. Hal ini memicu kecenderungan pasif di kelas dan keengganan bertanya.
* **Keterbatasan Rasio Asistensi di Kelas Besar:**  
  Dalam kelas yang beranggotakan puluhan hingga ratusan mahasiswa, dosen dan asisten laboratorium tidak memiliki kapasitas waktu yang cukup untuk memeriksa logika kode mahasiswa satu per satu secara manual, sehingga umpan balik perbaikan (*feedback loop*) menjadi lambat.

Untuk menjembatani kesenjangan tersebut secara efektif tanpa membebani jadwal perkuliahan formal, **Divisi Pemrograman Panitia Matrikulasi TRPL 2026** menyelenggarakan program matrikulasi terstruktur. Kegiatan ini menggabungkan pengajaran intensif langsung oleh Ketua Divisi Pemrograman didampingi staf divisi dengan eksplorasi mandiri terpandu melalui platform pembelajaran web interaktif berbasis WebAssembly (*zero-setup environment*).

---

### 2. MAKSUD DAN TUJUAN

#### 2.1 Maksud Kegiatan
Menyelenggarakan pembekalan dasar pemrograman yang terstandar, inklusif, dan adaptif guna menyamakan pemahaman logika dasar serta membangun kesiapan mental seluruh mahasiswa baru TRPL 2026 sebelum memasuki kurikulum perkuliahan sarjana terapan.

#### 2.2 Tujuan Khusus
1. **Penyetaraan Kemampuan Logika Dasar:** Memastikan seluruh mahasiswa baru—tanpa memandang latar belakang asal sekolah—menguasai fondasi berpikir komputasional (*computational thinking*), tipe data, struktur keputusan (*if-else*), perulangan (*loops*), modularisasi fungsi (*functions*), serta pengorganisasian data (*lists/arrays*).
2. **Eliminasi Kendala Teknis Awal:** Menghilangkan friksi instalasi lokal pada minggu pertama kuliah melalui pemanfaatan engine Python 3.11 berbasis WebAssembly (Pyodide) yang dapat langsung dijalankan di browser mahasiswa.
3. **Penyampaian Materi Terarah dan Humanis:** Menghadirkan sesi kelas interaktif langsung yang dipandu oleh Ketua Divisi Pemrograman bersama jajaran Staf Divisi Pemrograman dengan pendekatan analogi nyata, tips praktis senior, dan dekonstruksi pesan error.
4. **Pembentukan Kemandirian & Budaya Konsultasi Terstruktur:** Membiasakan mahasiswa memecahkan persoalan koding secara mandiri di asrama/tempat tinggal dengan dukungan sistem koreksi otomatis (*auto-grader*) dan mekanisme peninjauan kode berbasis tautan instan (*code snapshot*).

---

### 3. METODE DAN MEKANISME PELAKSANAAN

Mengingat daya tampung kognitif mahasiswa pemula terhadap konsep logika baru memiliki batas toleransi tertentu, kegiatan matrikulasi dirancang secara realistis menggunakan pendekatan **Two-Phase Blended Bootcamp**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ FASE 1: LIVE INTERACTIVE WORKSHOP (DURASI 4 – 6 JAM)                     │
│ Format : Sesi Tatap Muka Terpusat (Ruang Pertemuan / Kelas / Aula)       │
│ Pemandu: Dipandu langsung oleh Ketua Divisi & Staf Divisi Pemrograman    │
│ Cakupan: Modul M0 s.d. M4 (Orientasi, Workspace, Logika, Variabel, If)   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ FASE 2: GUIDED INDEPENDENT MASTERY (ASRAMA / TEMPAT TINGGAL)             │
│ Format : Pembelajaran Mandiri Terpandu Berbasis Platform Web             │
│ Dukungan: Auto-Grader Otomatis + Pendampingan Mentor via Code Snapshot  │
│ Cakupan: Modul M5 s.d. M8 (Looping, Fungsi, List Data, Proyek Kasir)    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

#### FASE 1: Live Interactive Workshop (Tatap Muka 4 – 6 Jam)
Sesi tatap muka intensif yang bertujuan meruntuhkan rasa takut awal terhadap koding dan menanamkan fondasi logika alur keputusan. Seluruh materi pada sesi ini diajarkan secara langsung oleh **Ketua Divisi Pemrograman Matrikulasi 2026** sebagai *Lead Instructor*, didampingi oleh segenap **Staf Divisi Pemrograman** sebagai *Teaching Assistants* yang mendampingi mahasiswa secara langsung saat praktik koding.

* **Target Modul:** **M0 sampai M4**
* **Rasional Batas Modul:** Modul M0–M4 mencakup orientasi pola pikir komputasi hingga percabangan (`if-elif-else`). Titik ini merupakan ambang batas krusial (*critical milestone*) di mana mahasiswa mulai merasakan bahwa program yang mereka tulis mampu mengambil keputusan logis secara mandiri.

**Rancangan Susunan Acara (Rundown) Sesi Live (Estimasi 5 Jam Bersih + Istirahat):**

| Sesi | Waktu / Durasi | Agenda & Topik Bahasan | Aktivitas Pembelajaran | Output Capaian Mahasiswa |
| :---: | :---: | :--- | :--- | :--- |
| **I** | 08.00 – 08.45<br>*(45 Menit)* | **Orientasi & Ruang Kerja (M0 – M1)**<br>• Pembukaan & pengenalan platform web.<br>• Dekonstruksi rasa takut terhadap *syntax error*.<br>• Konsep ruang kerja dan terminal dasar. | • Login platform tanpa instalasi.<br>• Menjalankan perintah terminal `python --version` & `ls`.<br>• Eksekusi skrip `print("Hello World")` di browser. | Akun aktif; mahasiswa membuktikan sendiri bahwa ngoding tidak rumit dan tidak butuh laptop mahal. |
| **II** | 08.45 – 10.00<br>*(75 Menit)* | **Logika, Tipe Data & Input (M2 – M3)**<br>• Dekomposisi masalah (analogi resep mie instan).<br>• Variabel, integer, float, string, boolean.<br>• Operasi matematika dan scanner `input()`. | • Live-coding dipandu instruktur.<br>• Latihan membuat program kalkulator usia & kasir 1 menu.<br>• Eksperimen tipe data via Visual Debugger. | Mahasiswa paham konsep penyimpanan memori variabel dan interaksi input-output pengguna. |
| **—** | 10.00 – 10.30<br>*(30 Menit)* | **Istirahat & Brain Reset** | Jeda istirahat untuk memulihkan konsentrasi dan mencegah kejenuhan kognitif. | Kesiapan energi peserta kembali optimal. |
| **III** | 10.30 – 12.00<br>*(90 Menit)* | **Logika Keputusan / Percabangan (M4)**<br>• Operator perbandingan (`==`, `!=`, `<`, `>`).<br>• Logika multi-kondisi (`and`, `or`, `not`).<br>• Struktur percabangan `if`, `elif`, dan `else`. | • Studi kasus pintu bioskop & pengecekan KTP.<br>• Tantangan koding parsons problem & kuis interaktif M4.<br>• Evaluasi kelulusan kode melalui *Auto-Grader*. | Mahasiswa mampu menyusun logika seleksi kondisi bertingkat dengan skor auto-grader 100%. |
| **IV** | 12.00 – 12.30<br>*(30 Menit)* | **Sosialisasi Fase Mandiri & Q&A**<br>• Roadmap pengerjaan modul lanjutan (M5–M8).<br>• Tutorial fitur *"Minta Bantuan"* (Snapshot Link).<br>• Ketentuan tenggat waktu & sertifikasi. | • Simulasi pembuatan link snapshot saat error.<br>• Pembagian kelompok mentoring senior.<br>• Sesi tanya jawab penutup. | Mahasiswa siap dan percaya diri untuk melanjutkan eksplorasi secara mandiri di asrama. |

---

#### FASE 2: Guided Independent Mastery (Belajar Mandiri di Asrama / Tempat Tinggal)
Setelah memiliki pemahaman logika dasar dari sesi tatap muka, mahasiswa diberikan ruang waktu yang lebih fleksibel untuk mengkaji konsep yang membutuhkan perenungan mendalam dan eksplorasi mandiri (*trial and error*).

* **Target Modul:** **M5 sampai M8**
  * **Modul M5 (Perulangan / Loops):** Memahami konsep iterasi terhitung (*for loop*), perulangan berbasis kondisi (*while loop*), dan mitigasi *infinite loop*.
  * **Modul M6 (Fungsi & Prosedur):** Modularisasi kode, parameterisasi fungsi, dan pemanfaatan nilai kembali (*return value*).
  * **Modul M7 (Struktur Data List):** Pengelolaan koleksi data, indeks, pemotongan (*slicing*), penambahan data (*append*), dan perulangan elemen list.
  * **Modul M8 (Mini Project Akhir - Kasir Warkop TRPL):** Integrasi menyeluruh dari M1–M7 melalui scaffolding 3 tahap:
    * *Fase 1:* Perhitungan total item dan harga belanja.
    * *Fase 2:* Validasi input, logika diskon member, dan penanganan kesalahan.
    * *Fase 3:* Pemformatan struk transaksi belanja yang rapi dan siap cetak.

* **Mekanisme Pendampingan Asinkron:**
  1. **Uji Otomatis Real-Time (Auto-Grader):** Mahasiswa mendapatkan hasil koreksi instan pada setiap kode yang disubmit, lengkap dengan visualisasi perbedaan output (*Diff Viewer*) jika output belum sesuai.
  2. **Fitur Snapshot "Minta Bantuan":** Ketika mahasiswa mengalami kendala logika atau error buntu di asrama, mahasiswa cukup menekan tombol *"Minta Bantuan"*. Sistem otomatis mengunci baris kode, riwayat console terminal, dan pesan error ke dalam URL unik (`/help/[snapshotId]`).
  3. **Kanal Mentoring Terarah:** Link snapshot tersebut dikirimkan ke forum diskusi angkatan/grup mentoring, sehingga asisten laboratorium atau senior mentor dapat langsung meninjau permasalahan tanpa perlu meminta mahasiswa mengambil foto layar laptop yang buram.
  4. **Rentang Waktu Pengerjaan:** Mahasiswa diberikan rentang waktu pengerjaan selama 5 (lima) hingga 7 (tujuh) hari kalender setelah sesi live workshop berakhir.

---

### 4. KURIKULUM DAN RINCIAN MODUL

| Kode | Nama Modul | Fase Belajar | Estimasi Waktu | Analogi & Konsep Kunci |
| :---: | :--- | :---: | :---: | :--- |
| **M0** | Kuis Pemetaan & Orientasi | Live Workshop | 20 Menit | Analogi belajar instrumen musik, dekomposisi masalah, etika koding. |
| **M1** | Komputer & Ruang Kerja | Live Workshop | 25 Menit | Navigasi direktori, pengenalan terminal PowerShell, eksekusi berkas `.py`. |
| **M2** | Logika & Algoritma | Live Workshop | 35 Menit | Analogi memasak mie instan, bagan alur (*flowchart*), urutan langkah logis. |
| **M3** | Variabel & Tipe Data | Live Workshop | 40 Menit | Analogi kotak berlabel, manipulasi string, operasi angka, dan input dinamis. |
| **M4** | Percabangan (*If-Else*) | Live Workshop | 60 Menit | Analogi pemeriksaan usia tiket bioskop, percabangan bertingkat (*nested if*). |
| **M5** | Perulangan (*Loops*) | Mandiri di Asrama | 55 Menit | Analogi putaran lari lapangan, pompa air otomatis, iterasi `for` dan `while`. |
| **M6** | Fungsi & Prosedur | Mandiri di Asrama | 60 Menit | Analogi mesin blender jus, parameter input, dan hasil olahan (*return value*). |
| **M7** | List & Array Data | Mandiri di Asrama | 60 Menit | Analogi deretan loker bernomor, daftar belanja, indexing, dan manipulasi list. |
| **M8** | Mini Project Terintegrasi | Mandiri di Asrama | 90 Menit | **Sistem Kasir Warkop TRPL 2026** (Scaffolding 3 Fase integrasi materi M1–M7). |

---

### 5. SPESIFIKASI DAN ARSITEKTUR PLATFORM

Platform pembelajaran yang digunakan dibangun secara khusus untuk kebutuhan matrikulasi TRPL 2026 dengan spesifikasi teknis:

1. **Client-Side WASM Execution Engine:**
   * Menggunakan **Pyodide WebAssembly** yang mengeksekusi Python 3.11 langsung di dalam thread peramban web (*client browser*).
   * Menjamin ketiadaan beban komputasi di server kampus (*zero server-side computation cost*), latensi eksekusi 0 ms, dan perlindungan penuh terhadap sistem internal.
2. **Terminal & Editor Standar Industri:**
   * Editor berbasis **Monaco Editor** (mesin yang sama dengan Microsoft VS Code) dengan *syntax highlighting* dan autokompleti.
   * Simulator antarmuka **PowerShell Lite 7.4** interaktif yang mendukung input scanner langsung.
3. **Instrumen Evaluasi & Pembelajaran Bantu:**
   * *Structural Rule Grader:* Memastikan mahasiswa menggunakan struktur logika yang benar (misal: memeriksa penggunaan keyword `def`, `for`, `if`) dan tidak melakukan hardcode nilai output semata.
   * *Visual Debugger & Memory Graph:* Memvisualisasikan alokasi variabel dan tumpukan eksekusi memori secara grafis untuk memudahkan pemahaman mahasiswa pemula.
   * *Aksesibilitas & Mode Disleksia:* Standar kontras WCAG AAA dan penyesuaian tata letak font ramah disleksia.
4. **Sistem Gamifikasi & Retensi Motivasi:**
   * Akumulasi Experience Points (XP), streak harian, leaderboard angkatan dengan podium 3D, serta koleksi badge pencapaian untuk menjaga antusiasme belajar mandiri di asrama.

---

### 6. SASARAN PESERTA

Peserta program matrikulasi adalah seluruh mahasiswa baru Program Studi Sarjana Terapan Teknologi Rekayasa Perangkat Lunak (TRPL) Angkatan 2026 yang telah terdaftar secara administratif.  
*(Estimasi peserta: 100 s.d. 120 mahasiswa).*

---

### 7. SUSUNAN TIM PELAKSANA & TUGAS

Untuk menjamin kelancaran pelaksanaan teknis dan mutu akademik, tim pelaksana dibagi sebagai berikut:

* **Penanggung Jawab:**  
  Ketua Program Studi Sarjana Terapan TRPL  
  *Tugas:* Memberikan pengarahan umum, legitimasi akademik kegiatan, dan mengesahkan penerbitan sertifikat kelulusan matrikulasi.
* **Pembina Kegiatan:**  
  Dosen Pembina Kemahasiswaan / Dosen Pengampu Mata Kuliah Dasar  
  *Tugas:* Melakukan supervisi keselarasan materi matrikulasi dengan silabus mata kuliah Algoritma dan Pemrograman semester ganjil.
* **Koordinator & Pengajar Utama (Lead Instructor):**  
  **Ketua Divisi Pemrograman Panitia Matrikulasi TRPL 2026**  
  *Tugas:*
  1. Bertindak sebagai pemateri tunggal pada sesi *Live Interactive Workshop* (M0 s.d. M4).
  2. Menyusun skenario analogi materi dan studi kasus latihan live-coding.
  3. Mengarahkan standar penilaian auto-grader pada platform.
  4. Mengkoordinasikan pembagian tugas tim fasilitator lapangan.
* **Fasilitator Lapangan & Tim Asistensi (Teaching Assistants):**  
  **Staf Divisi Pemrograman & Asisten Laboratorium Komputer**  
  *Tugas:*
  1. Memberikan pendampingan langsung (*one-on-one troubleshooting*) saat sesi latihan tatap muka berlangsung.
  2. Memantau dasbor analitik progres belajar mahasiswa.
  3. Meninjau link snapshot *"Minta Bantuan"* yang dikirimkan mahasiswa selama fase mandiri di asrama.

---

### 8. INDIKATOR KETUNTASAN & LUARAN KEGIATAN

#### 8.1 Indikator Kelulusan Individu Mahasiswa
Mahasiswa dinyatakan **LULUS** program matrikulasi dan siap mengikuti perkuliahan reguler apabila memenuhi kriteria:
1. Menyelesaikan seluruh latihan dan kuis pada Modul M0 sampai M7 dengan skor auto-grader 100% lolos uji skenario.
2. Menyelesaikan dan mengumpulkan penugasan Capstone Mini Project Kasir Warkop TRPL (Modul M8) hingga Fase 3 sebelum batas waktu yang ditentukan.

#### 8.2 Luaran Program (Deliverables)
1. **Sertifikat Digital Kelulusan:** Diterbitkannya e-sertifikat resmi kelulusan Matrikulasi TRPL 2026 yang dilengkapi kode verifikasi QR unik untuk setiap mahasiswa yang lulus.
2. **Laporan Pemetaan Profil Angkatan:** Rekapitulasi data kesiapan logika dan kecepatan adaptasi koding angkatan 2026 sebagai dokumen rekomendasi awal bagi dosen pengampu perkuliahan semester ganjil.
3. **Kesiapan Teknis 100%:** Tereliminasinya kendala instalasi dan kebingungan terminal saat perkuliahan resmi perdana dimulai di laboratorium.

---

### 9. PENUTUP

Kerangka Acuan Kerja (TOR) ini disusun sebagai pedoman operasional pelaksanaan kegiatan Matrikulasi Pemrograman Dasar bagi Mahasiswa Baru TRPL 2026. Melalui kombinasi pengajaran langsung yang terpusat dan pembelajaran mandiri terfasilitasi platform modern, diharapkan kegiatan ini mampu memberikan dampak nyata dalam membangun fondasi keilmuan rekayasa perangkat lunak yang kokoh, adaptif, dan menyenangkan bagi seluruh mahasiswa baru.

---

### LEMBAR PENGESAHAN (DRAF)

Ditetapkan di : ____________________  
Pada tanggal  : ____________________ 2026  

<br>

Mengetahui dan Menyetujui,

| Mengetahui,<br>Ketua Program Studi Sarjana Terapan TRPL | Mengesahkan,<br>Ketua Pelaksana Matrikulasi 2026 | Yang Mengajukan,<br>Ketua Divisi Pemrograman Matrikulasi 2026 *(Lead Instructor)* |
| :---: | :---: | :---: |
| <br><br><br><br>____________________________________<br>**NIP. ........................................** | <br><br><br><br>____________________________________<br>**NIM. ........................................** | <br><br><br><br>____________________________________<br>**NIM. ........................................** |
