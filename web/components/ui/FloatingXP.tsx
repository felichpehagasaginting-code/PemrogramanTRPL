"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightning } from "@phosphor-icons/react";

interface FloatingXPProps {
  xp: number;
  show: boolean;
  onComplete?: () => void;
}

export function FloatingXP({ xp, show, onComplete }: FloatingXPProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -60, scale: 1.2 }}
          exit={{ opacity: 0, y: -90, scale: 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          onAnimationComplete={onComplete}
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 99999,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #FF9D00, #FF6B00)",
            color: "#FFF",
            padding: "10px 20px",
            borderRadius: "9999px",
            boxShadow: "0 0 25px rgba(255, 157, 0, 0.8)",
            fontWeight: 800,
            fontSize: "1.25rem",
            fontFamily: "var(--font-heading)",
          }}
        >
          <Lightning size={24} weight="fill" color="#FFD93D" />
          +{xp} XP Diberikan!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
