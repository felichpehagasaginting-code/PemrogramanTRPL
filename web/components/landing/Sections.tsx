"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Code,
  GameController,
  Trophy,
  Lightning,
  ArrowRight,
  Star,
  Brain,
  Rocket,
  Play,
  Terminal,
  CheckCircle,
  EggCrack,
  Laptop,
  Sword,
  Books,
  Graph,
  Sparkle,
} from "@phosphor-icons/react";
import { Button, BadgeIcon } from "@/components/ui";
import { MODULES_META } from "@/lib/content/modules-data";
import { BADGES } from "@/lib/store/useUserStore";
import { getRandomMemes } from "@/lib/content/memes";
import { ColorSwitcher } from "./ColorSwitcher";

/* ============================================================
   VARIANTS + SCROLL UTILITIES
   ============================================================ */
const easeOut = [0.16, 1, 0.3, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } } };
const fadeLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOut } } };
const fadeRight = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: easeOut } } };
const stagger = { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } };

/* ============================================================
   HERO — Code Sandbox with Live Preview
   ============================================================ */
function HeroSandbox() {
  const [tab, setTab] = useState<"code" | "folder" | "preview">("code");
  const [code, setCode] = useState(`# Coba jalankan kode pertamamu!\nnama = "Maba TRPL 2026"\nprint("Halo " + nama + "!")\nprint("Selamat datang di platform matrikulasi!")\n`);
  const [out, setOut] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [fname, setFname] = useState("");
  const [spath, setSpath] = useState("");
  const [fb, setFb] = useState("");
  const [created, setCreated] = useState(false);

  const hasSpace = /\s/.test(fname);
  const hasSpec = /[^a-zA-Z0-9_\-]/.test(fname);
  const nameOk = fname.length > 0 && !hasSpace && !hasSpec;
  const pathOk = spath === "D:\\TRPL\\Proyek";
  const allOk = nameOk && pathOk;

  const run = () => {
    setRunning(true);
    setOut(["Running python main.py..."]);
    setTimeout(() => {
      try {
        const lines = code.split("\n");
        const v: Record<string, any> = {};
        const logs: string[] = [];
        for (const line of lines) {
          const l = line.trim();
          if (!l || l.startsWith("#")) continue;
          if (l.includes("=") && !l.includes("==") && !l.startsWith("print")) {
            const i = l.indexOf("="); const n = l.slice(0, i).trim(); const vs = l.slice(i + 1).trim();
            if ((vs.startsWith('"') && vs.endsWith('"')) || (vs.startsWith("'") && vs.endsWith("'"))) v[n] = vs.slice(1, -1);
            else { try { let t = vs; Object.keys(v).forEach(k => { t = t.replace(new RegExp(`\\b${k}\\b`, "g"), v[k]); }); v[n] = (Function as any)(`return (${t})`)(); } catch { v[n] = NaN; } }
            continue;
          }
          if (l.startsWith("print(") && l.endsWith(")")) {
            const inner = l.slice(6, -1).trim(); let e = inner;
            Object.keys(v).forEach(k => { const val = typeof v[k] === "string" ? `"${v[k]}"` : v[k]; e = e.replace(new RegExp(`\\b${k}\\b`, "g"), val); });
            try { logs.push(String((Function as any)(`return (${e})`)())); } catch { logs.push(`SyntaxError: '${inner}'`); }
          }
        }
        if (!logs.length) logs.push("(done, no output)");
        setOut(logs);
      } catch { setOut(["SyntaxError: failed to execute"]); }
      finally { setRunning(false); }
    }, 600);
  };

  const selectPath = (p: string) => {
    setSpath(p);
    setFb(p.includes("Desktop") ? "Desktop rawan sync-lock" : p.includes("Downloads") ? "Downloads folder temp" : p.includes("Program Files") ? "Butuh Admin" : "D: drive aman");
  };

  const tabStyle = (a: boolean) => ({
    background: a ? "#1E293B" : "transparent",
    color: a ? "#fff" : "#6B7280",
    border: "none",
    borderRadius: "6px",
    padding: "5px 12px",
    fontSize: "0.72rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-heading)",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      style={{
        background: "#0F172A",
        borderRadius: "var(--radius-xl)",
        border: "1.5px solid rgba(255,255,255,0.06)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "440px",
      }}
    >
      {/* Chrome */}
      <div style={{ background: "#1E293B", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", height: "42px", userSelect: "none" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28C840" }} />
          <div style={{ display: "flex", gap: "3px", marginLeft: "14px" }}>
            <button onClick={() => setTab("code")} style={tabStyle(tab === "code")}><Code size={11} /> Code</button>
            <button onClick={() => setTab("preview")} style={tabStyle(tab === "preview")}><Play size={11} /> Preview</button>
            <button onClick={() => setTab("folder")} style={tabStyle(tab === "folder")}><Books size={11} /> Folder</button>
          </div>
        </div>
        {tab === "code" && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={run} disabled={running}
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "4px 14px", borderRadius: "20px", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
          >
            {running ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} /> : <Play size={10} weight="fill" />}
            {running ? "Running" : "Run"}
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "16px", background: "#0F172A" }}>
          {tab === "code" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
              <div style={{ flex: 1, position: "relative", minHeight: "140px" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "24px", color: "#4B5563", fontSize: "0.72rem", fontFamily: "var(--font-code)", textAlign: "right", paddingRight: "6px", userSelect: "none", lineHeight: "1.6" }}>
                  {code.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea value={code} onChange={e => setCode(e.target.value)} style={{ width: "100%", height: "100%", background: "transparent", border: "none", outline: "none", resize: "none", paddingLeft: "30px", color: "#e5e7eb", fontFamily: "var(--font-code)", fontSize: "0.78rem", lineHeight: "1.6" }} />
              </div>
              <motion.div layout style={{ height: "100px", background: "#0B1121", borderRadius: "8px", border: "1px solid #1E293B", padding: "8px 12px", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.62rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}><Terminal size={10} /> Console</span>
                <div style={{ flex: 1, overflowY: "auto", fontFamily: "var(--font-code)", fontSize: "0.72rem", color: "#34D399", lineHeight: "1.4" }}>
                  {out.length ? out.map((l, i) => <div key={i}>{l}</div>) : <span style={{ color: "#4B5563" }}>Run code above</span>}
                </div>
              </motion.div>
            </div>
          )}

          {tab === "preview" && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "0.85rem", textAlign: "center", padding: "20px" }}>
              <div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} style={{ width: "56px", height: "56px", borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, rgba(123,31,162,0.2), rgba(255,107,0,0.1))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#CE93D8" }}>
                  <Rocket size={28} weight="fill" />
                </motion.div>
                <p style={{ fontWeight: 600, color: "#e5e7eb", marginBottom: "4px" }}>Kode kamu akan tampil di sini</p>
                <p style={{ fontSize: "0.78rem", color: "#6B7280" }}>Klik Run untuk melihat hasil eksekusi</p>
                {out.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "16px", background: "#0B1121", borderRadius: "8px", border: "1px solid #1E293B", padding: "12px 16px", fontFamily: "var(--font-code)", fontSize: "0.78rem", color: "#34D399", textAlign: "left", maxWidth: "320px" }}>
                    {out.map((l, i) => <div key={i} style={{ padding: "2px 0" }}>{l}</div>)}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {tab === "folder" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", fontSize: "0.78rem" }}>
              {!created ? (
                <>
                  <div>
                    <label style={{ display: "block", color: "#9CA3AF", fontWeight: 600, marginBottom: "4px", fontSize: "0.72rem" }}>Project folder</label>
                    <input type="text" placeholder="belajar_python" value={fname} onChange={e => setFname(e.target.value)} style={{ width: "100%", background: "#1E293B", border: fname && !nameOk ? "1px solid #EF4444" : "1px solid #374151", borderRadius: "6px", padding: "7px 10px", color: "white", outline: "none", fontFamily: "var(--font-code)", fontSize: "0.78rem" }} />
                    {fname && (
                      <div style={{ fontSize: "0.68rem", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ color: nameOk ? "#22C55E" : "#EF4444" }}>{hasSpace ? "Spaces not allowed" : hasSpec ? "No special chars" : "Valid name"}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#9CA3AF", fontWeight: 600, marginBottom: "4px", fontSize: "0.72rem" }}>Path</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                      {["C:\\Desktop", "C:\\Downloads", "C:\\Program Files", "D:\\TRPL\\Proyek"].map(p => (
                        <button key={p} onClick={() => selectPath(p)} style={{ background: spath === p ? "rgba(255,107,0,0.08)" : "#1E293B", border: spath === p ? "1.5px solid var(--color-primary-500)" : "1px solid #374151", padding: "6px", borderRadius: "4px", color: "white", textAlign: "left", cursor: "pointer", fontSize: "0.68rem", fontFamily: "var(--font-code)", transition: "all 0.15s ease" }}>{p}</button>
                      ))}
                    </div>
                    {spath && <div style={{ fontSize: "0.68rem", marginTop: "4px", color: pathOk ? "#22C55E" : "#EF4444" }}>{fb}</div>}
                  </div>
                  <motion.button
                    whileHover={allOk ? { scale: 1.02 } : {}}
                    whileTap={allOk ? { scale: 0.98 } : {}}
                    disabled={!allOk} onClick={() => setCreated(true)}
                    style={{ background: allOk ? "var(--color-primary-500)" : "#374151", color: allOk ? "white" : "#9CA3AF", border: "none", borderRadius: "6px", padding: "8px", fontWeight: 700, cursor: allOk ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <CheckCircle size={14} /> Create
                  </motion.button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ color: "#22C55E", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle size={16} weight="fill" /> Created</span>
                  <div style={{ background: "#0B1121", border: "1px solid #1E293B", padding: "10px", borderRadius: "6px", fontFamily: "var(--font-code)", fontSize: "0.72rem", color: "#e5e7eb", lineHeight: 1.6 }}>
                    <div style={{ color: "#FF8C42" }}>{spath}\{fname}\</div>
                    <div style={{ color: "#6B7280" }}>├── .vscode/</div>
                    <div style={{ color: "#D4D4D4" }}>├── main.py</div>
                    <div style={{ color: "#D4D4D4" }}>└── readme.md</div>
                  </div>
                  <button onClick={() => { setCreated(false); setFname(""); setSpath(""); setFb(""); }} style={{ background: "transparent", border: "1px solid #374151", color: "#9CA3AF", padding: "6px", borderRadius: "4px", cursor: "pointer", fontSize: "0.68rem" }}>Reset</button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const sandboxScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={heroRef} style={{ minHeight: "100dvh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "6rem", background: "var(--bg-page)" }}>
      {/* Dot-grid texture */}
      <div className="dot-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Floating decorative text — pure CSS, no JS scroll listener */}
      <div className="float-text" style={{ position: "absolute", top: "15%", right: "5%", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary-500)", opacity: 0.06, fontFamily: "var(--font-code)", lineHeight: 1, letterSpacing: "0.3em", pointerEvents: "none", userSelect: "none" }}>Hello World!</div>
      <div className="float-text" style={{ position: "absolute", bottom: "25%", left: "3%", fontSize: "0.95rem", fontWeight: 600, color: "var(--color-primary-400)", opacity: 0.05, fontFamily: "var(--font-code)", lineHeight: 1, animationDelay: "-2.5s", pointerEvents: "none", userSelect: "none" }}>print("Halo TRPL!")</div>

      {/* Scroll-driven glow parallax */}
      <div style={{ position: "absolute", top: "-300px", right: "-200px", width: "800px", height: "800px", background: "radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)", opacity: 0.05, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-200px", left: "-100px", width: "500px", height: "500px", background: "radial-gradient(circle, var(--color-primary-400) 0%, transparent 70%)", opacity: 0.035, pointerEvents: "none" }} />

      <div className="section-container" style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-12)", alignItems: "center" }} className="hero-grid">
          <motion.div style={{ opacity: heroOpacity }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} style={{ marginBottom: "var(--space-6)" }}>
              <span className="badge badge-primary">
                <Sparkle size={12} weight="fill" />
                Matrikulasi TRPL 2026
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h1 className="headline-float" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-6)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Coding itu{" "}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="rgb-text"
                style={{
                  display: "inline-block",
                  fontStyle: "italic",
                  letterSpacing: "-0.02em",
                  filter: "drop-shadow(0 0 24px rgba(255,107,0,0.3))",
                }}
              >
                seru
              </motion.span>
              .{" "}
              <span className="gradient-text" style={{ display: "block" }}>Percaya deh.</span>
            </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "var(--space-8)", maxWidth: "480px" }}
            >
              Platform belajar pemrograman interaktif untuk maba TRPL yang{" "}
              <strong className="rgb-text" style={{ fontWeight: 700, display: "inline-block" }}>anti-boring</strong>.
              Live coding, gamifikasi, kuis seru, dan meme yang not-cringe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", marginBottom: "var(--space-5)" }}
            >
              <Button href="/login" variant="primary" size="lg">
                Mulai Belajar <ArrowRight size={18} weight="bold" />
              </Button>
              <Button href="#kurikulum" variant="secondary" size="lg">
                Lihat Kurikulum
              </Button>
            </motion.div>

            <ColorSwitcher />
          </motion.div>

          <motion.div className="hero-visual" style={{ scale: sandboxScale }}>
            <HeroSandbox />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}
      >
        <span>Scroll</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: "1.5px", height: "24px", background: "linear-gradient(to bottom, var(--color-primary-500), transparent)" }} />
      </motion.div>
    </section>
  );
}

