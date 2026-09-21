"use client";

import React, { useState, useEffect } from "react";
import { Warning, X, Megaphone } from "@phosphor-icons/react";
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

  // Clean title removing any emoji prefix
  const cleanTitle = broadcast.title.replace(/^[\p{Emoji}\s]+/gu, "").trim();

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
          overflow: "hidden",
        }}
      >
        <div
          className="section-container"
          style={{
            padding: "5px var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            fontSize: "0.78rem",
          }}
        >
          {/* Static Pinned Tag on Left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--bg-card)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-color)",
              flexShrink: 0,
              zIndex: 2,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span
              style={{
                color: accentColor,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {isUrgent ? (
                <Warning size={14} weight="fill" />
              ) : isWarning ? (
                <Warning size={14} weight="fill" />
              ) : (
                <Megaphone size={14} weight="fill" />
              )}
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: "0.72rem",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              {cleanTitle || "Pengumuman"}
            </span>
          </div>

          {/* Smooth Horizontal Marquee Ticker Track */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              maskImage:
                "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
            }}
          >
            <div className="broadcast-ticker-content">
              <span className="ticker-item">
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {broadcast.message}
                </span>
              </span>
              <span className="ticker-item" aria-hidden="true">
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {broadcast.message}
                </span>
              </span>
              <span className="ticker-item" aria-hidden="true">
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {broadcast.message}
                </span>
              </span>
            </div>
          </div>

          {/* Dismiss Button on Right */}
          <button
            onClick={handleDismiss}
            aria-label="Tutup pengumuman"
            className="btn btn-sm btn-ghost"
            style={{
              padding: "3px",
              color: "var(--text-muted)",
              borderRadius: "var(--radius-full)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <X size={13} weight="bold" />
          </button>
        </div>

        <style jsx>{`
          .broadcast-ticker-content {
            display: flex;
            width: max-content;
            animation: tickerScroll 25s linear infinite;
            white-space: nowrap;
          }
          .broadcast-ticker-content:hover {
            animation-play-state: paused;
          }
          .ticker-item {
            display: inline-flex;
            align-items: center;
            padding-right: 48px;
            font-size: 0.78rem;
          }
          @keyframes tickerScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
