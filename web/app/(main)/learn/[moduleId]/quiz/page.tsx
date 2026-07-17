"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useGameStore } from "@/lib/store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowsClockwise,
  Question,
  BookOpen,
} from "@phosphor-icons/react";
import { fireConfetti } from "@/lib/confetti";
import { getRandomMemes } from "@/lib/content/memes";

interface QuestionData {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizPage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeModule, addXP, unlockBadge } = useUserStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const gameApi = useGameStore.getState();
  const quizMemes = getRandomMemes(moduleId as string, 2);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!user) return null;

  const quizData: Record<string, QuestionData[]> = {
    M0: [
      {
        text: "Apa perintah yang digunakan untuk menampilkan tulisan atau output ke layar di Python?",
        options: ["print()", "input()", "show()", "write()"],
        correctIndex: 0,
        explanation: "Fungsi print() adalah fungsi dasar bawaan Python yang digunakan untuk mencetak teks atau nilai ke layar."
      },
      {
        text: "Manakah dari pilihan berikut yang merupakan contoh penulisan string (teks) yang benar di Python?",
        options: ["Halo", "\"Halo\"", "123", "True"],
        correctIndex: 1,
        explanation: "String di Python harus diapit oleh tanda kutip (tunggal maupun ganda), contohnya \"Halo\"."
      },
      {
        text: "Jika kita ingin menyimpan nilai angka bulat seperti 10, tipe data apa yang paling tepat digunakan?",
        options: ["String", "Float", "Integer", "Boolean"],
        correctIndex: 2,
        explanation: "Integer (int) digunakan untuk menyimpan bilangan bulat tanpa pecahan, seperti 10, -5, atau 0."
      },
      {
        text: "Tipe data apakah yang hanya memiliki dua kemungkinan nilai, yaitu True (Benar) atau False (Salah)?",
        options: ["Boolean", "Integer", "Float", "String"],
        correctIndex: 0,
        explanation: "Boolean (bool) adalah tipe data logika yang hanya bernilai True or False."
      },
      {
        text: "Apa fungsi dari tanda pagar (#) di awal baris kode Python?",
        options: [
          "Untuk membuat baris kode tersebut menjadi judul program",
          "Untuk menandai baris komentar agar tidak dieksekusi oleh komputer",
          "Untuk mempercepat jalannya program",
          "Untuk menghapus variabel"
        ],
        correctIndex: 1,
        explanation: "Karakter # digunakan untuk menulis komentar. Komputer akan mengabaikan baris komentar saat menjalankan kode program."
      },
      {
        text: "Manakah simbol operator matematika yang digunakan untuk melakukan operasi penjumlahan?",
        options: ["*", "/", "-", "+"],
        correctIndex: 3,
        explanation: "Operator '+' digunakan untuk menjumlahkan dua bilangan atau menggabungkan string."
      },
      {
        text: "Apa yang dimaksud dengan 'Syntax Error' dalam pemrograman?",
        options: [
          "Kesalahan dalam logika berpikir program",
          "Kesalahan penulisan aturan tata bahasa kode sehingga program tidak bisa dijalankan",
          "Kesalahan karena komputer mati mendadak",
          "Aplikasi berjalan tapi hasilnya salah"
        ],
        correctIndex: 1,
        explanation: "Syntax Error terjadi jika kode melanggar aturan tata bahasa (sintaksis) bahasa pemrograman tersebut, sehingga interpreter/compiler tidak dapat memahaminya."
      },
      {
        text: "Siapa atau bagian komputer apa yang mengeksekusi instruksi dari script program Python?",
        options: ["Keyboard", "Layar Monitor", "Interpreter Python melalui CPU", "Harddisk"],
        correctIndex: 2,
        explanation: "Interpreter Python menerjemahkan baris demi baris script kode kita menjadi bahasa mesin yang kemudian dieksekusi oleh CPU."
      },
      {
        text: "Fungsi bawaan Python manakah yang digunakan untuk meminta input teks dari pengguna lewat keyboard?",
        options: ["print()", "input()", "read()", "scan()"],
        correctIndex: 1,
        explanation: "Fungsi input() menghentikan jalannya program sementara untuk menunggu pengguna mengetikkan teks lalu menekan Enter."
      },
      {
        text: "Mengapa variabel sangat penting dalam pemrograman komputer?",
        options: [
          "Untuk menghias tampilan aplikasi agar cantik",
          "Sebagai wadah penyimpanan sementara agar data bisa digunakan kembali di baris kode selanjutnya",
          "Untuk mempercepat koneksi internet",
          "Untuk menyimpan program di dalam flashdisk"
        ],
        correctIndex: 1,
        explanation: "Tanpa variabel, program tidak bisa mengingat data yang telah dihitung atau diinput sebelumnya untuk diproses di langkah selanjutnya."
      }
    ],
    M1: [
      {
        text: "Dari pilihan berikut, manakah lokasi folder yang paling aman dan disarankan untuk membuat folder proyek coding?",
        options: [
          "C:\\Windows\\System32",
          "Di folder Desktop atau Downloads",
          "Di partisi non-sistem (seperti D:\\TRPL\\proyek) dengan nama tanpa spasi",
          "Di dalam Recycle Bin agar tidak mengotori harddisk"
        ],
        correctIndex: 2,
        explanation: "Menyimpan proyek di D: atau partisi non-sistem menghindari resiko terhapus secara tidak sengaja dan meminimalisir error permission."
      },
      {
        text: "Bagaimana cara memunculkan file name extensions di Windows File Explorer agar kita bisa membedakan program.py dengan program.py.txt?",
        options: [
          "Membuka Command Prompt dan mengetik file-extensions",
          "Mencentang pilihan 'File name extensions' pada tab View di File Explorer",
          "Mengganti sistem operasi ke Linux",
          "Menghapus instalan File Explorer"
        ],
        correctIndex: 1,
        explanation: "Mencentang opsi 'File name extensions' di tab View Windows Explorer akan menampilkan format akhiran berkas secara jelas."
      },
      {
        text: "Karakter manakah yang sebaiknya dihindari dalam penamaan folder proyek pemrograman?",
        options: ["Huruf kecil (a-z)", "Karakter spasi (' ')", "Garis bawah (Underscore '_')", "Huruf besar (A-Z)"],
        correctIndex: 1,
        explanation: "Penggunaan spasi pada nama folder proyek sering memicu error path ketika terminal/compiler mencoba mengeksekusi file di dalamnya."
      },
      {
        text: "Perintah terminal (CLI) manakah yang digunakan untuk memeriksa versi Python yang terinstal di komputer?",
        options: ["python --version", "python --help", "run python", "check python"],
        correctIndex: 0,
        explanation: "Perintah 'python --version' atau 'python -V' digunakan untuk memeriksa versi interpreter Python yang aktif di PATH."
      },
      {
        text: "Apa fungsi dari Environment Variables (PATH) dalam sistem operasi?",
        options: [
          "Untuk menyimpan kata sandi akun Google",
          "Sebagai peta alamat bagi sistem operasi untuk mencari lokasi program agar bisa dipanggil dari folder mana saja di terminal",
          "Untuk mempercepat koneksi internet WiFi kampus",
          "Sebagai aplikasi pembersih virus otomatis"
        ],
        correctIndex: 1,
        explanation: "PATH memberi tahu OS di mana lokasi executable dari program (seperti Python atau Git) berada, sehingga terminal mengenali perintahnya dari direktori mana saja."
      },
      {
        text: "Software manakah yang paling populer digunakan sebagai teks editor/IDE yang ringan untuk coding Python?",
        options: ["Microsoft Word", "VS Code (Visual Studio Code)", "Adobe Photoshop", "Google Chrome"],
        correctIndex: 1,
        explanation: "VS Code adalah teks editor modern gratis yang sangat populer di kalangan developer karena dukungannya yang kaya akan ekstensi pemrograman."
      },
      {
        text: "Apa kepanjangan dari istilah terminal CLI?",
        options: ["Computer Line Interface", "Command Line Interface", "Code Line Integration", "Common Loop Instruction"],
        correctIndex: 1,
        explanation: "CLI adalah Command Line Interface, antarmuka pengguna berbasis teks untuk berinteraksi dengan sistem operasi melalui perintah baris."
      },
      {
        text: "Perintah terminal manakah yang digunakan untuk berpindah dari satu direktori/folder ke folder lainnya?",
        options: ["cd", "dir", "mkdir", "move"],
        correctIndex: 0,
        explanation: "Perintah 'cd' (change directory) digunakan untuk menavigasi atau masuk/keluar dari folder aktif di terminal."
      },
      {
        text: "Untuk melihat daftar file dan sub-folder di dalam direktori aktif pada Windows Command Prompt, perintah apa yang diketikkan?",
        options: ["ls", "dir", "list", "show"],
        correctIndex: 1,
        explanation: "Di Windows CMD, perintah 'dir' digunakan untuk melihat daftar isi direktori. Di Linux/macOS, perintah padanannya adalah 'ls'."
      },
      {
        text: "Apa konsekuensi terburuk jika kita menaruh folder workspace coding di dalam folder Recycle Bin?",
        options: [
          "Aplikasi berjalan lebih cepat",
          "File dapat terhapus secara permanen secara tidak sengaja ketika Recycle Bin dibersihkan",
          "IDE VS Code akan otomatis mempercantik tampilan kode",
          "Interpreter Python akan menolak memproses tipe data String"
        ],
        correctIndex: 1,
        explanation: "Recycle Bin adalah tempat pembuangan sementara. File di dalamnya sangat rentan hilang selamanya saat dibersihkan."
      }
    ],
    M2: [
      {
        text: "Manakah pengertian yang paling tepat mengenai Algoritma?",
        options: [
          "Program aplikasi buatan Microsoft",
          "Langkah-langkah logis terstruktur untuk memecahkan suatu masalah",
          "Tipe data untuk menyimpan angka pecahan",
          "Sistem operasi khusus untuk laptop gaming"
        ],
        correctIndex: 1,
        explanation: "Algoritma adalah panduan langkah demi langkah yang logis, sistematis, dan terurut untuk memecahkan sebuah masalah atau mencapai tujuan tertentu."
      },
      {
        text: "Kriteria algoritma yang menyatakan bahwa algoritma harus berhenti setelah menyelesaikan sejumlah langkah tertentu disebut...",
        options: ["Finiteness (Keterbatasan)", "Definiteness (Kepastian)", "Effectiveness (Keefektifan)", "Generality (Keumuman)"],
        correctIndex: 0,
        explanation: "Finiteness (Keterbatasan) berarti suatu algoritma tidak boleh berjalan tanpa henti (harus memiliki titik akhir yang jelas)."
      },
      {
        text: "Simbol bangun datar Oval (Terminal) pada flowchart melambangkan...",
        options: ["Proses perhitungan", "Mulai (Start) atau Selesai (End) program", "Pengambilan keputusan logika", "Pemasukan data input"],
        correctIndex: 1,
        explanation: "Oval merupakan simbol Terminal yang berfungsi sebagai penanda awal mula dan akhir dari alur flowchart."
      },
      {
        text: "Bentuk bangun datar Persegi Panjang pada bagan alir (Flowchart) digunakan untuk menggambarkan...",
        options: ["Input data dari pengguna", "Keputusan Ya/Tidak", "Proses pengolahan/perhitungan nilai", "Mencetak output ke layar"],
        correctIndex: 2,
        explanation: "Persegi Panjang melambangkan Proses, yaitu proses komputasi, rumus matematika, atau penugasan variabel."
      },
      {
        text: "Simbol Belah Ketupat (Decision) digunakan ketika algoritma membutuhkan...",
        options: ["Pemberhentian program secara paksa", "Percabangan/pengambilan keputusan berdasarkan suatu syarat", "Penginputan nama mahasiswa", "Pencetakan hasil ke kertas"],
        correctIndex: 1,
        explanation: "Belah Ketupat (Decision) melambangkan percabangan bersyarat, di mana alur program harus memilih satu dari beberapa jalur keputusan."
      },
      {
        text: "Simbol Jajar Genjang pada Flowchart melambangkan...",
        options: ["Mulai / Selesai", "Proses penambahan nilai", "Operasi Input atau Output data", "Konektor antar halaman"],
        correctIndex: 2,
        explanation: "Jajar Genjang melambangkan aktivitas I/O (Input/Output), seperti membaca variabel dari user atau menampilkan hasil ke layar."
      },
      {
        text: "Apa yang dimaksud dengan Pseudocode?",
        options: [
          "Bahasa pemrograman tingkat tinggi terbaru",
          "Penulisan algoritma menggunakan deskripsi bahasa manusia terstruktur yang mirip kode pemrograman asli",
          "Kode program yang sengaja ditulis salah untuk menguji compiler",
          "Diagram alir berbentuk gambar grafik"
        ],
        correctIndex: 1,
        explanation: "Pseudocode membantu menjembatani pemikiran manusia dengan sintaks bahasa pemrograman menggunakan kata kunci informal terstruktur."
      },
      {
        text: "Mengapa sebaiknya kita merancang algoritma (pseudocode/flowchart) sebelum mulai mengetikkan kode program asli?",
        options: [
          "Agar program bisa langsung dijual mahal",
          "Supaya kita fokus pada pemecahan logika masalah dan meminimalisir error alur logika",
          "Karena komputer mewajibkan pseudocode diunggah ke memori",
          "Supaya laptop tidak cepat kehabisan baterai"
        ],
        correctIndex: 1,
        explanation: "Merancang algoritma terlebih dahulu memisahkan tahap pemecahan masalah dengan tahap implementasi sintaksis kode bahasa komputer."
      },
      {
        text: "Apa yang terjadi jika urutan instruksi dalam sebuah algoritma diubah secara acak?",
        options: [
          "Program akan tetap berjalan normal",
          "Logika program rusak dan output yang dihasilkan akan salah atau memicu error",
          "Komputer akan otomatis memperbaiki urutan langkahnya",
          "Tipe data integer otomatis berubah menjadi float"
        ],
        correctIndex: 1,
        explanation: "Algoritma sangat sensitif terhadap urutan. Mengubah urutan instruksi secara acak merusak runtutan logika pemecahan masalah."
      },
      {
        text: "Kata kunci standar manakah yang sering digunakan dalam pseudocode untuk menandakan pencetakan informasi ke layar?",
        options: ["READ", "HITUNG", "TAMPILKAN", "BACA"],
        correctIndex: 2,
        explanation: "TAMPILKAN (atau PRINT/WRITE) digunakan untuk menunjukkan operasi pengeluaran output data ke layar dalam pseudocode."
      }
    ],
    M3: [
      {
        text: "Manakah cara penulisan variabel Python yang disarankan sesuai dengan standar snake_case?",
        options: ["namaLengkap", "nama_lengkap", "NamaLengkap", "nama-lengkap"],
        correctIndex: 1,
        explanation: "snake_case menggunakan huruf kecil semua dan memisahkan setiap kata dengan karakter underscore (_)."
      },
      {
        text: "Jika kita ingin menyimpan nilai desimal IPK sebesar 3.82, tipe data manakah yang paling tepat?",
        options: ["Integer (int)", "Boolean (bool)", "Float (float)", "String (str)"],
        correctIndex: 2,
        explanation: "Float digunakan untuk mewakili angka pecahan atau bilangan desimal dalam pemrograman Python."
      },
      {
        text: "Berapakah hasil dari operasi modulo berikut di Python: 7 % 3?",
        options: ["2.33", "2", "1", "0"],
        correctIndex: 2,
        explanation: "Operator % (modulo) menghasilkan sisa pembagian. 7 dibagi 3 adalah 2 dengan sisa bagi 1."
      },
      {
        text: "Operator matematika manakah yang digunakan untuk melakukan pembagian bulat (membulatkan hasil pembagian ke bawah)?",
        options: ["/", "%", "//", "**"],
        correctIndex: 2,
        explanation: "Operator '//' (floor division) membagi bilangan lalu membulatkan hasilnya ke bawah menjadi bilangan bulat terdekat."
      },
      {
        text: "Bagaimana cara melakukan operasi perpangkatan (misalnya 2 pangkat 3) di Python?",
        options: ["2 ^ 3", "2 ** 3", "2 * 3", "pow(2, 3) saja yang bisa"],
        correctIndex: 1,
        explanation: "Di Python, operator eksponen/perpangkatan dilambangkan dengan dua bintang (**)."
      },
      {
        text: "Apa output dari perintah: type(3.14)?",
        options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'bool'>"],
        correctIndex: 2,
        explanation: "Karena 3.14 memiliki pecahan desimal, fungsi type() akan mengenali tipe data tersebut sebagai class 'float'."
      },
      {
        text: "Ekspresi logika menggunakan operator 'and' akan bernilai True jika...",
        options: [
          "Salah satu kondisi bernilai True",
          "Kedua kondisi yang digabungkan sama-sama bernilai True",
          "Kedua kondisi bernilai False",
          "Kondisi pertama bernilai False"
        ],
        correctIndex: 1,
        explanation: "Operator 'and' mensyaratkan semua kondisi bernilai benar (True) untuk menghasilkan nilai akhir True."
      },
      {
        text: "Berapakah hasil dari ekspresi logika berikut: not True?",
        options: ["True", "False", "None", "Error"],
        correctIndex: 1,
        explanation: "Operator 'not' berfungsi membalikkan nilai boolean. Kebalikan dari True adalah False."
      },
      {
        text: "Apakah hasil akhir dari perbandingan matematika berikut: 12 > 15?",
        options: ["True", "False", "1", "0"],
        correctIndex: 1,
        explanation: "Karena 12 secara logika lebih kecil dari 15, perbandingan 12 > 15 menghasilkan nilai boolean False."
      },
      {
        text: "Simbol manakah yang digunakan sebagai assignment operator (operator penugasan nilai ke variabel) di Python?",
        options: ["==", "=", "+=", "is"],
        correctIndex: 1,
        explanation: "Simbol '=' tunggal digunakan untuk menetapkan (assign) nilai di sebelah kanan ke variabel di sebelah kiri."
      }
    ],
    M4: [
      {
        text: "Karakter atau tanda baca apakah yang wajib dituliskan di akhir baris pernyataan kondisi 'if' di Python?",
        options: ["; (titik koma)", ": (titik dua)", ", (koma)", "{ (kurung kurawal)"],
        correctIndex: 1,
        explanation: "Pernyataan kontrol seperti if, elif, else, while, dan def wajib diakhiri dengan tanda titik dua (:) di Python."
      },
      {
        text: "Kesalahan tata bahasa kode program (Error) apakah yang paling sering terjadi jika kita tidak merapikan tab/spasi di dalam block 'if'?",
        options: ["SyntaxError", "TypeError", "IndentationError", "NameError"],
        correctIndex: 2,
        explanation: "IndentationError terjadi karena penulisan spasi masuk (indentasi) di awal baris di dalam blok instruksi tidak konsisten atau tidak ada."
      },
      {
        text: "Kapan kode di dalam blok 'else' akan dieksekusi oleh interpreter Python?",
        options: [
          "Jika kondisi pada bagian 'if' bernilai True",
          "Jika semua kondisi 'if' dan 'elif' di atasnya bernilai False",
          "Setiap kali program dijalankan, tanpa melihat kondisi",
          "Hanya jika terjadi error pada program"
        ],
        correctIndex: 1,
        explanation: "Blok 'else' bertindak sebagai jalur alternatif terakhir apabila seluruh syarat kondisi di atasnya tidak ada yang bernilai True."
      },
      {
        text: "Kata kunci manakah yang digunakan untuk memeriksa kondisi tambahan lainnya jika kondisi 'if' pertama salah?",
        options: ["else if", "elif", "elseif", "else_if"],
        correctIndex: 1,
        explanation: "Python menyingkat penulisan 'else if' menjadi satu kata kunci resmi yaitu 'elif'."
      },
      {
        text: "Apa yang terjadi jika kondisi di dalam block 'if' bernilai False dan program tidak memiliki block 'else'?",
        options: [
          "Program akan memisu error dan berhenti paksa",
          "Blok instruksi di dalam 'if' dilewati begitu saja dan lanjut ke baris kode setelah blok 'if'",
          "Program akan hang",
          "Interpreter Python akan meminta user menginput ulang data"
        ],
        correctIndex: 1,
        explanation: "Jika kondisi bersyarat tidak terpenuhi (False) dan tidak ada jalur alternatif (else), program langsung melompat ke baris kode setelah struktur percabangan."
      },
      {
        text: "Bagaimana cara penulisan struktur percabangan di dalam percabangan lainnya (Nested If) yang benar?",
        options: [
          "Menyejajarkan baris 'if' pertama dengan 'if' kedua",
          "Menaruh pernyataan 'if' kedua di dalam blok yang teridentasi masuk dari 'if' pertama",
          "Menggunakan kata kunci 'nested_if' di awal kode",
          "Tidak diperbolehkan membuat if di dalam if di Python"
        ],
        correctIndex: 1,
        explanation: "Nested If dibuat dengan menulis struktur if baru di dalam blok instruksi milik if utama, yang ditandai dengan identasi yang menjorok lebih dalam."
      },
      {
        text: "Berapakah jumlah maksimal pernyataan 'elif' yang diperbolehkan di dalam satu struktur percabangan?",
        options: ["Hanya 1", "Maksimal 5", "Maksimal 10", "Tidak terbatas (sebanyak yang dibutuhkan)"],
        correctIndex: 3,
        explanation: "Kita dapat menyusun kondisi pemeriksaan sebanyak apa pun menggunakan 'elif' sesuai dengan logika kebutuhan program."
      },
      {
        text: "Manakah penulisan ekspresi logika yang benar untuk memeriksa apakah variabel x bernilai di antara 10 dan 20 secara inklusif?",
        options: ["x >= 10 or x <= 20", "10 <= x <= 20", "x = 10 and x = 20", "10 >= x >= 20"],
        correctIndex: 1,
        explanation: "Di Python, kita bisa menulis rentang nilai secara berantai seperti '10 <= x <= 20', atau menggunakan gabungan logika 'x >= 10 and x <= 20'."
      },
      {
        text: "Apakah block 'else' bersifat wajib (wajib ada) di setiap kita membuat pernyataan 'if'?",
        options: [
          "Ya, tanpa else program tidak akan berjalan",
          "Tidak, else bersifat opsional dan hanya ditulis jika kita butuh menangani kondisi alternatif",
          "Hanya wajib jika menggunakan Python versi lama",
          "Ya, else wajib digabung agar memori tidak bocor"
        ],
        correctIndex: 1,
        explanation: "Kita bisa menulis 'if' tunggal tanpa harus menyertakan block 'else' jika tidak ada aksi khusus saat kondisi bernilai salah."
      },
      {
        text: "Perhatikan kode berikut:\nx = 5\nif x > 3:\n    print('A')\nif x > 4:\n    print('B')\nApa output yang tercetak?",
        options: ["A", "B", "A dan B", "Tidak mencetak apa pun"],
        correctIndex: 2,
        explanation: "Karena ada dua blok 'if' mandiri terpisah, keduanya akan diperiksa. x > 3 bernilai True (cetak 'A') dan x > 4 juga bernilai True (cetak 'B')."
      }
    ],
    M5: [
      {
        text: "Fungsi range(1, 5) di Python akan menghasilkan urutan deret angka...",
        options: ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4, 5", "2, 3, 4"],
        correctIndex: 1,
        explanation: "Parameter stop pada fungsi range() bersifat eksklusif. range(1, 5) menghasilkan angka mulai dari 1 sampai sebelum 5 (yaitu 1, 2, 3, 4)."
      },
      {
        text: "Kapan jenis perulangan 'while' loop lebih cocok digunakan daripada 'for' loop?",
        options: [
          "Saat jumlah iterasi pengulangan sudah diketahui dengan pasti sejak awal",
          "Saat pengulangan bergantung pada terpenuhinya suatu kondisi boolean tertentu yang belum pasti kapan selesainya",
          "Saat kita ingin mempercepat proses perhitungan matematika",
          "Saat tipe data yang diulang adalah string"
        ],
        correctIndex: 1,
        explanation: "while loop ideal digunakan untuk perulangan yang tidak pasti berapa kali harus berjalan, melainkan terus berjalan selama kondisi syarat bernilai True."
      },
      {
        text: "Apa yang dimaksud dengan istilah 'Infinite Loop'?",
        options: [
          "Looping yang berjalan sangat cepat di background",
          "Perulangan yang berjalan terus-menerus tanpa henti karena kondisi syarat while selalu bernilai True",
          "Kode perulangan yang memiliki error tata bahasa",
          "Perulangan yang hanya dijalankan sebanyak satu kali saja"
        ],
        correctIndex: 1,
        explanation: "Infinite loop terjadi saat tidak ada perubahan nilai di dalam loop yang dapat membuat kondisi while bernilai False, sehingga program terjebak mengulang selamanya."
      },
      {
        text: "Kata kunci manakah yang digunakan untuk menghentikan paksa dan langsung keluar dari blok perulangan?",
        options: ["stop", "break", "continue", "exit"],
        correctIndex: 1,
        explanation: "Keyword 'break' menghentikan eksekusi perulangan saat itu juga dan langsung mengalihkan alur kontrol ke baris kode setelah blok perulangan."
      },
      {
        text: "Kata kunci 'continue' di dalam perulangan berfungsi untuk...",
        options: [
          "Menghentikan perulangan saat itu juga secara permanen",
          "Melompati sisa instruksi di iterasi saat ini dan langsung melompat ke iterasi berikutnya",
          "Mengulangi program dari awal baris pertama",
          "Membuat komputer berbunyi beep"
        ],
        correctIndex: 1,
        explanation: "continue menghentikan iterasi aktif saat ini, mengabaikan sisa baris kode di bawahnya, dan langsung mengevaluasi perulangan ke putaran selanjutnya."
      },
      {
        text: "Deret angka manakah yang dihasilkan oleh range(5) secara default?",
        options: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "0, 1, 2, 3, 4, 5", "5, 4, 3, 2, 1"],
        correctIndex: 1,
        explanation: "Jika range() hanya diberikan satu parameter, parameter itu dianggap nilai stop dan start dimulai secara default dari angka 0. range(5) -> 0, 1, 2, 3, 4."
      },
      {
        text: "Kombinasi tombol keyboard manakah yang digunakan untuk menghentikan paksa program Python yang terjebak infinite loop di terminal?",
        options: ["Ctrl + Alt + Del", "Ctrl + C", "Alt + F4", "Ctrl + Z"],
        correctIndex: 1,
        explanation: "Menekan tombol 'Ctrl + C' di terminal mengirimkan sinyal Interrupt untuk menghentikan paksa eksekusi program Python yang sedang aktif."
      },
      {
        text: "Di dalam struktur perulangan 'while', kapan pemeriksaan kondisi syarat perulangan dilakukan oleh sistem?",
        options: [
          "Setelah seluruh block instruksi selesai dijalankan satu putaran",
          "Di awal sebelum mengeksekusi block instruksi di dalamnya",
          "Hanya saat program pertama kali dibuka",
          "Secara acak di tengah-tengah jalannya looping"
        ],
        correctIndex: 1,
        explanation: "while loop bertindak sebagai entry-controlled loop; kondisi diperiksa terlebih dahulu di awal sebelum mengizinkan blok instruksi di dalamnya dijalankan."
      },
      {
        text: "Berapa kali tulisan 'TRPL' tercetak dari kode berikut:\nfor i in range(1, 3):\n    print('TRPL')?",
        options: ["1 kali", "2 kali", "3 kali", "Tidak tercetak sama sekali"],
        correctIndex: 1,
        explanation: "range(1, 3) menghasilkan deret angka 1 dan 2. Maka loop berputar sebanyak 2 kali, mencetak 'TRPL' 2 kali."
      },
      {
        text: "Apa sebutan untuk teknik menulis perulangan di dalam perulangan lainnya?",
        options: ["Double Loop", "Nested Loop (Perulangan Bersarang)", "Recursive Loop", "Chain Loop"],
        correctIndex: 1,
        explanation: "Nested Loop adalah perulangan di dalam perulangan, di mana setiap satu putaran loop luar (outer loop) akan menjalankan seluruh putaran loop dalam (inner loop)."
      }
    ],
    M6: [
      {
        text: "Kata kunci wajib apakah yang digunakan untuk mendeklarasikan sebuah fungsi di Python?",
        options: ["function", "def", "func", "define"],
        correctIndex: 1,
        explanation: "Python menggunakan kata kunci 'def' (kependekan dari define) untuk mendefinisikan sebuah fungsi."
      },
      {
        text: "Variabel penampung nilai input yang ditulis di dalam tanda kurung saat mendefinisikan fungsi disebut...",
        options: ["Argumen", "Parameter", "Local Variable", "Global Variable"],
        correctIndex: 1,
        explanation: "Parameter adalah nama variabel penampung yang tercantum di definisi fungsi, sedangkan Argumen adalah nilai nyata yang dikirimkan saat fungsi dipanggil."
      },
      {
        text: "Apakah manfaat utama dari membuat fungsi dalam penulisan kode program?",
        options: [
          "Membuat program menjadi lebih berwarna",
          "Membagi kode menjadi bagian-bagian modular yang dapat digunakan kembali (reusable) dan rapi",
          "Menghilangkan virus di komputer secara otomatis",
          "Mengubah tipe data string menjadi integer secara otomatis"
        ],
        correctIndex: 1,
        explanation: "Fungsi memisahkan logika khusus ke sebuah blok mandiri yang bisa dipanggil berkali-kali tanpa menulis ulang kodenya, sesuai prinsip DRY."
      },
      {
        text: "Perbedaan utama antara fungsi yang menggunakan kata kunci 'return' dengan fungsi yang menggunakan perintah 'print()' di dalamnya adalah...",
        options: [
          "Fungsi print() memakan memori lebih banyak daripada return",
          "Return mengembalikan nilai hasil proses untuk disimpan/diolah variabel lain, sedangkan print hanya mencetak visual teks ke layar",
          "Fungsi return hanya bisa memproses tipe data integer",
          "Tidak ada perbedaan sama sekali"
        ],
        correctIndex: 1,
        explanation: "return mengirimkan objek hasil perhitungan kembali ke pemanggil fungsi agar bisa dimasukkan ke variabel lain atau diproses lebih lanjut."
      },
      {
        text: "Apakah yang dimaksud dengan 'Variabel Lokal' di dalam sebuah fungsi?",
        options: [
          "Variabel yang hanya dikenali dan dapat diakses dari dalam fungsi tempat ia dideklarasikan",
          "Variabel yang dideklarasikan menggunakan bahasa daerah",
          "Variabel yang dideklarasikan di luar fungsi agar bisa diakses siapa saja",
          "Variabel yang menyimpan alamat memori harddisk"
        ],
        correctIndex: 0,
        explanation: "Variabel lokal dideklarasikan di dalam blok fungsi. Ruang lingkupnya (scope) terbatas hanya di dalam fungsi tersebut dan akan dihapus saat fungsi selesai dijalankan."
      },
      {
        text: "Apakah yang dimaksud dengan 'Variabel Global'?",
        options: [
          "Variabel yang dideklarasikan di luar fungsi dan dapat diakses dari bagian mana saja di dalam file kode tersebut",
          "Variabel yang tersambung dengan jaringan internet global",
          "Variabel yang tidak bisa dihapus oleh sistem operasi",
          "Variabel khusus untuk menyimpan data koordinat GPS bumi"
        ],
        correctIndex: 0,
        explanation: "Variabel global berada di tingkat terluar kode, sehingga memiliki scope global dan bisa dibaca oleh fungsi-fungsi di bawahnya."
      },
      {
        text: "Apakah kepanjangan dari prinsip DRY dalam aturan clean code?",
        options: ["Do Rule Yourself", "Don't Repeat Yourself", "Data Register Yellow", "Dynamic Run Yield"],
        correctIndex: 1,
        explanation: "DRY (Don't Repeat Yourself) mengajarkan agar menghindari duplikasi kode logika yang sama di beberapa tempat, melainkan membungkusnya ke dalam fungsi modular."
      },
      {
        text: "Secara default, jika sebuah fungsi Python tidak memiliki pernyataan 'return', apa nilai kembalian yang dihasilkan fungsi tersebut?",
        options: ["0", "False", "None", "Null"],
        correctIndex: 2,
        explanation: "Di Python, fungsi yang berakhir tanpa menuliskan kata kunci 'return' secara implisit akan mengembalikan objek bernilai 'None'."
      },
      {
        text: "Bagaimanakah cara yang benar untuk memanggil fungsi bernama 'cetak_garis' yang tidak memerlukan parameter input?",
        options: ["call cetak_garis", "cetak_garis", "cetak_garis()", "run cetak_garis()"],
        correctIndex: 2,
        explanation: "Memanggil fungsi wajib menyertakan tanda kurung buka dan tutup '()' di belakang nama fungsinya, meskipun tidak ada argumen di dalamnya."
      },
      {
        text: "Bolehkah sebuah fungsi di Python memiliki lebih dari satu parameter input?",
        options: [
          "Tidak boleh, maksimal hanya satu",
          "Boleh, dipisahkan menggunakan tanda koma (,)",
          "Boleh, tetapi tipe datanya harus sama semua",
          "Boleh, asalkan jumlahnya genap"
        ],
        correctIndex: 1,
        explanation: "Fungsi dapat menerima banyak parameter sesuai kebutuhan logika dengan memisahkannya menggunakan tanda koma di dalam tanda kurung."
      }
    ],
    M7: [
      {
        text: "Pada struktur data List di Python, berapakah indeks yang digunakan untuk mengakses elemen pertama?",
        options: ["1", "0", "-1", "A"],
        correctIndex: 1,
        explanation: "Python menggunakan sistem indeks berbasis nol (0-based indexing), sehingga elemen pertama list berada pada indeks 0."
      },
      {
        text: "Apa arti penggunaan indeks negatif '-1' pada sebuah List di Python?",
        options: [
          "Elemen tersebut bernilai minus satu",
          "Mengakses elemen terakhir dari sebelah kanan list",
          "Menghapus satu elemen dari list",
          "Menyatakan indeks tidak ditemukan"
        ],
        correctIndex: 1,
        explanation: "Indeks negatif membaca list dari kanan/belakang. Indeks -1 adalah elemen terakhir, -2 adalah elemen kedua dari belakang, dan seterusnya."
      },
      {
        text: "Metode bawaan (method) List manakah yang digunakan untuk menambahkan elemen baru ke bagian paling akhir dari list?",
        options: [".add()", ".insert()", ".append()", ".push()"],
        correctIndex: 2,
        explanation: "Method '.append(nilai)' digunakan untuk menyisipkan nilai baru di posisi paling belakang dari List."
      },
      {
        text: "Bagaimana cara menghapus elemen tertentu dari List berdasarkan nilai objeknya secara langsung?",
        options: [".delete()", ".remove()", ".clear()", ".pop()"],
        correctIndex: 1,
        explanation: "Method '.remove(nilai)' mencari kemunculan nilai tersebut pertama kali dari kiri list lalu menghapusnya."
      },
      {
        text: "Fungsi bawaan Python manakah yang digunakan untuk menghitung jumlah total elemen di dalam sebuah List?",
        options: ["length()", "len()", "count()", "size()"],
        correctIndex: 1,
        explanation: "Fungsi global 'len(list)' digunakan untuk mengembalikan panjang atau jumlah total item di dalam koleksi objek."
      },
      {
        text: "Diberikan list buah = ['Apel', 'Mangga', 'Jeruk', 'Pisang']. Hasil dari operasi slicing buah[1:3] adalah...",
        options: [
          "['Mangga', 'Jeruk', 'Pisang']",
          "['Mangga', 'Jeruk']",
          "['Apel', 'Mangga']",
          "['Jeruk', 'Pisang']"
        ],
        correctIndex: 1,
        explanation: "Slicing buah[1:3] mengambil elemen dari indeks 1 ('Mangga') hingga sebelum indeks 3 ('Jeruk'), yaitu ['Mangga', 'Jeruk']."
      },
      {
        text: "Tanda kurung manakah yang digunakan sebagai pembuka dan penutup saat mendeklarasikan List di Python?",
        options: [
          "( ) - Kurung Biasa",
          "[ ] - Kurung Siku",
          "{ } - Kurung Kurawal",
          "< > - Kurung Siku Sudut"
        ],
        correctIndex: 1,
        explanation: "List diidentifikasi dengan tanda kurung siku '[ ]' untuk membungkus elemen-elemen di dalamnya."
      },
      {
        text: "Apakah List di Python diperbolehkan menampung elemen dengan tipe data yang berbeda-beda sekaligus?",
        options: [
          "Tidak boleh, semua elemen harus bertipe data sama",
          "Boleh, list Python mendukung penyimpanan berbagai tipe data campuran dalam satu wadah",
          "Hanya boleh jika isinya angka saja",
          "Boleh, asalkan jumlah elemennya di bawah 5"
        ],
        correctIndex: 1,
        explanation: "List di Python bersifat heterogen, artinya kita dapat mencampur string, integer, float, bahkan list lain di dalam satu list yang sama."
      },
      {
        text: "Apakah perbedaan utama antara method '.append(nilai)' dengan '.insert(indeks, nilai)' pada List?",
        options: [
          "Append menambahkan di akhir, sedangkan Insert menyisipkan nilai di posisi indeks tertentu yang kita tentukan",
          "Insert memakan memori lebih sedikit daripada append",
          "Append menghapus data lama, sedangkan insert menyimpannya",
          "Tidak ada perbedaan fungsi"
        ],
        correctIndex: 0,
        explanation: "Method '.append()' selalu menambahkan item di ujung akhir, sedangkan '.insert()' memberi kita kontrol penuh di indeks mana data ingin disisipkan."
      },
      {
        text: "Berapakah hasil dari output kode berikut: len([])?",
        options: ["0", "1", "None", "Error"],
        correctIndex: 0,
        explanation: "Kurung siku kosong '[]' melambangkan list kosong tanpa elemen. Maka panjang (len) list tersebut adalah 0."
      }
    ],
    M8: [
      {
        text: "Setiap data input yang dibaca melalui fungsi input() di Python secara default akan selalu bernilai tipe data...",
        options: ["Integer (int)", "String (str)", "Boolean (bool)", "Float (float)"],
        correctIndex: 1,
        explanation: "Fungsi input() selalu membaca masukan dari keyboard sebagai barisan karakter teks (String), walaupun user mengetikkan angka."
      },
      {
        text: "Fungsi konversi (Type Casting) manakah yang digunakan untuk mengubah tipe data String teks angka menjadi Integer bilangan bulat?",
        options: ["str()", "float()", "int()", "convert()"],
        correctIndex: 2,
        explanation: "Fungsi 'int(nilai)' mengonversi string angka (seperti '15') menjadi nilai bilangan bulat integer asli (15) agar bisa dihitung secara matematika."
      },
      {
        text: "Fungsi konversi manakah yang digunakan jika kita ingin mengubah string input menjadi bilangan desimal pecahan?",
        options: ["int()", "float()", "str()", "double()"],
        correctIndex: 1,
        explanation: "Fungsi 'float(nilai)' mengonversi data string angka pecahan menjadi tipe pecahan desimal di Python."
      },
      {
        text: "Apakah langkah pertama yang paling disarankan ketika program yang kita jalankan memunculkan error?",
        options: [
          "Menutup aplikasi VS Code dan tidur",
          "Membaca dengan teliti pesan error dan melacak baris ke berapa error tersebut terjadi",
          "Menghapus seluruh file program lalu mengetik ulang dari awal",
          "Menginstal ulang sistem operasi Windows"
        ],
        correctIndex: 1,
        explanation: "Pesan error Python (Traceback) memberikan informasi yang sangat akurat tentang lokasi baris kode dan penyebab utama kesalahan."
      },
      {
        text: "Jenis error apakah yang terjadi jika kita salah menuliskan ejaan keyword (contoh: menulis 'prnt' yang seharusnya 'print')?",
        options: ["NameError atau SyntaxError", "TypeError", "ValueError", "ZeroDivisionError"],
        correctIndex: 0,
        explanation: "Salah mengeja perintah bawaan akan dideteksi sebagai NameError (karena compiler mencari variabel/fungsi bernama 'prnt' yang tidak terdefinisi) atau SyntaxError."
      },
      {
        text: "Jenis error apakah yang terjadi jika kita mencoba melakukan operasi penjumlahan matematika antara Integer dengan String (misalnya: 5 + '10')?",
        options: ["SyntaxError", "TypeError", "ZeroDivisionError", "IndexError"],
        correctIndex: 1,
        explanation: "TypeError terjadi karena operasi matematika pertambahan tidak didukung untuk tipe data campuran int dan str tanpa konversi terlebih dahulu."
      },
      {
        text: "Mengapa kita sangat disarankan melakukan pengujian (testing) program menggunakan berbagai variasi data input?",
        options: [
          "Untuk membuang-buang waktu",
          "Agar kita bisa mendeteksi celah logika atau bug yang tersembunyi saat diinput data ekstrim",
          "Karena diperintahkan oleh pembuat sistem operasi",
          "Supaya tampilan warna editor kode berubah"
        ],
        correctIndex: 1,
        explanation: "Pengujian dengan data normal, batas, dan tidak valid membantu memastikan program tangguh di segala skenario penggunaan nyata."
      },
      {
        text: "Di manakah tempat terbaik untuk membuat rancangan flowchart atau pseudocode saat mengerjakan proyek pemrograman?",
        options: [
          "Di dalam otak saja tanpa perlu ditulis",
          "Di atas kertas sketsa atau file dokumen dokumentasi proyek sebelum coding dimulai",
          "Ditulis langsung di dalam compiler Python agar dieksekusi",
          "Di folder Recycle Bin"
        ],
        correctIndex: 1,
        explanation: "Menuangkan rancangan logika ke kertas atau dokumentasi membantu mengkristalisasi jalan pikiran sebelum mulai memikirkan sintaks kode."
      },
      {
        text: "Bagaimana cara melakukan debugging manual yang paling sederhana untuk melihat isi variabel di tengah-tengah alur program?",
        options: [
          "Menggunakan perintah print() untuk mencetak isi variabel tersebut ke layar konsol",
          "Menghapus variabel tersebut",
          "Membeli komputer baru",
          "Mengirimkan email laporan ke pihak Python"
        ],
        correctIndex: 0,
        explanation: "Menyisipkan print(nama_variabel) di titik-titik krusial membantu programmer menginspeksi apakah nilai variabel sudah sesuai harapan."
      },
      {
        text: "Sebagai calon programmer TRPL, cara terbaik untuk mengasah keterampilan coding adalah...",
        options: [
          "Hanya membaca materi teori tanpa pernah mencoba koding",
          "Berlatih menulis kode secara konsisten, memecahkan latihan soal, dan berani mengulik error",
          "Menyalin kode proyek teman tanpa mempelajarinya",
          "Menghafal seluruh syntax Python di luar kepala"
        ],
        correctIndex: 1,
        explanation: "Coding adalah keterampilan praktis (*hands-on*). Cara terbaik untuk mahir adalah dengan banyak berlatih memecahkan masalah logika secara mandiri."
      }
    ]
  };

  const questions = quizData[moduleId as string] || quizData.M0;
  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === currentQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setIsAnswered(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      const meme = getRandomMemes(moduleId as string, 1)[0];
      if (meme) gameApi.triggerMeme(meme.emoji, meme.caption);

      const passRate = (score / questions.length) * 100;
      if (passRate >= 60) {
        // Confetti splash
        fireConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        // Save module completion
        completeModule(moduleId as string);

        // If they got 100%, unlock perfectionist badge
        if (score === questions.length) {
          unlockBadge("perfectionist");
        }
      }
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="section-container" style={{ maxWidth: "600px", paddingTop: "var(--space-4)" }}>
      {/* Header Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-6)" }}>
        <button
          onClick={() => router.push(`/learn/${moduleId}`)}
          style={{
            background: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--border-color)",
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase" }}>
            Uji Pemahaman
          </span>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Kuis Evaluasi Modul
          </h2>
        </div>
      </div>

      {!quizFinished ? (
        <>
          {/* Question Index Progress */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
            <span>Soal {currentIdx + 1} dari {questions.length}</span>
            <span>Skor: {Math.round((score / questions.length) * 100)}%</span>
          </div>

          <div style={{ width: "100%", height: "6px", background: "var(--color-neutral-150)", borderRadius: "3px", overflow: "hidden", marginBottom: "var(--space-6)" }}>
            <div
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
                height: "100%",
                background: "var(--gradient-hero)",
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Quiz Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1.5px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-6) var(--space-8)",
              boxShadow: "var(--shadow-card)",
              marginBottom: "var(--space-6)",
            }}
          >
            <h3 style={{ fontSize: "1.1875rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: "var(--space-6)" }}>
              {currentQuestion.text}
            </h3>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "var(--space-6)" }}>
              {currentQuestion.options.map((opt, i) => {
                let optionStyle: React.CSSProperties = {
                  background: "var(--bg-page-alt)",
                  border: "1.5px solid var(--border-color)",
                  color: "var(--text-primary)",
                };

                if (isAnswered) {
                  if (i === currentQuestion.correctIndex) {
                    // Correct option
                    optionStyle = {
                      background: "rgba(34,197,94,0.12)",
                      border: "2px solid #22C55E",
                      color: "#15803D",
                      fontWeight: 700,
                    };
                  } else if (i === selectedIdx) {
                    // Wrong option clicked by user
                    optionStyle = {
                      background: "rgba(239,68,68,0.12)",
                      border: "2px solid #EF4444",
                      color: "#B91C1C",
                      fontWeight: 700,
                    };
                  } else {
                    optionStyle = {
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-muted)",
                      opacity: 0.6,
                    };
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: isAnswered ? 1 : 1.01 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.99 }}
                    onClick={() => handleOptionClick(i)}
                    disabled={isAnswered}
                    style={{
                      width: "100%",
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: isAnswered ? "default" : "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all var(--transition-fast)",
                      ...optionStyle,
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && i === currentQuestion.correctIndex && (
                      <CheckCircle size={20} weight="fill" color="#22C55E" />
                    )}
                    {isAnswered && i === selectedIdx && i !== currentQuestion.correctIndex && (
                      <XCircle size={20} weight="fill" color="#EF4444" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation box */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "var(--bg-page-alt)",
                    borderLeft: "4px solid var(--color-primary-500)",
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                    fontSize: "0.8125rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  <strong>💡 Pembahasan:</strong> {currentQuestion.explanation}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="btn btn-primary"
              style={{ opacity: !isAnswered ? 0.5 : 1 }}
            >
              Lanjut Soal
            </button>
          </div>
        </>
      ) : (
        /* Quiz Summary Report Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-color)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-8)",
            textAlign: "center",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {score / questions.length >= 0.6 ? (
            <>
              <div style={{ fontSize: "5rem", marginBottom: "var(--space-4)" }}>🏆</div>
              <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Selamat! Kamu Lulus Kuis!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: "8px", marginBottom: "var(--space-6)" }}>
                Kamu menyelesaikan kuis dengan skor **{Math.round((score / questions.length) * 100)}%** ({score} dari {questions.length} benar).
              </p>

              {quizMemes.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "var(--space-6)" }}>
                  {quizMemes.map((meme) => (
                    <div key={meme.id} style={{ border: "2px solid var(--text-primary)", borderRadius: "var(--radius-md)", background: "#000", padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textAlign: "center" }}>
                      <div style={{ fontSize: "1.5rem", marginBottom: "2px" }}>{meme.emoji}</div>
                      {meme.caption}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={() => router.push("/dashboard")} className="btn btn-primary">
                  Kembali ke Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "5rem", marginBottom: "var(--space-4)" }}>🥺</div>
              <h2 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Kamu Belum Lulus, Jangan Menyerah!
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: "8px", marginBottom: "var(--space-6)" }}>
                Nilai kamu **{Math.round((score / questions.length) * 100)}%** (passing grade kuis: 60%). Yuk ulangi sekali lagi biar paham!
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "var(--space-6)" }}>
                {quizMemes.map((meme) => (
                  <div key={meme.id} style={{ border: "2px solid var(--color-danger)", borderRadius: "var(--radius-md)", background: "#000", padding: "12px 16px", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "2px" }}>{meme.emoji}</div>
                    {meme.caption}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={handleRetry} className="btn btn-primary" style={{ background: "var(--color-primary-500)" }}>
                  <ArrowsClockwise size={16} weight="bold" /> Ulangi Kuis
                </button>
                <button onClick={() => router.push(`/learn/${moduleId}`)} className="btn btn-secondary">
                  Baca Materi Lagi
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
