export interface SlideContent {
  title: string;
  type: "text" | "interactive-drag" | "interactive-cli" | "checklist";
  contentKey?: string;
}

export interface ModuleData {
  id: string;
  title: string;
  slides: SlideContent[];
}

export interface QuizData {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeData {
  mode: "coding" | "quiz";
  description: string;
  initialCode?: string;
  questions?: QuizData[];
}

export interface PracticeContent {
  [moduleId: string]: PracticeData;
}

export const MODULES_DATA: ModuleData[] = [
  {
    id: "M0",
    title: "Kuis Pemetaan & Orientasi",
    slides: [
      { title: "Selamat Datang di Platform Matrikulasi!", type: "text", contentKey: "m0-welcome" },
      { title: "Apa itu Pemrograman?", type: "text", contentKey: "m0-what-is-programming" },
      { title: "Roadmap Perjalananmu (9 Modul)", type: "text", contentKey: "m0-roadmap" },
      { title: "Kuis Pemetaan Petualang Koding", type: "text", contentKey: "m0-pretest" },
    ],
  },
  {
    id: "M1",
    title: "Dasar Komputer & Workspace VS Code",
    slides: [
      { title: "Prasyarat Penting Sebelum Menulis Kode", type: "text", contentKey: "m1-prerequisites" },
      { title: "Bagaimana Komputer Bekerja", type: "text", contentKey: "m1-how-computer-works" },
      { title: "Cara Komputer Membaca Kode", type: "text", contentKey: "m1-code-reading" },
      { title: "Aturan Folder & Peta Harddisk", type: "text", contentKey: "m1-folder-rules" },
      { title: "Simulasi Membuat Folder Workspace", type: "text", contentKey: "m1-folder-sim" },
      { title: "Game Simulasi: Susun Workspace yang Benar", type: "interactive-drag", contentKey: "m1-drag" },
      { title: "File Extension & Karakter Terlarang", type: "text", contentKey: "m1-extensions" },
      { title: "GUI vs CLI (Command Line)", type: "text", contentKey: "m1-gui-cli" },
      { title: "Simulator CLI: Memeriksa Python & PATH", type: "interactive-cli", contentKey: "m1-cli" },
      { title: "Memilih Text Editor & IDE", type: "text", contentKey: "m1-editor" },
      { title: "Checklist Akhir Setup Workspace", type: "checklist", contentKey: "m1-checklist" },
    ],
  },
  {
    id: "M2",
    title: "Logika & Algoritma Naratif",
    slides: [
      { title: "Apa itu Algoritma?", type: "text", contentKey: "m2-algorithm" },
      { title: "Bagan Alir (Flowchart) Secara Visual", type: "text", contentKey: "m2-flowchart" },
      { title: "Menulis Logika dengan Pseudocode", type: "text", contentKey: "m2-pseudocode" },
      { title: "Ciri-Ciri Algoritma yang Baik", type: "text", contentKey: "m2-good-algorithm" },
      { title: "Latihan Baca Flowchart Sehari-hari", type: "text", contentKey: "m2-flowchart-practice" },
      { title: "Dari Pseudocode ke Kode Python Nyata", type: "text", contentKey: "m2-pseudo-to-python" },
    ],
  },
  {
    id: "M3",
    title: "Toples Variabel & Tipe Data",
    slides: [
      { title: "Apa itu Variabel?", type: "text", contentKey: "m3-variable" },
      { title: "Tipe Data Dasar di Python", type: "text", contentKey: "m3-data-types" },
      { title: "Operasi pada Variabel & Jebakan input()", type: "text", contentKey: "m3-operations" },
    ],
  },
  {
    id: "M4",
    title: "Percabangan & Keputusan Diskon",
    slides: [
      { title: "Logika Percabangan dalam Kehidupan", type: "text", contentKey: "m4-if-intro" },
      { title: "if, elif, else di Python", type: "text", contentKey: "m4-if-elif-else" },
      { title: "Operasi Perbandingan & Logika", type: "text", contentKey: "m4-comparison" },
    ],
  },
  {
    id: "M5",
    title: "Perulangan Loop Tanpa Pusing",
    slides: [
      { title: "Mengapa Perulangan Penting?", type: "text", contentKey: "m5-loop-intro" },
      { title: "For Loop di Python", type: "text", contentKey: "m5-for-loop" },
      { title: "While Loop & Makan Kerupuk", type: "text", contentKey: "m5-while-loop" },
    ],
  },
  {
    id: "M6",
    title: "Resep Fungsi & Dapur Kode",
    slides: [
      { title: "Konsep Fungsi (Dapur Restoran)", type: "text", contentKey: "m6-function" },
      { title: "Membuat Fungsi di Python", type: "text", contentKey: "m6-def-function" },
      { title: "Parameter, Return Value (Pelayan vs Koki)", type: "text", contentKey: "m6-params-scope" },
    ],
  },
  {
    id: "M7",
    title: "Rak Menu Makanan & List Data",
    slides: [
      { title: "Apa itu List? (Rak Kosan)", type: "text", contentKey: "m7-list-intro" },
      { title: "Operasi pada List & Indeks Antrean 0", type: "text", contentKey: "m7-list-operations" },
      { title: "List Aplikasi di Dunia Nyata", type: "text", contentKey: "m7-list-multi" },
    ],
  },
  {
    id: "M8",
    title: "Mini Project Kasir Warkop TRPL",
    slides: [
      { title: "Ringkasan Materi Sebelumnya", type: "text", contentKey: "m8-summary" },
      { title: "Spesifikasi Mini Project Kasir", type: "text", contentKey: "m8-spec" },
      { title: "Langkah Pengerjaan 3 Babak", type: "text", contentKey: "m8-steps" },
    ],
  },
];

export interface EvaluationQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type PostTestQuestion = EvaluationQuestion;

export const EVALUATION_QUESTIONS: EvaluationQuestion[] = [
  {
    id: "pt-1",
    category: "Dasar & Workspace",
    question: "Mengapa nama folder proyek coding sebaiknya TIDAK menggunakan karakter spasi atau simbol aneh?",
    options: [
      "Agar tidak menimbulkan error pembacaan path saat dieksekusi di terminal atau tools compiler",
      "Karena sistem operasi komputer akan otomatis menghapus folder tersebut",
      "Karena bahasa Python hanya dapat disimpan di folder default 'root'",
      "Karena memori laptop akan berkurang drastis jika ada spasi"
    ],
    correctIndex: 0,
    explanation: "Spasi pada nama folder sering memecah argumen di CLI/terminal secara tidak sengaja, sehingga program gagal dieksekusi."
  },
  {
    id: "pt-2",
    category: "Logika & Algoritma",
    question: "Salah satu syarat penting dari sebuah algoritma adalah harus berhenti setelah menjalankan sejumlah tahapan langkah. Sifat ini dikenal sebagai...",
    options: [
      "Infinite Loop (Perulangan Tak Hingga)",
      "Finiteness (Keterbatasan / Memiliki Titik Akhir)",
      "Randomness (Ketidakpastian Jalur)",
      "Complexity (Tingkat Kerumitan)"
    ],
    correctIndex: 1,
    explanation: "Finiteness menjamin bahwa algoritma pasti akan berhenti dan menghasilkan output akhir setelah sejumlah langkah terhingga."
  },
  {
    id: "pt-3",
    category: "Logika & Flowchart",
    question: "Simbol bangun datar pada diagram alir (flowchart) yang digunakan untuk menentukan keputusan bersyarat (kondisi Ya / Tidak) adalah...",
    options: [
      "Persegi Panjang (Proses Eksekusi)",
      "Belah Ketupat / Diamond (Keputusan Kondisional)",
      "Oval / Elips (Mulai / Selesai)",
      "Jajar Genjang (Input / Output)"
    ],
    correctIndex: 1,
    explanation: "Belah Ketupat (Decision) digunakan untuk percabangan logika kondisi Ya/Tidak."
  },
  {
    id: "pt-4",
    category: "Tipe Data & Variabel",
    question: "Diberikan kode Python: a = \"10\" dan b = 5. Berapakah hasil dari operasi: int(a) + b?",
    options: [
      "15",
      "\"105\"",
      "\"15\"",
      "Error: Tipe data tidak bisa dijumlahkan"
    ],
    correctIndex: 0,
    explanation: "Fungsi int(a) mengubah teks \"10\" menjadi angka 10. Operasi 10 + 5 menghasilkan 15 bertipe Integer."
  },
  {
    id: "pt-5",
    category: "Input Python",
    question: "Ketika kita menggunakan perintah input(\"Masukkan nama: \") di Python, tipe data bawaan apa yang selalu dihasilkan?",
    options: [
      "int (Bilangan Bulat)",
      "str (String / Teks)",
      "float (Bilangan Desimal)",
      "bool (Boolean)"
    ],
    correctIndex: 1,
    explanation: "Fungsi input() di Python selalu mengembalikan nilai dalam bentuk String (str)."
  },
  {
    id: "pt-6",
    category: "Percabangan (If-Else)",
    question: "Perhatikan kode Python berikut:\n\nnilai = 80\nif nilai >= 75:\n    print(\"Lulus\")\nelse:\n    print(\"Remedial\")\n\nApa teks yang akan dicetak ke layar?",
    options: [
      "Lulus",
      "Remedial",
      "80",
      "Error sintaks"
    ],
    correctIndex: 0,
    explanation: "Karena nilai adalah 80 dan kondisi (80 >= 75) bernilai Benar (True), maka blok if dijalankan dan mencetak 'Lulus'."
  },
  {
    id: "pt-7",
    category: "Perulangan (Loop)",
    question: "Berapa kali kata \"TRPL\" akan dicetak oleh kode perulangan berikut?\n\nfor i in range(3):\n    print(\"TRPL\")",
    options: [
      "1 kali",
      "2 kali",
      "3 kali",
      "4 kali"
    ],
    correctIndex: 2,
    explanation: "range(3) menghasilkan 3 iterasi (untuk indeks i = 0, 1, dan 2), sehingga mencetak 'TRPL' sebanyak 3 kali."
  },
  {
    id: "pt-8",
    category: "Kontrol Perulangan",
    question: "Kata kunci (keyword) manakah yang digunakan untuk menghentikan jalannya perulangan loop secara seketika?",
    options: [
      "break",
      "continue",
      "pass",
      "return"
    ],
    correctIndex: 0,
    explanation: "Keyword 'break' memutus jalannya loop seketika dan langsung melompat keluar dari blok perulangan."
  },
  {
    id: "pt-9",
    category: "Fungsi Dasar",
    question: "Perhatikan potongan kode fungsi berikut:\n\ndef hitung(a, b):\n    return a + b\n\nhasil = hitung(4, 6)\nprint(hasil)\n\nBerapakah angka yang dicetak ke layar konsol?",
    options: [
      "24",
      "10",
      "46",
      "4"
    ],
    correctIndex: 1,
    explanation: "Fungsi hitung menjumlahkan argumen 4 dan 6 (4 + 6 = 10) lalu mengembalikan nilai 10 ke variabel hasil."
  },
  {
    id: "pt-10",
    category: "Fungsi & Nilai Balik",
    question: "Perintah apa yang digunakan di dalam fungsi untuk mengirimkan nilai hasil pemrosesan kembali ke pemanggil fungsi?",
    options: [
      "return",
      "print",
      "output",
      "send"
    ],
    correctIndex: 0,
    explanation: "Keyword 'return' digunakan oleh fungsi untuk memberikan nilai keluaran yang dapat disimpan ke dalam variabel."
  },
  {
    id: "pt-11",
    category: "List & Indexing",
    question: "Diberikan list: prodi = [\"TRPL\", \"Informatika\", \"Sistem Informasi\"]. Perintah manakah yang tepat untuk mengambil elemen pertama (\"TRPL\")?",
    options: [
      "prodi[1]",
      "prodi.first()",
      "prodi[0]",
      "prodi[3]"
    ],
    correctIndex: 2,
    explanation: "Indeks list di bahasa Python selalu dimulai dari angka 0, sehingga elemen pertama adalah prodi[0]."
  },
  {
    id: "pt-12",
    category: "Operasi List",
    question: "Metode (method) bawaan list manakah yang digunakan untuk menambahkan elemen baru di urutan paling akhir?",
    options: [
      "list.add(item)",
      "list.append(item)",
      "list.push(item)",
      "list.insert_end(item)"
    ],
    correctIndex: 1,
    explanation: "Metode .append() adalah cara standar di Python untuk memasukkan item baru ke bagian paling ujung/akhir list."
  },
  {
    id: "pt-13",
    category: "Operator Perbandingan",
    question: "Operator manakah di bahasa Python yang digunakan untuk memeriksa apakah dua nilai bernilai SAMA?",
    options: [
      "==",
      "=",
      "!=",
      "<="
    ],
    correctIndex: 0,
    explanation: "Simbol == (double equals) adalah operator perbandingan kesetaraan, sedangkan = adalah operator penugasan nilai (assignment)."
  },
  {
    id: "pt-14",
    category: "Debugging & Error",
    question: "Pesan error 'SyntaxError' pada saat menjalankan script Python biasanya menandakan...",
    options: [
      "Koneksi WiFi ke internet terputus",
      "Kesalahan penulisan tata bahasa kode (misal lupa tanda kurung tutup atau titik dua :)",
      "Memori harddisk laptop penuh",
      "Program mencoba membagi angka dengan nol"
    ],
    correctIndex: 1,
    explanation: "SyntaxError muncul ketika interpreter tidak memahami kode karena melanggar aturan sintaks atau tata bahasa Python."
  },
  {
    id: "pt-15",
    category: "Engineering Mindset",
    question: "Ketika program koding mengalami error atau pesan warna merah saat dijalankan, sikap awal seorang calon Software Engineer yang benar adalah...",
    options: [
      "Menyalahkan laptop atau menganggap komputer rusak",
      "Langsung menghapus seluruh folder proyek dan putus asa",
      "Membaca baris pesan error traceback dengan tenang untuk mencari nomor baris dan penyebab errornya",
      "Menyalin kode orang lain secara acak tanpa memahaminya"
    ],
    correctIndex: 2,
    explanation: "Membaca traceback pesan error secara cermat adalah kemampuan dasar paling penting yang membedakan engineer profesional dengan pemula."
  }
];

export const POST_TEST_QUESTIONS = EVALUATION_QUESTIONS;

export const PRACTICE_CONTENT: PracticeContent = {
  M0: {
    mode: "quiz",
    description: "Pre-Test Diagnostik TRPL 2026: Ukur pemahaman awal logika & dasar pemrograman kamu.",
    questions: EVALUATION_QUESTIONS.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })),
  },
  M2: {
    mode: "coding",
    description: "Halo calon engineer! Yuk bikin baris kode Python pertamamu. Buat variabel nama kamu, lalu cetak salam 'Halo, [nama]!' ke layar konsol.",
    initialCode: "# Buat variabel namamu\nnama = \"Maba TRPL\"\n\n# Cetak salam hangat ke layar\nprint(\"Halo, \" + nama + \"!\")\n",
  },
  M3: {
    mode: "coding",
    description: "Yuk simpan data di Python! Buat variabel nama (string), umur (integer), dan tinggi (float), lalu tampilkan semuanya ya!",
    initialCode: "# String (teks)\nnama = \"Budi\"\n\n# Integer (bilangan bulat)\numur = 18\n\n# Float (desimal)\ntinggi = 170.5\n\n# Cetak semua data ke layar\nprint(nama, umur, tinggi)\n",
  },
  M4: {
    mode: "coding",
    description: "Saatnya belajar mengambil keputusan! Minta pengguna memasukkan sebuah angka bulat, lalu tentukan apakah angka tersebut 'Genap' atau 'Ganjil' dengan if-else.",
    initialCode: "# Minta input angka dari user\nangka = int(input(\"Masukkan angka: \"))\n\n# Cek genap atau ganjil\nif angka % 2 == 0:\n    print(\"Genap\")\nelse:\n    print(\"Ganjil\")\n",
  },
  M5: {
    mode: "coding",
    description: "Biar gak capek ngetik manual berulang-ulang, gunakan perulangan for loop untuk mencetak angka 1 sampai 10 secara otomatis!",
    initialCode: "# Gunakan perulangan for dan range(1, 11)\nfor i in range(1, 11):\n    print(i)\n",
  },
  M6: {
    mode: "coding",
    description: "Fungsi itu ibarat resep masakan yang bisa kita panggil berkali-kali! Buat fungsi bernama 'sapa' yang menerima parameter 'nama' dan mengembalikan string 'Halo, [nama]!'.",
    initialCode: "# Definisikan fungsi sapa(nama)\ndef sapa(nama):\n    return f\"Halo, {nama}!\"\n\n# Uji panggil fungsimu\nprint(sapa(\"TRPL 2026\"))\n",
  },
  M7: {
    mode: "coding",
    description: "Bayangkan list seperti rak barang di kosan! Buat list berisi 5 buah favoritmu, lalu ambil dan cetak buah ke-3 (ingat, indeks di Python mulai dari angka 0 ya!).",
    initialCode: "# Buat list 5 buah favorit\nbuah = [\"apel\", \"mangga\", \"pisang\", \"anggur\", \"jeruk\"]\n\n# Ambil dan cetak buah ketiga (indeks 2)\nprint(buah[2])\n",
  },
  M8: {
    mode: "coding",
    description: "Saatnya merakit Mini Project Kasir Warkop TRPL! Ikuti 3 babak terstruktur: 1) Tampilkan Menu & Input Pesanan, 2) Hitung Total & Diskon 10%, 3) Cetak Struk Belanja.",
    initialCode: `# === MINI PROJECT: SISTEM KASIR WARKOP TRPL 2026 ===
# Ikuti 3 Babak berikut ini:

# --- BABAK 1: Menu Makanan & Harga ---
harga_kopi = 5000
harga_mie = 10000

print("=== MENU WARKOP TRPL ===")
print("1. Kopi Tubruk: Rp 5.000")
print("2. Mie Goreng: Rp 10.000")

jumlah_kopi = int(input("Jumlah Kopi: "))
jumlah_mie = int(input("Jumlah Mie: "))

# --- BABAK 2: Hitung Total & Diskon 10% ---
total = (jumlah_kopi * harga_kopi) + (jumlah_mie * harga_mie)

# Jika belanja >= Rp 30.000, dapat diskon 10%
if total >= 30000:
    diskon = total * 0.10
    total_bayar = total - diskon
    print("Selamat! Kamu dapat diskon 10%!")
else:
    diskon = 0
    total_bayar = total

# --- BABAK 3: Cetak Struk Pembayaran ---
print("------------------------")
print(f"Total Belanja: Rp {total}")
print(f"Diskon: Rp {int(diskon)}")
print(f"Total Bayar: Rp {int(total_bayar)}")
print("Terima kasih sudah jajan di Warkop TRPL!")
`,
  },
};

