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
    title: "Pre-Test & Orientasi",
    slides: [
      { title: "Selamat Datang di Platform Matrikulasi!", type: "text", contentKey: "m0-welcome" },
      { title: "Apa itu Pemrograman?", type: "text", contentKey: "m0-what-is-programming" },
      { title: "Roadmap Perjalananmu (9 Modul)", type: "text", contentKey: "m0-roadmap" },
      { title: "Pre-Test Pemetaan Kemampuan", type: "text", contentKey: "m0-pretest" },
    ],
  },
  {
    id: "M1",
    title: "Dasar Komputer & Workspace",
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
    title: "Logika & Algoritma",
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
    title: "Variabel & Tipe Data",
    slides: [
      { title: "Apa itu Variabel?", type: "text", contentKey: "m3-variable" },
      { title: "Tipe Data Dasar di Python", type: "text", contentKey: "m3-data-types" },
      { title: "Operasi pada Variabel", type: "text", contentKey: "m3-operations" },
    ],
  },
  {
    id: "M4",
    title: "Percabangan",
    slides: [
      { title: "Logika Percabangan dalam Kehidupan", type: "text", contentKey: "m4-if-intro" },
      { title: "if, elif, else di Python", type: "text", contentKey: "m4-if-elif-else" },
      { title: "Operasi Perbandingan & Logika", type: "text", contentKey: "m4-comparison" },
    ],
  },
  {
    id: "M5",
    title: "Perulangan",
    slides: [
      { title: "Mengapa Perulangan Penting?", type: "text", contentKey: "m5-loop-intro" },
      { title: "For Loop di Python", type: "text", contentKey: "m5-for-loop" },
      { title: "While Loop & Aplikasinya", type: "text", contentKey: "m5-while-loop" },
    ],
  },
  {
    id: "M6",
    title: "Fungsi & Prosedur",
    slides: [
      { title: "Konsep Fungsi", type: "text", contentKey: "m6-function" },
      { title: "Membuat Fungsi di Python", type: "text", contentKey: "m6-def-function" },
      { title: "Parameter, Return Value & Scope", type: "text", contentKey: "m6-params-scope" },
    ],
  },
  {
    id: "M7",
    title: "Array & List",
    slides: [
      { title: "Apa itu List?", type: "text", contentKey: "m7-list-intro" },
      { title: "Operasi pada List", type: "text", contentKey: "m7-list-operations" },
      { title: "List Multidimensi & Aplikasi", type: "text", contentKey: "m7-list-multi" },
    ],
  },
  {
    id: "M8",
    title: "Mini Project",
    slides: [
      { title: "Ringkasan Materi Sebelumnya", type: "text", contentKey: "m8-summary" },
      { title: "Spesifikasi Mini Project", type: "text", contentKey: "m8-spec" },
      { title: "Langkah Pengerjaan", type: "text", contentKey: "m8-steps" },
    ],
  },
];

