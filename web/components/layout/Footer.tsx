"use client";

import { memo } from "react";
import Link from "next/link";
import { Code, InstagramLogo, GithubLogo, Heart } from "@phosphor-icons/react";

export const Footer = memo(function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-dark)",
        borderTop: "1px solid rgba(255,107,0,0.15)",
        padding: "var(--space-12) 0 var(--space-8)",
      }}
    >
      <div className="section-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--space-8)",
            marginBottom: "var(--space-8)",
          }}
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "var(--space-4)" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--gradient-hero)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code size={18} color="white" weight="bold" />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "#FFFAF6" }}>
                Matrikulasi <span className="gradient-text">TRPL</span>
              </span>
            </Link>
            <p style={{ color: "rgba(255,250,246,0.6)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "240px" }}>
              Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL. Belajar itu asik, beneran!
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
              {[InstagramLogo, GithubLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="footer-social-icon"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255,107,0,0.12)",
                    border: "1px solid rgba(255,107,0,0.22)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,250,246,0.7)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "0.875rem", color: "rgba(255,250,246,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-4)" }}>
              Platform
            </h4>
            {["Kurikulum", "Live Coding", "Gamifikasi", "Leaderboard"].map((item) => (
              <a
                key={item}
                href="#"
                className="footer-link"
                style={{
                  display: "block",
                  color: "rgba(255,250,246,0.65)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  marginBottom: "var(--space-3)",
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "0.875rem", color: "rgba(255,250,246,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-4)" }}>
              Info
            </h4>
            {["Tentang TRPL", "Hubungi Kami", "FAQ", "Panduan"].map((item) => (
              <a
                key={item}
                href="#"
                className="footer-link"
                style={{
                  display: "block",
                  color: "rgba(255,250,246,0.65)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  marginBottom: "var(--space-3)",
                }}
              >
                {item}
              </a>
            ))}
            <a
              href="https://himaprodi-trpl-cwe.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--color-primary-400)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 700,
                marginTop: "var(--space-2)",
              }}
            >
              <Heart size={14} weight="fill" /> HIMA TRPL
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,107,0,0.1)",
            paddingTop: "var(--space-6)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          <p style={{ color: "rgba(255,250,246,0.55)", fontSize: "0.875rem" }}>
            © 2026 Matrikulasi TRPL. Dibuat dengan{" "}
            <Heart size={14} color="var(--color-primary-400)" weight="fill" style={{ display: "inline", verticalAlign: "middle" }} />{" "}
            oleh Divisi Pemrograman TRPL ·{" "}
            <a href="https://himaprodi-trpl-cwe.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary-400)", textDecoration: "none", fontWeight: 600 }}>
              HIMA TRPL
            </a>
          </p>
          <p style={{ color: "rgba(255,250,246,0.4)", fontSize: "0.8125rem" }}>
            Versi 1.0.0 · Juli 2026
          </p>
        </div>
      </div>
    </footer>
  );
});
