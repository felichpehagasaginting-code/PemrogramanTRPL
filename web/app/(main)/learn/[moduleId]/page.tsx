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
                Dosen Pemrograman Dasar berpesan: **Jangan melompat langsung ke coding jika tidak mengerti sistem operasi laptop sendiri!**
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
          title: "Dasar Berpikir Logis",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Algoritma adalah deretan langkah logis terstruktur untuk memecahkan suatu masalah.
                Komputer hanya melakukan apa yang diperintahkan, jadi langkah kita harus tepat.
              </p>
              <div style={{ background: "var(--bg-page-alt)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "16px" }}>
                <strong>Analogi Sederhana:</strong> Resep membuat mie instan adalah algoritma!
                Jika langkah menuang air panas ditaruh setelah menyajikan mie kering di piring, mie tidak akan matang. Urutan itu penting!
              </div>
            </div>
          ),
        },
        {
          title: "Orientasi Coding Praktek",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Sekarang saatnya kamu mencoba melatih logika coding pertama kamu menggunakan console editor di modul latihan berikutnya.
              </p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginTop: "10px" }}>
                Mari kita beralih ke editor untuk mempraktekkan sintaksis Python paling dasar.
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
          title: "Apa Itu Variabel?",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Variabel adalah tempat penyimpanan data di memori komputer. Bayangkan variabel seperti 
                kotak penyimpanan yang bisa kamu beri label dan diisi dengan nilai tertentu.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "var(--bg-page-alt)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginTop: "16px" }}>
                <span style={{ color: "#569CD6" }}>nama</span> <span style={{ color: "#D4D4D4" }}>= </span>
                <span style={{ color: "#CE9178" }}>"Budi"</span>
                <br />
                <span style={{ color: "#569CD6" }}>umur</span> <span style={{ color: "#D4D4D4" }}>= </span>
                <span style={{ color: "#B5CEA8" }}>18</span>
              </div>
            </div>
          ),
        },
        {
          title: "Tipe Data Dasar Python",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "16px" }}>
                Python memiliki beberapa tipe data dasar yang perlu kamu kenali:
              </p>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { type: "string (str)", contoh: '"Halo"', desc: "Teks atau karakter" },
                  { type: "integer (int)", contoh: "42", desc: "Bilangan bulat" },
                  { type: "float", contoh: "3.14", desc: "Bilangan desimal" },
                  { type: "boolean (bool)", contoh: "True/False", desc: "Nilai kebenaran" },
                ].map((t, i) => (
                  <div key={i} style={{ background: "var(--bg-page-alt)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.875rem" }}>
                    <strong style={{ color: "var(--text-primary)" }}>{t.type}</strong>
                    <span style={{ color: "var(--text-muted)", margin: "0 8px" }}>—</span>
                    <code style={{ color: "#CE9178" }}>{t.contoh}</code>
                    <div style={{ color: "var(--text-secondary)", marginTop: "4px" }}>{t.desc}</div>
                  </div>
                ))}
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
          title: "If, Elif, Else",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Percabangan memungkinkan program mengambil keputusan berdasarkan kondisi tertentu. 
                Struktur dasarnya: <strong style={{ color: "var(--text-primary)" }}>if</strong>, 
                <strong style={{ color: "var(--text-primary)" }}> elif</strong>, dan 
                <strong style={{ color: "var(--text-primary)" }}> else</strong>.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                <span style={{ color: "#569CD6" }}>nilai</span> = <span style={{ color: "#B5CEA8" }}>85</span>
                <br />
                <span style={{ color: "#C586C0" }}>if</span> nilai &gt;= <span style={{ color: "#B5CEA8" }}>75</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Lulus"</span>)<br />
                <span style={{ color: "#C586C0" }}>else</span>:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: "#CE9178" }}>"Remidi"</span>)
              </div>
            </div>
          ),
        },
      ],
    },
    M5: {
      title: "Perulangan",
      slides: [
        {
          title: "For Loop & While",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Perulangan (loop) digunakan untuk mengulang blok kode beberapa kali. 
                Python memiliki dua jenis perulangan: <strong style={{ color: "var(--text-primary)" }}>for</strong> dan 
                <strong style={{ color: "var(--text-primary)" }}>while</strong>.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ color: "#9CA3AF", fontSize: "0.75rem", marginBottom: "8px" }}>FOR LOOP</div>
                  <span style={{ color: "#C586C0" }}>for</span> i <span style={{ color: "#C586C0" }}>in</span> range(<span style={{ color: "#B5CEA8" }}>5</span>):<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;print(i)
                </div>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ color: "#9CA3AF", fontSize: "0.75rem", marginBottom: "8px" }}>WHILE LOOP</div>
                  i = <span style={{ color: "#B5CEA8" }}>0</span><br />
                  <span style={{ color: "#C586C0" }}>while</span> i &lt; <span style={{ color: "#B5CEA8" }}>5</span>:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;print(i)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;i += <span style={{ color: "#B5CEA8" }}>1</span>
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
          title: "Membuat Fungsi dengan def",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Fungsi adalah blok kode yang bisa dipanggil berulang kali. Gunakan kata kunci 
                <strong style={{ color: "var(--text-primary)" }}> def</strong> untuk mendefinisikan fungsi.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                <span style={{ color: "#C586C0" }}>def</span> <span style={{ color: "#DCDCAA" }}>sapa</span>(nama):<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "#C586C0" }}>return</span> <span style={{ color: "#CE9178" }}>f"Halo, {'{nama}'}!"</span><br />
                <br />
                print(sapa(<span style={{ color: "#CE9178" }}>"Budi"</span>))
              </div>
              <div style={{ background: "rgba(255,107,0,0.08)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "12px", marginTop: "16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                <strong>💡 Tips:</strong> Fungsi membantu kamu menulis kode yang lebih rapi dan tidak mengulang-ulang kode yang sama (DRY Principle).
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
          title: "List di Python",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                List adalah struktur data yang bisa menyimpan banyak nilai dalam satu variabel. 
                List menggunakan kurung siku <strong style={{ color: "var(--text-primary)" }}>[]</strong>.
              </p>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "0.875rem", background: "#1E1E1E", color: "#D4D4D4", padding: "16px", borderRadius: "var(--radius-md)", marginTop: "16px" }}>
                buah = [<span style={{ color: "#CE9178" }}>"apel"</span>, <span style={{ color: "#CE9178" }}>"mangga"</span>, <span style={{ color: "#CE9178" }}>"pisang"</span>]<br />
                print(buah[<span style={{ color: "#B5CEA8" }}>0</span>]) <span style={{ color: "#6A9955" }}># apel</span><br />
                print(len(buah)) <span style={{ color: "#6A9955" }}># 3</span><br />
                buah.append(<span style={{ color: "#CE9178" }}>"anggur"</span>)
              </div>
              <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                <div style={{ background: "var(--bg-page-alt)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong>Indexing:</strong> dimulai dari 0
                </div>
                <div style={{ background: "var(--bg-page-alt)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <strong>Slicing:</strong> list[1:3]
                </div>
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
          title: "Project Akhir Matrikulasi",
          type: "text",
          content: (
            <div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Selamat! Kamu sudah sampai di modul terakhir matrikulasi. 
                Sekarang saatnya membuat project akhir: <strong style={{ color: "var(--text-primary)" }}>Program Kalkulator Sederhana</strong>.
              </p>
              <div style={{ background: "var(--bg-card)", border: "2px solid var(--color-primary-400)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)", marginTop: "16px" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>📋 Spesifikasi Project:</h4>
                <ul style={{ color: "var(--text-secondary)", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "6px", paddingLeft: "20px" }}>
                  <li>Menerima input 2 angka dari user</li>
                  <li>Menyediakan operasi: tambah, kurang, kali, bagi</li>
                  <li>Menampilkan hasil perhitungan</li>
                  <li>Menggunakan fungsi untuk setiap operasi</li>
                </ul>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "16px" }}>
                Klik tombol "Lanjut ke Coding" untuk mulai mengerjakan project di editor interaktif!
              </p>
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
      // Complete the module slides
      completeModule(moduleId as string);
      // If it is M0, direct to quiz
      if (moduleId === "M0") {
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
                moduleId === "M0" ? "Mulai Pre-Test" : "Lanjut ke Coding"
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


