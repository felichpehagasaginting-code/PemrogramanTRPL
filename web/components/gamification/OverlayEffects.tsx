"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/useGameStore";
import { X, Trophy, Sparkle, Smiley, Rocket } from "@phosphor-icons/react";
import { BadgeIcon } from "@/components/ui";
import { fireConfettiBurst } from "@/lib/confetti";

export function OverlayEffects() {
  const {
    badgePopup, levelUpPopup, memePopup,
    closeBadgePopup, closeLevelUpPopup, closeMemePopup,
  } = useGameStore();

  useEffect(() => {
    if (badgePopup.isOpen || levelUpPopup.isOpen) {
      fireConfettiBurst(3000);
    }
  }, [badgePopup.isOpen, levelUpPopup.isOpen]);

  return (
    <AnimatePresence>
      {badgePopup.isOpen && badgePopup.badge && (
        <div key="badge-popup" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(28, 10, 0, 0.45)", backdropFilter: "blur(8px)", padding: "20px" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }} transition={{ type: "spring", damping: 15, stiffness: 200 }}
            style={{ background: "var(--bg-card)", border: "2px solid var(--color-primary-400)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-glow), var(--shadow-lg)", width: "100%", maxWidth: "400px", padding: "var(--space-6)", position: "relative", textAlign: "center" }}
          >
            <button onClick={closeBadgePopup} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
            <div style={{ width: "80px", height: "80px", margin: "0 auto var(--space-4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BadgeIcon id={badgePopup.badge.id} color={badgePopup.badge.color} size={80} />
            </div>
            <span className="badge badge-primary" style={{ marginBottom: "var(--space-2)" }}><Trophy size={12} weight="fill" /> BADGE BARU UNLOCKED!</span>
            <h3 style={{ fontSize: "1.25rem", color: "var(--text-primary)", fontWeight: 700, margin: "8px 0" }}>{badgePopup.badge.name}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "var(--space-4)" }}>{badgePopup.badge.description}</p>
            <div style={{ background: "var(--bg-page-alt)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", color: "var(--color-primary-600)", fontWeight: 700, fontSize: "0.875rem" }}>✨ +50 Poin XP Bonus didapatkan!</div>
          </motion.div>
        </div>
      )}

      {levelUpPopup.isOpen && (
        <div key="level-up" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(28, 10, 0, 0.55)", backdropFilter: "blur(10px)", padding: "20px" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }} transition={{ type: "spring", damping: 15, stiffness: 200 }}
            style={{ background: "var(--gradient-hero)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-glow), var(--shadow-lg)", width: "100%", maxWidth: "400px", padding: "var(--space-8)", position: "relative", textAlign: "center", color: "white" }}
          >
            <button onClick={closeLevelUpPopup} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}><X size={20} /></button>
            <motion.div animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }} style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-3)" }}>
              <Rocket size={72} color="white" weight="fill" />
            </motion.div>
            <h2 style={{ fontSize: "1.75rem", fontFamily: "var(--font-heading)", fontWeight: 800, color: "#FFF8F2", marginBottom: "8px" }}>Level Up!</h2>
            <p style={{ color: "rgba(255,250,246,0.8)", fontSize: "0.9375rem", marginBottom: "var(--space-6)" }}>
              Keren! Level kamu naik dari <strong style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.6)" }}>{levelUpPopup.oldLevel}</strong> menjadi:
            </p>
            <div style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", fontSize: "1.25rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <Sparkle size={22} weight="fill" /> {levelUpPopup.newLevel}
            </div>
          </motion.div>
        </div>
      )}

      {memePopup.isOpen && (
        <div key="meme-popup" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(28, 10, 0, 0.5)", backdropFilter: "blur(6px)", padding: "20px" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", width: "100%", maxWidth: "480px", padding: "var(--space-6)", position: "relative", textAlign: "center" }}
          >
            <button onClick={closeMemePopup} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
            <span className="badge badge-success" style={{ marginBottom: "var(--space-4)" }}><Smiley size={12} weight="fill" /> YAY! SUBMIT BERHASIL</span>
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", border: "2.5px solid var(--text-primary)", background: "#000", width: "100%", maxHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-4)" }}>
              <div style={{ color: "white", padding: "20px", fontFamily: "var(--font-heading)", fontWeight: 800, textTransform: "uppercase", fontSize: "1.1rem" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><Smiley size={48} color="#FF6B00" weight="fill" /></div>
                {memePopup.caption}
              </div>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5 }}>Tugas coding selesai dengan sempurna. Kamu berhak mendapatkan meme penyemangat!</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