/* ============================================================
   TRUST BAR
   ============================================================ */
export function TrustBarSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      style={{ padding: "var(--space-5) 0", background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}
    >
      <div className="section-container">
        <motion.div className="trustbar-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: false }} style={{ display: "flex", justifyContent: "center", gap: "var(--space-12)", flexWrap: "wrap" }}>
          {[
            { icon: <Code size={14} />, label: "7 Modul Coding" },
            { icon: <Trophy size={14} />, label: "13 Badge Eksklusif" },
            { icon: <Lightning size={14} />, label: "Live Code Editor" },
          ].map((item) => (
            <motion.div key={item.label} variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500 }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--color-primary-500)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   FEATURES — Glass premium cards with staggered showcase
   ============================================================ */
const features = [
  {
    icon: <Code size={24} weight="duotone" />, title: "Live Code Editor",
    desc: "Tulis dan jalankan kode Python langsung di browser. Lengkap dengan console output real-time dan preview.",
    color: "var(--color-primary-500)", gradient: "linear-gradient(135deg, rgba(123,31,162,0.06), transparent)",
  },
  {
    icon: <GameController size={24} weight="duotone" />, title: "Gamifikasi Seru",
    desc: "Kumpulkan XP, unlock 13 badge eksklusif, naiki 6 level, dan bersaing di leaderboard kelas. Setiap modul adalah quest.",
    color: "var(--color-secondary-500)", gradient: "linear-gradient(135deg, rgba(126,87,194,0.06), transparent)",
  },
  {
    icon: <Brain size={24} weight="duotone" />, title: "Adaptive Learning",
    desc: "Platform menyesuaikan dengan kecepatan belajarmu. Sudah paham? Langsung skip. Masih bingung? Ada penjelasan ulang otomatis.",
    color: "#22C55E", gradient: "linear-gradient(135deg, rgba(34,197,94,0.06), transparent)",
  },
  {
    icon: <Rocket size={24} weight="duotone" />, title: "Meme Integration",
    desc: "Dapatkan meme pemrograman relevan setiap kali menyelesaikan tantangan. Belajar coding sambil terkekeh.",
    color: "#FF8C42", gradient: "linear-gradient(135deg, rgba(255,140,66,0.06), transparent)",
  },
];

export function FeaturesSection() {
  const [memeIdx, setMemeIdx] = useState(0);
  const memePool = getRandomMemes("M8", 5);

  useEffect(() => {
    if (memePool.length < 2) return;
    const t = setInterval(() => setMemeIdx(i => (i + 1) % memePool.length), 2500);
    return () => clearInterval(t);
  }, [memePool.length]);

  const featureVariants = (i: number) => i % 2 === 0 ? fadeLeft : fadeRight;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      className="section-padding"
      style={{ padding: "var(--space-20) 0", background: "var(--bg-page)", position: "relative", overflow: "hidden" }}
    >
      <div className="dot-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      <div className="float-text" style={{ position: "absolute", top: "8%", left: "4%", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary-500)", opacity: 0.06, fontFamily: "var(--font-code)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>try:</div>
      <div className="float-text" style={{ position: "absolute", bottom: "10%", right: "5%", fontSize: "1.2rem", fontWeight: 700, color: "var(--color-primary-400)", opacity: 0.05, fontFamily: "var(--font-code)", lineHeight: 1, animationDelay: "-2.5s", pointerEvents: "none", userSelect: "none" }}>except ValueError:</div>

      <div style={{ position: "absolute", top: "20%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)", opacity: 0.025, pointerEvents: "none" }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "var(--space-14)" }}
        >
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-4)" }}>
            <Sparkle size={12} weight="fill" />
            Fitur Interaktif
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-3)" }}>
            Bukan sekedar <span className="gradient-text">baca materi doang</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "560px", margin: "var(--space-4) auto 0", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Kamu bisa langsung praktek kode Python dan simulasi folder workspace tanpa install apa-apa.
          </p>
        </motion.div>

        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={featureVariants(i)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.01, boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--border-color)",
                  padding: "var(--space-6)",
                  height: "100%",
                  transition: "all 0.25s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  perspective: "800px",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: f.color, opacity: 0.3 }} />
                <div style={{ width: "52px", height: "52px", borderRadius: "var(--radius-md)", background: `${f.color}10`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: "var(--space-4)", border: `1px solid ${f.color}15` }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>

                {f.title === "Meme Integration" && memePool.length > 0 && (
                  <motion.div
                    key={memeIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginTop: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "#0F172A", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.06)", color: "white", fontSize: "0.82rem", fontWeight: 600, textAlign: "center" }}
                  >
                    <span style={{ fontSize: "1.2rem", display: "block", marginBottom: "2px" }}>{memePool[memeIdx].emoji}</span>
                    {memePool[memeIdx].caption}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   CURRICULUM — Module grid + stats
   ============================================================ */
export function CurriculumSection() {
  const mods = MODULES_META.map((m, i) => ({
    ...m, num: parseInt(m.code.replace("M", "")),
    desc: m.id === "M0" ? "Kenalan sama platform dan test kemampuan awal" :
          m.id === "M1" ? "Manajemen File System, path, setup Python & VS Code" :
          m.id === "M2" ? "Berpikir kayak programmer dengan flowchart & pseudo-code" :
          m.id === "M3" ? "Variabel, integer, string, boolean di Python" :
          m.id === "M4" ? "if, elif, else - buat program yang bisa berpikir" :
          m.id === "M5" ? "for loop, while loop - otomasi yang mengubah segalanya" :
          m.id === "M6" ? "DRY principle - tulis sekali, pakai berkali-kali" :
          m.id === "M7" ? "Simpan banyak data dalam satu variabel" :
          "Integrasikan semua yang dipelajari jadi program nyata",
  }));

  const totalHours = MODULES_META.reduce((acc, m) => {
    const d = m.duration;
    if (d.includes("mnt")) return acc + parseInt(d) / 60;
    if (d.includes("jam")) return acc + parseFloat(d);
    return acc + 2;
  }, 0);
  const totalXP = MODULES_META.length * 130;

  return (
    <motion.section
       id="kurikulum"
      className="section-padding"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      style={{ padding: "var(--space-20) 0", background: "var(--bg-page-alt)", position: "relative", overflow: "hidden" }}
    >
      <div className="dot-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025 }} />

      <div className="float-text" style={{ position: "absolute", bottom: "6%", right: "5%", fontSize: "1rem", fontWeight: 700, color: "var(--color-primary-500)", opacity: 0.06, fontFamily: "var(--font-code)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>MODULES = 9</div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)", opacity: 0.03, pointerEvents: "none" }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          style={{ textAlign: "center", marginBottom: "var(--space-12)" }}
        >
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-3)" }}>
            Dari nol hingga <span className="gradient-text">bikin program sendiri</span>
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "480px", margin: "var(--space-3) auto 0", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {MODULES_META.length} modul &middot; ~{totalHours.toFixed(1)} jam &middot; {totalXP} XP tersedia
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {mods.map((m, i) => (
            <motion.div
              key={m.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              style={{ display: "flex", gap: "var(--space-5)", padding: "var(--space-4) 0", borderBottom: i < mods.length - 1 ? "1px solid var(--border-color)" : "none" }}
            >
              <div style={{ width: "48px", flexShrink: 0, paddingTop: "2px" }}>
                <div style={{ fontFamily: "var(--font-code)", fontSize: "1.15rem", fontWeight: 700, color: m.color, lineHeight: 1 }}>{String(m.num).padStart(2, "0")}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginBottom: "2px" }}>
                  <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: 600 }}>{m.title}</h4>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{m.duration}</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   GAMIFICATION — Level + Badges
   ============================================================ */
const levels = [
  { name: "Script Kiddie", range: "0-99 XP", icon: <EggCrack size={18} weight="fill" color="#FF9D00" />, active: false },
  { name: "Code Padawan", range: "100-249 XP", icon: <Lightning size={18} weight="fill" color="#FF8C42" />, active: false },
  { name: "Developer Muda", range: "250-499 XP", icon: <Laptop size={18} weight="fill" color="#06B6D4" />, active: true },
  { name: "Code Warrior", range: "500-799 XP", icon: <Brain size={18} weight="fill" color="#EF4444" />, active: false },
  { name: "Algorithm Master", range: "800-1099 XP", icon: <Trophy size={18} weight="fill" color="#D45900" />, active: false },
  { name: "TRPL Legend", range: "1100+ XP", icon: <Rocket size={18} weight="fill" color="#FF6B00" />, active: false },
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

export function GamificationSection() {
  return (
    <motion.section
       className="section-padding"
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       viewport={{ once: false }}
       style={{ padding: "var(--space-20) 0", background: "var(--bg-page-alt)", position: "relative", overflow: "hidden" }}
     >
       <div className="dot-grid" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025 }} />

       <div className="float-text" style={{ position: "absolute", top: "10%", right: "6%", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary-400)", opacity: 0.06, fontFamily: "var(--font-code)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>Level UP!</div>

      <div style={{ position: "absolute", top: "30%", left: "-5%", width: "400px", height: "400px", background: "radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)", opacity: 0.025, pointerEvents: "none" }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          style={{ textAlign: "center", marginBottom: "var(--space-12)" }}
        >
          <span className="badge badge-primary" style={{ marginBottom: "var(--space-4)" }}>
            <GameController size={12} weight="fill" />
            Sistem Gamifikasi
          </span>
          <h2 style={{ color: "var(--text-primary)", marginTop: "var(--space-3)" }}>
            Belajar itu kayak <span className="gradient-text">main game. Serius.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "var(--space-4) auto 0", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Setiap modul selesai = poin naik, badge unlock, level naik. Ada leaderboard buat kompetisi sehat antar maba.
          </p>
        </motion.div>

        <div className="gamification-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", alignItems: "start" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.45 }}
          >
            <h3 style={{ color: "var(--text-primary)", marginBottom: "var(--space-5)", fontSize: "1.0625rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Rocket size={18} color="var(--color-primary-500)" weight="fill" />
              Level Progression
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {levels.map((lv, i) => (
                <motion.div
                  key={lv.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.04 }}
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    style={{
                      background: lv.active ? "linear-gradient(135deg, rgba(123,31,162,0.06), rgba(126,87,194,0.03))" : "var(--bg-card)",
                      borderRadius: "var(--radius-md)",
                      border: lv.active ? "1.5px solid var(--color-primary-500)" : "1px solid var(--border-color)",
                      padding: "var(--space-3) var(--space-4)",
                      display: "flex", alignItems: "center", gap: "var(--space-3)",
                      boxShadow: lv.active ? "0 4px 16px rgba(123,31,162,0.08)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ display: "flex", width: "24px", height: "24px", flexShrink: 0, alignItems: "center", justifyContent: "center" }}>{lv.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: lv.active ? "var(--color-primary-600)" : "var(--text-primary)", fontSize: "0.875rem" }}>{lv.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>{lv.range}</div>
                    </div>
                    {lv.active && (
                      <span style={{ fontSize: "0.58rem", background: "var(--gradient-hero)", color: "white", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                        LIVE
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <h3 style={{ color: "var(--text-primary)", marginBottom: "var(--space-5)", fontSize: "1.0625rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <Trophy size={18} color="var(--color-primary-500)" weight="fill" />
              Badge Collection ({badges.length})
            </h3>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="badge-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-2)" }}
            >
              {badges.map((b, i) => (
                <motion.div key={b.name} variants={fadeUp}>
                  <motion.div
                    whileHover={{ y: -3, boxShadow: `0 6px 20px ${b.color}15` }}
                    style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: `1px solid ${b.color}15`, padding: "var(--space-3)", textAlign: "center", cursor: "default", transition: "all 0.2s ease" }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "3px" }}>
                      <BadgeIcon id={b.id} color={b.color} size={34} />
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "var(--text-secondary)", lineHeight: 1.3, fontWeight: 500 }}>{b.name}</div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   CTA
   ============================================================ */
export function CTASection() {
  return (
    <motion.section
       className="section-padding"
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       viewport={{ once: false }}
       style={{ padding: "var(--space-20) 0", position: "relative", overflow: "hidden", background: "var(--bg-dark)" }}
     >
       {/* Animated gradient orbs */}
      <div className="orb-slow" style={{ position: "absolute", top: "20%", right: "15%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(123,31,162,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="orb-slow" style={{ position: "absolute", bottom: "10%", left: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="orb-slow" style={{ position: "absolute", top: "50%", left: "50%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(206,147,216,0.06) 0%, transparent 70%)", pointerEvents: "none", transform: "translate(-50%,-50%)" }} />

      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(123,31,162,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "var(--gradient-hero)" }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-5)" }}
          >
            <div style={{ width: "68px", height: "68px", borderRadius: "var(--radius-lg)", background: "linear-gradient(135deg, rgba(123,31,162,0.2), rgba(255,107,0,0.08))", border: "1.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#E1BEE7" }}>
              <Rocket size={32} weight="fill" />
            </div>
          </motion.div>

          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "#FFFAF6", marginBottom: "var(--space-4)" }}>
            Matrikulasi tahun ini,{" "}
            <span className="gradient-text">beda.</span>
          </h2>
          <p style={{ color: "rgba(255,250,246,0.6)", maxWidth: "520px", margin: "0 auto var(--space-8)", fontSize: "1.0625rem", lineHeight: 1.75 }}>
            Izinkan kami mengubah matrikulasi TRPL menjadi pengalaman yang diingat seumur hidup. Mulai sekarang, gratis.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.15 }}
            className="cta-buttons"
            style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Button href="/login" variant="primary" size="lg">
              Daftar Sekarang &mdash; Gratis <ArrowRight size={18} weight="bold" />
            </Button>
            <a href="#tentang" style={{ display: "inline-flex", alignItems: "center", padding: "var(--space-4) var(--space-8)", borderRadius: "var(--radius-full)", border: "1.5px solid rgba(255,250,246,0.2)", color: "rgba(255,250,246,0.85)", textDecoration: "none", fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "1.0625rem", transition: "all 0.25s ease" }}>
              Pelajari Lebih Lanjut
            </a>
          </motion.div>

          <p style={{ marginTop: "var(--space-6)", color: "rgba(255,250,246,0.35)", fontSize: "0.85rem" }}>
            Login dengan SSO kampus &bull; Tidak perlu buat akun baru &bull; 100% gratis
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ============================================================
   ENGINEER
   ============================================================ */
export function EngineerSection() {
  return (
    <section style={{ padding: "var(--space-14) 0 var(--space-10)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 80%, rgba(123,31,162,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: false }} style={{ width: "48px", height: "1.5px", background: "var(--gradient-hero)", margin: "0 auto var(--space-5)", borderRadius: "2px", transformOrigin: "center" }} />

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: "var(--space-2)" }}>Dibuat Oleh</motion.p>
          <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.375rem)", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Felich Pehagasa Ginting</motion.h3>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.08 }} style={{ color: "var(--text-secondary)", fontSize: "0.78rem", marginTop: "2px" }}>Software Engineer &bull; AI Enthusiast &bull; D4 TRPL</motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.12 }}
            style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "var(--space-5)" }}
          >
            {[
              { href: "https://github.com/felichpehagasaginting-code", label: "GitHub", path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" },
              { href: "https://www.linkedin.com/in/felich-pehagasa-ginting", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              { href: "https://www.instagram.com/fel.comp", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
              { href: "https://felich.dev", label: "Portfolio", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
            ].map(({ href, label, path }) => (
              <motion.a key={label} whileHover={{ y: -3 }} href={href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "50%", background: "var(--bg-page-alt)", border: "1px solid var(--border-color)", color: "var(--text-muted)", textDecoration: "none", cursor: "pointer", transition: "all 0.2s ease" }} title={label}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d={path} /></svg>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.18 }}
            style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "var(--space-6)" }}
          >
            {[1, 2].map((i) => (
              <div key={i} style={{ width: "110px", padding: "var(--space-3) var(--space-2)", borderRadius: "var(--radius-md)", border: "1.5px dashed var(--border-color)", background: "var(--bg-page-alt)", textAlign: "center", opacity: 0.5 }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-neutral-150)", margin: "0 auto var(--space-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>?</div>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)" }}>Anggota {i}</p>
                <p style={{ fontSize: "0.58rem", color: "var(--text-muted)", marginTop: "1px", opacity: 0.6 }}>Data menyusul</p>
              </div>
            ))}
          </motion.div>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} style={{ color: "var(--text-muted)", fontSize: "0.62rem", marginTop: "var(--space-5)", opacity: 0.4 }}>Projek Himpunan Mahasiswa TRPL</motion.p>
        </div>
      </div>
    </section>
  );
}
