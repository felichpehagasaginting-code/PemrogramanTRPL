"use client";

import { useEffect, useState } from "react";
import { WifiSlash, WifiHigh } from "@phosphor-icons/react";

export function PWARegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Service Worker registered successfully with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("Service Worker registration failed:", err);
          });
      });
    }

    // Network connectivity status handlers
    const handleOnline = () => {
      setIsOffline(false);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowToast(true);
    };

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  if (!showToast && !isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: isOffline ? "rgba(220, 38, 38, 0.95)" : "rgba(16, 185, 129, 0.95)",
        color: "#ffffff",
        padding: "8px 16px",
        borderRadius: "24px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.82rem",
        fontWeight: 600,
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
      }}
    >
      {isOffline ? (
        <>
          <WifiSlash size={16} weight="bold" />
          <span>Mode Offline aktif &bull; Pyodide &amp; Sandbox dapat dijalankan dari cache lokal</span>
        </>
      ) : (
        <>
          <WifiHigh size={16} weight="bold" />
          <span>Koneksi pulih &bull; Data tersinkronisasi kembali</span>
        </>
      )}
    </div>
  );
}
