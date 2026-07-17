"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Folder,
  Warning,
  CheckCircle,
  Terminal,
  Paperclip,
  Bookmark,
  Sparkle,
} from "@phosphor-icons/react";

interface Slide {
  title: string;
  type: "text" | "interactive-drag" | "interactive-cli" | "checklist";
  content: React.ReactNode;
}

export default function LearnModulePage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const { user, completeSubModule, completeModule } = useUserStore();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dragLocation, setDragLocation] = useState<"none" | "desktop" | "downloads" | "proper">("none");
  const [cliInput, setCliInput] = useState("");
  const [cliOutput, setCliOutput] = useState<string[]>([
    "Microsoft Windows [Version 10.0.22631]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Users\\maba> _",
  ]);
  const [cliStep, setCliStep] = useState(0); // 0: initial, 1: cd done, 2: python done

  const [checklist, setChecklist] = useState({
    downloaded: false,
    checkedPath: false,
    installedVSCode: false,
    extensionAdded: false,
  });

  if (!user) return null;

  // Modul details metadata
  const moduleMap: Record<string, { title: string; slides: Slide[] }> = {
    M0: {
      title: "Pre-Test & Orientasi",
      slides: [
        {
          title: "Selamat Datang di Platform Matrikulasi!",
          type: "text",
          content: (
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                <Sparkle size={56} color="var(--color-primary-500)" weight="fill" />
              </div>
              <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Halo Calon Programmer TRPL 2026! Selamat datang di dunia coding yang menantang sekaligus menyenangkan.
                Melalui platform ini, kamu akan dibimbing langkah demi langkah dari nol mutlak hingga bisa membuat program nyata.
              </p>
              <div style={{ background: "var(--gradient-hero-soft)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "var(--space-6)", color: "var(--text-primary)", fontWeight: 600 }}>
                Ingat: Belajar pemrograman bukan soal menghafal sintaks, tapi soal melatih cara berpikir logis dan problem-solving!
              </div>
            </div>
          ),
        },
        {
          title: "Apa itu Pemrograman?",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Pemrograman</strong> adalah proses memberi serangkaian instruksi kepada komputer agar ia melakukan sesuatu yang kita inginkan.
                Komputer sangat patuh — ia akan melakukan persis apa yang kamu instruksikan, tidak lebih, tidak kurang.
              </p>
              <div style={{ background: "var(--bg-page-alt)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "14px" }}>
                <strong>Analogi Robot Pembantu:</strong>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "6px", lineHeight: 1.6 }}>
                  Bayangkan komputer seperti robot pembantu cerdas yang tidak bisa berpikir sendiri. Kamu perlu menjelaskan setiap langkah secara spesifik.
                  Jika kamu bilang "buatkan kopi", robot itu bingung. Kamu harus bilang: "ambil cangkir → tuang air panas → masukkan 1 sendok kopi → aduk 10 detik".
                  Begitulah cara kerja kode program!
                </p>
              </div>
              <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
                {[
                  { label: "Python", desc: "Bahasa pemrograman yang kita pakai di sini. Sintaksnya mudah dibaca, hampir seperti kalimat bahasa Inggris biasa." },
                  { label: "Script / Kode", desc: "Kumpulan instruksi yang kamu tulis dan disimpan dalam file berekstensi .py" },
                  { label: "Output / Hasil", desc: "Informasi yang ditampilkan program setelah semua instruksi selesai dieksekusi komputer." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "10px 14px", borderRadius: "var(--radius-md)", fontSize: "0.85rem" }}>
                    <strong style={{ color: "var(--color-primary-500)" }}>{item.label}:</strong>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "6px" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Roadmap Perjalananmu (9 Modul)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "14px" }}>
                Sebelum mulai, lihat dulu gambaran besar perjalanan belajarmu. Ada <strong>9 modul</strong> yang akan kamu lalui secara berurutan, dari fondasi paling dasar hingga ke project nyata:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {[
                  { kode: "M0", nama: "Pre-Test & Orientasi", warna: "#FF9D00", aktif: true },
                  { kode: "M1", nama: "Dasar Komputer & Workspace", warna: "#FF8C42" },
                  { kode: "M2", nama: "Logika & Algoritma", warna: "#FF6B00" },
                  { kode: "M3", nama: "Variabel & Tipe Data", warna: "#06B6D4" },
                  { kode: "M4", nama: "Percabangan (if-else)", warna: "#EF4444" },
                  { kode: "M5", nama: "Perulangan (Loop)", warna: "#22C55E" },
                  { kode: "M6", nama: "Fungsi & Prosedur", warna: "#D45900" },
                  { kode: "M7", nama: "Array & List", warna: "#FF8C42" },
                  { kode: "M8", nama: "Mini Project Akhir", warna: "#FF6B00" },
                ].map((m) => (
                  <div key={m.kode} style={{ display: "flex", alignItems: "center", gap: "12px", background: m.aktif ? `${m.warna}12` : "var(--bg-page-alt)", border: m.aktif ? `1.5px solid ${m.warna}` : "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "8px 14px" }}>
                    <span style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", fontWeight: 800, color: m.warna, width: "28px", flexShrink: 0 }}>{m.kode}</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: m.aktif ? 700 : 500, color: m.aktif ? "var(--text-primary)" : "var(--text-secondary)" }}>{m.nama}</span>
                    {m.aktif && <span style={{ marginLeft: "auto", fontSize: "0.7rem", background: m.warna, color: "white", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 700, flexShrink: 0 }}>KAMU DI SINI</span>}
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Pre-Test Pemetaan Kemampuan",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "var(--space-4)" }}>
                Sebelum mulai belajar, kita akan melakukan tes diagnostik singkat.
                Tujuannya bukan untuk memberi nilai jelek, melainkan untuk memetakan level awal kamu.
              </p>
              <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li>Durasi: sekitar 10 menit</li>
                <li>Format: 10 Soal Pilihan Ganda Logika Dasar</li>
                <li>Sifat: Diagnostik (bebas stres, tidak ada nilai buruk!)</li>
              </ul>
              <div style={{ marginTop: "var(--space-6)", textAlign: "center" }}>
                <Link href={`/learn/${moduleId}/quiz`} className="btn btn-primary">
                  Mulai Pre-Test Sekarang &rarr;
                </Link>
              </div>
            </div>
          ),
        },
      ],
    },
    M1: {
      title: "Dasar Komputer & Workspace",
      slides: [
        {
          title: "Prasyarat Penting Sebelum Menulis Kode",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Instruktur Pemrograman Dasar berpesan: <strong>Jangan melompat langsung ke coding jika tidak mengerti sistem operasi laptop sendiri!</strong>
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "12px" }}>
                Banyak maba gagal menjalankan kodenya bukan karena salah logika matematika, melainkan karena salah menaruh folder proyek, salah variabel path, atau extensi file yang tersembunyi.
              </p>
              <div
                style={{
                  background: "rgba(255, 107, 0, 0.08)",
                  border: "1.5px solid var(--border-color-strong)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  display: "flex",
                  gap: "12px",
                  marginTop: "var(--space-5)",
                }}
              >
                <Warning size={24} color="var(--color-primary-500)" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                  <strong>Aturan Emas:</strong> Dilarang keras membuat folder project pemrograman di <strong>Desktop</strong> atau <strong>Downloads</strong>!
                  Hal ini memicu error path permission saat IDE/VS Code mencoba menjalankannya.
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Bagaimana Komputer Bekerja",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sebelum menulis program, pahami 3 pilar perangkat keras utama komputer dalam menjalankan kode Anda:
              </p>
              <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
                {[
                  { title: "🧠 Processor (CPU)", desc: "Otak komputer yang memproses kalkulasi logika dan mengeksekusi baris kode program." },
                  { title: "⚡ RAM (Short-term Memory)", desc: "Tempat penampungan data program yang sedang berjalan. Super cepat, tapi bersifat volatile (data hilang saat mati lampu)." },
                  { title: "📁 Storage (SSD/HDD)", desc: "Lemari arsip permanen tempat Anda menyimpan file script Python `.py` Anda agar tidak hilang." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--bg-page-alt)", padding: "12px var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    <strong style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>{item.title}</strong>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", margin: "4px 0 0" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Cara Komputer Membaca Kode",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Komputer adalah mesin digital yang sangat sederhana: ia hanya mengerti angka <strong>0</strong> dan <strong>1</strong> (Bahasa Biner).
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "10px" }}>
                Karena menulis biner secara langsung sangat sulit, dibuatlah <strong>Bahasa Pemrograman Tingkat Tinggi</strong> (seperti Python). Penerjemahannya dibagi dua cara:
              </p>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: "14px", borderRadius: "var(--radius-md)", marginTop: "12px", display: "grid", gap: "10px", fontSize: "0.85rem" }}>
                <div>
                  <strong style={{ color: "var(--color-primary-500)" }}>1. Compiler:</strong> Menerjemahkan seluruh isi file kode sekaligus menjadi file executable sebelum dijalankan (contoh: C++, Go).
                </div>
                <div>
                  <strong style={{ color: "var(--color-primary-500)" }}>2. Interpreter:</strong> Menerjemahkan dan menjalankan kode baris-demi-baris secara langsung (contoh: Python).
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Aturan Folder & Peta Harddisk",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Setiap file di komputer memiliki alamat unik yang disebut <strong>Path</strong> (contoh: <code>D:/TRPL/proyek/main.py</code>).
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "10px" }}>
                Menyimpan proyek pemrograman di folder Desktop atau Downloads sangat berbahaya karena:
              </p>
              <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", fontSize: "0.85rem" }}>
                <li>Folder Desktop/Downloads sering tersinkronisasi otomatis oleh cloud storage seperti OneDrive/iCloud, yang dapat mengunci file dan membuat interpreter Python error.</li>
                <li>Windows membatasi izin akses (*read-write permissions*) pada folder sistem, menyebabkan IDE gagal membuat berkas baru.</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Game Simulasi: Susun Workspace yang Benar",
          type: "interactive-drag",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>
                Pindahkan file coding <strong>`calculator.py`</strong> ke lokasi folder penyimpanan yang paling tepat:
              </p>

              {/* File element */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-5)" }}>
                <motion.div
                  drag
                  dragConstraints={{ left: -150, right: 150, top: -50, bottom: 50 }}
                  whileDrag={{ scale: 1.05 }}
                  style={{
                    background: "var(--bg-card)",
                    border: "2px solid var(--text-primary)",
                    padding: "8px 16px",
                    borderRadius: "var(--radius-md)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "grab",
                    zIndex: 10,
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <Paperclip size={18} color="var(--color-primary-500)" />
                  <span style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", fontWeight: 700 }}>calculator.py</span>
                </motion.div>
              </div>

              {/* Target Slots */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {[
                  { id: "desktop", label: "💻 Desktop", color: "#EF4444" },
                  { id: "downloads", label: "📥 Downloads", color: "#EF4444" },
                  { id: "proper", label: "📁 D:\\TRPL\\proyek", color: "#22C55E" },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setDragLocation(slot.id as any);
                      if (slot.id === "proper") {
                        completeSubModule("M1", "sub-1.2");
                      }
                    }}
                    style={{
                      background: dragLocation === slot.id ? `${slot.color}15` : "var(--bg-page-alt)",
                      border: dragLocation === slot.id ? `2px solid ${slot.color}` : "1.5px dashed var(--border-color)",
                      padding: "var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      textAlign: "center",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>

              {/* Feedback Message */}
              <div style={{ marginTop: "var(--space-4)", minHeight: "60px" }}>
                {dragLocation === "desktop" && (
                  <div style={{ color: "#EF4444", fontSize: "0.875rem", display: "flex", gap: "6px", alignItems: "center" }}>
                    <Warning size={18} /> Jangan taruh di Desktop! Folder Desktop mudah terhapus dan mengganggu set environment path.
                  </div>
                )}
                {dragLocation === "downloads" && (
                  <div style={{ color: "#EF4444", fontSize: "0.875rem", display: "flex", gap: "6px", alignItems: "center" }}>
                    <Warning size={18} /> Downloads adalah folder sampah sementara. Project coding tidak boleh diletakkan di sini!
                  </div>
                )}
                {dragLocation === "proper" && (
                  <div style={{ color: "#22C55E", fontSize: "0.875rem", display: "flex", gap: "6px", alignItems: "center" }}>
                    <CheckCircle size={18} weight="fill" /> Sempurna! Local disk D: atau partisi non-sistem adalah tempat terbaik untuk proyek coding.
                  </div>
                )}
              </div>
            </div>
          ),
        },
        {
          title: "File Extension & Karakter Terlarang",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Dalam pemrograman, ada dua detail teknis kecil yang sering memicu error besar:
              </p>
              <div style={{ display: "grid", gap: "10px", marginTop: "12px", fontSize: "0.85rem" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>🔍 File Name Extension</strong>
                  <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Secara default, Windows menyembunyikan ekstensi berkas. File bernama <code>main.py</code> mungkin saja aslinya adalah <code>main.py.txt</code> (file teks biasa). 
                    Pastikan Anda mencentang opsi <strong>File name extensions</strong> pada tab <em>View</em> di File Explorer.
                  </p>
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>❌ Karakter Spasi pada Nama Folder</strong>
                  <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Jangan pernah gunakan spasi untuk nama folder proyek (misalnya: <code>tugas 1</code>). Gunakan garis bawah (<code>tugas_1</code>). 
                    Terminal memperlakukan spasi sebagai pemisah perintah, sehingga folder berspasi sering merusak jalur eksekusi compiler.
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "GUI vs CLI (Command Line)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sebagai pengguna komputer biasa, Anda menggunakan <strong>GUI (Graphical User Interface)</strong> dengan mengklik ikon memakai mouse.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "10px" }}>
                Namun, seorang programmer wajib menguasai <strong>CLI (Command Line Interface)</strong>—mengetikkan perintah langsung berupa teks di Terminal/Command Prompt karena jauh lebih cepat dan efisien.
              </p>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "12px" }}>
                <strong>Dua Perintah CLI Dasar yang Wajib Diingat:</strong>
                <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", margin: "6px 0 0", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li><code>cd [path_folder]</code> : Digunakan untuk berpindah (Change Directory) ke folder lain.</li>
                  <li><code>dir</code> (Windows) / <code>ls</code> (Mac/Linux) : Menampilkan daftar file di dalam folder aktif.</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Simulator CLI: Memeriksa Python & PATH",
          type: "interactive-cli",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>
                Ketikkan perintah <strong>`python --version`</strong> pada terminal di bawah untuk memeriksa konfigurasi PATH Python:
              </p>

              {/* Console simulator window */}
              <div
                style={{
                  background: "#111827",
                  color: "#34D399",
                  fontFamily: "var(--font-code)",
                  fontSize: "0.875rem",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255,107,0,0.15)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <div style={{ display: "flex", gap: "6px", borderBottom: "1px solid #1F2937", paddingBottom: "8px", marginBottom: "12px", color: "#9CA3AF" }}>
                  <Terminal size={16} /> Console Simulator
                </div>
                <div style={{ minHeight: "120px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {cliOutput.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>

              {/* Command Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cliInput) return;

                  let outputLines = [...cliOutput];
                  // Remove cursor line
                  outputLines.pop();

                  if (cliInput.trim() === "python --version") {
                    outputLines.push("C:\\Users\\maba> python --version");
                    outputLines.push("Python 3.12.3");
                    outputLines.push("");
                    outputLines.push("✅ PATH terkonfigurasi dengan benar!");
                    outputLines.push("C:\\Users\\maba> _");
                    setCliStep(2);
                    completeSubModule("M1", "sub-1.4");
                  } else {
                    outputLines.push(`C:\\Users\\maba> ${cliInput}`);
                    outputLines.push(`'${cliInput}' is not recognized as an internal or external command,`);
                    outputLines.push("operable program or batch file.");
                    outputLines.push("");
                    outputLines.push("C:\\Users\\maba> _");
                  }

                  setCliOutput(outputLines);
                  setCliInput("");
                }}
                style={{ display: "flex", gap: "8px" }}
              >
                <input
                  type="text"
                  placeholder="Ketik 'python --version' di sini..."
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: "var(--bg-card)",
                    border: "1.5px solid var(--border-color)",
                    padding: "10px 16px",
                    borderRadius: "var(--radius-full)",
                    outline: "none",
                    fontFamily: "var(--font-code)",
                    fontSize: "0.875rem",
                    color: "var(--text-primary)",
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Kirim
                </button>
              </form>
            </div>
          ),
        },
        {
          title: "Memilih Text Editor & IDE",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Untuk mengetik kode pemrograman, kita tidak menggunakan Microsoft Word karena Word menambahkan banyak format dokumen yang merusak script program.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "10px" }}>
                Kita membutuhkan alat penyunting teks khusus:
              </p>
              <div style={{ display: "grid", gap: "10px", marginTop: "12px", fontSize: "0.85rem" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>💻 VS Code (Visual Studio Code)</strong>
                  <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Text editor modern, ringan, gratis, dan sangat fleksibel. Mendukung ribuan ekstensi yang mempermudah koding (seperti autocomplete dan penyorot sintaks).
                  </p>
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>⚙️ IDE (Integrated Development Environment)</strong>
                  <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>
                    Aplikasi sangat lengkap berisi compiler, editor, debugger, dan penguji bawaan dalam satu paket besar (contoh: PyCharm, Visual Studio).
                  </p>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Checklist Akhir Setup Workspace",
          type: "checklist",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-4)" }}>
                Sekarang, silakan lakukan setup lokal di laptop masing-masing mengikuti checklist berikut:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { key: "downloaded", label: "Download Python 3.12+ dari situs resmi python.org" },
                  { key: "checkedPath", label: "Install Python dan centang box 'Add Python to PATH' saat setup" },
                  { key: "installedVSCode", label: "Install Visual Studio Code (VS Code) IDE" },
                  { key: "extensionAdded", label: "Install ekstensi Python oleh Microsoft di VS Code" },
                ].map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "var(--bg-card)",
                      padding: "12px var(--space-4)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(checklist as any)[item.key]}
                      onChange={(e) => {
                        const newChecklist = { ...checklist, [item.key]: e.target.checked };
                        setChecklist(newChecklist);
                        if (Object.values(newChecklist).every(v => v)) {
                          completeSubModule("M1", "sub-1.5");
                        }
                      }}
                      style={{
                        accentColor: "var(--color-primary-500)",
                        width: "18px",
                        height: "18px",
                      }}
                    />
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ),
        },
      ],
    },
    M2: {
      title: "Logika & Algoritma",
      slides: [
        {
          title: "Apa itu Algoritma?",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Algoritma</strong> adalah deretan langkah logis terstruktur yang disusun secara sistematis untuk memecahkan suatu masalah. 
                Komputer hanyalah alat yang patuh; ia hanya melakukan apa yang diperintahkan. Oleh karena itu, logika langkah kita harus tepat.
              </p>
              <div style={{ background: "var(--bg-page-alt)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "16px" }}>
                <strong>Analogi Sederhana: Resep Mie Instan</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "0.875rem", margin: 0 }}>
                  Resep mie instan adalah bentuk nyata algoritma. Jika langkah 'tuangkan bumbu' ditaruh sebelum 'rebus mie', rasa bumbu mungkin kurang meresap. 
                  Jika langkah 'rebus air' ditaruh di akhir, mie tidak akan pernah matang. Urutan dan kejelasan langkah sangat menentukan hasil!
                </p>
              </div>
              <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.875rem" }}>
                <li><strong>Terbatas (Finiteness)</strong>: Harus berhenti setelah menyelesaikan sejumlah langkah.</li>
                <li><strong>Jelas (Definiteness)</strong>: Setiap instruksi harus bermakna tunggal (tidak ambigu).</li>
                <li><strong>Input & Output</strong>: Menerima input data dan menghasilkan solusi (output).</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Bagan Alir (Flowchart) Secara Visual",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Flowchart</strong> adalah representasi grafis dari langkah-langkah logika dalam memecahkan masalah. 
                Dengan flowchart, kita dapat dengan mudah membaca percabangan dan perulangan secara visual.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "12px" }}>
                {[
                  { symbol: "Oval (Terminal)", desc: "Menandai titik awal (Start) dan akhir (End) dari suatu program." },
                  { symbol: "Persegi Panjang (Process)", desc: "Menunjukkan aktivitas perhitungan matematika atau penugasan variabel." },
                  { symbol: "Belah Ketupat (Decision)", desc: "Menunjukkan logika percabangan (syarat) dengan jalur keluar bercabang Ya/Tidak." },
                  { symbol: "Jajar Genjang (Input/Output)", desc: "Digunakan untuk membaca data input dari keyboard atau mencetak hasil output ke layar." },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: "var(--bg-page-alt)", padding: "10px var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                    <strong>{item.symbol}</strong>: <span style={{ color: "var(--text-secondary)" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Menulis Logika dengan Pseudocode",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Pseudocode</strong> adalah cara menulis algoritma menggunakan deskripsi bahasa manusia terstruktur yang menyerupai bahasa pemrograman asli (tanpa sintaksis kaku).
              </p>
              <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "12px" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase" }}>
                  Contoh Pseudocode: Menghitung Luas Persegi Panjang
                </span>
                <code style={{ display: "block", fontFamily: "var(--font-code)", fontSize: "0.875rem", color: "var(--text-primary)", marginTop: "8px", whiteSpace: "pre", lineHeight: 1.6 }}>
                  START<br />
                  &nbsp;&nbsp;BACA panjang<br />
                  &nbsp;&nbsp;BACA lebar<br />
                  &nbsp;&nbsp;HITUNG luas = panjang * lebar<br />
                  &nbsp;&nbsp;TAMPILKAN luas<br />
                  END
                </code>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                Menulis pseudocode membantu programmer fokus pada jalan pikiran logika pemecahan masalah tanpa terganggu oleh detail error kompilasi kode.
              </p>
            </div>
          ),
        },
        {
          title: "Ciri-Ciri Algoritma yang Baik",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Tidak semua urutan langkah bisa disebut algoritma. Sebuah algoritma yang baik harus memenuhi 5 syarat berikut:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {[
                  { no: "1", nama: "Finiteness (Terbatas)", desc: "Algoritma harus punya titik akhir yang jelas. Tidak boleh berjalan terus-menerus tanpa henti." },
                  { no: "2", nama: "Definiteness (Jelas)", desc: "Setiap langkah instruksi harus bermakna tunggal dan tidak ambigu. Tidak boleh ada instruksi yang samar." },
                  { no: "3", nama: "Input (Masukan)", desc: "Boleh memiliki nol atau lebih data yang diterima dari luar sebelum proses dimulai." },
                  { no: "4", nama: "Output (Keluaran)", desc: "Harus menghasilkan minimal satu data keluaran yang merupakan solusi dari masalah." },
                  { no: "5", nama: "Effectiveness (Efektif)", desc: "Setiap langkah harus bisa dilakukan dan memberikan kontribusi nyata menuju solusi." },
                ].map((item) => (
                  <div key={item.no} style={{ display: "flex", gap: "12px", background: "var(--bg-page-alt)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "flex-start" }}>
                    <span style={{ background: "var(--color-primary-500)", color: "white", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>{item.no}</span>
                    <div><strong style={{ color: "var(--text-primary)" }}>{item.nama}:</strong><span style={{ color: "var(--text-secondary)", marginLeft: "4px" }}>{item.desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Latihan Baca Flowchart Sehari-hari",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "14px" }}>
                Yuk latihan membaca flowchart! Ikuti alur logika di bawah ini seperti kamu membaca peta:
              </p>
              <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", fontFamily: "var(--font-code)", fontSize: "0.85rem" }}>
                <div style={{ textAlign: "center", marginBottom: "8px" }}>
                  <span style={{ background: "var(--color-primary-500)", color: "white", padding: "4px 16px", borderRadius: "var(--radius-full)", fontWeight: 700 }}>START</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", color: "var(--text-secondary)" }}>
                  <div style={{ background: "var(--bg-page-alt)", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>Cek kondisi: Apakah hari ini hujan?</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", padding: "8px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                      <strong style={{ color: "#22C55E" }}>YA</strong><br />Bawa payung
                    </div>
                    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", padding: "8px", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                      <strong style={{ color: "#EF4444" }}>TIDAK</strong><br />Tidak perlu payung
                    </div>
                  </div>
                  <div style={{ background: "var(--bg-page-alt)", padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>Pergi ke kampus</div>
                </div>
                <div style={{ textAlign: "center", marginTop: "8px" }}>
                  <span style={{ background: "var(--color-neutral-500)", color: "white", padding: "4px 16px", borderRadius: "var(--radius-full)", fontWeight: 700 }}>END</span>
                </div>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                Flowchart di atas setara dengan kode Python: <code style={{ color: "#CE9178" }}>if hujan: bawa_payung()</code>. Itulah kekuatan memvisualisasikan logika sebelum menulis kode!
              </p>
            </div>
          ),
        },
        {
          title: "Dari Pseudocode ke Kode Python Nyata",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Setelah menulis pseudocode, langkah selanjutnya adalah menerjemahkannya ke kode Python yang sesungguhnya. Lihat pemetaan satu-per-satu di bawah:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "14px" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Pseudocode</div>
                  <code style={{ fontFamily: "var(--font-code)", fontSize: "0.8rem", color: "var(--text-primary)", display: "block", lineHeight: 1.8 }}>
                    START<br />
                    &nbsp;&nbsp;BACA panjang<br />
                    &nbsp;&nbsp;BACA lebar<br />
                    &nbsp;&nbsp;HITUNG luas = panjang * lebar<br />
                    &nbsp;&nbsp;TAMPILKAN luas<br />
                    END
                  </code>
                </div>
                <div style={{ background: "#1E1E1E", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,107,0,0.2)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase", marginBottom: "8px" }}>Python</div>
                  <code style={{ fontFamily: "var(--font-code)", fontSize: "0.8rem", display: "block", lineHeight: 1.8, color: "#D4D4D4" }}>
                    <span style={{ color: "#6A9955" }}># Program dimulai</span><br />
                    panjang = <span style={{ color: "#DCDCAA" }}>int</span>(<span style={{ color: "#DCDCAA" }}>input</span>(<span style={{ color: "#CE9178" }}>"panjang: "</span>))<br />
                    lebar = <span style={{ color: "#DCDCAA" }}>int</span>(<span style={{ color: "#DCDCAA" }}>input</span>(<span style={{ color: "#CE9178" }}>"lebar: "</span>))<br />
                    luas = panjang * lebar<br />
                    <span style={{ color: "#DCDCAA" }}>print</span>(luas)
                  </code>
                </div>
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "14px", fontSize: "0.85rem" }}>
                <strong>Catatan penting:</strong> <span style={{ color: "var(--text-secondary)" }}>Fungsi <code>input()</code> selalu mengembalikan data bertipe String. Jika kamu butuh angka, harus dikonversi ke <code>int()</code> atau <code>float()</code> terlebih dahulu.</span>
              </div>
            </div>
          ),
        },
      ],
    },
    M3: {
      title: "Variabel & Tipe Data",
      slides: [
        {
          title: "Variabel: Loker Penyimpan Data",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Variabel</strong> adalah wadah/tempat penyimpanan data di dalam memori komputer. 
                Bayangkan variabel seperti loker di kampus yang kamu beri label nama dan diisi dengan data tertentu.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "var(--bg-page-alt)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "16px" }}>
                <span style={{ color: "#6A9955" }}># Pendeklarasian variabel di Python menggunakan '='</span><br />
                nama = <span style={{ color: "#CE9178" }}>"Reza"</span><br />
                umur = <span style={{ color: "#B5CEA8" }}>18</span><br />
                ipk = <span style={{ color: "#B5CEA8" }}>3.85</span>
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "16px", fontSize: "0.85rem" }}>
                <strong>Aturan Penamaan Variabel (Naming Convention):</strong>
                <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>Tidak boleh diawali oleh angka (contoh salah: <code style={{ color: "#EF4444" }}>1nama</code>).</li>
                  <li>Tidak boleh menggunakan spasi (contoh salah: <code style={{ color: "#EF4444" }}>nama lengkap</code>).</li>
                  <li>Sangat direkomendasikan menggunakan format <strong>snake_case</strong> di Python (huruf kecil semua dipisah underscore, contoh: <code style={{ color: "#22C55E" }}>nama_lengkap</code>).</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Mengenal Tipe Data Dasar",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "12px" }}>
                Di Python, variabel secara dinamis menentukan tipe datanya berdasarkan nilai yang diberikan. Empat tipe data dasar yang wajib dipahami:
              </p>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  { type: "String (str)", contoh: '"Halo TRPL"', desc: "Teks alfabet, angka, atau simbol yang diapit tanda kutip." },
                  { type: "Integer (int)", contoh: "26", desc: "Bilangan bulat positif, negatif, atau nol." },
                  { type: "Float (float)", contoh: "3.14", desc: "Bilangan pecahan/desimal yang dipisahkan tanda titik." },
                  { type: "Boolean (bool)", contoh: "True atau False", desc: "Menyatakan kondisi logika benar atau salah." },
                ].map((t, i) => (
                  <div key={i} style={{ background: "var(--bg-page-alt)", padding: "10px var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.875rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                      <span style={{ color: "var(--text-primary)" }}>{t.type}</span>
                      <code style={{ color: "#CE9178" }}>{t.contoh}</code>
                    </div>
                    <div style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "0.8rem" }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Operator Aritmatika di Python",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Python mendukung berbagai operator matematika standar untuk manipulasi angka:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px", fontFamily: "var(--font-code)", fontSize: "0.825rem" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  Penjumlahan: <code style={{ color: "#CE9178" }}>+</code> (contoh: 5 + 3 = 8)<br />
                  Pengurangan: <code style={{ color: "#CE9178" }}>-</code> (contoh: 5 - 3 = 2)<br />
                  Perkalian: <code style={{ color: "#CE9178" }}>*</code> (contoh: 5 * 3 = 15)<br />
                  Pembagian: <code style={{ color: "#CE9178" }}>/</code> (contoh: 5 / 2 = 2.5)
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  Bagi Bulat: <code style={{ color: "#CE9178" }}>//</code> (contoh: 5 // 2 = 2)<br />
                  Sisa Bagi: <code style={{ color: "#CE9178" }}>%</code> (contoh: 5 % 2 = 1)<br />
                  Perpangkatan: <code style={{ color: "#CE9178" }}>**</code> (contoh: 2 ** 3 = 8)
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Operator Perbandingan & Logika",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Operator perbandingan digunakan untuk membandingkan dua nilai, menghasilkan tipe data Boolean (`True`/`False`):
              </p>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem", marginBottom: "12px" }}>
                <code>==</code> (sama dengan), <code>!=</code> (tidak sama dengan), <code>&gt;</code> (lebih besar), <code>&lt;</code> (lebih kecil)
              </div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Operator logika digunakan untuk menggabungkan kondisi:
              </p>
              <ul style={{ color: "var(--text-secondary)", fontSize: "0.85rem", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li><strong>and</strong>: Bernilai True hanya jika KEDUA kondisi bernilai True (contoh: `True and False` &rarr; `False`).</li>
                <li><strong>or</strong>: Bernilai True jika SALAH SATU kondisi bernilai True (contoh: `True or False` &rarr; `True`).</li>
                <li><strong>not</strong>: Membalikkan nilai boolean (contoh: `not True` &rarr; `False`).</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Analogi: Variabel adalah Label pada Toples",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Variabel bukan menyimpan data secara permanen — isinya bisa <strong>diganti kapan saja</strong>.
                Bayangkan variabel seperti toples kaca yang diberi label nama. Isi toples bisa kamu ganti tanpa mengganti label toples-nya.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px" }}>
                <span style={{ color: "#6A9955" }}># Toples berlabel "skor" diisi dengan 50</span><br />
                skor = <span style={{ color: "#B5CEA8" }}>50</span><br />
                <span style={{ color: "#DCDCAA" }}>print</span>(skor) <span style={{ color: "#6A9955" }}># Output: 50</span><br />
                <br />
                <span style={{ color: "#6A9955" }}># Isi toples diganti menjadi 95 (label sama)</span><br />
                skor = <span style={{ color: "#B5CEA8" }}>95</span><br />
                <span style={{ color: "#DCDCAA" }}>print</span>(skor) <span style={{ color: "#6A9955" }}># Output: 95</span>
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "14px", fontSize: "0.85rem" }}>
                <strong>Kesimpulan penting:</strong> <span style={{ color: "var(--text-secondary)" }}>Variabel menyimpan nilai <em>terakhir</em> yang diberikan padanya. Nilai lama otomatis ditimpa oleh nilai baru.</span>
              </div>
            </div>
          ),
        },
        {
          title: "Konversi Tipe Data (Type Casting)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Kadang kita perlu mengubah tipe data dari satu jenis ke jenis lain. Proses ini disebut <strong>Type Casting</strong>.
                Ini sangat penting ketika mengambil data dari fungsi <code>input()</code> yang selalu menghasilkan String.
              </p>
              <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
                {[
                  { fn: "int('5')", hasil: "5 (integer)", desc: "Ubah teks angka ke bilangan bulat. Digunakan sebelum melakukan operasi matematika." },
                  { fn: "float('3.14')", hasil: "3.14 (float)", desc: "Ubah teks ke bilangan desimal. Berguna untuk perhitungan yang butuh presisi desimal." },
                  { fn: "str(100)", hasil: "'100' (string)", desc: "Ubah angka ke teks. Berguna untuk menggabungkan angka ke dalam kalimat output." },
                  { fn: "bool(0)", hasil: "False (boolean)", desc: "Ubah nilai lain ke boolean. Nilai 0 dan string kosong dianggap False." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--bg-page-alt)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                      <code style={{ color: "#DCDCAA", fontWeight: 700 }}>{item.fn}</code>
                      <span style={{ color: "#22C55E", fontFamily: "var(--font-code)" }}>{item.hasil}</span>
                    </div>
                    <div style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "0.8rem" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Fungsi input() dan print(): Gerbang Interaksi",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Dua fungsi bawaan Python yang paling sering digunakan untuk berinteraksi dengan pengguna:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                <span style={{ color: "#6A9955" }}># Meminta input dari keyboard (hasilnya selalu String)</span><br />
                nama = <span style={{ color: "#DCDCAA" }}>input</span>(<span style={{ color: "#CE9178" }}>"Siapa namamu? "</span>)<br />
                <br />
                <span style={{ color: "#6A9955" }}># Menampilkan output ke layar (bisa dikombinasikan dengan f-string)</span><br />
                <span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>{`f"Halo, {nama}! Selamat belajar Python!"`}</span>)
              </div>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "14px", fontSize: "0.85rem" }}>
                <strong>Apa itu f-string?</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.6 }}>
                  F-string (Format String) adalah cara modern Python untuk menyisipkan nilai variabel langsung di dalam teks.
                  Cukup tulis <code>f"..."</code> dan letakkan nama variabel di dalam kurung kurawal <code>{`{nama_variabel}`}</code>.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    M4: {
      title: "Percabangan",
      slides: [
        {
          title: "Logika Percabangan & Struktur if",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Percabangan</strong> memungkinkan alur program bercabang ke jalur yang berbeda berdasarkan suatu kondisi bersyarat (bernilai boolean `True`/`False`).
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                umur = <span style={{ color: "#B5CEA8" }}>18</span><br />
                <span style={{ color: "#C586C0" }}>if</span> umur &gt;= <span style={{ color: "#B5CEA8" }}>17</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Sudah punya KTP"</span>)
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "16px", fontSize: "0.85rem" }}>
                <strong>⚠️ Aturan Emas Indentasi Python:</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
                  Python tidak menggunakan kurung kurawal `{}` untuk menandai blok kode. Python mendeteksinya melalui <strong>indentasi</strong> (jarak spasi/tab masuk). 
                  Seluruh kode di dalam perintah `if` wajib menjorok masuk ke dalam. Jika tidak, akan terjadi error <code style={{ color: "#EF4444" }}>IndentationError</code>.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Percabangan Dua Arah (if-else)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Ketika kita ingin menjalankan tindakan alternatif apabila kondisi awal bernilai `False`, kita bisa menambahkan kata kunci `else`.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                nilai = <span style={{ color: "#B5CEA8" }}>65</span><br />
                <span style={{ color: "#C586C0" }}>if</span> nilai &gt;= <span style={{ color: "#B5CEA8" }}>75</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Selamat, Lulus!"</span>)<br />
                <span style={{ color: "#C586C0" }}>else</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Silakan ikuti remedial."</span>)
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                Sama seperti block `if`, block di dalam `else` juga memerlukan identasi spasi yang sejajar dan konsisten.
              </p>
            </div>
          ),
        },
        {
          title: "Percabangan Bertingkat: elif",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Bagaimana jika ada lebih dari dua kemungkinan kondisi? Kita bisa menggunakan struktur lengkap `if-elif-else`:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "14px", borderRadius: "var(--radius-md)", marginTop: "12px" }}>
                nilai = <span style={{ color: "#B5CEA8" }}>80</span><br />
                <span style={{ color: "#C586C0" }}>if</span> nilai &gt;= <span style={{ color: "#B5CEA8" }}>85</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Predikat: A"</span>)<br />
                <span style={{ color: "#C586C0" }}>elif</span> nilai &gt;= <span style={{ color: "#B5CEA8" }}>75</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Predikat: B"</span>)<br />
                <span style={{ color: "#C586C0" }}>else</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Predikat: C"</span>)
              </div>
              <ul style={{ color: "var(--text-secondary)", fontSize: "0.85rem", paddingLeft: "20px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li><code>if</code> menguji kondisi pertama.</li>
                <li><code>elif</code> (else-if) menguji kondisi berikutnya secara berurutan jika kondisi sebelumnya bernilai salah.</li>
                <li><code>else</code> mengeksekusi blok kode terakhir jika semua kondisi di atas salah.</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Percabangan Bersarang (Nested if)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Python mengizinkan kita menulis blok <code>if</code> di dalam blok <code>if</code> lain. Ini disebut <strong>Nested if</strong> dan berguna saat kita memiliki lebih dari satu kondisi yang perlu dicek secara bertahap.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "14px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                usia = <span style={{ color: "#B5CEA8" }}>20</span><br />
                punya_ktp = <span style={{ color: "#569CD6" }}>True</span><br />
                <br />
                <span style={{ color: "#C586C0" }}>if</span> usia &gt;= <span style={{ color: "#B5CEA8" }}>17</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>if</span> punya_ktp:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>"Boleh memilih dalam pemilu"</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>else</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>"Usia cukup tapi belum punya KTP"</span>)<br />
                <span style={{ color: "#C586C0" }}>else</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>"Belum cukup umur"</span>)
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "12px", fontSize: "0.85rem" }}>
                <strong>Perhatian:</strong> <span style={{ color: "var(--text-secondary)" }}>Semakin banyak nested if, semakin dalam indentasi kodenya. Terlalu banyak lapisan nested if bisa membuat kode sulit dibaca. Batasi ke 2-3 level saja.</span>
              </div>
            </div>
          ),
        },
        {
          title: "Operator Ternary: if-else Satu Baris",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Python memiliki cara ringkas untuk menulis if-else sederhana dalam <strong>satu baris</strong>. Ini disebut <strong>Ekspresi Ternary</strong> (Ternary Operator):
              </p>
              <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "14px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Format Ternary</div>
                <code style={{ fontFamily: "var(--font-code)", fontSize: "0.9rem", color: "var(--color-primary-500)" }}>
                  nilai_variabel = nilai_jika_true <span style={{ color: "#C586C0" }}>if</span> kondisi <span style={{ color: "#C586C0" }}>else</span> nilai_jika_false
                </code>
              </div>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "12px", lineHeight: 1.8 }}>
                nilai = <span style={{ color: "#B5CEA8" }}>80</span><br />
                <br />
                <span style={{ color: "#6A9955" }}># Cara panjang (4 baris)</span><br />
                <span style={{ color: "#C586C0" }}>if</span> nilai &gt;= <span style={{ color: "#B5CEA8" }}>75</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;status = <span style={{ color: "#CE9178" }}>"Lulus"</span><br />
                <span style={{ color: "#C586C0" }}>else</span>: status = <span style={{ color: "#CE9178" }}>"Remedi"</span><br />
                <br />
                <span style={{ color: "#6A9955" }}># Cara ternary (1 baris, hasil sama!)</span><br />
                status = <span style={{ color: "#CE9178" }}>"Lulus"</span> <span style={{ color: "#C586C0" }}>if</span> nilai &gt;= <span style={{ color: "#B5CEA8" }}>75</span> <span style={{ color: "#C586C0" }}>else</span> <span style={{ color: "#CE9178" }}>"Remedi"</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                Gunakan ternary untuk kondisi sederhana. Untuk kondisi kompleks, tetap gunakan blok if-else biasa agar kode lebih mudah dibaca.
              </p>
            </div>
          ),
        },
      ],
    },
    M5: {
      title: "Perulangan",
      slides: [
        {
          title: "Perulangan Terukur dengan for Loop",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Perulangan (loop)</strong> digunakan untuk mengeksekusi blok kode secara berulang selama memenuhi kondisi tertentu, menghemat waktu dan baris kode.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                <span style={{ color: "#C586C0" }}>for</span> i <span style={{ color: "#C586C0" }}>in</span> range(<span style={{ color: "#B5CEA8" }}>1</span>, <span style={{ color: "#B5CEA8" }}>6</span>):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>f"Perulangan ke-{'{i}'}"</span>)
              </div>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "16px", fontSize: "0.85rem" }}>
                <strong>Fungsi `range(start, stop)`:</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
                  Fungsi `range` menghasilkan deret angka. Perhatikan bahwa parameter `stop` bersifat eksklusif (tidak diikutkan). 
                  Maka `range(1, 6)` akan menghasilkan deret angka `1, 2, 3, 4, 5`.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Perulangan Bersyarat dengan while Loop",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Jika `for` digunakan untuk perulangan yang jumlahnya sudah pasti, **`while`** loop digunakan untuk mengulang kode selama suatu syarat bernilai `True`.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "14px", borderRadius: "var(--radius-md)", marginTop: "12px" }}>
                jumlah = <span style={{ color: "#B5CEA8" }}>0</span><br />
                <span style={{ color: "#C586C0" }}>while</span> jumlah &lt; <span style={{ color: "#B5CEA8" }}>3</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Belajar Coding"</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;jumlah += <span style={{ color: "#B5CEA8" }}>1</span>
              </div>
              <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "14px", fontSize: "0.85rem" }}>
                <strong>🚨 Waspada: Infinite Loop!</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
                  Pastikan kondisi di dalam `while` akan bernilai `False` pada titik tertentu (misalnya dengan menaikkan nilai `jumlah += 1`). 
                  Jika kondisi bernilai `True` selamanya, program akan berjalan tanpa henti dan dapat membuat browser/komputer hang.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Kontrol Perulangan: break & continue",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Kadang kita perlu memodifikasi alur jalannya perulangan di tengah jalan:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "12px" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                  <strong>🔴 break:</strong> Berfungsi menghentikan paksa seluruh jalannya perulangan dan keluar dari block perulangan seketika. Contoh:
                  <code style={{ display: "block", fontFamily: "var(--font-code)", color: "#CE9178", marginTop: "4px" }}>
                    if i == 5: break
                  </code>
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                  <strong>🔵 continue:</strong> Berfungsi menghentikan iterasi saat ini saja, melompati sisa baris kode di bawahnya, and langsung melompat ke iterasi berikutnya. Contoh:
                  <code style={{ display: "block", fontFamily: "var(--font-code)", color: "#CE9178", marginTop: "4px" }}>
                    if i % 2 == 0: continue # Skip angka genap
                  </code>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Iterasi Langsung Elemen List dengan for",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Selain menggunakan <code>range()</code>, loop <code>for</code> di Python bisa digunakan untuk <strong>mengiterasi langsung setiap elemen</strong> yang ada di dalam sebuah list. Ini sangat intuitif:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                mata_kuliah = [<span style={{ color: "#CE9178" }}>"Matematika"</span>, <span style={{ color: "#CE9178" }}>"Algoritma"</span>, <span style={{ color: "#CE9178" }}>"Bahasa Inggris"</span>]<br />
                <br />
                <span style={{ color: "#C586C0" }}>for</span> mk <span style={{ color: "#C586C0" }}>in</span> mata_kuliah:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>{`f"Mengikuti kelas: {mk}"`}</span>)<br />
                <br />
                <span style={{ color: "#6A9955" }}># Output:</span><br />
                <span style={{ color: "#6A9955" }}># Mengikuti kelas: Matematika</span><br />
                <span style={{ color: "#6A9955" }}># Mengikuti kelas: Algoritma</span><br />
                <span style={{ color: "#6A9955" }}># Mengikuti kelas: Bahasa Inggris</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                Variabel <code>mk</code> secara otomatis berisi elemen list saat ini di setiap iterasi. Kamu bebas memberi nama apa pun pada variabel iterasi ini.
              </p>
            </div>
          ),
        },
        {
          title: "Loop Bersarang (Nested Loop): Pola Bintang",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sama seperti nested if, kita juga bisa menulis loop di dalam loop lain. Ini disebut <strong>Nested Loop</strong>. Contoh paling klasik adalah mencetak pola bintang:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                <span style={{ color: "#C586C0" }}>for</span> baris <span style={{ color: "#C586C0" }}>in</span> <span style={{ color: "#DCDCAA" }}>range</span>(<span style={{ color: "#B5CEA8" }}>1</span>, <span style={{ color: "#B5CEA8" }}>6</span>):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>for</span> kolom <span style={{ color: "#C586C0" }}>in</span> <span style={{ color: "#DCDCAA" }}>range</span>(baris):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>"*"</span>, end=<span style={{ color: "#CE9178" }}>" "</span>)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>() <span style={{ color: "#6A9955" }}># Pindah baris</span>
              </div>
              <div style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginTop: "12px", fontFamily: "var(--font-code)", fontSize: "0.85rem", color: "var(--color-primary-400)", lineHeight: 1.8 }}>
                * <br />* * <br />* * * <br />* * * * <br />* * * * *
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "10px" }}>
                Loop dalam (kolom) berjalan dari 0 hingga nilai <code>baris</code> saat ini. Setiap kali loop luar (baris) naik satu langkah, loop dalam mencetak satu bintang lebih banyak.
              </p>
            </div>
          ),
        },
        {
          title: "Praktik: Menghitung Rata-rata Nilai dengan Loop",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sekarang kita gabungkan loop dan list untuk menyelesaikan masalah nyata: <strong>menghitung rata-rata nilai mahasiswa</strong>.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                nilai = [<span style={{ color: "#B5CEA8" }}>80</span>, <span style={{ color: "#B5CEA8" }}>75</span>, <span style={{ color: "#B5CEA8" }}>90</span>, <span style={{ color: "#B5CEA8" }}>85</span>, <span style={{ color: "#B5CEA8" }}>70</span>]<br />
                total = <span style={{ color: "#B5CEA8" }}>0</span><br />
                <br />
                <span style={{ color: "#C586C0" }}>for</span> n <span style={{ color: "#C586C0" }}>in</span> nilai:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;total = total + n <span style={{ color: "#6A9955" }}># Akumulasi jumlah</span><br />
                <br />
                rata_rata = total / <span style={{ color: "#DCDCAA" }}>len</span>(nilai)<br />
                <span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>{`f"Rata-rata: {rata_rata}"`}</span>)<br />
                <span style={{ color: "#6A9955" }}># Output: Rata-rata: 80.0</span>
              </div>
              <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.25)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "12px", fontSize: "0.85rem" }}>
                <strong>Integrasi konsep:</strong> <span style={{ color: "var(--text-secondary)" }}>Contoh ini menggabungkan List (M7), for Loop, dan operator aritmatika (M3) dalam satu program yang berguna nyata!</span>
              </div>
            </div>
          ),
        },
      ],
    },
    M6: {
      title: "Fungsi & Prosedur",
      slides: [
        {
          title: "Fungsi: Blok Kode Modular",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Fungsi</strong> adalah sekumpulan instruksi terisolasi yang diberi nama, dirancang untuk melakukan tugas spesifik secara berulang.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                <span style={{ color: "#C586C0" }}>def</span> <span style={{ color: "#DCDCAA" }}>sapa_maba</span>(nama):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>f"Halo, {'{nama}'}! Selamat datang di TRPL!"</span>)<br />
                <br />
                <span style={{ color: "#6A9955" }}># Memanggil fungsi</span><br />
                sapa_maba(<span style={{ color: "#CE9178" }}>"Adit"</span>)
              </div>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "16px", fontSize: "0.85rem" }}>
                <strong>Istilah Penting:</strong>
                <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li><strong>def</strong>: Kata kunci wajib untuk mendefinisikan fungsi di Python.</li>
                  <li><strong>Parameter</strong>: Variabel penampung input di tanda kurung fungsi (contoh: `nama`).</li>
                  <li><strong>Argumen</strong>: Nilai aktual yang dilewatkan ke fungsi saat dipanggil (contoh: `"Adit"`).</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Pengembalian Nilai (Return Value) & DRY",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Ada perbedaan besar antara fungsi yang hanya mencetak nilai (`print`) dengan fungsi yang mengembalikan nilai menggunakan kata kunci **`return`**:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "14px", borderRadius: "var(--radius-md)", marginTop: "12px" }}>
                <span style={{ color: "#C586C0" }}>def</span> <span style={{ color: "#DCDCAA" }}>tambah</span>(a, b):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>return</span> a + b<br />
                <br />
                hasil = tambah(<span style={{ color: "#B5CEA8" }}>10</span>, <span style={{ color: "#B5CEA8" }}>5</span>)<br />
                print(hasil) <span style={{ color: "#6A9955" }}># Output: 15</span>
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "14px", fontSize: "0.85rem" }}>
                <strong>💡 Prinsip DRY (Don't Repeat Yourself):</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
                  Jangan mengulang baris kode yang sama di berbagai tempat. Jika ada logika perhitungan atau format data yang terus berulang, 
                  bungkus logika tersebut ke dalam sebuah fungsi agar kode kamu rapi, modular, dan mudah di-maintain.
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Scope Variabel: Scope Lokal vs Scope Global",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Variabel memiliki batas wilayah di mana ia dapat dibaca atau dimodifikasi:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginTop: "12px" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                  <strong>🔒 Variabel Lokal:</strong> Variabel yang dideklarasikan di dalam suatu fungsi. Variabel ini hanya hidup dan dikenali di dalam fungsi tersebut, serta tidak bisa diakses dari luar fungsi.
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                  <strong>🌐 Variabel Global:</strong> Variabel yang dideklarasikan di luar fungsi mana pun. Variabel ini dapat dibaca oleh fungsi lain di seluruh dokumen kode tersebut.
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Mengapa Kita Butuh Fungsi? (Analogi Microwave)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Bayangkan fungsi seperti <strong>microwave di dapur</strong>. Kamu tidak perlu tahu cara kerja elemen pemanas di dalamnya —
                cukup tekan tombol "2 menit", dan makananmu akan panas. Itulah esensi fungsi: <em>sembunyikan kompleksitas, ekspos kemudahan</em>.
              </p>
              <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
                {[
                  { emoji: "Tanpa Fungsi", desc: "Kamu harus menulis ulang 10 baris kode hitung IPK setiap kali ada mahasiswa baru yang ingin dievaluasi.", color: "#EF4444" },
                  { emoji: "Dengan Fungsi", desc: "Kamu cukup panggil hitung_ipk(nilai_mahasiswa) sekali. Kode dalam fungsi bisa digunakan berkali-kali tanpa pengulangan.", color: "#22C55E" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--bg-page-alt)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: `1px solid ${item.color}33`, fontSize: "0.85rem" }}>
                    <strong style={{ color: item.color }}>{item.emoji}:</strong>
                    <span style={{ color: "var(--text-secondary)", marginLeft: "6px" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "12px", fontSize: "0.85rem" }}>
                <strong>Prinsip DRY</strong> <span style={{ color: "var(--text-secondary)" }}>(Don't Repeat Yourself): Jika kamu punya kode yang ditulis lebih dari sekali, itu sinyal kuat bahwa kamu perlu membungkusnya dalam sebuah fungsi.</span>
              </div>
            </div>
          ),
        },
        {
          title: "Parameter Default & Keyword Argument",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Python mengizinkan fungsi memiliki <strong>nilai default untuk parameter</strong>-nya. Jika argumen tidak diberikan saat pemanggilan, nilai default tersebut yang digunakan:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                <span style={{ color: "#C586C0" }}>def</span> <span style={{ color: "#DCDCAA" }}>sapa</span>(nama, sapaan=<span style={{ color: "#CE9178" }}>"Halo"</span>):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>{`f"{sapaan}, {nama}!"`}</span>)<br />
                <br />
                sapa(<span style={{ color: "#CE9178" }}>"Reza"</span>) <span style={{ color: "#6A9955" }}># Output: Halo, Reza!</span><br />
                sapa(<span style={{ color: "#CE9178" }}>"Dian"</span>, <span style={{ color: "#CE9178" }}>"Selamat pagi"</span>) <span style={{ color: "#6A9955" }}># Output: Selamat pagi, Dian!</span>
              </div>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "12px", fontSize: "0.85rem" }}>
                <strong>Aturan Penting:</strong> <span style={{ color: "var(--text-secondary)" }}>Parameter dengan nilai default harus selalu diletakkan di <em>bagian akhir</em> daftar parameter, setelah semua parameter wajib (yang tidak memiliki nilai default).</span>
              </div>
            </div>
          ),
        },
        {
          title: "Rekursi: Fungsi yang Memanggil Dirinya Sendiri",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                <strong>Rekursi</strong> adalah teknik di mana sebuah fungsi memanggil dirinya sendiri untuk menyelesaikan masalah yang lebih kecil dari masalah aslinya, secara berulang.
              </p>
              <div style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "12px", marginBottom: "12px", fontSize: "0.85rem" }}>
                <strong>Analogi: Boneka Matryoshka</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "4px", lineHeight: 1.6 }}>
                  Boneka Matryoshka adalah boneka kayu yang di dalamnya ada boneka lebih kecil, dan di dalamnya ada boneka lebih kecil lagi... sampai boneka terkecil. Rekursi bekerja persis seperti ini.
                </p>
              </div>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "14px", borderRadius: "var(--radius-md)", lineHeight: 1.8 }}>
                <span style={{ color: "#6A9955" }}># Faktorial: 5! = 5 x 4 x 3 x 2 x 1 = 120</span><br />
                <span style={{ color: "#C586C0" }}>def</span> <span style={{ color: "#DCDCAA" }}>faktorial</span>(n):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>if</span> n == <span style={{ color: "#B5CEA8" }}>1</span>: <span style={{ color: "#C586C0" }}>return</span> <span style={{ color: "#B5CEA8" }}>1</span> <span style={{ color: "#6A9955" }}># Base case (pemberhenti)</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>return</span> n * <span style={{ color: "#DCDCAA" }}>faktorial</span>(n - <span style={{ color: "#B5CEA8" }}>1</span>) <span style={{ color: "#6A9955" }}># Rekursi</span><br />
                <br />
                <span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#DCDCAA" }}>faktorial</span>(<span style={{ color: "#B5CEA8" }}>5</span>)) <span style={{ color: "#6A9955" }}># Output: 120</span>
              </div>
            </div>
          ),
        },
      ],
    },
    M7: {
      title: "Array & List",
      slides: [
        {
          title: "Struktur Data List di Python",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Bagaimana jika kita ingin menyimpan data berkelompok seperti daftar nilai mahasiswa? Kita bisa menggunakan <strong>List</strong> (struktur data mirip Array).
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                nilai_ujian = [<span style={{ color: "#B5CEA8" }}>80</span>, <span style={{ color: "#B5CEA8" }}>75</span>, <span style={{ color: "#B5CEA8" }}>90</span>]<br />
                <span style={{ color: "#6A9955" }}># Indeks elemen dimulai dari 0</span><br />
                print(nilai_ujian[<span style={{ color: "#B5CEA8" }}>0</span>]) <span style={{ color: "#6A9955" }}># Output: 80</span><br />
                print(nilai_ujian[-<span style={{ color: "#B5CEA8" }}>1</span>]) <span style={{ color: "#6A9955" }}># Indeks negatif, output: 90 (terakhir)</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                List di Python sangat fleksibel: dapat memuat tipe data yang berbeda, ukurannya dinamis, dan kodenya mudah dibaca.
              </p>
            </div>
          ),
        },
        {
          title: "Operasi Element List Bawaan",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "12px" }}>
                Berikut adalah beberapa operasi bawaan Python yang paling sering digunakan untuk mengolah data di dalam list:
              </p>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  { op: "nilai.append(95)", desc: "Menambahkan elemen baru '95' ke bagian paling akhir dari list." },
                  { op: "nilai.remove(75)", desc: "Mencari dan menghapus elemen pertama bernilai '75' dari list." },
                  { op: "len(nilai)", desc: "Fungsi bawaan untuk mengembalikan jumlah total elemen di dalam list." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "var(--bg-page-alt)", padding: "10px var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.875rem" }}>
                    <code style={{ color: "#CE9178", fontWeight: 700 }}>{item.op}</code>
                    <div style={{ color: "var(--text-secondary)", marginTop: "4px", fontSize: "0.8rem" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Slicing (Pemotongan) List",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Python menyediakan cara mudah memotong list dan mengambil sub-koleksi menggunakan format indeks <code>list[start:stop]</code>:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                abjad = [<span style={{ color: "#CE9178" }}>"A"</span>, <span style={{ color: "#CE9178" }}>"B"</span>, <span style={{ color: "#CE9178" }}>"C"</span>, <span style={{ color: "#CE9178" }}>"D"</span>]<br />
                sub_abjad = abjad[<span style={{ color: "#B5CEA8" }}>1</span>:<span style={{ color: "#B5CEA8" }}>3</span>]<br />
                print(sub_abjad) <span style={{ color: "#6A9955" }}># Output: ['B', 'C']</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "12px" }}>
                Ingat bahwa angka batas <code>stop</code> bersifat eksklusif, artinya data pada indeks batas stop tidak akan diikutsertakan ke dalam hasil pemotongan.
              </p>
            </div>
          ),
        },
        {
          title: "Analogi: List adalah Kertas Absensi Kelas",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Cara termudah memahami List: bayangkan sebuah <strong>kertas absensi kelas</strong>.
                Setiap baris kertas = satu elemen. Nomor urut baris (mulai dari 0) = indeks elemen.
              </p>
              <div style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "14px", fontFamily: "var(--font-code)", fontSize: "0.85rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--color-primary-500)", fontWeight: 700 }}>Indeks</span><span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Nama</span>
                  {["Adit", "Budi", "Citra", "Dian"].map((nm, i) => (
                    <><span key={`i-${i}`} style={{ color: "var(--color-primary-400)", fontWeight: 600 }}>[{i}]</span><span key={`n-${i}`}>{nm}</span></>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "14px", borderRadius: "var(--radius-md)", marginTop: "12px", lineHeight: 1.8 }}>
                absen = [<span style={{ color: "#CE9178" }}>"Adit"</span>, <span style={{ color: "#CE9178" }}>"Budi"</span>, <span style={{ color: "#CE9178" }}>"Citra"</span>, <span style={{ color: "#CE9178" }}>"Dian"</span>]<br />
                <span style={{ color: "#DCDCAA" }}>print</span>(absen[<span style={{ color: "#B5CEA8" }}>2</span>]) <span style={{ color: "#6A9955" }}># Output: Citra</span>
              </div>
            </div>
          ),
        },
        {
          title: "Dictionary: Pasangan Kunci-Nilai",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Selain List, Python memiliki tipe data bernama <strong>Dictionary</strong>. Dictionary menyimpan data dalam format <strong>kunci: nilai</strong> (seperti kamus bahasa).
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                mahasiswa = &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#CE9178" }}>"nama"</span>: <span style={{ color: "#CE9178" }}>"Reza"</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#CE9178" }}>"nim"</span>: <span style={{ color: "#CE9178" }}>"22001"</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#CE9178" }}>"ipk"</span>: <span style={{ color: "#B5CEA8" }}>3.85</span><br />
                &#125;<br />
                <br />
                <span style={{ color: "#DCDCAA" }}>print</span>(mahasiswa[<span style={{ color: "#CE9178" }}>"nama"</span>]) <span style={{ color: "#6A9955" }}># Output: Reza</span><br />
                <span style={{ color: "#DCDCAA" }}>print</span>(mahasiswa[<span style={{ color: "#CE9178" }}>"ipk"</span>]) <span style={{ color: "#6A9955" }}># Output: 3.85</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px", fontSize: "0.85rem" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ color: "var(--color-primary-500)" }}>List</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Diakses pakai indeks angka. <code>[0]</code>, <code>[1]</code>, ...</p>
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong style={{ color: "var(--color-primary-500)" }}>Dictionary</strong>
                  <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Diakses pakai nama kunci. <code>["nama"]</code>, ...</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "List of Dictionaries: Data Mahasiswa Nyata",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Dalam program nyata, kita sering menggabungkan <strong>List berisi Dictionary</strong> untuk menyimpan banyak objek data sekaligus:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.8rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                daftar = [<br />
                &nbsp;&nbsp;&#123;<span style={{ color: "#CE9178" }}>"nama"</span>: <span style={{ color: "#CE9178" }}>"Adit"</span>, <span style={{ color: "#CE9178" }}>"ipk"</span>: <span style={{ color: "#B5CEA8" }}>3.5</span>&#125;,<br />
                &nbsp;&nbsp;&#123;<span style={{ color: "#CE9178" }}>"nama"</span>: <span style={{ color: "#CE9178" }}>"Budi"</span>, <span style={{ color: "#CE9178" }}>"ipk"</span>: <span style={{ color: "#B5CEA8" }}>3.8</span>&#125;,<br />
                ]<br />
                <br />
                <span style={{ color: "#C586C0" }}>for</span> mhs <span style={{ color: "#C586C0" }}>in</span> daftar:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>{`f"{mhs['nama']}: IPK {mhs['ipk']}"`}</span>)<br />
                <span style={{ color: "#6A9955" }}># Adit: IPK 3.5  &nbsp; Budi: IPK 3.8</span>
              </div>
              <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.25)", borderRadius: "var(--radius-md)", padding: "10px 12px", marginTop: "12px", fontSize: "0.85rem" }}>
                <strong>Integrasi konsep:</strong> <span style={{ color: "var(--text-secondary)" }}>List + Dictionary + for Loop bekerja bersama. Inilah pola data paling umum dalam dunia programming profesional!</span>
              </div>
            </div>
          ),
        },
      ],
    },
    M8: {
      title: "Mini Project",
      slides: [
        {
          title: "Rekap Perjalanan Belajarmu!",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "14px" }}>
                Kamu sudah melewati perjalanan panjang! Sebelum mulai Mini Project, mari kita rekap semua ilmu yang sudah kamu kuasai:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[
                  { modul: "M1", topik: "Dasar Komputer & Workspace", icon: "OS, file system, VS Code, terminal" },
                  { modul: "M2", topik: "Logika & Algoritma", icon: "Algoritma, flowchart, pseudocode" },
                  { modul: "M3", topik: "Variabel & Tipe Data", icon: "str, int, float, bool, input()" },
                  { modul: "M4", topik: "Percabangan", icon: "if, elif, else, nested if, ternary" },
                  { modul: "M5", topik: "Perulangan", icon: "for, while, break, continue, nested" },
                  { modul: "M6", topik: "Fungsi & Prosedur", icon: "def, return, scope, parameter default" },
                  { modul: "M7", topik: "Array & List", icon: "list, slicing, dict, append, len" },
                ].map((item) => (
                  <div key={item.modul} style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "10px 12px", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontFamily: "var(--font-code)", fontWeight: 800, color: "var(--color-primary-500)", fontSize: "0.7rem" }}>{item.modul}</span>
                      <strong style={{ color: "var(--text-primary)" }}>{item.topik}</strong>
                    </div>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{item.icon}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.25)", borderRadius: "var(--radius-md)", padding: "10px 14px", marginTop: "12px", fontSize: "0.85rem" }}>
                Kamu sudah siap! Semua konsep di atas akan kamu gunakan bersama-sama dalam Mini Project ini.
              </div>
            </div>
          ),
        },
        {
          title: "Latihan Integratif Akhir",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Selamat! Kamu telah membaca seluruh konsep dasar pemrograman. Sekarang saatnya menguji pemahaman kamu secara integratif dengan menyelesaikan **Mini Project: Kalkulator Sederhana**.
              </p>
              <div style={{ background: "var(--bg-card)", border: "2px solid var(--color-primary-400)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "16px" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>📋 Spesifikasi Proyek Kalkulator:</h4>
                <ul style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "20px" }}>
                  <li>Meminta input angka pertama dari user.</li>
                  <li>Meminta input angka kedua dari user.</li>
                  <li>Mencetak hasil penjumlahan kedua angka tersebut ke konsol output.</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Tips Debugging & Alur Kerja",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sebelum mulai menulis kode di editor praktek, perhatikan tips berikut agar proses pengerjaan berjalan mulus:
              </p>
              <ul style={{ color: "var(--text-secondary)", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                <li>💡 <strong>Rancang logika</strong>: Tuliskan pseudocode sederhana terlebih dahulu di kertas atau komentar kode.</li>
                <li>🛠️ <strong>Ketik bertahap</strong>: Tulis variabel input terlebih dahulu, jalankan kode untuk memastikan tidak ada error sintaksis.</li>
                <li>🎯 <strong>Jalankan sebelum kirim</strong>: Klik tombol <em>Jalankan Kode</em> untuk memvalidasi output sebelum mengeklik tombol <em>Kirim Jawaban</em>.</li>
              </ul>
            </div>
          ),
        },
        {
          title: "Tips Debugging & Alur Kerja yang Benar",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sebelum mulai menulis kode, ikuti alur kerja profesional ini agar kodemu rapi dan minim error:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                {[
                  { step: "1", judul: "Rencanakan dengan pseudocode", desc: "Tulis langkah-langkah program secara alami sebelum membuka editor kode." },
                  { step: "2", judul: "Tulis kode bertahap", desc: "Tulis variabel input dulu, jalankan. Lalu tambahkan logika, jalankan lagi. Jangan langsung tulis semua sekaligus." },
                  { step: "3", judul: "Baca pesan error dengan teliti", desc: "Python selalu memberitahu di baris mana error terjadi. Baca pesannya, jangan panik!" },
                  { step: "4", judul: "Jalankan sebelum kirim", desc: "Klik 'Jalankan Kode' untuk memvalidasi output sebelum mengklik 'Kirim Jawaban'." },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "12px", background: "var(--bg-page-alt)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.85rem", alignItems: "flex-start" }}>
                    <span style={{ background: "var(--color-primary-500)", color: "white", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>{item.step}</span>
                    <div><strong style={{ color: "var(--text-primary)" }}>{item.judul}:</strong><span style={{ color: "var(--text-secondary)", marginLeft: "4px" }}>{item.desc}</span></div>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Skeleton Code: Kerangka Kalkulator Kamu",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Gunakan kerangka kode di bawah ini sebagai titik awal. Isi bagian yang kosong sesuai logikamu:
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "14px", lineHeight: 1.8 }}>
                <span style={{ color: "#6A9955" }}># Langkah 1: Ambil input dari pengguna</span><br />
                angka1 = <span style={{ color: "#DCDCAA" }}>int</span>(<span style={{ color: "#DCDCAA" }}>input</span>(<span style={{ color: "#CE9178" }}>"Masukkan angka pertama: "</span>))<br />
                angka2 = <span style={{ color: "#DCDCAA" }}>int</span>(<span style={{ color: "#DCDCAA" }}>input</span>(<span style={{ color: "#CE9178" }}>"Masukkan angka kedua: "</span>))<br />
                <br />
                <span style={{ color: "#6A9955" }}># Langkah 2: Hitung hasil (tulis operasimu di sini!)</span><br />
                hasil = <span style={{ color: "#CE9178" }}>???</span> <span style={{ color: "#6A9955" }}># Ganti ??? dengan operasi matematika</span><br />
                <br />
                <span style={{ color: "#6A9955" }}># Langkah 3: Tampilkan hasil</span><br />
                <span style={{ color: "#DCDCAA" }}>print</span>(<span style={{ color: "#CE9178" }}>{`f"Hasil: {hasil}"`}</span>)
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "10px 12px", marginTop: "12px", fontSize: "0.85rem" }}>
                <strong>Penting:</strong> <span style={{ color: "var(--text-secondary)" }}>Ganti <code>???</code> dengan operasi yang sesuai tantangan. Misalnya untuk penjumlahan: <code>angka1 + angka2</code></span>
              </div>
            </div>
          ),
        },
        {
          title: "Tantangan Lanjutan (Bonus!)",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sudah selesai lebih awal? Coba tantangan bonus ini untuk mengasah kemampuanmu lebih jauh:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
                {[
                  { level: "Mudah", color: "#22C55E", soal: "Tambahkan operasi pengurangan: tampilkan juga hasil angka1 - angka2." },
                  { level: "Menengah", color: "#FF9D00", soal: "Buat kalkulator 4 operasi (+, -, *, /) menggunakan if-elif-else untuk memilih operasi berdasarkan input karakter dari pengguna." },
                  { level: "Sulit", color: "#EF4444", soal: "Bungkus seluruh logika kalkulator di dalam sebuah fungsi bernama hitung(a, b, op) yang menerima dua angka dan satu operasi sebagai argumen." },
                ].map((item) => (
                  <div key={item.level} style={{ background: "var(--bg-page-alt)", padding: "12px 14px", borderRadius: "var(--radius-md)", border: `1.5px solid ${item.color}44`, fontSize: "0.85rem" }}>
                    <span style={{ display: "inline-block", background: item.color, color: "white", padding: "1px 10px", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 700, marginBottom: "6px" }}>{item.level}</span>
                    <p style={{ color: "var(--text-secondary)", margin: 0 }}>{item.soal}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255, 107, 0, 0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "10px 12px", marginTop: "12px", fontSize: "0.85rem" }}>
                Selamat telah menyelesaikan seluruh modul matrikulasi! Kamu sudah memiliki fondasi yang kuat untuk memulai perkuliahan Pemrograman Dasar.
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const currentModule = moduleMap[moduleId as string] || {
    title: `Modul ${moduleId}`,
    slides: [
      {
        title: "Slide Pembuka Materi",
        type: "text",
        content: (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
              Modul ini berisi materi coding interaktif dan latihan pemrograman. Klik tombol di bawah untuk masuk ke latihan coding.
            </p>
          </div>
        ),
      },
    ],
  };

  const slides = currentModule.slides;
  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Go to quiz or practice depending on module
      if (moduleId === "M0" || moduleId === "M1") {
        router.push(`/learn/${moduleId}/quiz`);
      } else {
        // Go to coding practice
        router.push(`/learn/${moduleId}/practice`);
      }
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  return (
    <div className="section-container" style={{ maxWidth: "720px", paddingTop: "var(--space-4)" }}>
      {/* Header Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-6)" }}>
        <button
          onClick={() => router.push("/dashboard")}
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
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-primary-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Materi Pembelajaran
          </span>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {currentModule.title}
          </h2>
        </div>
      </div>

      {/* Progress indicators */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "var(--space-6)" }}>
        {slides.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              background: idx <= currentSlideIndex ? "var(--color-primary-500)" : "var(--color-neutral-150)",
              transition: "background var(--transition-fast)",
            }}
          />
        ))}
      </div>

      {/* Slide Container Card */}
      <div className="learn-slide-card"
        style={{
          background: "var(--bg-card)",
          border: "1.5px solid var(--border-color-strong)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-card)",
          minHeight: "400px",
          padding: "var(--space-8)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginBottom: "var(--space-6)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.375rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "var(--space-6)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Sparkle size={20} weight="fill" color="var(--color-primary-500)" />
              {currentSlide.title}
            </h3>

            <div style={{ flex: 1 }}>{currentSlide.content}</div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-8)" }}>
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            style={{
              background: "transparent",
              border: "1.5px solid var(--border-color)",
              padding: "10px var(--space-5)",
              borderRadius: "var(--radius-full)",
              color: "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: currentSlideIndex === 0 ? "not-allowed" : "pointer",
              opacity: currentSlideIndex === 0 ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ArrowLeft size={16} weight="bold" /> <span className="nav-btn-text">Kembali</span>
          </button>

          <button
            onClick={handleNext}
            style={{
              background: "var(--gradient-hero)",
              border: "none",
              padding: "10px var(--space-6)",
              borderRadius: "var(--radius-full)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(255,107,0,0.25)",
            }}
          >
            <span className="nav-btn-text">
              {isLastSlide ? (
                (moduleId === "M0" || moduleId === "M1") ? "Mulai Kuis" : "Lanjut ke Latihan"
              ) : (
                "Lanjut"
              )}
            </span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .learn-slide-card { padding: var(--space-4) !important; }
          .nav-btn-text { display: none; }
          .learn-heading { font-size: 1.125rem !important; }
          .cli-output { font-size: 0.75rem !important; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}


