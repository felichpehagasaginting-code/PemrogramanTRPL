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
          title: "Selamat Datang di Platform Matrikulasi! 🚀",
          type: "text",
          content: (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "15px" }}>🎓</div>
              <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Halo Calon Programmer TRPL! Selamat datang di dunia coding yang menantang dan menyenangkan.
                Melalui platform matrikulasi ini, kamu akan dibimbing langkah demi langkah dari nol mutlak.
              </p>
              <div
                style={{
                  background: "var(--gradient-hero-soft)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-4)",
                  marginTop: "var(--space-6)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                💡 Tips: Belajar pemrograman bukan soal menghafal sintaks, tapi soal melatih problem-solving!
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
                <li>⏱️ Durasi: ~10 menit</li>
                <li>📝 Format: 10 Soal Pilihan Ganda Logika Dasar</li>
                <li>🎯 Sifat: Diagnostik (bebas stres!)</li>
              </ul>
              <div style={{ marginTop: "var(--space-6)", textAlign: "center" }}>
                <Link href={`/learn/${moduleId}/quiz`} className="btn btn-primary">
                  Mulai Pre-Test Sekarang →
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
                Instruktur Pemrograman Dasar berpesan: **Jangan melompat langsung ke coding jika tidak mengerti sistem operasi laptop sendiri!**
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "12px" }}>
                Banyak maba gagal menjalankan kodenya hanya karena salah menaruh folder proyek, salah variabel path, atau extensi file yang tersembunyi.
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
                  <strong>Aturan Emas:</strong> Dilarang keras membuat folder project pemrograman di **Desktop** atau **Downloads**!
                  Hal ini memicu error path permission saat IDE/VS Code mencoba menjalankannya.
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Game Simulasi: Susun Workspace yang Benar",
          type: "interactive-drag",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>
                Pindahkan file coding **`calculator.py`** ke lokasi folder penyimpanan yang paling tepat:
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
          title: "Simulator CLI: Memeriksa Python & PATH",
          type: "interactive-cli",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>
                Ketikkan perintah **`python --version`** pada terminal di bawah untuk memeriksa konfigurasi PATH Python:
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
      ],
    },
    M8: {
      title: "Mini Project",
      slides: [
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


