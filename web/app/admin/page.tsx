"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUserStore, BADGES, LEVELS, isAdmin, isStaff, isCreator, isTester } from "@/lib/store/useUserStore";
import { SkeletonAdmin } from "@/components/ui/Skeleton";
import { CreatorBadge } from "@/components/ui";
import {
  ShieldCheck, Users, Trophy, MagnifyingGlass,
  DownloadSimple, ArrowCounterClockwise, PlusCircle, X,
  Student, ChartBar, CheckCircle, LockKey, SignOut, Code,
  PencilSimpleLine, TrashSimple, UserPlus, ArrowLeft, PlayCircle,
  FileText, Table,
} from "@phosphor-icons/react";

import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { StruggleHeatmap } from "@/components/admin/StruggleHeatmap";
import { HelpDeskQueue } from "@/components/admin/HelpDeskQueue";
import { PlagiarismDetector } from "@/components/admin/PlagiarismDetector";
import { BroadcastManager } from "@/components/admin/BroadcastManager";
import { TestCaseEditor } from "@/components/admin/TestCaseEditor";
import { AcademicGradebookModal } from "@/components/admin/AcademicGradebookModal";
import { TestAnswerDetailModal } from "@/components/admin/TestAnswerDetailModal";
import { CodePlaybackPlayer } from "@/components/editor/CodePlaybackPlayer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSessionTimeout } from "@/lib/auth/useSessionTimeout";
import { DosenPinDialpadModal } from "@/components/auth/DosenPinDialpadModal";

const MODULE_LABELS: Record<string, string> = {
  M0: "Pre-Test", M1: "Workspace", M2: "Logika",
  M3: "Variabel", M4: "Percabangan", M5: "Perulangan",
  M6: "Fungsi", M7: "Array", M8: "Mini Project",
};

const INITIAL_FORM = {
  name: "",
  email: "",
  xp: 0,
  role: "maba" as "maba" | "staff" | "tester",
};

const isCreatorAccount = (u: any) => Boolean(u?.isCreator || isCreator({ email: u?.email, name: u?.name }));
const isStaffAccount = (u: any) => Boolean(u?.isStaff || isStaff({ email: u?.email }));
const isTesterAccount = (u: any) => Boolean(u?.isTester || isTester(u));
const isPureMaba = (u: any) => !isTesterAccount(u) && !isCreatorAccount(u) && !isStaffAccount(u);

