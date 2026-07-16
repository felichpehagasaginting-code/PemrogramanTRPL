"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui";

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

          {/* Right: Code editor mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            style={{ position: "relative" }}
            className="hero-visual"
          >
            {/* Floating success badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "-28px",
                right: "8%",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  background: "var(--gradient-success)",
                  borderRadius: "var(--radius-full)",
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "white",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
                }}
              >
                <CheckCircle size={16} weight="fill" /> Kode berhasil jalan!
              </div>
            </motion.div>

            {/* Editor window */}
            <div
              style={{
                background: "#111827",
                borderRadius: "var(--radius-xl)",
                border: "1px solid rgba(255,107,0,0.2)",
                boxShadow: "0 24px 64px rgba(28,10,0,0.15), var(--shadow-glow-soft)",
                overflow: "hidden",
              }}
            >
              {/* Window chrome */}
              <div
                style={{
                  padding: "12px 16px",
                  background: "#1F2937",
                  borderBottom: "1px solid rgba(255,107,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28C840" }} />
                <span style={{ marginLeft: "8px", color: "#9CA3AF", fontSize: "0.8rem", fontFamily: "var(--font-code)" }}>
                  main.py
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.7rem",
                    background: "rgba(255,107,0,0.2)",
                    color: "#FF8C42",
                    padding: "2px 10px",
                    borderRadius: "var(--radius-full)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                  }}
                >
                  Python 3
                </span>
              </div>

              {/* Code content */}
              <div style={{ padding: "var(--space-6)", fontFamily: "var(--font-code)", fontSize: "0.9rem", lineHeight: 1.8 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <CodeLine num={1} content={<><span style={{ color: "#60A5FA" }}>nama</span> <span style={{ color: "#F87171" }}>=</span> <span style={{ color: "#FCD34D" }}>&quot;Reza&quot;</span></>} />
                  <CodeLine num={2} content={<><span style={{ color: "#60A5FA" }}>nilai</span> <span style={{ color: "#F87171" }}>=</span> <span style={{ color: "#A78BFA" }}>85</span></>} />
                  <CodeLine num={3} content="" />
                  <CodeLine num={4} content={<><span style={{ color: "#F87171" }}>if</span> <span style={{ color: "#60A5FA" }}>nilai</span> <span style={{ color: "#F87171" }}>&gt;=</span> <span style={{ color: "#A78BFA" }}>75</span><span style={{ color: "#E5E7EB" }}>:</span></>} />
                  <CodeLine num={5} indent content={<><span style={{ color: "#34D399" }}>print</span><span style={{ color: "#E5E7EB" }}>(</span><span style={{ color: "#FCD34D" }}>&quot;Selamat, &quot;</span> <span style={{ color: "#F87171" }}>+</span> <span style={{ color: "#60A5FA" }}>nama</span> <span style={{ color: "#F87171" }}>+</span> <span style={{ color: "#FCD34D" }}>&quot;! Lulus!&quot;</span><span style={{ color: "#E5E7EB" }}>)</span></>} />
                  <CodeLine num={6} content={<><span style={{ color: "#F87171" }}>else</span><span style={{ color: "#E5E7EB" }}>:</span></>} />
                  <CodeLine num={7} indent content={<><span style={{ color: "#34D399" }}>print</span><span style={{ color: "#E5E7EB" }}>(</span><span style={{ color: "#FCD34D" }}>&quot;Semangat terus!&quot;</span><span style={{ color: "#E5E7EB" }}>)</span></>} />
                </motion.div>

                {/* Output */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  style={{
                    marginTop: "var(--space-4)",
                    padding: "var(--space-3) var(--space-4)",
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div style={{ color: "#6B7280", fontSize: "0.75rem", marginBottom: "4px" }}>▶ Output</div>
                  <div style={{ color: "#34D399", fontFamily: "var(--font-code)", fontSize: "0.875rem" }}>
                    Selamat, Reza! Lulus! ✨
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating XP badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "5%",
                background: "var(--gradient-hero)",
                borderRadius: "var(--radius-lg)",
                padding: "10px 18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "var(--shadow-glow)",
                color: "white",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              <Trophy size={18} weight="fill" />
              +50 XP · Badge Unlocked!
            </motion.div>
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
    { name: "Script Kiddie", range: "0–99 XP", icon: "🐣", active: false },
    { name: "Code Padawan", range: "100–249 XP", icon: "⚡", active: false },
    { name: "Developer Muda", range: "250–499 XP", icon: "💻", active: true },
    { name: "Code Warrior", range: "500–799 XP", icon: "⚔️", active: false },
    { name: "Algorithm Master", range: "800–1099 XP", icon: "🧠", active: false },
    { name: "TRPL Legend", range: "1100+ XP", icon: "🏆", active: false },
  ];

  const badges = [
    { name: "Langkah Pertama", emoji: "👟", color: "#FF9D00" },
    { name: "Workspace Master", emoji: "📁", color: "#FF8C42" },
    { name: "Pemikir Logis", emoji: "⭐", color: "#FF6B00" },
    { name: "Si Penampung Data", emoji: "📦", color: "#06B6D4" },
    { name: "Pembuat Keputusan", emoji: "🔀", color: "#EF4444" },
    { name: "Master of Loop", emoji: "🔄", color: "#22C55E" },
    { name: "Function Wizard", emoji: "🪄", color: "#D45900" },
    { name: "Data Collector", emoji: "📊", color: "#FF8C42" },
    { name: "Junior Developer", emoji: "⛑️", color: "#FF9D00" },
    { name: "Matrikulasi Graduate", emoji: "🎓", color: "#FF6B00" },
    { name: "Perfectionist", emoji: "💎", color: "#06B6D4" },
    { name: "Speed Runner", emoji: "🚀", color: "#EF4444" },
    { name: "Helping Hand", emoji: "🤝", color: "#22C55E" },
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
                  <span style={{ fontSize: "1.25rem" }}>{lv.icon}</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
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
                  <div style={{ fontSize: "1.75rem", marginBottom: "4px" }}>{badge.emoji}</div>
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
