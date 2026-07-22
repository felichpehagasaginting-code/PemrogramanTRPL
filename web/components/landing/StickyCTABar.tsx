"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Rocket, ArrowRight } from "@phosphor-icons/react";

export function StickyCTABar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setShow(scrollPercent > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid var(--border-color)",
        borderRadius: "9999px",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FFF", fontSize: "0.875rem", fontWeight: 700 }}>
        <Rocket size={20} color="var(--primary-color)" />
        <span>Siap Mulai Matrikulasi TRPL 2026?</span>
      </div>

      <Link
        href="/login"
        className="btn btn-primary btn-sm"
        style={{
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          textDecoration: "none",
          fontWeight: 800,
        }}
      >
        Mulai Sekarang <ArrowRight size={14} />
      </Link>
    </div>
  );
}