export default function AdminPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  useSessionTimeout();
  const allUsers = useUserStore((s) => s.allUsers);
  const fetchAllUsers = useUserStore((s) => s.fetchAllUsers);
  const isAllUsersReady = useUserStore((s) => s.isAllUsersReady);
  const resetUserProgress = useUserStore((s) => s.resetUserProgress);
  const awardXP = useUserStore((s) => s.awardXP);
  const addUser = useUserStore((s) => s.addUser);
  const updateUser = useUserStore((s) => s.updateUser);
  const deleteUser = useUserStore((s) => s.deleteUser);
  const subscribeAllUsersRealtime = useUserStore((s) => s.subscribeAllUsersRealtime);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState<"maba2026" | "staff" | "testers" | "all">("maba2026");
  const [statusFilter, setStatusFilter] = useState<"all" | "struggling" | "postTestReady" | "certified">("all");
  const [csvPreviewModalOpen, setCsvPreviewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"users" | "analytics" | "helpdesk" | "plagiarism" | "broadcast" | "testcases">("users");
  const [academicModalOpen, setAcademicModalOpen] = useState(false);
  const [dosenGateModalOpen, setDosenGateModalOpen] = useState(false);
  const [testDetailModalOpen, setTestDetailModalOpen] = useState(false);
  const [testDetailUser, setTestDetailUser] = useState<any | null>(null);
  const [testDetailInitialTab, setTestDetailInitialTab] = useState<"preTest" | "postTest">("preTest");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [awardModal, setAwardModal] = useState<string | null>(null);
  const [awardAmount, setAwardAmount] = useState(50);
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null);
  const [playbackUser, setPlaybackUser] = useState<any | null>(null);
  const [playbackStartTime, setPlaybackStartTime] = useState<number>(0);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const targetUsers = useMemo(() => {
    if (batchFilter === "maba2026") {
      return allUsers.filter((u) => isPureMaba(u));
    }
    if (batchFilter === "staff") {
      return allUsers.filter((u) => isCreatorAccount(u) || isStaffAccount(u));
    }
    if (batchFilter === "testers") {
      return allUsers.filter((u) => isTesterAccount(u));
    }
    return allUsers;
  }, [allUsers, batchFilter]);

  const openTestDetail = (targetUser: any, tab: "preTest" | "postTest" = "preTest") => {
    setTestDetailUser(targetUser);
    setTestDetailInitialTab(tab);
    setTestDetailModalOpen(true);
  };

  useEffect(() => {
    fetchAllUsers().finally(() => setLoading(false));
    const unsubscribe = subscribeAllUsersRealtime();
    return () => {
      unsubscribe();
    };
  }, [fetchAllUsers, subscribeAllUsersRealtime]);

  const resetForm = () => setFormData(INITIAL_FORM);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    const isStaffRole = formData.role === "staff";
    const isTesterRole = formData.role === "tester";
    await addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      xp: Number(formData.xp) || 0,
      isStaff: isStaffRole,
      isTester: isTesterRole,
      batch: isTesterRole ? "2025" : "2026",
    });
    resetForm();
    setAddModal(false);
  };

  const handleEdit = async () => {
    if (!editUser || !formData.name.trim() || !formData.email.trim()) return;
    const isStaffRole = formData.role === "staff";
    const isTesterRole = formData.role === "tester";
    await updateUser(editUser, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      xp: Number(formData.xp) || 0,
      isStaff: isStaffRole,
      isTester: isTesterRole,
      batch: isTesterRole ? "2025" : "2026",
    });
    setEditUser(null);
    resetForm();
  };

  const handleAward = async () => {
    if (!awardModal) return;
    await awardXP(awardModal, awardAmount);
    setAwardModal(null);
  };

  const handleReset = async (uid: string, name: string) => {
    if (!confirm(`Reset semua progres mahasiswa "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    await resetUserProgress(uid);
  };

  const handleDelete = async (uid: string, name: string) => {
    if (!confirm(`Hapus mahasiswa "${name}"? Data akan dihapus permanen.`)) return;
    await deleteUser(uid);
    if (selectedUid === uid) setSelectedUid(null);
  };

  const openEdit = (uid: string) => {
    const target = allUsers.find((u) => u.uid === uid);
    if (!target) return;
    const targetIsStaff = Boolean(target.isStaff || isStaff({ email: target.email }));
    const targetIsTester = Boolean(target.isTester || isTester(target));
    const role: "maba" | "staff" | "tester" = targetIsStaff ? "staff" : targetIsTester ? "tester" : "maba";
    setFormData({
      name: target.name,
      email: target.email,
      xp: target.xp,
      role,
    });
    setEditUser(uid);
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: "20px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", maxWidth: "380px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--gradient-hero)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "var(--shadow-glow-soft)" }}>
            <ShieldCheck size={28} color="white" weight="fill" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>Admin Panel</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-6)" }}>
            Kamu harus login terlebih dahulu.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: "100%", display: "block" }}>Login</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: "20px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "var(--space-8)", maxWidth: "420px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "rgba(168, 85, 247, 0.15)", color: "#A855F7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <ShieldCheck size={32} weight="fill" />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
            Akses Dosen Penguji / Admin TRPL
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-6)", lineHeight: 1.5 }}>
            Halaman ini khusus untuk evaluasi dosen penguji. Masukkan 4-digit PIN khusus Dosen Penguji untuk membuka akses panel admin.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={() => setDosenGateModalOpen(true)}
              className="btn btn-primary"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                fontWeight: 800,
                fontSize: "0.9rem",
              }}
            >
              <ShieldCheck size={18} weight="fill" />
              <span>Masukkan PIN Dosen Penguji</span>
            </button>

            <Link href="/dashboard" className="btn btn-secondary" style={{ width: "100%", display: "block" }}>
              Kembali ke Dasbor
            </Link>
          </div>
        </div>

        <DosenPinDialpadModal
          isOpen={dosenGateModalOpen}
          onClose={() => setDosenGateModalOpen(false)}
        />
      </div>
    );
  }

  if (loading || !isAllUsersReady) return <SkeletonAdmin />;

  const mabaCount = allUsers.filter((u) => isPureMaba(u)).length;
  const staffCount = allUsers.filter((u) => isCreatorAccount(u) || isStaffAccount(u)).length;
  const testerCount = allUsers.filter((u) => isTesterAccount(u)).length;

  const allModuleKeys = Object.keys(MODULE_LABELS);
  const totalStudents = targetUsers.length;
  const totalXP = targetUsers.reduce((s, u) => s + u.xp, 0);
  const avgXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  const completedAll = targetUsers.filter((u) => u.level === "TRPL Legend").length;
  const avgStreak = totalStudents > 0 ? Math.round(targetUsers.reduce((s, u) => s + (u.streak || 0), 0) / totalStudents) : 0;

  const filteredUsers = targetUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;

    const pre = u.tests?.preTest;
    const post = u.tests?.postTest;
    const isCertified = Boolean(
      pre?.completed &&
      allModuleKeys.every((k) => u.progress?.[k]?.status === "completed") &&
      post?.completed
    );

    if (statusFilter === "certified") {
      return isCertified;
    }

    if (statusFilter === "postTestReady") {
      return pre?.completed && !post?.completed;
    }

    if (statusFilter === "struggling") {
      // Selesai pretest tapi stuck di modul 1 atau 2 (kurang dari 3 modul selesai)
      const completedCount = allModuleKeys.filter((k) => u.progress?.[k]?.status === "completed").length;
      return Boolean(pre?.completed && completedCount <= 3 && !post?.completed);
    }

    return true;
  });

  const moduleStats = allModuleKeys.map((key) => {
    const completed = targetUsers.filter((u) => u.progress[key]?.status === "completed").length;
    return { module: key, label: MODULE_LABELS[key], completed, total: totalStudents, pct: totalStudents > 0 ? Math.round((completed / totalStudents) * 100) : 0 };
  });

  const sorted = [...targetUsers].sort((a, b) => b.xp - a.xp);

  const exportCSV = () => {
    const header = [
      "Nama", "Email", "Peran", "XP", "Level", "Streak", "Badges",
      "PreTest_Skor", "PreTest_Pct", "PostTest_Skor", "PostTest_Pct", "Status_Sertifikat",
      ...allModuleKeys.map((k) => MODULE_LABELS[k])
    ];
    const rows = sorted.map((u) => {
      const preTest = u.tests?.preTest;
      const postTest = u.tests?.postTest;
      const isEligibleCert = Boolean(
        preTest?.completed &&
        allModuleKeys.every((k) => u.progress?.[k]?.status === "completed") &&
        postTest?.completed
      );
      const roleStr = isCreatorAccount(u)
        ? "CREATOR"
        : isStaffAccount(u)
        ? "STAFF"
        : isTesterAccount(u)
        ? "PENGUJI_2025"
        : "MABA_2026";

      return [
        `"${u.name.replace(/"/g, '""')}"`,
        u.email,
        roleStr,
        u.xp,
        u.level,
        u.streak || 0,
        u.badges.length,
        preTest?.score ?? "-",
        preTest ? `${preTest.percentage}%` : "-",
        postTest?.score ?? "-",
        postTest ? `${postTest.percentage}%` : "-",
        isEligibleCert ? "LULUS_SERTIFIKAT" : "BELUM_LULUS",
        ...allModuleKeys.map((k) => u.progress[k]?.status || "locked"),
      ];
    });
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `matrikulasi-${batchFilter}-rekap-evaluasi-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const selectedUser = selectedUid ? allUsers.find((u) => u.uid === selectedUid) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      {/* Mini Navbar */}
      <header style={{
        borderBottom: "1px solid var(--border-color)", background: "var(--bg-navbar)",
        backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 90,
      }}>
        <div className="section-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "28px", height: "22px", position: "relative" }}>
                <Image src="/images/logo_kiri_cwe.png" alt="Logo CWE" fill style={{ objectFit: "contain" }} />
              </div>
              <div style={{ width: "20px", height: "20px", position: "relative" }}>
                <Image src="/images/logo_kanan_trpl.png" alt="Logo TRPL" fill style={{ objectFit: "contain" }} />
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              Admin <span className="gradient-text">Panel TRPL</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {totalStudents} mahasiswa
            </span>
            <ThemeToggle />
            <Link
              href="/dashboard"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px", borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-color)", background: "transparent",
                color: "var(--text-primary)", fontWeight: 600, fontSize: "0.8rem",
                textDecoration: "none", cursor: "pointer",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,107,0,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <ArrowLeft size={14} weight="bold" /> Dasbor
            </Link>
          </div>
        </div>
      </header>

      <div className="section-container" style={{ paddingTop: "var(--space-4)" }}>
        {/* Navigation Mode: 3 Major Tabs with Sub-Tool Switches */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => setViewMode("users")}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                borderBottom: viewMode === "users" ? "3px solid var(--color-primary-500)" : "3px solid transparent",
                color: viewMode === "users" ? "var(--color-primary-500)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Users size={16} /> Data Mahasiswa & Rekap
            </button>
            <button
              onClick={() => {
                if (viewMode !== "broadcast" && viewMode !== "helpdesk") {
                  setViewMode("broadcast");
                }
              }}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                borderBottom: (viewMode === "broadcast" || viewMode === "helpdesk") ? "3px solid var(--color-primary-500)" : "3px solid transparent",
                color: (viewMode === "broadcast" || viewMode === "helpdesk") ? "var(--color-primary-500)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ShieldCheck size={16} /> Pusat Siaran & Bantuan
            </button>
            <button
              onClick={() => {
                if (viewMode !== "analytics" && viewMode !== "plagiarism" && viewMode !== "testcases") {
                  setViewMode("analytics");
                }
              }}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "none",
                borderBottom: (viewMode === "analytics" || viewMode === "plagiarism" || viewMode === "testcases") ? "3px solid var(--color-primary-500)" : "3px solid transparent",
                color: (viewMode === "analytics" || viewMode === "plagiarism" || viewMode === "testcases") ? "var(--color-primary-500)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ChartBar size={16} /> Statistik & Evaluasi Ujian
            </button>
          </div>

          {/* Sub-tool Pills for Broadcast Group */}
          {(viewMode === "broadcast" || viewMode === "helpdesk") && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setViewMode("broadcast")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--border-color)",
                  background: viewMode === "broadcast" ? "var(--color-primary-500)" : "var(--bg-card)",
                  color: viewMode === "broadcast" ? "white" : "var(--text-secondary)",
                }}
              >
                📢 Siaran Pengumuman
              </button>
              <button
                onClick={() => setViewMode("helpdesk")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--border-color)",
                  background: viewMode === "helpdesk" ? "var(--color-primary-500)" : "var(--bg-card)",
                  color: viewMode === "helpdesk" ? "white" : "var(--text-secondary)",
                }}
              >
                🆘 Antrean Help Desk
              </button>
            </div>
          )}

          {/* Sub-tool Pills for Evaluation Group */}
          {(viewMode === "analytics" || viewMode === "plagiarism" || viewMode === "testcases") && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => setViewMode("analytics")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--border-color)",
                  background: viewMode === "analytics" ? "var(--color-primary-500)" : "var(--bg-card)",
                  color: viewMode === "analytics" ? "white" : "var(--text-secondary)",
                }}
              >
                📈 Analytics & Heatmap
              </button>
              <button
                onClick={() => setViewMode("plagiarism")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--border-color)",
                  background: viewMode === "plagiarism" ? "var(--color-primary-500)" : "var(--bg-card)",
                  color: viewMode === "plagiarism" ? "white" : "var(--text-secondary)",
                }}
              >
                🔍 Plagiarisme AST
              </button>
              <button
                onClick={() => setViewMode("testcases")}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--border-color)",
                  background: viewMode === "testcases" ? "var(--color-primary-500)" : "var(--bg-card)",
                  color: viewMode === "testcases" ? "white" : "var(--text-secondary)",
                }}
              >
                🧪 Test Cases Grader
              </button>
            </div>
          )}
        </div>

        {viewMode === "plagiarism" ? (
          <PlagiarismDetector users={targetUsers} />
        ) : viewMode === "broadcast" ? (
          <BroadcastManager />
        ) : viewMode === "testcases" ? (
          <TestCaseEditor />
        ) : viewMode === "helpdesk" ? (
          <HelpDeskQueue />
        ) : viewMode === "analytics" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <AnalyticsDashboard users={targetUsers} />
            <StruggleHeatmap users={targetUsers} />
          </div>
        ) : (
          <>
            {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "var(--space-6)" }}>
          <div>
            <span className="badge badge-primary"><ShieldCheck size={12} weight="fill" /> MONITORING</span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "8px" }}>
              Progress Mahasiswa
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Total {totalStudents} akun {
                batchFilter === "maba2026"
                  ? "mahasiswa baru (Angkatan 2026)"
                  : batchFilter === "staff"
                  ? "panitia & staf (Divisi Pemrograman TRPL)"
                  : batchFilter === "testers"
                  ? "penguji awal (Angkatan 2025)"
                  : "terdaftar (seluruh kategori)"
              }
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => setAcademicModalOpen(true)} className="btn btn-sm btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <DownloadSimple size={16} /> 📄 Rekap Nilai & CPL Resmi
            </button>
            <button onClick={() => { resetForm(); setAddModal(true); }} className="btn btn-primary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <UserPlus size={16} /> Tambah Mahasiswa
            </button>
            <button onClick={() => setCsvPreviewModalOpen(true)} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-primary-500)" }} title="Lihat pratinjau tabel sebelum mengunduh CSV">
              <Table size={16} /> Pratinjau CSV
            </button>
            <button onClick={exportCSV} className="btn btn-secondary btn-sm" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <DownloadSimple size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Batch / Angkatan Segmented Filter Tabs */}
        <div
          style={{
            display: "inline-flex",
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: "4px",
            gap: "4px",
            marginBottom: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setBatchFilter("maba2026")}
            style={{
              padding: "7px 16px",
              borderRadius: "calc(var(--radius-lg) - 2px)",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              background: batchFilter === "maba2026" ? "var(--color-primary-500)" : "transparent",
              color: batchFilter === "maba2026" ? "white" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all var(--transition-fast)",
            }}
          >
            <span>🎓 Mahasiswa Baru (2026)</span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: batchFilter === "maba2026" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                color: batchFilter === "maba2026" ? "white" : "var(--text-muted)",
              }}
            >
              {mabaCount}
            </span>
          </button>

          <button
            onClick={() => setBatchFilter("staff")}
            style={{
              padding: "7px 16px",
              borderRadius: "calc(var(--radius-lg) - 2px)",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              background: batchFilter === "staff" ? "#3B82F6" : "transparent",
              color: batchFilter === "staff" ? "white" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all var(--transition-fast)",
            }}
          >
            <span>🛡️ Panitia & Staff</span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: batchFilter === "staff" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                color: batchFilter === "staff" ? "white" : "var(--text-muted)",
              }}
            >
              {staffCount}
            </span>
          </button>

          <button
            onClick={() => setBatchFilter("testers")}
            style={{
              padding: "7px 16px",
              borderRadius: "calc(var(--radius-lg) - 2px)",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              background: batchFilter === "testers" ? "#A855F7" : "transparent",
              color: batchFilter === "testers" ? "white" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all var(--transition-fast)",
            }}
          >
            <span>🧪 Penguji Angkatan 2025</span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: batchFilter === "testers" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                color: batchFilter === "testers" ? "white" : "var(--text-muted)",
              }}
            >
              {testerCount}
            </span>
          </button>

          <button
            onClick={() => setBatchFilter("all")}
            style={{
              padding: "7px 16px",
              borderRadius: "calc(var(--radius-lg) - 2px)",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              background: batchFilter === "all" ? "var(--text-primary)" : "transparent",
              color: batchFilter === "all" ? "var(--bg-card)" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all var(--transition-fast)",
            }}
          >
            <span>🌐 Semua Akun</span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 7px",
                borderRadius: "10px",
                background: batchFilter === "all" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                color: batchFilter === "all" ? "var(--bg-card)" : "var(--text-muted)",
              }}
            >
              {allUsers.length}
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
          {[
            { label: "Total Mahasiswa", value: totalStudents, icon: <Users size={22} />, color: "#06B6D4" },
            { label: "Total XP Kelas", value: totalXP.toLocaleString(), icon: <Trophy size={22} />, color: "#FF6B00" },
            { label: "Rata-rata XP", value: avgXP.toLocaleString(), icon: <ChartBar size={22} />, color: "#FF9D00" },
            { label: "Lulus (Legend)", value: completedAll, icon: <ShieldCheck size={22} />, color: "#22C55E" },
            { label: "Rata-rata Streak", value: `${avgStreak} hari`, icon: <Student size={22} />, color: "#D45900" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "var(--space-5)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ color: stat.color, marginBottom: "6px" }}>{stat.icon}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{stat.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Module Completion Matrix */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", marginBottom: "var(--space-8)" }}>
          <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
            Statistik Penyelesaian Per Modul
          </h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {moduleStats.map((stat) => (
              <div key={stat.module}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                    {stat.module} — {stat.label}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                    {stat.completed}/{stat.total} ({stat.pct}%)
                  </span>
                </div>
                <div style={{ width: "100%", height: "10px", background: "var(--color-neutral-150)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ width: `${stat.pct}%`, height: "100%", borderRadius: "var(--radius-full)", background: stat.pct >= 80 ? "#22C55E" : stat.pct >= 50 ? "#FF9D00" : "#EF4444" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Quick Filter Chips & Table */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", marginBottom: "var(--space-12)" }}>
          <div style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Data Seluruh Mahasiswa
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Menampilkan {filteredUsers.length} dari {totalStudents} mahasiswa
              </span>
            </div>

            {/* Quick Filter Chips (Recommendation 9) */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              {[
                { id: "all", label: "Semua", count: totalStudents, color: "var(--text-secondary)" },
                {
                  id: "struggling",
                  label: "🔴 Perlu Bantuan (M1-M3)",
                  count: targetUsers.filter((u) => u.tests?.preTest?.completed && allModuleKeys.filter((k) => u.progress?.[k]?.status === "completed").length <= 3 && !u.tests?.postTest?.completed).length,
                  color: "#EF4444",
                },
                {
                  id: "postTestReady",
                  label: "🟡 Mengerjakan Post-Test",
                  count: targetUsers.filter((u) => u.tests?.preTest?.completed && !u.tests?.postTest?.completed).length,
                  color: "#F59E0B",
                },
                {
                  id: "certified",
                  label: "🟢 Lulus Lengkap",
                  count: targetUsers.filter((u) => u.tests?.preTest?.completed && allModuleKeys.every((k) => u.progress?.[k]?.status === "completed") && u.tests?.postTest?.completed).length,
                  color: "#22C55E",
                },
              ].map((chip) => {
                const isActive = statusFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setStatusFilter(chip.id as any)}
                    className="focus-ring"
                    style={{
                      background: isActive ? "rgba(255, 107, 0, 0.15)" : "var(--bg-page-alt)",
                      border: `1.5px solid ${isActive ? "var(--color-primary-500)" : "var(--border-color)"}`,
                      color: isActive ? "var(--color-primary-500)" : "var(--text-secondary)",
                      borderRadius: "var(--radius-full)",
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <span>{chip.label}</span>
                    <span style={{ background: "rgba(0,0,0,0.15)", padding: "1px 5px", borderRadius: "10px", fontSize: "0.7rem" }}>
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ position: "relative", width: "240px", maxWidth: "100%" }}>
              <MagnifyingGlass size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text" placeholder="Cari nama / email..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "var(--radius-full)", border: "1.5px solid var(--border-color)", background: "var(--bg-page)", fontSize: "0.85rem", color: "var(--text-primary)", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-page-alt)" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700 }}>#</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700 }}>Nama</th>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700 }}>Email</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>Peran</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>XP</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>Level</th>
                  <th style={{ padding: "10px 8px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem" }} title="Pre-Test (M0)">Pre-Test</th>
                  <th style={{ padding: "10px 8px", textAlign: "center", color: "var(--color-primary-500)", fontWeight: 700, fontSize: "0.75rem" }} title="Post-Test Evaluasi Akhir">Post-Test</th>
                  {allModuleKeys.map((k) => (
                    <th key={k} style={{ padding: "10px 6px", textAlign: "center", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.7rem" }} title={MODULE_LABELS[k]}>{k}</th>
                  ))}
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-muted)", fontWeight: 700 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={18} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Tidak ada data mahasiswa</td></tr>
                ) : (filteredUsers.map((u, i) => {
                  const pre = u.tests?.preTest;
                  const post = u.tests?.postTest;
                  return (
                  <tr
                    key={u.uid}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      cursor: "pointer",
                      background: selectedUid === u.uid ? "rgba(255,107,0,0.06)" : "transparent",
                    }}
                    onClick={() => setSelectedUid(selectedUid === u.uid ? null : u.uid)}
                  >
                    <td style={{ padding: "8px 12px", fontWeight: 800, color: i < 3 ? "#FFD93D" : "var(--text-muted)" }}>#{i + 1}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span>
                          {search.trim() ? (
                            <span>
                              {u.name.split(new RegExp(`(${search})`, "gi")).map((part: string, idx: number) =>
                                part.toLowerCase() === search.toLowerCase() ? (
                                  <mark key={idx} style={{ background: "rgba(255, 107, 0, 0.35)", color: "inherit", borderRadius: "2px", padding: "0 2px" }}>
                                    {part}
                                  </mark>
                                ) : (
                                  part
                                )
                              )}
                            </span>
                          ) : (
                            u.name
                          )}
                        </span>
                        {(Boolean(u.isCreator || isCreator({ email: u.email, name: u.name }))) && (
                          <CreatorBadge size="xs" variant="subtle" />
                        )}
                        {(Boolean(u.isStaff || isStaff({ email: u.email }))) && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: "rgba(59, 130, 246, 0.15)",
                              color: "#3B82F6",
                              fontWeight: 800,
                            }}
                          >
                            🛡️ Staff
                          </span>
                        )}
                        {isTesterAccount(u) && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: "rgba(168, 85, 247, 0.15)",
                              color: "#A855F7",
                              fontWeight: 800,
                            }}
                          >
                            🧪 Penguji 2025
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "8px 12px", color: "var(--text-secondary)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {search.trim() ? (
                        <span>
                          {u.email.split(new RegExp(`(${search})`, "gi")).map((part: string, idx: number) =>
                            part.toLowerCase() === search.toLowerCase() ? (
                              <mark key={idx} style={{ background: "rgba(255, 107, 0, 0.35)", color: "inherit", borderRadius: "2px", padding: "0 2px" }}>
                                {part}
                              </mark>
                            ) : (
                              part
                            )
                          )}
                        </span>
                      ) : (
                        u.email
                      )}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                      {isCreatorAccount(u) ? (
                        <CreatorBadge size="xs" variant="solid" />
                      ) : isStaffAccount(u) ? (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "rgba(59, 130, 246, 0.15)",
                            color: "#3B82F6",
                            fontWeight: 800,
                          }}
                        >
                          🛡️ Staff
                        </span>
                      ) : isTesterAccount(u) ? (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "rgba(168, 85, 247, 0.15)",
                            color: "#A855F7",
                            fontWeight: 800,
                          }}
                        >
                          🧪 Penguji 2025
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "rgba(34, 197, 94, 0.15)",
                            color: "#22C55E",
                            fontWeight: 800,
                          }}
                        >
                          🎓 Maba 2026
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "var(--color-primary-600)" }}>{u.xp}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.75rem" }}>{u.level}</td>
                    
                    {/* Pre-Test Score Badge */}
                    <td style={{ padding: "8px 8px", textAlign: "center", fontSize: "0.75rem" }}>
                      {pre ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTestDetail(u, "preTest");
                          }}
                          style={{
                            background: "rgba(34,197,94,0.12)",
                            border: "1px solid rgba(34,197,94,0.4)",
                            color: "#22C55E",
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                          title="Klik untuk melihat lembar jawaban Pre-Test"
                        >
                          {pre.percentage}% 🔍
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>-</span>
                      )}
                    </td>

                    {/* Post-Test Score Badge */}
                    <td style={{ padding: "8px 8px", textAlign: "center", fontSize: "0.75rem" }}>
                      {post ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTestDetail(u, "postTest");
                          }}
                          style={{
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: post.percentage >= 60 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                            color: post.percentage >= 60 ? "#22C55E" : "#EF4444",
                            border: `1px solid ${post.percentage >= 60 ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                            fontWeight: 800,
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                          title="Klik untuk melihat lembar jawaban Post-Test"
                        >
                          {post.percentage}% 🔍
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>-</span>
                      )}
                    </td>

                    {allModuleKeys.map((k) => {
                      const status = u.progress[k]?.status || "locked";
                      return (
                        <td key={k} style={{ padding: "8px 6px", textAlign: "center" }}>
                          {status === "completed" ? <CheckCircle size={14} weight="fill" color="#22C55E" /> : status === "active" ? <span style={{ color: "#FF9D00", fontSize: "0.8rem" }}>●</span> : <LockKey size={12} color="var(--text-muted)" />}
                        </td>
                      );
                    })}
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setPlaybackStartTime(Date.now() - 60000);
                            setPlaybackUser(u);
                          }}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(59,130,246,0.15)", border: "1px solid #3B82F6", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#60A5FA" }}
                          title="Putar Ulang Ketikan (Replay)"
                        >
                          <PlayCircle size={13} weight="fill" /> Replay
                        </button>
                        <button
                          onClick={() => { setAwardModal(u.uid); setAwardAmount(50); }}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(255,107,0,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "var(--text-primary)" }}
                          title="Beri XP"
                        >
                          <PlusCircle size={12} /> XP
                        </button>
                        <button
                          onClick={() => openEdit(u.uid)}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(6,182,212,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#06B6D4" }}
                          title="Edit"
                        >
                          <PencilSimpleLine size={12} />
                        </button>
                        <button
                          onClick={async () => { if (confirm(`Reset progress ${u.name}?`)) await resetUserProgress(u.uid); }}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(239,68,68,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#FF9D00" }}
                          title="Reset Progress"
                        >
                          <ArrowCounterClockwise size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.uid, u.name)}
                          className="btn btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.7rem", background: "rgba(239,68,68,0.1)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", cursor: "pointer", color: "#EF4444" }}
                          title="Hapus"
                        >
                          <TrashSimple size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
              </tbody>
            </table>
          </div>

          {/* Student Detail Panel */}
          {selectedUser && (
            <div style={{ borderTop: "2px solid var(--color-primary-400)", background: "var(--bg-page-alt)", padding: "var(--space-6)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
                <h4 style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem" }}>
                  Detail: {selectedUser.name}
                </h4>
                <button onClick={() => setSelectedUid(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                <div style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>INFORMASI AKUN</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong>Peran / Kategori:</strong>
                      {isCreatorAccount(selectedUser) ? (
                        <CreatorBadge size="xs" variant="solid" />
                      ) : isStaffAccount(selectedUser) ? (
                        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(59, 130, 246, 0.15)", color: "#3B82F6", fontWeight: 800 }}>
                          🛡️ Staff
                        </span>
                      ) : isTesterAccount(selectedUser) ? (
                        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(168, 85, 247, 0.15)", color: "#A855F7", fontWeight: 800 }}>
                          🧪 Penguji 2025
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(34, 197, 94, 0.15)", color: "#22C55E", fontWeight: 800 }}>
                          🎓 Mahasiswa Baru 2026
                        </span>
                      )}
                    </div>
                    <span><strong>Email:</strong> {selectedUser.email}</span>
                    <span><strong>XP:</strong> {selectedUser.xp}</span>
                    <span><strong>Level:</strong> {selectedUser.level}</span>
                    <span><strong>Streak:</strong> {selectedUser.streak || 0} hari</span>
                  </div>

                  <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-primary-500)", fontWeight: 800 }}>
                        📝 REKAP UJIAN EVALUASI
                      </span>
                      {(selectedUser.tests?.preTest || selectedUser.tests?.postTest) && (
                        <button
                          onClick={() => openTestDetail(selectedUser, selectedUser.tests?.postTest ? "postTest" : "preTest")}
                          className="btn btn-sm btn-primary"
                          style={{ padding: "3px 8px", fontSize: "0.7rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <FileText size={12} /> Buka Lembar Jawaban
                        </button>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.825rem", marginBottom: "6px" }}>
                      <span>Pre-Test Diagnostik:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong style={{ color: selectedUser.tests?.preTest ? "#22C55E" : "var(--text-muted)" }}>
                          {selectedUser.tests?.preTest ? `${selectedUser.tests.preTest.score}/${selectedUser.tests.preTest.totalQuestions} (${selectedUser.tests.preTest.percentage}%)` : "Belum Mengerjakan"}
                        </strong>
                        {selectedUser.tests?.preTest && (
                          <button
                            onClick={() => openTestDetail(selectedUser, "preTest")}
                            style={{
                              background: "rgba(34,197,94,0.12)",
                              border: "1px solid rgba(34,197,94,0.3)",
                              borderRadius: "4px",
                              padding: "1px 5px",
                              cursor: "pointer",
                              color: "#22C55E",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                            title="Lihat Detail Jawaban Pre-Test"
                          >
                            Detail
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.825rem" }}>
                      <span>Post-Test Akhir:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <strong style={{ color: selectedUser.tests?.postTest?.percentage && selectedUser.tests.postTest.percentage >= 60 ? "#22C55E" : selectedUser.tests?.postTest ? "#EF4444" : "var(--text-muted)" }}>
                          {selectedUser.tests?.postTest ? `${selectedUser.tests.postTest.score}/${selectedUser.tests.postTest.totalQuestions} (${selectedUser.tests.postTest.percentage}%)` : "Belum Mengerjakan"}
                        </strong>
                        {selectedUser.tests?.postTest && (
                          <button
                            onClick={() => openTestDetail(selectedUser, "postTest")}
                            style={{
                              background: "rgba(255,107,0,0.12)",
                              border: "1px solid rgba(255,107,0,0.3)",
                              borderRadius: "4px",
                              padding: "1px 5px",
                              cursor: "pointer",
                              color: "var(--color-primary-500)",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                            }}
                            title="Lihat Detail Jawaban Post-Test"
                          >
                            Detail
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>PROGRESS PER MODUL</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {allModuleKeys.map((k) => {
                      const status = selectedUser.progress[k]?.status || "locked";
                      const subs = selectedUser.progress[k]?.completedSubModules || [];
                      return (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{k} - {MODULE_LABELS[k]}</span>
                          <span style={{ color: status === "completed" ? "#22C55E" : status === "active" ? "#FF9D00" : "var(--text-muted)", fontWeight: 600 }}>
                            {status === "completed" ? `(${subs.length})` : status === "active" ? `(${subs.length})` : "Locked"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div style={{ background: "var(--bg-card)", padding: "var(--space-4)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "8px" }}>
                  BADGE ({selectedUser.badges.length}/{BADGES.length})
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {BADGES.map((b) => {
                    const earned = selectedUser.badges.includes(b.id);
                    return (
                      <span key={b.id} style={{ fontSize: "1.25rem", filter: earned ? "none" : "grayscale(100%) opacity(30%)", cursor: "pointer" }} title={`${b.name}: ${b.description}`}>
                        {b.emoji}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {addModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "380px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                <UserPlus size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} /> Tambah Mahasiswa
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "var(--space-4)" }}>
                <input
                  type="text" placeholder="Nama lengkap" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="email" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="number" placeholder="XP awal (0)" value={formData.xp}
                  min={0} max={9999}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
                    Kategori / Peran:
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-color)",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      background: "var(--bg-page)",
                      outline: "none",
                    }}
                  >
                    <option value="maba">🎓 Mahasiswa Baru 2026</option>
                    <option value="staff">🛡️ Staff Divisi Pemrograman</option>
                    <option value="tester">🧪 Penguji Angkatan 2025</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setAddModal(false); resetForm(); }} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button
                  onClick={handleAdd}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editUser && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "380px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                <PencilSimpleLine size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} /> Edit Mahasiswa
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "var(--space-4)" }}>
                <input
                  type="text" placeholder="Nama lengkap" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="email" placeholder="Email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <input
                  type="number" placeholder="XP" value={formData.xp}
                  min={0} max={9999}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-primary)", background: "var(--bg-page)", outline: "none" }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
                    Kategori / Peran:
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--border-color)",
                      fontSize: "0.875rem",
                      color: "var(--text-primary)",
                      background: "var(--bg-page)",
                      outline: "none",
                    }}
                  >
                    <option value="maba">🎓 Mahasiswa Baru 2026</option>
                    <option value="staff">🛡️ Staff Divisi Pemrograman</option>
                    <option value="tester">🧪 Penguji Angkatan 2025</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setEditUser(null); resetForm(); }} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button
                  onClick={handleEdit}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Award XP Modal */}
        {awardModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", padding: "20px" }}>
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: "var(--space-6)", width: "100%", maxWidth: "360px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
              <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-4)" }}>
                Award XP
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>
                Jumlah XP untuk <strong>{allUsers.find((u) => u.uid === awardModal)?.name}</strong>
              </p>
              <input
                type="number" value={awardAmount} min={1} max={1000}
                onChange={(e) => setAwardAmount(parseInt(e.target.value) || 0)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-color)", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", background: "var(--bg-page)", outline: "none", marginBottom: "var(--space-4)" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setAwardModal(null)} className="btn btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button
                  onClick={async () => {
                    await awardXP(awardModal, awardAmount);
                    setAwardModal(null);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Berikan XP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Code Playback Player Modal */}
        {playbackUser && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
              padding: "20px",
            }}
          >
            <CodePlaybackPlayer
              studentName={playbackUser.name}
              session={{
                sessionId: `sess-${playbackUser.uid}`,
                studentId: playbackUser.uid,
                moduleId: "M4",
                startTime: playbackStartTime,
                totalEvents: 6,
                hasPasteBurst: false,
                events: [
                  { timestamp: 1, deltaMs: 0, code: "# Mengerjakan Latihan Percabangan\n", charCount: 35 },
                  { timestamp: 2, deltaMs: 400, code: "# Mengerjakan Latihan Percabangan\nnilai = int(input(\"Nilai: \"))\n", charCount: 65 },
                  { timestamp: 3, deltaMs: 600, code: "# Mengerjakan Latihan Percabangan\nnilai = int(input(\"Nilai: \"))\nif nilai >= 80:\n    print(\"Lulus\")\n", charCount: 110 },
                  { timestamp: 4, deltaMs: 500, code: "# Mengerjakan Latihan Percabangan\nnilai = int(input(\"Nilai: \"))\nif nilai >= 80:\n    print(\"Lulus dengan pujian\")\n", charCount: 125 },
                  { timestamp: 5, deltaMs: 450, code: "# Mengerjakan Latihan Percabangan\nnilai = int(input(\"Nilai: \"))\nif nilai >= 80:\n    print(\"Lulus dengan pujian\")\nelse:\n    print(\"Semangat coba lagi!\")\n", charCount: 175 },
                  { timestamp: 6, deltaMs: 300, code: "# Mengerjakan Latihan Percabangan TRPL 2026\nnilai = int(input(\"Nilai: \"))\nif nilai >= 80:\n    print(\"Lulus dengan pujian!\")\nelse:\n    print(\"Semangat coba lagi!\")\n", charCount: 186 },
                ],
              }}
              onClose={() => setPlaybackUser(null)}
            />
          </div>
        )}
        </>
        )}

        {/* Academic Gradebook & CPL Modal */}
        <AcademicGradebookModal
          isOpen={academicModalOpen}
          onClose={() => setAcademicModalOpen(false)}
          users={targetUsers}
        />

        {/* Detailed Examination Answer Sheet Modal */}
        <TestAnswerDetailModal
          isOpen={testDetailModalOpen}
          onClose={() => setTestDetailModalOpen(false)}
          user={testDetailUser}
          initialTab={testDetailInitialTab}
        />

        {/* CSV Mini Data Preview Modal (Recommendation 9) */}
        {csvPreviewModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              padding: "20px",
            }}
          >
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                width: "100%",
                maxWidth: "960px",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                border: "1.5px solid var(--border-color)",
                boxShadow: "var(--shadow-2xl)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Table size={22} color="var(--color-primary-500)" />
                    Pratinjau Data Rekapitulasi CSV ({sorted.length} Baris Mahasiswa)
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                    Pratinjau struktur tabel data nilai, status kelulusan, dan modul sebelum diunduh ke format Excel/CSV.
                  </p>
                </div>
                <button onClick={() => setCsvPreviewModalOpen(false)} className="btn btn-sm btn-ghost">
                  <X size={20} />
                </button>
              </div>

              <div style={{ flex: 1, overflow: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                  <thead style={{ position: "sticky", top: 0, background: "var(--bg-page-alt)", zIndex: 1 }}>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <th style={{ padding: "8px", textAlign: "left" }}>#</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Nama</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Email</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Peran</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>XP</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>Pre-Test</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>Post-Test</th>
                      <th style={{ padding: "8px", textAlign: "center" }}>Sertifikat</th>
                      {allModuleKeys.map((k) => (
                        <th key={k} style={{ padding: "8px 4px", textAlign: "center" }}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.slice(0, 50).map((u, idx) => {
                      const pre = u.tests?.preTest;
                      const post = u.tests?.postTest;
                      const isCert = Boolean(
                        pre?.completed &&
                        allModuleKeys.every((k) => u.progress?.[k]?.status === "completed") &&
                        post?.completed
                      );
                      return (
                        <tr key={u.uid} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "6px 8px", color: "var(--text-muted)" }}>{idx + 1}</td>
                          <td style={{ padding: "6px 8px", fontWeight: 700, whiteSpace: "nowrap" }}>{u.name}</td>
                          <td style={{ padding: "6px 8px", color: "var(--text-secondary)" }}>{u.email}</td>
                          <td style={{ padding: "6px 8px", whiteSpace: "nowrap" }}>
                            {isCreatorAccount(u) ? (
                              <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: "rgba(168,85,247,0.15)", color: "#9333ea" }}>
                                CREATOR
                              </span>
                            ) : isStaffAccount(u) ? (
                              <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: "rgba(59,130,246,0.15)", color: "#2563eb" }}>
                                STAFF
                              </span>
                            ) : isTesterAccount(u) ? (
                              <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: "rgba(245,158,11,0.15)", color: "#d97706" }}>
                                PENGUJI
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "rgba(34,197,94,0.15)", color: "#16a34a" }}>
                                MABA 2026
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: 700, color: "var(--color-primary-600)" }}>{u.xp}</td>
                          <td style={{ padding: "6px 8px", textAlign: "center" }}>{pre ? `${pre.percentage}%` : "-"}</td>
                          <td style={{ padding: "6px 8px", textAlign: "center" }}>{post ? `${post.percentage}%` : "-"}</td>
                          <td style={{ padding: "6px 8px", textAlign: "center" }}>
                            <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, background: isCert ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: isCert ? "#22C55E" : "#EF4444" }}>
                              {isCert ? "LULUS" : "BELUM"}
                            </span>
                          </td>
                          {allModuleKeys.map((k) => (
                            <td key={k} style={{ padding: "6px 4px", textAlign: "center", fontSize: "0.68rem" }}>
                              {u.progress?.[k]?.status === "completed" ? "✅" : "⏳"}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  * Menampilkan 50 entri teratas. Unduh file untuk melihat seluruh dataset.
                </span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => setCsvPreviewModalOpen(false)} className="btn btn-secondary btn-sm">
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      exportCSV();
                      setCsvPreviewModalOpen(false);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ gap: "6px" }}
                  >
                    <DownloadSimple size={16} /> Unduh File CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
