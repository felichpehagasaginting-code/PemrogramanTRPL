# 📚 Matrikulasi TRPL – Peta Konten & Struktur Pembelajaran

---

## Daftar Isi

1. [Gambaran Kurikulum](#1-gambaran-kurikulum)
2. [Alur Belajar Utama](#2-alur-belajar-utama)
3. [Modul 0 – Pre-Test & Orientasi](#3-modul-0--pre-test--orientasi)
4. [Modul 1 – Dasar Komputer & Workspace Setup](#4-modul-1--dasar-komputer--workspace-setup)
5. [Modul 2 – Logika & Algoritma](#5-modul-2--logika--algoritma)
6. [Modul 3 – Variabel, Tipe Data & Operator](#6-modul-3--variabel-tipe-data--operator)
7. [Modul 4 – Percabangan (if-else)](#7-modul-4--percabangan-if-else)
8. [Modul 5 – Perulangan (Loop)](#8-modul-5--perulangan-loop)
9. [Modul 6 – Fungsi & Prosedur](#9-modul-6--fungsi--prosedur)
10. [Modul 7 – Array & List Dasar](#10-modul-7--array--list-dasar)
11. [Modul 8 – Mini Project Akhir](#11-modul-8--mini-project-akhir)
12. [Sistem Badge & Poin](#12-sistem-badge--poin)
13. [Metadata & Estimasi Durasi](#13-metadata--estimasi-durasi)

---

## 1. Gambaran Kurikulum

```
TOTAL KURIKULUM: 8 Modul + Pre-Test + Mini Project
DURASI TOTAL   : ~18.5 jam belajar (fleksibel, bisa diulang)
BAHASA CODING  : Python 3 (utama) + pseudo-code
PENDEKATAN     : Problem-solving first, syntax second
LEVEL          : Absolute beginner friendly
```

### 1.1 Peta Modul

```
[M0]         [M1]          [M2]          [M3]          [M4]          [M5]          [M6]          [M7]        [M8]
Pre-Test --> Dasar     --> Logika    --> Variabel  --> Percabangan --> Perulangan --> Fungsi   --> Array  --> Mini
Orientasi   Komputer      Algoritma     Tipe Data     if-else         Loop          Prosedur      List       Project
            (~1.5 jam)    (~2 jam)      (~2 jam)      (~2.5 jam)      (~2.5 jam)    (~2.5 jam)   (~2 jam)   (~3 jam)
```

### 1.2 Filosofi Kurikulum

- **Learn by Doing**: Setiap teori langsung diikuti praktik di live code editor
- **Fail Forward**: Error bukan musuh, tapi guru terbaik
- **Kontekstual**: Semua contoh menggunakan situasi kehidupan nyata mahasiswa
- **Spiral Learning**: Konsep lama diulang dalam konteks baru di modul berikutnya

---

## 2. Alur Belajar Utama

Setiap modul mengikuti flow standar:

```
+----------+     +----------+     +----------+     +----------+     +-----------+
|          |     |          |     |          |     |          |     |           |
| PRE-TEST | --> |  MATERI  | --> |  CODING  | --> | POST-TEST| --> |  REWARD   |
| (5 soal) |     | (Teks+   |     | PRACTICE |     | (10 soal)|     | (Badge +  |
|          |     |  Video)  |     | (Editor) |     |          |     |  Meme +   |
|          |     |          |     |          |     |          |     |  Konfeti) |
+----------+     +----------+     +----------+     +----------+     +-----------+
     |                                                    |
     v                                                    v
  Adaptif:                                            Score < 60%:
  Jika sudah                                          Konten remedial
  paham, skip                                         muncul otomatis
  bagian tertentu
```

---

## 3. Modul 0 – Pre-Test & Orientasi

### 3.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Durasi** | 30 menit |
| **Tipe** | Orientasi + Assessment |
| **Prasyarat** | Login SSO berhasil |
| **Deliverable** | Profil kemampuan awal mahasiswa |

### 3.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Mengetahui apa yang akan dipelajari selama matrikulasi
- Mengenal interface platform dan cara navigasinya
- Memberikan data baseline kemampuan coding awal

### 3.3 Konten

**Sub-modul 0.1: Selamat Datang di Dunia Coding!**
- Video intro singkat (3 menit): "Apa itu programmer dan kenapa coding itu keren"
- Tur interaktif platform (guided tour dengan tooltip)
- Video perkenalan koordinator matrikulasi

**Sub-modul 0.2: Pre-Test Diagnostik**
- 20 soal pilihan ganda (campuran: logika, matematika dasar, tech literacy)
- Tidak ada jawaban salah/benar yang dinilai – hanya untuk mapping level
- Hasil: kategori (Pemula Total, Ada Sedikit Pengalaman, Sudah Pernah Coding)

**Sub-modul 0.3: Setup Profil**
- Upload foto (opsional)
- Pilih avatar pixelart
- Tulis harapan/goals belajar (1-2 kalimat)

### 3.4 Meme yang Cocok

- Meme "First day vs Last day of coding bootcamp" – muncul di halaman intro
- Caption: "Ini kamu sekarang vs kamu habis matrikulasi. Let's goo!"

---

## 4. Modul 1 – Dasar Komputer & Workspace Setup

### 4.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M01 |
| **Durasi** | ~90 menit |
| **Bahasa** | Konseptual + CLI dasar + OS Windows/Linux |
| **Poin Tersedia** | 80 poin |
| **Badge** | "Workspace Master" |

### 4.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Mengidentifikasi sistem penyimpanan file di OS (Drive vs Desktop/Downloads)
- Mengaktifkan tampilan file extensions (seperti `.py`) di File Explorer
- Membuat struktur folder proyek coding yang aman dan terstruktur
- Memahami konsep dasar Command Line Interface (CLI) dan Environment Variables (PATH)
- Melakukan instalasi Python 3 & VS Code dengan konfigurasi yang benar

### 4.3 Sub-modul

**M1.1 – Bagaimana Komputer Menyimpan File? (Analogi File Cabinet)**
- Durasi: 15 menit
- Analogi: Hard Drive adalah lemari arsip besar, sedangkan Desktop dan Downloads hanyalah meja kerja sementara.
- Konten: Disk partition (`C:`, `D:`), folder struktur, serta mengapa dilarang menyimpan proyek di Desktop/Downloads (potensi error path, permission, dan risiko data terhapus).
- Interaksi: Drag-and-drop file/folder ke lokasi drive yang tepat.

**M1.2 – Menyingkap File Tersembunyi (File Extensions)**
- Durasi: 15 menit
- Konten: Mengenal tipe file berdasarkan extension (`.py`, `.txt`, `.docx`, `.exe`). Panduan visual memunculkan "File name extensions" di Windows Explorer agar tidak terkecoh dengan nama file ganda seperti `program.py.txt`.
- Interaksi: Kuis interaktif mencocokkan tipe file dengan extensionnya.

**M1.3 – Membuat Workspace yang Proper (Golden Rules)**
- Durasi: 20 menit
- Konten: Langkah demi langkah membuat folder project pemrograman yang terstruktur (contoh: `D:\TRPL\pemrograman-dasar\matrikulasi`). Larangan menggunakan spasi atau karakter aneh pada nama folder project.
- Latihan: Simulasi interaktif membuat folder project dan subfolder modul secara virtual di platform.

**M1.4 – Pengenalan Terminal, CLI, dan PATH**
- Durasi: 20 menit
- Konten: Apa itu Command Line Interface? Memahami bahwa terminal adalah cara mengetikkan perintah langsung ke sistem operasi. Konsep Environment Variables (PATH) sebagai "peta alamat" bagi OS untuk mencari lokasi program seperti `python`.
- Latihan: Mengetikkan command sederhana (`cd`, `dir`/`ls`, `python --version`) di terminal tiruan (mock terminal).

**M1.5 – Instalasi & Setup Python + VS Code**
- Durasi: 20 menit
- Konten: Panduan video instalasi Python terbaru (menekankan pentingnya mencentang opsi "Add Python to PATH") dan instalasi VS Code + Extension Python.
- Latihan: Checklist interaktif langkah-langkah instalasi lokal maba.

### 4.4 Meme

- Meme: "Desktop full of project folders vs Clean D drive folder structure" (Meme format Drake Approved)
- Caption: "Rapikan workspace-mu sebelum coding dimulai! Dosenmu akan berterima kasih karena kodenya tidak rusak karena salah path."

---

## 5. Modul 2 – Logika & Algoritma

### 5.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M02 |
| **Durasi** | ~2 jam |
| **Bahasa** | Pseudo-code + analogi visual |
| **Poin Tersedia** | 100 poin |
| **Badge** | "Pemikir Logis" |

### 4.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Memahami konsep algoritma sebagai langkah-langkah penyelesaian masalah
- Mendeskripsikan algoritma dalam bahasa sehari-hari (pseudo-code)
- Membaca dan membuat flowchart sederhana
- Memahami perbedaan input, proses, dan output

### 4.3 Sub-modul

**M1.1 – Apa itu Algoritma?**
- Durasi: 20 menit
- Konten: Analogi membuat mie instan sebagai algoritma
- Interaksi: Drag-and-drop langkah-langkah dalam urutan yang benar
- Meme: "Algorithm for making instant noodles" – meme format resep dengan step konyol

**M1.2 – Flowchart**
- Durasi: 25 menit
- Konten: Pengenalan simbol flowchart (Start/End, Process, Decision, I/O)
- Interaksi: Drag-and-drop simbol untuk membuat flowchart "cek apakah lulus ujian"
- Tool: Flowchart builder sederhana di platform

**M1.3 – Pseudo-code**
- Durasi: 20 menit
- Konten: Cara menulis algoritma dalam bahasa manusia terstruktur
- Latihan: Tulis pseudo-code untuk "cari angka terbesar dari 3 angka"

**M1.4 – Kuis Modul 1**
- 10 soal (pilihan ganda + drag-and-drop)
- Passing grade: 60%

### 4.4 Meme

- Trigger: Setelah kuis dengan skor >= 80%
- Meme: "Me explaining my algorithm" (orang jenius di papan tulis)
- Caption: "Kamu udah bisa berpikir kayak programmer! Next: ngomong sama komputer."

---

## 6. Modul 3 – Variabel, Tipe Data & Operator

### 6.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M03 |
| **Durasi** | ~2 jam |
| **Bahasa** | Python 3 |
| **Poin Tersedia** | 120 poin |
| **Badge** | "Si Penampung Data" |

### 5.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Mendeklarasikan variabel dan memberikan nilai
- Membedakan tipe data: integer, float, string, boolean
- Menggunakan operator aritmatika, perbandingan, dan logika
- Menampilkan output dengan print()

### 5.3 Sub-modul

**M2.1 – Variabel: Kotak Penyimpan Data**
- Durasi: 25 menit
- Analogi: Variabel = kotak berlabel di loker kampus
- Konten: Deklarasi, assignment, naming convention
- Live Code:
  ```python
  nama = "Reza"
  umur = 18
  ipk = 3.8
  aktif = True
  print(nama, "berumur", umur, "tahun")
  ```
- Latihan: Buat variabel untuk data diri sendiri

**M2.2 – Tipe Data**
- Durasi: 20 menit
- Konten: int, float, str, bool + type() function
- Fun Fact: "Python itu dinamis – kamu bisa ganti tipe kapanpun!"
- Kuis mini: Tebak tipe data (3 soal)

**M2.3 – Operator**
- Durasi: 30 menit
- Konten: Aritmatika (+, -, *, /, //, %, **), Perbandingan (==, !=, <, >), Logika (and, or, not)
- Live Code: Kalkulator sederhana dengan operator
- Latihan: Hitung nilai akhir dari nilai UTS, UAS, dan tugas

**M2.4 – Kuis Modul 2**
- 10 soal + 2 soal coding sederhana
- Passing grade: 60%

### 5.4 Meme

- Meme: "Me naming variables: x, xx, xxx, xFinal, xFinalFinal..."
- Caption: "Kasih nama variabel yang jelas ya! nama_mahasiswa lebih bagus dari x."

---

## 7. Modul 4 – Percabangan (if-else)

### 7.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M04 |
| **Durasi** | ~2.5 jam |
| **Bahasa** | Python 3 |
| **Poin Tersedia** | 150 poin |
| **Badge** | "Pembuat Keputusan" |

### 6.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Membuat percabangan sederhana dengan if-else
- Membuat percabangan bertingkat (elif)
- Menggabungkan kondisi dengan operator logika
- Memahami indentasi Python sebagai bagian dari syntax

### 6.3 Sub-modul

**M3.1 – if Statement**
- Durasi: 25 menit
- Analogi: "Kalau hujan, bawa payung. Titik."
- Live Code: Cek apakah nilai lulus atau tidak
- Latihan: Buat cek usia untuk konten tertentu

**M3.2 – if-else & elif**
- Durasi: 30 menit
- Analogi: Drake meme (No = if tanpa else, Yes = if-else yang proper)
- Live Code: Konverter nilai huruf (A, B, C, D, E)
- Latihan: Kategori BMI

**M3.3 – Nested if & Kondisi Kompleks**
- Durasi: 25 menit
- Konten: Nested if, and/or dalam kondisi
- Latihan: Sistem tiket bioskop (harga berdasarkan usia + hari)

**M3.4 – Kuis Modul 3**
- 10 soal pilihan ganda + 2 soal trace kode
- Passing grade: 60%

### 6.4 Meme

- Meme: "Programmer vs Decision" (Buzz Lightyear "Decisions, decisions everywhere")
- Caption: "if-else adalah jantungnya logika program. Kuasai ini, kamu sudah setengah jalan!"

---

## 8. Modul 5 – Perulangan (Loop)

### 8.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M05 |
| **Durasi** | ~2.5 jam |
| **Bahasa** | Python 3 |
| **Poin Tersedia** | 150 poin |
| **Badge** | "Master of Loop" |

### 7.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Menggunakan for loop untuk iterasi
- Menggunakan while loop untuk kondisi
- Menggunakan range() function
- Mengenali dan menghindari infinite loop
- Menggunakan break dan continue

### 7.3 Sub-modul

**M4.1 – for Loop**
- Durasi: 30 menit
- Analogi: Absensi kelas – panggil satu per satu
- Live Code: Print daftar nama, hitung total nilai
- Latihan: Buat tabel perkalian

**M4.2 – while Loop**
- Durasi: 25 menit
- Analogi: "Terus makan selagi lapar"
- Live Code: Tebak angka sederhana
- WARNING: Demo infinite loop + cara stop-nya (Ctrl+C)

**M4.3 – break, continue, range()**
- Durasi: 20 menit
- Konten: range(start, stop, step), break untuk keluar loop, continue untuk skip
- Latihan: Filter angka genap dari 1-100

**M4.4 – Nested Loop**
- Durasi: 20 menit
- Konten: Loop di dalam loop
- Visualisasi: Animasi grid 5x5 yang diisi satu per satu
- Latihan: Print pola bintang (*) segitiga

**M4.5 – Kuis Modul 4**
- 10 soal + 2 soal trace + 1 soal tulis kode
- Passing grade: 60%

### 7.4 Meme

- Meme: "While (alive) { eat(); sleep(); code(); }"
- Caption: "Loop ini yang nemenin kamu sampai wisuda!"

---

## 9. Modul 6 – Fungsi & Prosedur

### 9.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M06 |
| **Durasi** | ~2.5 jam |
| **Bahasa** | Python 3 |
| **Poin Tersedia** | 150 poin |
| **Badge** | "Function Wizard" |

### 8.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Mendefinisikan dan memanggil fungsi
- Menggunakan parameter dan argumen
- Memahami return value
- Mengerti konsep scope variabel
- Menerapkan prinsip DRY (Don't Repeat Yourself)

### 8.3 Sub-modul

**M5.1 – Apa itu Fungsi?**
- Durasi: 25 menit
- Analogi: Fungsi = mesin kopi – masukkan biji kopi, keluar kopi
- Live Code: def sapa(nama): print("Halo", nama)
- Latihan: Buat fungsi hitung luas persegi panjang

**M5.2 – Parameter & Return**
- Durasi: 30 menit
- Konten: Perbedaan parameter vs argumen, return vs print
- Live Code: Fungsi konverter suhu Celsius ke Fahrenheit
- Latihan: Fungsi hitung diskon harga

**M5.3 – Scope & Variable Lifetime**
- Durasi: 20 menit
- Konten: Local vs global scope, kenapa variabel di luar fungsi tidak bisa diakses
- Visualisasi: Diagram kotak scope yang menarik

**M5.4 – Fungsi dengan Default Parameter**
- Durasi: 15 menit
- Konten: Default value, keyword arguments
- Latihan: Fungsi buat biodata dengan parameter opsional

**M5.5 – Kuis Modul 5**
- 10 soal + 2 soal debugging fungsi
- Passing grade: 60%

### 8.4 Meme

- Meme: "Extract method" / "There's a function for that"
- Caption: "DRY = Don't Repeat Yourself. Kalau kamu nulis hal yang sama 3x, saatnya bikin fungsi!"

---

## 10. Modul 7 – Array & List Dasar

### 10.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M07 |
| **Durasi** | ~2 jam |
| **Bahasa** | Python 3 (List) |
| **Poin Tersedia** | 120 poin |
| **Badge** | "Data Collector" |

### 9.2 Tujuan Pembelajaran

Setelah modul ini, mahasiswa dapat:
- Membuat dan mengakses elemen list
- Menggunakan operasi dasar list (append, remove, len, sort)
- Iterasi list dengan for loop
- Memahami indexing dan slicing
- Menggabungkan list dengan loop untuk kasus nyata

### 9.3 Sub-modul

**M6.1 – Pengenalan List**
- Durasi: 25 menit
- Analogi: List = daftar belanjaan yang bisa diubah
- Live Code: List nilai ujian mahasiswa
- Latihan: Buat list hobi dan print satu per satu

**M6.2 – Operasi List**
- Durasi: 30 menit
- Konten: append(), remove(), insert(), pop(), len(), sort(), reverse()
- Live Code: Manajemen daftar tugas (todo list)
- Latihan: Tambah dan hapus item dari list

**M6.3 – Indexing & Slicing**
- Durasi: 20 menit
- Konten: Index 0-based, negative indexing, slicing [start:end:step]
- Visualisasi: Animasi kotak-kotak list dengan index yang highlight
- Latihan: Ambil 3 nilai tertinggi dari list

**M6.4 – List + Loop = Power Combo**
- Durasi: 20 menit
- Konten: Kombinasi loop dengan list untuk processing data
- Live Code: Hitung rata-rata dari list nilai
- Latihan: Filter nilai yang lulus dari list

**M6.5 – Kuis Modul 6**
- 10 soal + 1 soal coding lengkap
- Passing grade: 60%

### 9.4 Meme

- Meme: "Me organizing my files vs Me organizing data in list"
- Caption: "List bikin data kamu rapi dan mudah diakses. Kayak lemari yang selalu teratur."

---

## 11. Modul 8 – Mini Project Akhir

### 11.1 Metadata

| Atribut | Detail |
|---------|--------|
| **Kode** | M08 |
| **Durasi** | ~3 jam |
| **Bahasa** | Python 3 |
| **Poin Tersedia** | 300 poin |
| **Badge** | "Junior Developer", "Matrikulasi Graduate" |

### 10.2 Tujuan Pembelajaran

Setelah mini project, mahasiswa dapat:
- Mengintegrasikan semua konsep yang dipelajari
- Membaca soal dan menerjemahkannya ke kode
- Melakukan debugging secara mandiri
- Mempresentasikan kode yang mereka tulis

### 10.3 Pilihan Mini Project

Mahasiswa boleh pilih salah satu:

**Option A: Kalkulator Interaktif**
```
Fitur wajib:
- Menu operasi: tambah, kurang, kali, bagi
- Validasi input (angka bukan huruf)
- Loop sampai user pilih keluar
- History 5 kalkulasi terakhir (pakai list)

Fitur bonus:
- Konverter satuan (km ke mil, dsb.)
- Kalkulator BMI
```

**Option B: Game Tebak Angka**
```
Fitur wajib:
- Generate angka random 1-100
- User punya maksimal 7 tebakan
- Hint "terlalu tinggi" / "terlalu rendah"
- Tampilkan jumlah percobaan saat berhasil
- Tanya apakah mau main lagi

Fitur bonus:
- Pilihan level (easy: 1-50, hard: 1-200)
- Leaderboard lokal (simpan 3 skor terbaik)
```

**Option C: Sistem Nilai Mahasiswa**
```
Fitur wajib:
- Input nama dan nilai beberapa mata kuliah
- Hitung IPK (rata-rata nilai)
- Tampilkan predikat (Cumlaude, Sangat Memuaskan, dsb.)
- Cari nilai tertinggi dan terendah
- Tampilkan daftar nilai dengan format rapi

Fitur bonus:
- Simpan data beberapa mahasiswa
- Urutkan mahasiswa berdasarkan IPK
```

### 10.4 Alur Pengerjaan

1. Baca spesifikasi proyek (15 menit)
2. Buat pseudocode/planning di editor teks (30 menit)
3. Coding di live editor (90 menit)
4. Testing dan debugging (30 menit)
5. Submit kode

### 10.5 Meme Final

- Meme: "It's not much, but it's honest work"
- Caption: "Selamat! Kamu baru saja bikin program pertamamu. Dari sini, langit batasnya!"
- Special: Full-screen confetti + animasi graduation hat jatuh

---

## 12. Sistem Badge & Poin

### 12.1 Daftar Badge

| Badge | Nama | Cara Mendapat | Poin Bonus |
|-------|------|---------------|------------|
| Kaki Lima | "Langkah Pertama" | Login pertama kali | 10 |
| Folder | "Workspace Master" | Selesaikan M01 | 50 |
| Bintang | "Pemikir Logis" | Selesaikan M02 | 50 |
| Kotak | "Si Penampung Data" | Selesaikan M03 | 60 |
| Cabang | "Pembuat Keputusan" | Selesaikan M04 | 75 |
| Lingkaran | "Master of Loop" | Selesaikan M05 | 75 |
| Tongkat | "Function Wizard" | Selesaikan M06 | 75 |
| Kotak data | "Data Collector" | Selesaikan M07 | 60 |
| Helm | "Junior Developer" | Selesaikan Mini Project (M08) | 150 |
| Toga | "Matrikulasi Graduate" | Selesaikan semua modul | 200 |
| Perfect | "Perfectionist" | Skor 100% di semua kuis | 100 |
| Cepat | "Speed Runner" | Selesaikan semua modul < 3 hari | 100 |
| Mabar | "Helping Hand" | 3x bantu teman di forum (post-MVP) | 50 |

### 11.2 Sistem Poin & Level

| Level | Nama | Poin Dibutuhkan |
|-------|------|----------------|
| 1 | Script Kiddie | 0 – 99 |
| 2 | Code Padawan | 100 – 249 |
| 3 | Developer Muda | 250 – 499 |
| 4 | Code Warrior | 500 – 799 |
| 5 | Algorithm Master | 800 – 1099 |
| 6 | TRPL Legend | 1100+ |

---

## 13. Metadata & Estimasi Durasi

| Modul | Judul | Durasi | Sub-modul | Kuis | Poin Max |
|-------|-------|--------|-----------|------|----------|
| M0 | Pre-Test & Orientasi | 30 menit | 3 | 1 | 0 |
| M1 | Dasar Komputer & Workspace | 90 menit | 5 | 1 | 80 |
| M2 | Logika & Algoritma | 120 menit | 4 | 1 | 100 |
| M3 | Variabel & Tipe Data | 120 menit | 4 | 1 | 120 |
| M4 | Percabangan | 150 menit | 4 | 1 | 150 |
| M5 | Perulangan | 150 menit | 5 | 1 | 150 |
| M6 | Fungsi & Prosedur | 150 menit | 5 | 1 | 150 |
| M7 | Array & List | 120 menit | 5 | 1 | 120 |
| M8 | Mini Project | 180 menit | 4 | 0 | 300 |
| **TOTAL** | | **~18.5 jam** | **39** | **8** | **1170** |

---

## Referensi

- Dokumen terkait: `prd.md`, `design.md`, `tech-architecture.md`
- Dibuat: Juli 2026
- Versi: 1.0.0
