"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Code,
  GameController,
  Trophy,
  Lightning,
  CheckCircle,
  ArrowRight,
  Star,
  Cpu,
  Brain,
  ListNumbers,
  GitBranch,
  ArrowsClockwise,
  Function,
  SquaresFour,
  Rocket,
  FolderOpen,
  Play,
  Folder,
  Terminal,
  Warning,
  EggCrack,
  Laptop,
  Sword,
} from "@phosphor-icons/react";
import { Button, BadgeIcon } from "@/components/ui";

/* ---- Animation variants ---- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

/* ---- Animated section wrapper ---- */
function AnimatedSection({ children, id, style = {} }: { children: React.ReactNode; id?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={stagger}
      style={style}
    >
      {children}
    </motion.section>
  );
}

function InteractiveHeroShowcase() {
  const [activeTab, setActiveTab] = useState<"code" | "folder">("code");

  // Code editor states
  const [code, setCode] = useState(`# Coba jalankan kode pertamamu!\nnama = "Maba TRPL 2026"\nprint("Halo " + nama + "!")\nprint("Selamat datang di platform matrikulasi!")\n`);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Folder creator states
  const [folderName, setFolderName] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [folderFeedback, setFolderFeedback] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const hasSpace = /\s/.test(folderName);
  const hasSpecialChar = /[^a-zA-Z0-9_\-]/.test(folderName);
  const isNameValid = folderName.length > 0 && !hasSpace && !hasSpecialChar;
  const isPathValid = selectedPath === "D:\\TRPL\\Proyek";
  const isEverythingValid = isNameValid && isPathValid;

  const runCode = () => {
    setIsExecuting(true);
    setConsoleOutput(["Running python main.py..."]);

    setTimeout(() => {
      try {
        const lines = code.split("\n");
        const vars: Record<string, any> = {};
        const logs: string[] = [];

        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith("#")) continue;

          if (line.includes("=") && !line.includes("==") && !line.startsWith("print")) {
            const eqIdx = line.indexOf("=");
            const name = line.substring(0, eqIdx).trim();
            const valStr = line.substring(eqIdx + 1).trim();

            if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
              vars[name] = valStr.substring(1, valStr.length - 1);
            } else {
              try {
                let temp = valStr;
                Object.keys(vars).forEach(k => {
                  temp = temp.replace(new RegExp(`\\b${k}\\b`, "g"), vars[k]);
                });
                vars[name] = (Function as any)(`return (${temp})`)();
              } catch (e) {
                vars[name] = NaN;
              }
            }
            continue;
          }

          if (line.startsWith("print(") && line.endsWith(")")) {
            const inner = line.substring(6, line.length - 1).trim();
            let expr = inner;
            Object.keys(vars).forEach(k => {
              const val = typeof vars[k] === "string" ? `"${vars[k]}"` : vars[k];
              expr = expr.replace(new RegExp(`\\b${k}\\b`, "g"), val);
            });

            try {
              const res = (Function as any)(`return (${expr})`)();
              logs.push(String(res));
            } catch (e) {
              logs.push(`SyntaxError: print expression '${inner}' is invalid.`);
            }
          }
        }

        if (logs.length === 0) {
          logs.push("(Script selesai tanpa output)");
        }
        setConsoleOutput(logs);
      } catch (err) {
        setConsoleOutput(["SyntaxError: Gagal menjalankan script Python tiruan."]);
      } finally {
        setIsExecuting(false);
      }
    }, 600);
  };

  const handlePathSelect = (path: string) => {
    setSelectedPath(path);
    if (path.includes("Desktop")) {
      setFolderFeedback("❌ Desktop rawan sync-lock OneDrive cloud!");
    } else if (path.includes("Downloads")) {
      setFolderFeedback("❌ Downloads adalah folder temp sampah sementara!");
    } else if (path.includes("Program Files")) {
      setFolderFeedback("❌ Butuh hak akses Administrator!");
    } else {
      setFolderFeedback("✅ Lokasi D: Drive partisi mandiri sangat aman!");
    }
  };

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(255,107,0,0.25)",
        boxShadow: "0 24px 64px rgba(28,10,0,0.25), var(--shadow-glow-soft)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "380px",
        maxHeight: "440px",
      }}
    >
      {/* Chrome window header with tabs */}
      <div
        style={{
          background: "#1F2937",
          borderBottom: "1px solid rgba(255,107,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          height: "44px",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F57" }}></span>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }}></span>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28C840" }}></span>
          
          {/* Tab buttons */}
          <div style={{ display: "flex", gap: "4px", marginLeft: "16px" }}>
            <button
              onClick={() => setActiveTab("code")}
              style={{
                background: activeTab === "code" ? "#111827" : "transparent",
                color: activeTab === "code" ? "white" : "#9CA3AF",
                border: "none",
                borderRadius: "4px 4px 0 0",
                padding: "6px 12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-heading)",
              }}
            >
              💻 VS Code Sandbox
            </button>
            <button
              onClick={() => setActiveTab("folder")}
              style={{
                background: activeTab === "folder" ? "#111827" : "transparent",
                color: activeTab === "folder" ? "white" : "#9CA3AF",
                border: "none",
                borderRadius: "4px 4px 0 0",
                padding: "6px 12px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-heading)",
              }}
            >
              📁 Folder Creator
            </button>
          </div>
        </div>

        {activeTab === "code" && (
          <button
            onClick={runCode}
            disabled={isExecuting}
            style={{
              background: "rgba(34,197,94,0.15)",
              border: "1px solid #22c55e",
              color: "#22c55e",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.7rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
          >
            <Play size={10} weight="fill" />
            <span>Run Code</span>
          </button>
        )}
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px", background: "#111827" }}>
        {activeTab === "code" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
            {/* Editor Input */}
            <div style={{ flex: 1, position: "relative", minHeight: "140px" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "24px", color: "#4B5563", fontSize: "0.75rem", fontFamily: "var(--font-code)", textAlign: "right", paddingRight: "6px", userSelect: "none", lineHeight: "1.6" }}>
                {code.split("\n").map((_, i) => <div key={i}>{i+1}</div>)}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  paddingLeft: "30px",
                  color: "#e5e7eb",
                  fontFamily: "var(--font-code)",
                  fontSize: "0.8rem",
                  lineHeight: "1.6",
                }}
              />
            </div>

            {/* Output console */}
            <div style={{ height: "100px", background: "#0b0f19", borderRadius: "8px", border: "1px solid #1e293b", padding: "8px 12px", display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.65rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>▶ Console Terminal</span>
              <div style={{ flex: 1, overflowY: "auto", fontFamily: "var(--font-code)", fontSize: "0.75rem", color: "#34D399", lineHeight: "1.4" }}>
                {consoleOutput.length > 0 ? (
                  consoleOutput.map((l, i) => <div key={i}>{l}</div>)
                ) : (
                  <span style={{ color: "#4b5563" }}>Klik 'Run Code' di atas untuk menjalankan program...</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", fontSize: "0.8rem" }}>
            {!isCreated ? (
              <>
                <div>
                  <label style={{ display: "block", color: "#9ca3af", fontWeight: 600, marginBottom: "4px" }}>Nama Folder Proyek:</label>
                  <input
                    type="text"
                    placeholder="Contoh: belajar_python"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      color: "white",
                      outline: "none",
                      fontFamily: "var(--font-code)",
                    }}
                  />
                  {folderName && (
                    <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>
                      {hasSpace && <span style={{ color: "#ef4444" }}>❌ Mengandung spasi! Gunakan _ atau -</span>}
                      {hasSpecialChar && !hasSpace && <span style={{ color: "#ef4444" }}>❌ Karakter spesial ilegal!</span>}
                      {isNameValid && <span style={{ color: "#22c55e" }}>✅ Nama folder profesional!</span>}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", color: "#9ca3af", fontWeight: 600, marginBottom: "4px" }}>Pilih Path:</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                    {[
                      "C:\\Desktop",
                      "C:\\Downloads",
                      "C:\\Program Files",
                      "D:\\TRPL\\Proyek",
                    ].map(p => (
                      <button
                        key={p}
                        onClick={() => handlePathSelect(p)}
                        style={{
                          background: selectedPath === p ? "rgba(255,107,0,0.1)" : "#1f2937",
                          border: selectedPath === p ? "1.5px solid var(--color-primary-500)" : "1px solid #374151",
                          padding: "6px",
                          borderRadius: "4px",
                          color: "white",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {selectedPath && (
                    <div style={{ fontSize: "0.7rem", color: selectedPath === "D:\\TRPL\\Proyek" ? "#22c55e" : "#ef4444", marginTop: "4px" }}>
                      {folderFeedback}
                    </div>
                  )}
                </div>

                <button
                  disabled={!isEverythingValid}
                  onClick={() => setIsCreated(true)}
                  style={{
                    background: isEverythingValid ? "var(--color-primary-500)" : "#374151",
                    color: isEverythingValid ? "white" : "#9ca3af",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px",
                    fontWeight: 700,
                    cursor: isEverythingValid ? "pointer" : "not-allowed",
                    marginTop: "4px",
                  }}
                >
                  Buat Folder Proyek Baru 📁
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ color: "#22c55e", fontWeight: 700 }}>✅ Workspace Berhasil Dibuat!</span>
                <div style={{ background: "#0b0f19", border: "1px solid #1e293b", padding: "10px", borderRadius: "6px", fontFamily: "var(--font-code)", fontSize: "0.75rem", color: "#e5e7eb", lineHeight: 1.5 }}>
                  <div>📁 {selectedPath}\{folderName}\</div>
                  <div style={{ color: "#9CA3AF" }}>├── 📁 .vscode\</div>
                  <div style={{ color: "#D4D4D4" }}>├── 📄 main.py</div>
                  <div style={{ color: "#D4D4D4" }}>└── 📄 readme.md</div>
                </div>
                <button
                  onClick={() => {
                    setIsCreated(false);
                    setFolderName("");
                    setSelectedPath("");
                    setFolderFeedback("");
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid #374151",
                    color: "white",
                    padding: "4px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                  }}
                >
                  Reset Simulasi 🔄
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ====================================================
   HERO SECTION
   ==================================================== */
export function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "80px",
        background: "var(--bg-page)",
      }}
    >
      {/* Warm orange glow blobs */}
      <div
        className="glow-dot"
        style={{
          width: "600px",
          height: "600px",
          top: "-150px",
          right: "-100px",
          background: "rgba(255,107,0,0.08)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="glow-dot"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-80px",
          left: "-80px",
          background: "rgba(255,179,71,0.07)",
          filter: "blur(70px)",
        }}
      />

      {/* Grid dots pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,107,0,0.12) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 70% 70% at 60% 40%, black 0%, transparent 100%)",
        }}
      />

      <div className="section-container" style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-12)",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: "var(--space-6)" }}
            >
              <span className="badge badge-primary">
                <Star size={12} weight="fill" />
                Platform Matrikulasi TRPL 2026
              </span>
            </motion.div>

            <h1
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "var(--space-6)",
                color: "var(--text-primary)",
              }}
            >
              Coding itu seru.{" "}
              <span
                className="gradient-text"
                style={{ display: "block" }}
              >
                Percaya deh. 🚀
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                marginBottom: "var(--space-8)",
                maxWidth: "480px",
              }}
            >
              Platform belajar pemrograman interaktif untuk maba TRPL yang{" "}
              <strong style={{ color: "var(--color-primary-500)", fontWeight: 700 }}>anti-boring</strong>.
              Live coding, gamifikasi, kuis seru, dan meme yang not-cringe.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <Button href="/login" variant="primary" size="lg">
                Mulai Belajar <ArrowRight size={18} weight="bold" />
              </Button>
              <Button href="#kurikulum" variant="secondary" size="lg">
                Lihat Kurikulum
              </Button>
            </div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                marginTop: "var(--space-8)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-6)",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: <Code size={15} />, label: "7 Modul Coding" },
                { icon: <Trophy size={15} />, label: "12 Badge Eksklusif" },
                { icon: <Lightning size={15} />, label: "Live Code Editor" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ color: "var(--color-primary-500)" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Interactive Showcase Playground */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            style={{ position: "relative" }}
            className="hero-visual"
          >
            <InteractiveHeroShowcase />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-muted)",
          fontSize: "0.75rem",
        }}
      >
        <span>Scroll ke bawah</span>
        <div style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, var(--color-primary-500), transparent)" }} />
      </motion.div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  );
}

function CodeLine({ num, content, indent = false }: { num: number; content: React.ReactNode; indent?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-4)" }}>
      <span style={{ color: "#4B5563", width: "20px", textAlign: "right", flexShrink: 0, userSelect: "none" }}>{num}</span>
      <span style={{ paddingLeft: indent ? "24px" : "0" }}>{content}</span>
    </div>
  );
}

/* ====================================================
   FEATURES SECTION
   ==================================================== */
export function FeaturesSection() {
  const features = [
    {
      icon: <Code size={32} weight="duotone" />,
      title: "Live Code Editor",
      description: "Tulis dan jalankan kode Python langsung di browser. Tidak perlu install apapun!",
      color: "#FF6B00",
      bg: "rgba(255,107,0,0.08)",
      border: "rgba(255,107,0,0.2)",
    },
    {
      icon: <GameController size={32} weight="duotone" />,
      title: "Gamifikasi Seru",
      description: "Kumpulkan poin, unlock badge, naik level, dan bersaing di leaderboard kelas.",
      color: "#D45900",
      bg: "rgba(212,89,0,0.08)",
      border: "rgba(212,89,0,0.2)",
    },
    {
      icon: <Trophy size={32} weight="duotone" />,
      title: "Kuis Interaktif",
      description: "Kuis pilihan ganda dan drag-and-drop. Bukan sekadar hafalan, tapi pemahaman nyata.",
      color: "#FF9D00",
      bg: "rgba(255,157,0,0.08)",
      border: "rgba(255,157,0,0.2)",
    },
    {
      icon: <Cpu size={32} weight="duotone" />,
      title: "Adaptive Learning",
      description: "Platform menyesuaikan level kamu. Sudah paham? Langsung skip ke bagian berikutnya.",
      color: "#06B6D4",
      bg: "rgba(6,182,212,0.08)",
      border: "rgba(6,182,212,0.2)",
    },
    {
      icon: <Brain size={32} weight="duotone" />,
      title: "Materi Kontekstual",
      description: "Semua contoh menggunakan situasi nyata mahasiswa. Relevan dan mudah dipahami.",
      color: "#22C55E",
      bg: "rgba(34,197,94,0.08)",
      border: "rgba(34,197,94,0.2)",
    },
    {
      icon: <Lightning size={32} weight="duotone" />,
      title: "Meme Integration",
      description: "Meme pemrograman yang relevan dan not-cringe muncul saat kamu berhasil! 🎉",
      color: "#FF8C42",
      bg: "rgba(255,140,66,0.08)",
      border: "rgba(255,140,66,0.2)",
    },
  ];

  return (
    <AnimatedSection
      id="tentang"
      style={{
        padding: "var(--space-16) 0",
        background: "var(--bg-page-alt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orange strip at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "4px",
        background: "var(--gradient-hero)",
      }} />

      <div className="section-container">
        <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-4)" }}>
            <Lightning size={12} weight="fill" />
            Kenapa Platform Ini?
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-3)" }}>
            Bukan ceramah.{" "}
            <span className="gradient-text">Ini pengalaman.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", margin: "var(--space-4) auto 0", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Matrikulasi TRPL dirancang ulang untuk Gen-Z. Interaktif, gamified, dan bikin ketagihan belajar coding.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} transition={{ delay: i * 0.08 }}>
              <div
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${f.border}`,
                  boxShadow: "var(--shadow-sm)",
                  padding: "var(--space-6)",
                  height: "100%",
                  transition: "all 0.25s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = `0 12px 32px ${f.bg}`;
                  el.style.borderColor = f.color;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "var(--shadow-sm)";
                  el.style.borderColor = f.border;
                }}
              >
                <div
                  style={{
                    width: "56px", height: "56px",
                    borderRadius: "var(--radius-md)",
                    background: f.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: f.color,
                    marginBottom: "var(--space-4)",
                    border: `1px solid ${f.border}`,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.0625rem", color: "var(--text-primary)", marginBottom: "var(--space-2)", fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ====================================================
   CURRICULUM SECTION
   ==================================================== */
export function CurriculumSection() {
  const modules = [
    { code: "M0", title: "Pre-Test & Orientasi", duration: "30 mnt", icon: <Star size={20} />, color: "#FF9D00", bg: "rgba(255,157,0,0.1)", desc: "Kenalan sama platform dan test kemampuan awal" },
    { code: "M1", title: "Dasar Komputer & Workspace", duration: "90 mnt", icon: <FolderOpen size={20} />, color: "#FF8C42", bg: "rgba(255,140,66,0.1)", desc: "Manajemen File System, path, setup Python & VS Code" },
    { code: "M2", title: "Logika & Algoritma", duration: "2 jam", icon: <Brain size={20} />, color: "#FF6B00", bg: "rgba(255,107,0,0.1)", desc: "Berpikir kayak programmer dengan flowchart & pseudo-code" },
    { code: "M3", title: "Variabel & Tipe Data", duration: "2 jam", icon: <SquaresFour size={20} />, color: "#06B6D4", bg: "rgba(6,182,212,0.1)", desc: "Variabel, integer, string, boolean di Python" },
    { code: "M4", title: "Percabangan", duration: "2.5 jam", icon: <GitBranch size={20} />, color: "#EF4444", bg: "rgba(239,68,68,0.1)", desc: "if, elif, else – buat program yang bisa berpikir" },
    { code: "M5", title: "Perulangan", duration: "2.5 jam", icon: <ArrowsClockwise size={20} />, color: "#22C55E", bg: "rgba(34,197,94,0.1)", desc: "for loop, while loop – otomasi yang mengubah segalanya" },
    { code: "M6", title: "Fungsi & Prosedur", duration: "2.5 jam", icon: <Function size={20} />, color: "#D45900", bg: "rgba(212,89,0,0.1)", desc: "DRY principle – tulis sekali, pakai berkali-kali" },
    { code: "M7", title: "Array & List", duration: "2 jam", icon: <ListNumbers size={20} />, color: "#FF8C42", bg: "rgba(255,140,66,0.1)", desc: "Simpan banyak data dalam satu variabel" },
    { code: "M8", title: "Mini Project", duration: "3 jam", icon: <Rocket size={20} />, color: "#FF6B00", bg: "rgba(255,107,0,0.12)", desc: "Integrasikan semua yang dipelajari jadi program nyata!" },
  ];

  return (
    <AnimatedSection
      id="kurikulum"
      style={{
        padding: "var(--space-16) 0",
        background: "var(--bg-page)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle orange background watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "800px", height: "800px",
          background: "var(--gradient-orange-glow)",
          pointerEvents: "none",
        }}
      />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-4)" }}>
            <Code size={12} weight="fill" />
            Kurikulum 9 Modul
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-3)" }}>
            Dari nol hingga{" "}
            <span className="gradient-text">bikin program sendiri</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "520px", margin: "var(--space-4) auto 0", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            9 modul terstruktur, ~18.5 jam belajar, 1170 poin tersedia. Dimulai dari dasar literasi komputer!
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          {modules.map((mod, i) => (
            <motion.div key={mod.code} variants={fadeUp} transition={{ delay: i * 0.07 }}>
              <div
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-sm)",
                  padding: "var(--space-5)",
                  display: "flex",
                  gap: "var(--space-4)",
                  alignItems: "flex-start",
                  borderLeft: `4px solid ${mod.color}`,
                  transition: "all 0.25s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div
                  style={{
                    width: "44px", height: "44px",
                    borderRadius: "var(--radius-md)",
                    background: mod.bg,
                    border: `1px solid ${mod.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: mod.color, flexShrink: 0,
                  }}
                >
                  {mod.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-code)", fontSize: "0.75rem", color: mod.color, fontWeight: 700 }}>
                      {mod.code}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--bg-page-alt)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                      ⏱ {mod.duration}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "0.9375rem", color: "var(--text-primary)", marginBottom: "4px", fontWeight: 700 }}>
                    {mod.title}
                  </h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {mod.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          style={{
            marginTop: "var(--space-12)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          {[
            { label: "Total Modul", value: "9", suffix: "modul" },
            { label: "Waktu Belajar", value: "~18.5", suffix: "jam" },
            { label: "Poin Tersedia", value: "1170", suffix: "XP" },
            { label: "Badge Eksklusif", value: "13", suffix: "badge" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
                padding: "var(--space-5)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 800,
                  background: "var(--gradient-hero)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-primary-500)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                {stat.suffix}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

/* ====================================================
   GAMIFICATION SECTION
   ==================================================== */
export function GamificationSection() {
  const levels = [
    { name: "Script Kiddie", range: "0–99 XP", icon: <EggCrack size={22} weight="fill" color="#FF9D00" />, active: false },
    { name: "Code Padawan", range: "100–249 XP", icon: <Lightning size={22} weight="fill" color="#FF8C42" />, active: false },
    { name: "Developer Muda", range: "250–499 XP", icon: <Laptop size={22} weight="fill" color="#06B6D4" />, active: true },
    { name: "Code Warrior", range: "500–799 XP", icon: <Sword size={22} weight="fill" color="#EF4444" />, active: false },
    { name: "Algorithm Master", range: "800–1099 XP", icon: <Brain size={22} weight="fill" color="#D45900" />, active: false },
    { name: "TRPL Legend", range: "1100+ XP", icon: <Trophy size={22} weight="fill" color="#FF6B00" />, active: false },
  ];

  const badges = [
    { id: "langkah_pertama", name: "Langkah Pertama", color: "#FF9D00" },
    { id: "workspace_master", name: "Workspace Master", color: "#FF8C42" },
    { id: "pemikir_logis", name: "Pemikir Logis", color: "#FF6B00" },
    { id: "penampung_data", name: "Si Penampung Data", color: "#06B6D4" },
    { id: "pembuat_keputusan", name: "Pembuat Keputusan", color: "#EF4444" },
    { id: "master_loop", name: "Master of Loop", color: "#22C55E" },
    { id: "function_wizard", name: "Function Wizard", color: "#D45900" },
    { id: "data_collector", name: "Data Collector", color: "#FF8C42" },
    { id: "junior_developer", name: "Junior Developer", color: "#FF9D00" },
    { id: "graduated", name: "Matrikulasi Graduate", color: "#FF6B00" },
    { id: "perfectionist", name: "Perfectionist", color: "#06B6D4" },
    { id: "speed_runner", name: "Speed Runner", color: "#EF4444" },
    { id: "helping_hand", name: "Helping Hand", color: "#22C55E" },
  ];

  return (
    <AnimatedSection
      id="fitur"
      style={{
        padding: "var(--space-16) 0",
        background: "var(--bg-page-alt)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orange decorative elements */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "4px",
        background: "var(--gradient-hero)",
      }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <span className="badge badge-amber" style={{ marginBottom: "var(--space-4)" }}>
            <GameController size={12} weight="fill" />
            Sistem Gamifikasi
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-3)" }}>
            Belajar itu kayak{" "}
            <span className="gradient-text">main game. Serius.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "var(--space-4) auto 0", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Setiap modul selesai = poin naik, badge unlock, level naik. Ada leaderboard buat kompetisi sehat antar maba.
          </p>
        </motion.div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", alignItems: "start" }}
          className="gamif-grid"
        >
          {/* Level System */}
          <motion.div variants={fadeUp}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "var(--space-6)", fontSize: "1.125rem", fontWeight: 700 }}>
              🎮 Sistem Level
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {levels.map((lv, i) => (
                <motion.div
                  key={lv.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  style={{
                    background: lv.active ? "linear-gradient(135deg, rgba(255,107,0,0.08), rgba(255,157,0,0.06))" : "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: lv.active ? "1.5px solid var(--color-primary-500)" : "1px solid var(--border-color)",
                    padding: "var(--space-3) var(--space-4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    boxShadow: lv.active ? "var(--shadow-card)" : "none",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", flexShrink: 0 }}>{lv.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: lv.active ? "var(--color-primary-600)" : "var(--text-primary)", fontSize: "0.9rem" }}>
                      {lv.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{lv.range}</div>
                  </div>
                  {lv.active && (
                    <span style={{ fontSize: "0.7rem", background: "var(--color-primary-500)", color: "white", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                      AKTIF
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Badge Grid */}
          <motion.div variants={fadeUp}>
            <h3 style={{ color: "var(--text-primary)", marginBottom: "var(--space-6)", fontSize: "1.125rem", fontWeight: 700 }}>
              🏅 Koleksi Badge (13 Badge)
            </h3>
            <div className="badge-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  viewport={{ once: true }}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${badge.color}25`,
                    padding: "var(--space-3)",
                    textAlign: "center",
                    cursor: "default",
                    boxShadow: `0 2px 12px ${badge.color}12`,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                    <BadgeIcon id={badge.id} color={badge.color} size={42} />
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", lineHeight: 1.35, fontWeight: 500 }}>
                    {badge.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .gamif-grid { grid-template-columns: 1fr !important; }
          .badge-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .badge-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </AnimatedSection>
  );
}

/* ====================================================
   CTA SECTION
   ==================================================== */
export function EngineerSection() {
  return (
    <section
      style={{
        padding: "var(--space-16) 0 var(--space-12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 80%, rgba(255,107,0,0.05) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              width: "60px",
              height: "1px",
              background: "var(--gradient-hero)",
              margin: "0 auto var(--space-6)",
              transformOrigin: "center",
            }}
          />

          {/* "Dibuat Oleh" tag */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              color: "var(--text-muted)",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: "var(--space-2)",
            }}
          >
            Dibuat Oleh
          </motion.p>

          {/* Name */}
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Felich Pehagasa Ginting
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
              marginTop: "2px",
            }}
          >
            Software Engineer · AI Enthusiast · D4 TRPL
          </motion.p>

          {/* Social icons - SVG */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              marginTop: "var(--space-5)",
            }}
          >
            {[
              {
                href: "https://github.com/felichpehagasaginting-code",
                label: "GitHub",
                path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
              },
              {
                href: "https://www.linkedin.com/in/felich-pehagasa-ginting",
                label: "LinkedIn",
                path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
              },
              {
                href: "https://www.instagram.com/fel.comp",
                label: "Instagram",
                path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
              },
              {
                href: "https://felich.dev",
                label: "Portfolio",
                path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
              },
            ].map(({ href, label, path }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--bg-page-alt)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "var(--color-primary-400)";
                  el.style.background = "rgba(255,107,0,0.08)";
                  el.style.color = "var(--color-primary-500)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "var(--border-color)";
                  el.style.background = "var(--bg-page-alt)";
                  el.style.color = "var(--text-muted)";
                }}
                title={label}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d={path} />
                </svg>
              </motion.a>
            ))}
          </motion.div>

          {/* Team Members */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginTop: "var(--space-7)",
            }}
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "120px",
                  padding: "var(--space-4) var(--space-3)",
                  borderRadius: "var(--radius-lg)",
                  border: "1.5px dashed var(--border-color)",
                  background: "var(--bg-page-alt)",
                  textAlign: "center",
                  opacity: 0.6,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--color-neutral-150)",
                    margin: "0 auto var(--space-2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    color: "var(--text-muted)",
                  }}
                >
                  ?
                </div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  Anggota {i}
                </p>
                <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px", opacity: 0.6 }}>
                  Data menyusul
                </p>
              </div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.5 }}
            style={{ color: "var(--text-muted)", fontSize: "0.65rem", marginTop: "var(--space-5)", opacity: 0.45 }}
          >
            Projek Himpunan Mahasiswa TRPL
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <AnimatedSection
      style={{
        padding: "var(--space-16) 0",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-dark)",
      }}
    >
      {/* Orange glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,107,0,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Top strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px",
        background: "var(--gradient-hero)",
      }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div variants={fadeUp}>
          <div style={{ fontSize: "3.5rem", marginBottom: "var(--space-4)" }}>🚀</div>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#FFFAF6",
              marginBottom: "var(--space-4)",
            }}
          >
            Matrikulasi tahun ini,{" "}
            <span className="gradient-text">beda.</span>
          </h2>
          <p
            style={{
              color: "rgba(255,250,246,0.65)",
              maxWidth: "520px",
              margin: "0 auto var(--space-8)",
              fontSize: "1.0625rem",
              lineHeight: 1.75,
            }}
          >
            Izinkan kami mengubah matrikulasi TRPL menjadi pengalaman yang diingat seumur hidup. Mulai sekarang, gratis!
          </p>

          <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
            <Button href="/login" variant="primary" size="lg">
              Daftar Sekarang – Gratis! <ArrowRight size={18} weight="bold" />
            </Button>
            <motion.a
              href="#tentang"
              whileHover={{ scale: 1.03 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "var(--space-4) var(--space-8)",
                borderRadius: "var(--radius-full)",
                border: "1.5px solid rgba(255,250,246,0.25)",
                color: "rgba(255,250,246,0.85)",
                textDecoration: "none",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "1.0625rem",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-primary-400)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#FF8C42";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,250,246,0.25)";
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,250,246,0.85)";
              }}
            >
              Pelajari Lebih Lanjut
            </motion.a>
          </div>

          <p style={{ marginTop: "var(--space-6)", color: "rgba(255,250,246,0.4)", fontSize: "0.875rem" }}>
            Login dengan SSO kampus · Tidak perlu buat akun baru · 100% gratis untuk maba TRPL
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