export interface ModuleMetaItem {
  id: string;
  code: string;
  title: string;
  duration: string;
  icon: string;
  color: string;
  phase: "live" | "independent";
  phaseLabel: string;
}

export const MODULES_META: ModuleMetaItem[] = [
  { id: "M0", code: "M0", title: "Kuis Pemetaan & Orientasi", duration: "10 mnt", icon: "Star", color: "#FF9D00", phase: "live", phaseLabel: "Fase 1: Live Workshop" },
  { id: "M1", code: "M1", title: "Dasar Komputer & Workspace", duration: "15 mnt", icon: "FolderOpen", color: "#FF8C42", phase: "live", phaseLabel: "Fase 1: Live Workshop" },
  { id: "M2", code: "M2", title: "Logika & Algoritma Naratif", duration: "10 mnt", icon: "Brain", color: "#FF6B00", phase: "live", phaseLabel: "Fase 1: Live Workshop" },
  { id: "M3", code: "M3", title: "Toples Variabel & Tipe Data", duration: "10 mnt", icon: "SquaresFour", color: "#06B6D4", phase: "live", phaseLabel: "Fase 1: Live Workshop" },
  { id: "M4", code: "M4", title: "Percabangan & Diskon", duration: "10 mnt", icon: "GitBranch", color: "#EF4444", phase: "live", phaseLabel: "Fase 1: Live Workshop" },
  { id: "M5", code: "M5", title: "Perulangan Tanpa Pusing", duration: "10 mnt", icon: "ArrowsClockwise", color: "#22C55E", phase: "independent", phaseLabel: "Fase 2: Mandiri Asrama" },
  { id: "M6", code: "M6", title: "Resep Fungsi & Dapur Kode", duration: "10 mnt", icon: "Function", color: "#D45900", phase: "independent", phaseLabel: "Fase 2: Mandiri Asrama" },
  { id: "M7", code: "M7", title: "Rak Menu & List Data", duration: "10 mnt", icon: "ListNumbers", color: "#FF8C42", phase: "independent", phaseLabel: "Fase 2: Mandiri Asrama" },
  { id: "M8", code: "M8", title: "Mini Project Kasir Warkop", duration: "15 mnt", icon: "Rocket", color: "#FF6B00", phase: "independent", phaseLabel: "Fase 2: Mandiri Asrama" },
];



