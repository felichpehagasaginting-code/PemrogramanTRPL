"use client";

import React, { useState, useMemo } from "react";
import {
  MagnifyingGlass,
  Warning,
  CheckCircle,
  ShieldCheck,
  Code,
  Users,
  ArrowsLeftRight,
  X,
  FileCode,
  Sparkle,
} from "@phosphor-icons/react";
import {
  CodeSubmission,
  SimilarityMatch,
  runBatchSimilarityAudit,
  computeCodeSimilarity,
  normalizePythonCode,
} from "@/lib/admin/similarityChecker";
import { UserProfile } from "@/lib/store/useUserStore";

interface PlagiarismDetectorProps {
  users: UserProfile[];
}

const MODULES = [
  { id: "M8", name: "M8: Mini Project Kasir Warkop TRPL" },
  { id: "M7", name: "M7: Array & List Belanja" },
  { id: "M6", name: "M6: Fungsi & Perhitungan Diskon" },
  { id: "M5", name: "M5: Perulangan (Loops)" },
  { id: "M4", name: "M4: Percabangan (If-Else KTP/Bioskop)" },
  { id: "M3", name: "M3: Variabel & Tipe Data" },
  { id: "M2", name: "M2: Logika & Algoritma" },
];

export function PlagiarismDetector({ users }: PlagiarismDetectorProps) {
  const [selectedModule, setSelectedModule] = useState<string>("M8");
  const [searchQuery, setSearchQuery] = useState("");
  const [thresholdFilter, setThresholdFilter] = useState<"all" | "high" | "moderate">("all");
  const [selectedDiffPair, setSelectedDiffPair] = useState<{
    subA: CodeSubmission;
    subB: CodeSubmission;
    score: number;
  } | null>(null);

  // Process genuine code submissions from users for selected module
  const submissions: CodeSubmission[] = useMemo(() => {
    const list: CodeSubmission[] = [];
    users.forEach((u) => {
      // Check if user has saved code for this module in progress or local snapshot
      const userMod = u.progress?.[selectedModule];
      if (userMod) {
        // If user submitted or completed the module
        const userCode = (u as any).submittedCode?.[selectedModule] || 
          (userMod.status === "completed" ? `# Kodingan ${u.name} untuk ${selectedModule}\n# Selesai diverifikasi oleh auto-grader` : "");
        
        if (userCode) {
          list.push({
            studentId: u.uid,
            studentName: u.name,
            code: userCode,
          });
        }
      }
    });
    return list;
  }, [users, selectedModule]);

  // Run similarity audit
  const matches: SimilarityMatch[] = useMemo(() => {
    if (submissions.length < 2) return [];
    return runBatchSimilarityAudit(submissions);
  }, [submissions]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchSearch =
        m.studentA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentB.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (thresholdFilter === "high") return m.status === "high_similarity";
      if (thresholdFilter === "moderate") return m.status === "moderate" || m.status === "high_similarity";
      return true;
    });
  }, [matches, searchQuery, thresholdFilter]);

  const highSimilarityCount = matches.filter((m) => m.status === "high_similarity").length;

  const handleOpenDiff = (match: SimilarityMatch) => {
    const subA = submissions.find((s) => s.studentId === match.studentA.id);
    const subB = submissions.find((s) => s.studentId === match.studentB.id);
    if (subA && subB) {
      setSelectedDiffPair({ subA, subB, score: match.similarityScore });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Top Header & Controls */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={24} weight="fill" />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Audit Plagiarisme & Matriks Kesamaan Kode (AST & Levenshtein)
              </h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0 }}>
                Mendeteksi duplikasi kode dan pola copy-paste antar mahasiswa secara otomatis.
              </p>
            </div>
          </div>

          {/* Module Selector Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Pilih Modul:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-md)",
                padding: "6px 12px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Submission Diuji</span>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>{submissions.length} Kodingan</div>
          </div>
          <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pasangan Identik &gt;85%</span>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: highSimilarityCount > 0 ? "#EF4444" : "#10B981" }}>
              {highSimilarityCount} Pasangan
            </div>
          </div>
          <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Metode Normalisasi</span>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary-500)", marginTop: "4px" }}>
              Tokenized Token & Whitespace Collapse
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-page)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "6px 12px", flex: 1, maxWidth: "340px" }}>
            <MagnifyingGlass size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Cari nama mahasiswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "0.825rem", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {(["all", "high", "moderate"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setThresholdFilter(lvl)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-color)",
                  background: thresholdFilter === lvl ? "var(--color-primary-500)" : "var(--bg-secondary)",
                  color: thresholdFilter === lvl ? "#ffffff" : "var(--text-primary)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
              >
                {lvl === "all" ? "Semua Hasil" : lvl === "high" ? "🚨 Kemiripan Tinggi (>85%)" : "⚠️ Kemiripan Sedang (>65%)"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches List Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
        }}
      >
        {filteredMatches.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            <CheckCircle size={36} color="#10B981" weight="fill" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontWeight: 700, margin: 0 }}>Tidak ada indikasi plagiarisme yang mencurigakan!</p>
            <span style={{ fontSize: "0.8rem" }}>Semua mahasiswa menulis kode dengan struktur yang beragam.</span>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px" }}>Mahasiswa A</th>
                  <th style={{ padding: "12px 16px" }}>Mahasiswa B</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Tingkat Kesamaan</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((m, idx) => {
                  const isHigh = m.status === "high_similarity";
                  const badgeColor = isHigh ? "#EF4444" : "#F59E0B";

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        background: idx % 2 === 0 ? "transparent" : "var(--bg-page)",
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {m.studentA.name}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {m.studentB.name}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: badgeColor }}>
                            {m.similarityScore}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: "var(--radius-full)",
                            background: `${badgeColor}15`,
                            color: badgeColor,
                            border: `1px solid ${badgeColor}35`,
                          }}
                        >
                          {isHigh ? "🚨 Sangat Mirip" : "⚠️ Cukup Mirip"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => handleOpenDiff(m)}
                          className="btn btn-sm btn-secondary"
                          style={{
                            fontSize: "0.75rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                          }}
                        >
                          <ArrowsLeftRight size={14} /> Bandingkan Kode
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side-by-Side Code Diff Modal */}
      {selectedDiffPair && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            padding: "20px",
          }}
          onClick={() => setSelectedDiffPair(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "960px",
              maxHeight: "85vh",
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-xl)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ArrowsLeftRight size={20} color="var(--color-primary-500)" />
                <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Perbandingan Kode: {selectedDiffPair.subA.studentName} vs {selectedDiffPair.subB.studentName}
                </h4>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: selectedDiffPair.score >= 85 ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                    color: selectedDiffPair.score >= 85 ? "#EF4444" : "#F59E0B",
                  }}
                >
                  {selectedDiffPair.score}% Kesamaan
                </span>
              </div>

              <button
                onClick={() => setSelectedDiffPair(null)}
                className="btn btn-sm btn-ghost"
                style={{ padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Side-by-Side Panes */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: "var(--border-color)",
                flex: 1,
                overflowY: "auto",
              }}
            >
              {/* Left Pane: Student A */}
              <div style={{ background: "var(--bg-card)", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary-500)" }}>
                  👤 Mahasiswa A: {selectedDiffPair.subA.studentName}
                </span>
                <pre
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    color: "var(--text-primary)",
                    margin: 0,
                    overflowX: "auto",
                    flex: 1,
                    lineHeight: 1.5,
                  }}
                >
                  <code>{selectedDiffPair.subA.code}</code>
                </pre>
              </div>

              {/* Right Pane: Student B */}
              <div style={{ background: "var(--bg-card)", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-primary-500)" }}>
                  👤 Mahasiswa B: {selectedDiffPair.subB.studentName}
                </span>
                <pre
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    color: "var(--text-primary)",
                    margin: 0,
                    overflowX: "auto",
                    flex: 1,
                    lineHeight: 1.5,
                  }}
                >
                  <code>{selectedDiffPair.subB.code}</code>
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "12px 24px",
                borderTop: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <span>💡 Algoritma memeriksa kesamaan AST & Token sintaks tanpa terpengaruh variasi nama variabel atau spasi.</span>
              <button onClick={() => setSelectedDiffPair(null)} className="btn btn-sm btn-primary">
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
