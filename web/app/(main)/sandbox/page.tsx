"use client";

import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/lib/store/useUserStore";
import { fireConfetti } from "@/lib/confetti";
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { SANDBOX_FEATURES } from "@/lib/features";
import {
  Folder,
  MagnifyingGlass,
  GitBranch,
  SquaresFour,
  Gear,
  Play,
  Trash,
  Plus,
  CheckCircle,
  Circle,
  Terminal,
  X,
  FileCode,
  Info,
  Sparkle,
  SidebarSimple,
  Columns,
  ArrowsOutSimple,
  ArrowsInSimple,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { PowerShellTerminal } from "@/components/editor/PowerShellTerminal";

interface VirtualFile {
  name: string;
  content: string;
}

export default function VSCodeSandboxPage() {
  const { user, addXP } = useUserStore();

  // Virtual Filesystem State
  const [files, setFiles] = useState<VirtualFile[]>([
    {
      name: "main.py",
      content: `# Tulis kode Python kamu di sini!\n# Contoh print dasar:\nnama = "Maba TRPL 2026"\nprint("Halo " + nama + "!")\nprint("Selamat datang di VS Code Sandbox Simulator!")\n`,
    },
    {
      name: "readme.md",
      content: `# 🚀 VS Code Sandbox\n\nSelamat datang di simulator workspace mandiri!\n\nDi sini kamu bisa:\n1. Membuat berkas baru (.py, .txt, .md)\n2. Menulis kode Python di editor\n3. Menjalankan program di terminal dengan perintah: \`python [nama_file].py\`\n4. Menginstal ekstensi Python di menu Marketplace kiri\n`,
    },
    {
      name: "settings.json",
      content: `{\n  "editor.fontSize": 14,\n  "python.linting.enabled": true,\n  "editor.wordWrap": "on"\n}\n`,
    },
  ]);

  // Sidebar & Layout Control States (Dynamic VS Code Panel Controls)
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showBottomTerminal, setShowBottomTerminal] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);

  // Mobile & Aspect Ratio Responsiveness State
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<"editor" | "terminal" | "misi">("editor");

  const [activeTab, setActiveTab] = useState<"explorer" | "search" | "git" | "extensions" | "settings">("explorer");
  const [activeFileName, setActiveFileName] = useState<string>("main.py");
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Extension states
  const [installedExtensions, setInstalledExtensions] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  // Code editor scroll
  const linesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Missions states
  const [mission1, setMission1] = useState(false);
  const [mission2, setMission2] = useState(false);
  const [mission3, setMission3] = useState(false);
  const [mission4, setMission4] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const activeFile = files.find((f) => f.name === activeFileName) || files[0];

  // Screen size listener for adaptive mobile/tablet/desktop layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (mobile) {
        setShowRightPanel(false); // Hide right panel by default on mobile to prevent squishing
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto detect missions progress
  useEffect(() => {
    if (files.some((f) => f.name === "app.py")) setMission1(true);
    else setMission1(false);

    const appFile = files.find((f) => f.name === "app.py");
    if (appFile && appFile.content.includes("print(")) setMission2(true);
    else setMission2(false);
  }, [files]);

  useEffect(() => {
    if (installedExtensions.includes("python")) setMission4(true);
  }, [installedExtensions]);

  useEffect(() => {
    if (mission1 && mission2 && mission3 && mission4 && !xpAwarded) {
      setXpAwarded(true);
      fireConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      addXP(50);
    }
  }, [mission1, mission2, mission3, mission4, xpAwarded, addXP]);

  const handleEditorScroll = () => {
    if (textareaRef.current && linesRef.current) {
      linesRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleEditorChange = (val: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.name === activeFileName ? { ...f, content: val } : f))
    );
  };

  const createNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let cleanName = newFileName.trim().replace(/\s+/g, "_");
    if (files.some((f) => f.name === cleanName)) {
      alert("Berkas dengan nama tersebut sudah ada!");
      return;
    }

    const newF: VirtualFile = {
      name: cleanName,
      content: `# Berkas ${cleanName}\n`,
    };

    setFiles((prev) => [...prev, newF]);
    setActiveFileName(cleanName);
    setNewFileName("");
    setIsCreatingFile(false);
  };

  const deleteFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("Minimal harus ada 1 berkas dalam workspace!");
      return;
    }

    if (confirm(`Apakah kamu yakin ingin menghapus berkas '${fileName}'?`)) {
      const updated = files.filter((f) => f.name !== fileName);
      setFiles(updated);
      if (activeFileName === fileName) {
        setActiveFileName(updated[0].name);
      }
    }
  };

  const handleInstallExtension = (extId: string) => {
    setIsInstalling(extId);
    setTimeout(() => {
      setInstalledExtensions((prev) => [...prev, extId]);
      setIsInstalling(null);
    }, 1200);
  };

  const searchResults = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchText.toLowerCase()) ||
      f.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const lineNumbers = activeFile.content.split("\n").map((_, i) => i + 1);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg-page)",
        padding: isMaximized ? "0" : isMobile ? "var(--space-2)" : "var(--space-6)",
        position: isMaximized ? "fixed" : "relative",
        inset: isMaximized ? 0 : "auto",
        zIndex: isMaximized ? 99999 : "auto",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Header Info */}
      {!isMaximized && (
        <div style={{ marginBottom: "var(--space-4)" }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: isMobile ? "1.5rem" : "1.875rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: "0 0 4px",
            }}
          >
            VS Code Sandbox <span className="gradient-text">Simulator</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: 0 }}>
            Workspace simulasi mandiri untuk melatih pembuatan file, edit kode Python, dan eksekusi Terminal CLI!
          </p>
        </div>
      )}

      {/* Mobile Tab Navigation Bar (For 1080x2400 and Smartphone viewports) */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            background: "#1E1E1E",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            marginBottom: "12px",
            overflow: "hidden",
          }}
        >
          {[
            { id: "editor", label: "📝 Code Editor" },
            { id: "terminal", label: "💻 Terminal" },
            { id: "misi", label: "🎯 Misi Sandbox" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: "10px",
                background: mobileActiveTab === tab.id ? "var(--color-primary-500)" : "transparent",
                color: mobileActiveTab === tab.id ? "white" : "var(--text-secondary)",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Adaptive IDE Container */}
      <div
        className="sandbox-grid-container"
        style={{
          display: isMobile ? "block" : "grid",
          gridTemplateColumns: showRightPanel ? "1fr 320px" : "1fr",
          gap: "16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* VS Code Window Frame */}
        <div
          style={{
            display: isMobile && mobileActiveTab === "misi" ? "none" : "flex",
            flexDirection: "column",
            background: "#1e1e1e",
            borderRadius: isMaximized ? 0 : "var(--radius-xl)",
            border: "1px solid #333333",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
            minHeight: isMobile ? "calc(100vh - 160px)" : "600px",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {/* VS Code Top Header Bar & Control Panel Toggle Icons */}
          <div
            style={{
              height: "38px",
              background: "#323233",
              borderBottom: "1px solid #252526",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 12px",
              userSelect: "none",
            }}
          >
            {/* Window Controls Dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F56" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27C93F" }} />
              </div>
              <span style={{ color: "#cccccc", fontSize: "0.75rem", fontFamily: "var(--font-code)", marginLeft: "8px" }}>
                {activeFileName} — Visual Studio Code (Sandbox)
              </span>
            </div>

            {/* Layout Toggle Buttons (Just like real VS Code header!) */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                type="button"
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                title={showLeftSidebar ? "Sembunyikan Sidebar Kiri" : "Tampilkan Sidebar Kiri"}
                style={{
                  background: showLeftSidebar ? "rgba(255,255,255,0.15)" : "transparent",
                  border: "none",
                  color: showLeftSidebar ? "#FFF" : "#858585",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.72rem",
                }}
              >
                <SidebarSimple size={15} />
                {!isMobile && <span>Sidebar</span>}
              </button>

              <button
                type="button"
                onClick={() => setShowBottomTerminal(!showBottomTerminal)}
                title={showBottomTerminal ? "Sembunyikan Terminal" : "Tampilkan Terminal"}
                style={{
                  background: showBottomTerminal ? "rgba(255,255,255,0.15)" : "transparent",
                  border: "none",
                  color: showBottomTerminal ? "#FFF" : "#858585",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.72rem",
                }}
              >
                <Terminal size={15} />
                {!isMobile && <span>Terminal</span>}
              </button>

              {!isMobile && (
                <button
                  type="button"
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  title={showRightPanel ? "Sembunyikan Misi Side Panel" : "Tampilkan Misi Side Panel"}
                  style={{
                    background: showRightPanel ? "rgba(255,255,255,0.15)" : "transparent",
                    border: "none",
                    color: showRightPanel ? "#FFF" : "#858585",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.72rem",
                  }}
                >
                  <Columns size={15} />
                  <span>Misi Panel</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Keluar Layar Penuh" : "Layar Penuh"}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#858585",
                  padding: "4px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {isMaximized ? <ArrowsInSimple size={15} /> : <ArrowsOutSimple size={15} />}
              </button>
            </div>
          </div>

          {/* IDE Body */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* Left Activity Bar (Icons) */}
            <div
              style={{
                width: "48px",
                background: "#333333",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 0",
                gap: "18px",
                borderRight: "1px solid #252526",
                flexShrink: 0,
              }}
            >
              {[
                { id: "explorer", icon: <Folder size={22} />, title: "Explorer (Ctrl+Shift+E)" },
                { id: "search", icon: <MagnifyingGlass size={22} />, title: "Search (Ctrl+Shift+F)" },
                { id: "git", icon: <GitBranch size={22} />, title: "Source Control (Ctrl+Shift+G)" },
                { id: "extensions", icon: <SquaresFour size={22} />, title: "Marketplace Extensions" },
              ].map((item) => {
                const isActive = activeTab === item.id && showLeftSidebar;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (activeTab === item.id && showLeftSidebar) {
                        setShowLeftSidebar(false);
                      } else {
                        setActiveTab(item.id as any);
                        setShowLeftSidebar(true);
                      }
                    }}
                    title={item.title}
                    style={{
                      background: "none",
                      border: "none",
                      color: isActive ? "#ffffff" : "#858585",
                      cursor: "pointer",
                      padding: "4px",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: "-12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "3px",
                          height: "22px",
                          background: "var(--color-primary-500)",
                        }}
                      />
                    )}
                  </button>
                );
              })}

              <div style={{ marginTop: "auto" }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("settings");
                    setShowLeftSidebar(true);
                  }}
                  title="Settings"
                  style={{
                    background: "none",
                    border: "none",
                    color: activeTab === "settings" ? "#ffffff" : "#858585",
                    cursor: "pointer",
                  }}
                >
                  <Gear size={22} />
                </button>
              </div>
            </div>

            {/* Primary Sidebar Content (Explorer / Search / Extensions) */}
            {showLeftSidebar && (
              <div
                style={{
                  width: isMobile ? "160px" : "220px",
                  background: "#252526",
                  borderRight: "1px solid #1e1e1e",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: 0,
                }}
              >
                {/* Explorer Header */}
                {activeTab === "explorer" && (
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#bbbbbb", textTransform: "uppercase" }}>
                        Explorer: Workspace
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCreatingFile(true)}
                        title="Buat Berkas Baru"
                        style={{ background: "none", border: "none", color: "#cccccc", cursor: "pointer" }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* New file input form */}
                    {isCreatingFile && (
                      <form onSubmit={createNewFile} style={{ marginBottom: "8px" }}>
                        <input
                          type="text"
                          autoFocus
                          placeholder="nama_file.py"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onBlur={() => {
                            if (!newFileName.trim()) setIsCreatingFile(false);
                          }}
                          style={{
                            width: "100%",
                            background: "#1e1e1e",
                            border: "1px solid var(--color-primary-500)",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "0.75rem",
                            color: "white",
                            fontFamily: "var(--font-code)",
                            outline: "none",
                          }}
                        />
                      </form>
                    )}

                    {/* Files List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {files.map((file) => {
                        const isActive = file.name === activeFileName;
                        return (
                          <div
                            key={file.name}
                            onClick={() => setActiveFileName(file.name)}
                            className="explorer-file-item"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              background: isActive ? "#37373d" : "transparent",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              color: isActive ? "#ffffff" : "#cccccc",
                              fontFamily: "var(--font-code)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                              <FileCode size={16} color={file.name.endsWith(".py") ? "#38bdf8" : "#9ca3af"} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {file.name}
                              </span>
                            </div>
                            <button
                              onClick={(e) => deleteFile(file.name, e)}
                              className="file-delete-btn"
                              style={{ background: "none", border: "none", color: "#888888", cursor: "pointer" }}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Search Panel */}
                {activeTab === "search" && (
                  <div style={{ padding: "12px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#bbbbbb", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      Pencarian Kata
                    </span>
                    <input
                      type="text"
                      placeholder="Cari kata/file..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{
                        width: "100%",
                        background: "#1e1e1e",
                        border: "1px solid #3d3d3d",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        fontSize: "0.8rem",
                        color: "white",
                        outline: "none",
                        marginBottom: "12px",
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {searchText &&
                        searchResults.map((res) => (
                          <div
                            key={res.name}
                            onClick={() => setActiveFileName(res.name)}
                            style={{
                              background: "#2d2d2d",
                              padding: "6px 8px",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              color: "#e5e7eb",
                            }}
                          >
                            <strong style={{ color: "var(--color-primary-400)" }}>{res.name}</strong>
                            <div style={{ color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                              {res.content.substring(0, 30)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Extensions Panel */}
                {activeTab === "extensions" && (
                  <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#bbbbbb", textTransform: "uppercase", display: "block" }}>
                      Marketplace Ekstensi
                    </span>
                    {[
                      { id: "python", name: "Python (Microsoft)", desc: "Dukungan editor Python lengkap." },
                      { id: "prettier", name: "Prettier - Code Formatter", desc: "Format berkas otomatis." },
                    ].map((ext) => {
                      const isInstalled = installedExtensions.includes(ext.id);
                      return (
                        <div key={ext.id} style={{ background: "#1e1e1e", border: "1px solid #333333", padding: "8px", borderRadius: "var(--radius-md)" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.78rem", color: "#ffffff" }}>{ext.name}</div>
                          <p style={{ fontSize: "0.68rem", color: "#9ca3af", margin: "4px 0 6px" }}>{ext.desc}</p>
                          <button
                            type="button"
                            disabled={isInstalled || isInstalling === ext.id}
                            onClick={() => handleInstallExtension(ext.id)}
                            style={{
                              width: "100%",
                              background: isInstalled ? "#22c55e" : "var(--color-primary-500)",
                              color: "white",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: isInstalled ? "default" : "pointer",
                            }}
                          >
                            {isInstalling === ext.id ? "Menginstal..." : isInstalled ? "Installed ✅" : "Install"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Settings Panel */}
                {activeTab === "settings" && (
                  <div style={{ padding: "12px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#bbbbbb", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                      Konfigurasi Editor
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2d2d2d", paddingBottom: "4px" }}>
                        <span style={{ color: "#a5a5a5" }}>Font Size</span>
                        <span style={{ fontWeight: 700, color: "#e5e7eb" }}>14px</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2d2d2d", paddingBottom: "4px" }}>
                        <span style={{ color: "#a5a5a5" }}>Theme</span>
                        <span style={{ fontWeight: 700, color: "#e5e7eb" }}>Matrikulasi Dark</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Editor & Bottom Terminal Center Panel */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
              {/* File Tabs Bar */}
              <div
                style={{
                  height: "36px",
                  background: "#2d2d2d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #202020",
                  paddingRight: "12px",
                  overflowX: "auto",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                  {files.map((file) => {
                    const isActive = file.name === activeFileName;
                    return (
                      <div
                        key={file.name}
                        onClick={() => setActiveFileName(file.name)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: isActive ? "#1e1e1e" : "transparent",
                          height: "100%",
                          padding: "0 12px",
                          borderRight: "1px solid #252526",
                          borderTop: isActive ? "2px solid var(--color-primary-500)" : "2px solid transparent",
                          fontSize: "0.8rem",
                          color: isActive ? "white" : "#a5a5a5",
                          fontFamily: "var(--font-code)",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <FileCode size={15} color={file.name.endsWith(".py") ? "#38bdf8" : "#9ca3af"} />
                        <span>{file.name}</span>
                        {files.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => deleteFile(file.name, e)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#888888",
                              cursor: "pointer",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <X size={10} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Text Editor Area */}
              <div style={{ flex: (!showBottomTerminal || isMobile && mobileActiveTab === "editor") ? 1 : "0 0 280px", display: "flex", background: "#1e1e1e", overflow: "hidden", position: "relative" }}>
                {/* Line Numbers */}
                <div
                  ref={linesRef}
                  style={{
                    width: "38px",
                    background: "#1e1e1e",
                    padding: "16px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-code)",
                    color: "#858585",
                    userSelect: "none",
                    lineHeight: "1.6",
                    overflow: "hidden",
                    borderRight: "1px solid #2d2d2d",
                    paddingRight: "6px",
                    flexShrink: 0,
                  }}
                >
                  {lineNumbers.map((num) => (
                    <div key={num}>{num}</div>
                  ))}
                </div>

                {/* Editor Textarea */}
                <textarea
                  ref={textareaRef}
                  value={activeFile.content}
                  onChange={(e) => handleEditorChange(e.target.value)}
                  onScroll={handleEditorScroll}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "16px",
                    resize: "none",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-code)",
                    color: "#d4d4d4",
                    lineHeight: "1.6",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    caretColor: "var(--color-primary-500)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Bottom Integrated PowerShell Terminal */}
              {(showBottomTerminal || (isMobile && mobileActiveTab === "terminal")) && (
                <div style={{ flex: 1, minHeight: "200px", borderTop: "1px solid #2d2d2d", overflow: "hidden" }}>
                  <PowerShellTerminal code={activeFile.content} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Misi Sandbox Side Panel (Hideable & Adaptive) */}
        {(showRightPanel || (isMobile && mobileActiveTab === "misi")) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            {/* Guide Card */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkle size={18} color="var(--color-primary-500)" weight="fill" />
                  Misi Sandbox
                </h3>

                {!isMobile && (
                  <button
                    type="button"
                    onClick={() => setShowRightPanel(false)}
                    title="Sembunyikan Panel Misi"
                    className="btn btn-sm btn-ghost"
                    style={{ padding: "2px 6px" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.825rem", lineHeight: 1.6 }}>
                Selesaikan 4 misi di bawah untuk memahami dasar alur kerja editor VS Code dan terminal CLI:
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                {[
                  { done: mission1, text: "Buat berkas baru bernama 'app.py' di Explorer." },
                  { done: mission2, text: "Tulis baris kode 'print(...)' di dalam berkas 'app.py'." },
                  { done: mission3, text: "Jalankan berkas di terminal: ketik 'python app.py' lalu tekan Enter." },
                  { done: mission4, text: "Masuk ke Marketplace Ekstensi di kiri dan instal ekstensi 'Python'." },
                ].map((m, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    {m.done ? (
                      <CheckCircle size={20} color="#22c55e" weight="fill" style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle size={20} color="var(--border-color)" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: "0.8rem", color: m.done ? "var(--text-muted)" : "var(--text-primary)", textDecoration: m.done ? "line-through" : "none", lineHeight: 1.4 }}>
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>

              {mission1 && mission2 && mission3 && mission4 && (
                <div
                  style={{
                    background: "rgba(34, 197, 94, 0.08)",
                    border: "1.5px solid rgba(34, 197, 94, 0.25)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    marginTop: "16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#22c55e", fontSize: "0.875rem" }}>🎉 Semua Misi Selesai!</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "4px" }}>+50 XP telah ditambahkan ke akunmu!</div>
                </div>
              )}
            </div>

            {/* Quick Help Card */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
              <h4 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Info size={16} /> Perintah Terminal CLI
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-code)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                <div><strong style={{ color: "var(--text-primary)" }}>python [file].py</strong>: eksekusi script</div>
                <div><strong style={{ color: "var(--text-primary)" }}>ls</strong> / <strong style={{ color: "var(--text-primary)" }}>dir</strong>: daftar berkas</div>
                <div><strong style={{ color: "var(--text-primary)" }}>cat [file]</strong>: baca isi berkas</div>
                <div><strong style={{ color: "var(--text-primary)" }}>clear</strong>: bersihkan terminal</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embedded CSS */}
      <style jsx>{`
        .explorer-file-item:hover {
          background: #2a2d2e !important;
        }
        .explorer-file-item:hover .file-delete-btn {
          display: block !important;
        }
      `}</style>
      <FeaturePopupQueue features={SANDBOX_FEATURES} delay={7000} />
    </div>
  );
}
