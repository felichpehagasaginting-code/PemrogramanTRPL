"use client";

import React, { useState, useEffect } from "react";
import { Warning, Info, X, Megaphone } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { BroadcastData } from "@/app/api/admin/broadcast/route";

export function BroadcastBanner() {
  const [broadcast, setBroadcast] = useState<BroadcastData | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchBroadcast = async () => {
      try {
        const res = await fetch("/api/admin/broadcast");
        if (res.ok) {
          const data = await res.json();
          if (data.broadcast && data.broadcast.isActive) {
            const dismissedId = sessionStorage.getItem("dismissed_broadcast_id");
            if (dismissedId !== data.broadcast.id) {
              setBroadcast(data.broadcast);
            }
          }
        }
      } catch {
        // ignore offline
      }
    };

    fetchBroadcast();
  }, []);

  const handleDismiss = () => {
    if (broadcast) {
      sessionStorage.setItem("dismissed_broadcast_id", broadcast.id);
    }
    setIsDismissed(true);
  };

  if (!broadcast || !broadcast.isActive || isDismissed) {
    return null;
  }

  const isUrgent = broadcast.type === "urgent";
  const isWarning = broadcast.type === "warning";
  const accentColor = isUrgent ? "#EF4444" : isWarning ? "#F59E0B" : "#38BDF8";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          background: isUrgent
            ? "linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.2) 100%)"
            : isWarning
            ? "linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.2) 100%)"
            : "linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0.2) 100%)",
          borderBottom: `1.5px solid ${accentColor}`,
          position: "relative",
          zIndex: 89,
        }}
      >
        <div
          className="section-container"
          style={{
            padding: "8px var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            fontSize: "0.825rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <span
              style={{
                color: accentColor,
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {isUrgent ? <Warning size={18} weight="fill" /> : isWarning ? <Warning size={18} weight="fill" /> : <Megaphone size={18} weight="fill" />}
            </span>
            <span style={{ fontWeight: 800, color: "var(--text-primary)" }}>
              {broadcast.title}:
            </span>
            <span style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {broadcast.message}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Tutup pengumuman"
            className="btn btn-sm btn-ghost"
            style={{
              padding: "4px",
              color: "var(--text-muted)",
              borderRadius: "50%",
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