export const PRACTICE_CONTENT: PracticeContent = {
  M0: {
    mode: "quiz",
    description: "Pre-test diagnostik untuk memetakan kemampuan awal kamu.",
    questions: [
      {
        id: "m0-q1",
        question: "Manakah dari berikut ini yang BUKAN termasuk bahasa pemrograman?",
        options: ["Python", "Java", "Microsoft Word", "JavaScript"],
        correctIndex: 2,
        explanation: "Microsoft Word adalah aplikasi pengolah kata, bukan bahasa pemrograman.",
      },
      {
        id: "m0-q2",
        question: "Apa kepanjangan dari IDE?",
        options: ["Integrated Development Environment", "Internet Data Explorer", "Internal Design Engine", "Integrated Debug Environment"],
        correctIndex: 0,
        explanation: "IDE adalah singkatan dari Integrated Development Environment, software yang menyediakan tools untuk menulis dan menguji kode.",
      },
      {
        id: "m0-q3",
        question: "Fungsi dari debugger dalam pemrograman adalah...",
        options: ["Menulis kode lebih cepat", "Mencari dan memperbaiki error dalam kode", "Mendesain tampilan aplikasi", "Mengompilasi kode menjadi binary"],
        correctIndex: 1,
        explanation: "Debugger membantu programmer menemukan dan memperbaiki bug atau kesalahan dalam kode program.",
      },
      {
        id: "m0-q4",
        question: "Algorithm + Data Structures = ?",
        options: ["Programs", "Websites", "Databases", "Networks"],
        correctIndex: 0,
        explanation: "Program = Algorithm + Data Structures (Niklaus Wirth). Keduanya adalah fondasi utama pemrograman.",
      },
      {
        id: "m0-q5",
        question: "Apa fungsi utama compiler dalam bahasa pemrograman?",
        options: ["Menjalankan kode baris per baris", "Menerjemahkan seluruh kode ke bahasa mesin sekaligus", "Menyimpan data ke database", "Mendesain antarmuka pengguna"],
        correctIndex: 1,
        explanation: "Compiler menerjemahkan seluruh source code ke dalam bahasa mesin/executable sebelum dijalankan, berbeda dengan interpreter yang menjalankan baris per baris.",
      },
    ],
  },
  M2: {
    mode: "coding",
    description: "Buat program Python pertama kamu! Buat variabel nama dan cetak 'Halo, [nama]!'",
    initialCode: "# Buat variabel nama\n# Cetak 'Halo, [nama]!'\n",
  },
  M3: {
    mode: "coding",
    description: "Buat variabel dengan tipe data string, integer, dan float, lalu cetak semuanya.",
    initialCode: "# String\nnama = \"Budi\"\n# Integer\numur = 18\n# Float\ntinggi = 170.5\n# Cetak semuanya\n",
  },
  M4: {
    mode: "coding",
    description: "Buat program yang meminta input angka dan menentukan apakah angka tersebut genap atau ganjil.",
    initialCode: "# Input angka\n# Cek genap/ganjil dengan if-else\n",
  },
  M5: {
    mode: "coding",
    description: "Buat program yang mencetak angka 1 sampai 10 menggunakan perulangan for.",
    initialCode: "# Gunakan for loop untuk mencetak 1-10\n",
  },
  M6: {
    mode: "coding",
    description: "Buat fungsi bernama 'sapa' yang menerima parameter nama dan mengembalikan string 'Halo, [nama]!'",
    initialCode: "# Definisikan fungsi sapa(nama)\ndef sapa(nama):\n    # return f\"Halo, {nama}!\"\n\n# Panggil fungsi\nprint(sapa(\"TRPL\"))\n",
  },
  M7: {
    mode: "coding",
    description: "Buat list berisi 5 buah favorit, lalu cetak buah ketiga dari list tersebut.",
    initialCode: "# Buat list buah\nbuah = [\"apel\", \"mangga\", \"pisang\", \"anggur\", \"jeruk\"]\n# Cetak buah ketiga (index ke-2)\n",
  },
  M8: {
    mode: "coding",
    description: "Mini Project: Buat program kalkulator sederhana yang bisa menjumlahkan dua angka.",
    initialCode: "# Kalkulator Sederhana\n# 1. Input angka pertama\n# 2. Input angka kedua\n# 3. Cetak hasil penjumlahan\n",
  },
};

export const MODULES_META = [
  { id: "M0", code: "M0", title: "Pre-Test & Orientasi", duration: "10 mnt", icon: "Star", color: "#FF9D00" },
  { id: "M1", code: "M1", title: "Dasar Komputer & Workspace", duration: "15 mnt", icon: "FolderOpen", color: "#FF8C42" },
  { id: "M2", code: "M2", title: "Logika & Algoritma", duration: "10 mnt", icon: "Brain", color: "#FF6B00" },
  { id: "M3", code: "M3", title: "Variabel & Tipe Data", duration: "10 mnt", icon: "SquaresFour", color: "#06B6D4" },
  { id: "M4", code: "M4", title: "Percabangan", duration: "10 mnt", icon: "GitBranch", color: "#EF4444" },
  { id: "M5", code: "M5", title: "Perulangan", duration: "10 mnt", icon: "ArrowsClockwise", color: "#22C55E" },
  { id: "M6", code: "M6", title: "Fungsi & Prosedur", duration: "10 mnt", icon: "Function", color: "#D45900" },
  { id: "M7", code: "M7", title: "Array & List", duration: "10 mnt", icon: "ListNumbers", color: "#FF8C42" },
  { id: "M8", code: "M8", title: "Mini Project", duration: "15 mnt", icon: "Rocket", color: "#FF6B00" },
];
