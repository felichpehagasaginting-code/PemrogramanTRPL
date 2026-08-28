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

export const PRACTICE_CONTENT: PracticeContent = {
  M0: {
    mode: "quiz",
    description: "Kuis pemetaan santai untuk mengenal kemampuan awal dan gaya belajar kodingmu.",
    questions: [
      {
        id: "m0-q1",
        question: "Manakah dari berikut ini yang BUKAN termasuk bahasa pemrograman?",
        options: ["Python", "Java", "Microsoft Word", "JavaScript"],
        correctIndex: 2,
        explanation: "Microsoft Word adalah aplikasi pengolah kata, sedangkan Python, Java, dan JS adalah bahasa pemrograman.",
      },
      {
        id: "m0-q2",
        question: "Apa kepanjangan dari IDE?",
        options: ["Integrated Development Environment", "Internet Data Explorer", "Internal Design Engine", "Integrated Debug Environment"],
        correctIndex: 0,
        explanation: "IDE adalah Integrated Development Environment, tempat serbaguna programmer menulis dan menguji kodingan (contoh: VS Code).",
      },
      {
        id: "m0-q3",
        question: "Fungsi dari debugger dalam pemrograman adalah...",
        options: ["Menulis kode lebih cepat", "Mencari dan memperbaiki error dalam kode", "Mendesain tampilan aplikasi", "Mengompilasi kode menjadi binary"],
        correctIndex: 1,
        explanation: "Debugger membantu programmer menemukan dan memperbaiki bug atau kesalahan logika dalam kode.",
      },
      {
        id: "m0-q4",
        question: "Algoritma + Struktur Data = ?",
        options: ["Program Komputer", "Situs Web", "Basis Data", "Jaringan"],
        correctIndex: 0,
        explanation: "Program Komputer = Algoritma + Struktur Data (Niklaus Wirth). Keduanya adalah pondasi utama software engineering!",
      },
      {
        id: "m0-q5",
        question: "Apa fungsi utama compiler / interpreter dalam bahasa pemrograman?",
        options: ["Menjalankan kode baris per baris", "Menerjemahkan kode manusia ke bahasa yang dimengerti mesin komputer", "Menyimpan data ke database", "Mendesain antarmuka pengguna"],
        correctIndex: 1,
        explanation: "Compiler/Interpreter bertugas menerjemahkan baris kode manusia ke instruksi mesin yang bisa dieksekusi oleh processor.",
      },
    ],
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

export const MODULES_META = [
  { id: "M0", code: "M0", title: "Kuis Pemetaan & Orientasi", duration: "10 mnt", icon: "Star", color: "#FF9D00" },
  { id: "M1", code: "M1", title: "Dasar Komputer & Workspace", duration: "15 mnt", icon: "FolderOpen", color: "#FF8C42" },
  { id: "M2", code: "M2", title: "Logika & Algoritma Naratif", duration: "10 mnt", icon: "Brain", color: "#FF6B00" },
  { id: "M3", code: "M3", title: "Toples Variabel & Tipe Data", duration: "10 mnt", icon: "SquaresFour", color: "#06B6D4" },
  { id: "M4", code: "M4", title: "Percabangan & Diskon", duration: "10 mnt", icon: "GitBranch", color: "#EF4444" },
  { id: "M5", code: "M5", title: "Perulangan Tanpa Pusing", duration: "10 mnt", icon: "ArrowsClockwise", color: "#22C55E" },
  { id: "M6", code: "M6", title: "Resep Fungsi & Dapur Kode", duration: "10 mnt", icon: "Function", color: "#D45900" },
  { id: "M7", code: "M7", title: "Rak Menu & List Data", duration: "10 mnt", icon: "ListNumbers", color: "#FF8C42" },
  { id: "M8", code: "M8", title: "Mini Project Kasir Warkop", duration: "15 mnt", icon: "Rocket", color: "#FF6B00" },
];
