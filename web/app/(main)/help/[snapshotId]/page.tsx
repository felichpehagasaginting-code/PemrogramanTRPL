"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lifebuoy, ArrowLeft, Play, Copy, Check, Terminal, Warning, Sparkle } from "@phosphor-icons/react";
import Editor from "@monaco-editor/react";

export default function HelpSnapshotPage() {
  const params = useParams();
  const router = useRouter();
  const snapshotId = params.snapshotId as string;

  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const res = await fetch(`/api/help/create-snapshot?id=${snapshotId}`);
        const data = await res.json();
        if (data.success && data.snapshot) {
          setSnapshot(data.snapshot);
        } else {
          setError(data.error || "Snapshot tidak ditemukan.");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat snapshot.");
      } finally {
        setLoading(false);
      }
    }
    fetchSnapshot();
  }, [snapshotId]);

  const handleCopyCode = () => {
    if (!snapshot?.code) return;
    navigator.clipboard.writeText(snapshot.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="section-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Memuat cuplikan kode diskusi...</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="section-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <Warning size={48} color="#EF4444" style={{ margin: "0 auto 16px" }} />
        <h2 style={{ color: "var(--text-primary)" }}>Cuplikan Kode Tidak Ditemukan</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px", marginBottom: "20px" }}>
          {error || "Tautan bantuan ini mungkin sudah kadaluarsa atau tidak valid."}
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <Link href="/dashboard" className="btn btn-secondary" style={{ gap: "6px" }}>
          <ArrowLeft size={16} />
          Kembali ke Dashboard
        </Link>
        <div className="badge badge-primary" style={{ gap: "6px" }}>
          <Lifebuoy size={14} weight="fill" />
          Modul {snapshot.moduleId}
        </div>
      </div>

      {/* Hero Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              Cuplikan Diskusi Kode: {snapshot.authorName}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
              Dibuat pada: {new Date(snapshot.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link
              href={`/sandbox?code=${encodeURIComponent(snapshot.code)}`}
              className="btn btn-primary"
              style={{ gap: "6px", textDecoration: "none" }}
            >
              <Play size={16} weight="bold" />
              Uji di Sandbox IDE
            </Link>
            <button onClick={handleCopyCode} className="btn btn-secondary" style={{ gap: "6px" }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Kode Disalin!" : "Salin Kode"}
            </button>
          </div>
        </div>

        {snapshot.error && (
          <div
            style={{
              marginTop: "16px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              fontSize: "0.85rem",
              color: "#F87171",
            }}
          >
            <strong>Pesan Kendala/Error:</strong>
            <pre style={{ margin: "4px 0 0", fontFamily: "monospace", fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
              {snapshot.error}
            </pre>
          </div>
        )}
      </div>

      {/* Code Editor (Read-Only) */}
      <div
        style={{
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            background: "#1E1E1E",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "monospace" }}>main.py (Read-Only Preview)</span>
          <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Python 3.11</span>
        </div>
        <div style={{ height: "400px" }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={snapshot.code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>

      {/* Mentor Advice Box */}
      <div
        style={{
          marginTop: "24px",
          background: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          display: "flex",
          gap: "12px",
        }}
      >
        <Sparkle size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: "var(--text-primary)", fontSize: "0.95rem" }}>
            Ingin membantu teman atau menguji kode ini?
          </h4>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Kamu bisa menyalin kodingan ini ke <strong>Sandbox IDE</strong> milikmu untuk mencoba mencari letak bug atau memberikan saran perbaikan logikanya!
          </p>
        </div>
      </div>
    </div>
  );
}
