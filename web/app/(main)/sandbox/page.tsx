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
} from "@phosphor-icons/react";

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

  // Sidebar states
  const [activeTab, setActiveTab] = useState<"explorer" | "search" | "git" | "extensions" | "settings">("explorer");
  const [activeFileName, setActiveFileName] = useState<string>("main.py");
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Extension states
  const [installedExtensions, setInstalledExtensions] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  // Search results
  const searchResults = files.filter(f => f.name.toLowerCase().includes(searchText.toLowerCase()) || f.content.toLowerCase().includes(searchText.toLowerCase()));

  // Code editor lines synchronizer scroll
  const linesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Terminal states
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Microsoft Windows [Version 10.0.22631]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Users\\maba\\workspace> _",
  ]);

  // Missions states
  const [mission1, setMission1] = useState(false); // Created app.py
  const [mission2, setMission2] = useState(false); // Typed print in app.py
  const [mission3, setMission3] = useState(false); // Run python app.py
  const [mission4, setMission4] = useState(false); // Installed Python extension
  const [xpAwarded, setXpAwarded] = useState(false);

  const activeFile = files.find((f) => f.name === activeFileName) || files[0];

  // Auto detect missions progress
  useEffect(() => {
    // Mission 1 check
    if (files.some(f => f.name === "app.py")) {
      setMission1(true);
    } else {
      setMission1(false);
    }

    // Mission 2 check
    const appFile = files.find(f => f.name === "app.py");
    if (appFile && appFile.content.includes("print(")) {
      setMission2(true);
    } else {
      setMission2(false);
    }
  }, [files]);

  // Mission 4 check
  useEffect(() => {
    if (installedExtensions.includes("python")) {
      setMission4(true);
    }
  }, [installedExtensions]);

  // Confetti when all completed
  useEffect(() => {
    if (mission1 && mission2 && mission3 && mission4 && !xpAwarded) {
      setXpAwarded(true);
      fireConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      // Award XP
      addXP(50);
    }
  }, [mission1, mission2, mission3, mission4, xpAwarded, addXP]);

  const handleEditorScroll = () => {
    if (textareaRef.current && linesRef.current) {
      linesRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleEditorChange = (val: string) => {
    setFiles(prev =>
      prev.map(f => (f.name === activeFileName ? { ...f, content: val } : f))
    );
  };

  // Virtual file creation
  const createNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    
    // Clean name
    let cleanName = newFileName.trim().replace(/\s+/g, "_");
    if (files.some(f => f.name === cleanName)) {
      alert("Berkas dengan nama tersebut sudah ada!");
      return;
    }

    const newF: VirtualFile = {
      name: cleanName,
      content: `# Berkas ${cleanName}\n`,
    };

    setFiles(prev => [...prev, newF]);
    setActiveFileName(cleanName);
    setNewFileName("");
    setIsCreatingFile(false);
  };

  // Delete file
  const deleteFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("Harus ada minimal 1 berkas di workspace!");
      return;
    }
    if (confirm(`Apakah kamu yakin ingin menghapus berkas '${fileName}'?`)) {
      setFiles(prev => prev.filter(f => f.name !== fileName));
      if (activeFileName === fileName) {
        const remaining = files.filter(f => f.name !== fileName);
        setActiveFileName(remaining[0].name);
      }
    }
  };

  // Reusable Python executor
  const runPythonFile = (fileName: string) => {
    let output = [...terminalOutput];
    if (output[output.length - 1]?.endsWith("_")) {
      output.pop();
    }

    output.push(`C:\\Users\\maba\\workspace> python ${fileName}`);

    const fileToRun = files.find(f => f.name === fileName);
    if (!fileToRun) {
      output.push(`Error: Berkas '${fileName}' tidak ditemukan di workspace.`);
    } else if (!fileName.endsWith(".py")) {
      output.push(`Error: Berkas '${fileName}' bukan berkas script Python (.py).`);
    } else {
      try {
        const lines = fileToRun.content.split("\n");
        const vars: Record<string, any> = {};
        let executionOutput: string[] = [];

        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith("#")) continue;

          // Handle variable assignments: x = 5 or name = "TRPL"
          if (line.includes("=") && !line.includes("==") && !line.startsWith("print")) {
            const eqIdx = line.indexOf("=");
            const varName = line.substring(0, eqIdx).trim();
            let varValStr = line.substring(eqIdx + 1).trim();

            if ((varValStr.startsWith('"') && varValStr.endsWith('"')) || (varValStr.startsWith("'") && varValStr.endsWith("'"))) {
              vars[varName] = varValStr.substring(1, varValStr.length - 1);
            } else if (varValStr === "True") {
              vars[varName] = true;
            } else if (varValStr === "False") {
              vars[varName] = false;
            } else {
              try {
                let tempValStr = varValStr;
                Object.keys(vars).forEach(k => {
                  tempValStr = tempValStr.replace(new RegExp(`\\b${k}\\b`, "g"), vars[k]);
                });
                const evaluated = new Function(`return (${tempValStr})`)();
                vars[varName] = evaluated;
              } catch (e) {
                vars[varName] = NaN;
              }
            }
            continue;
          }

          // Handle print statements
          if (line.startsWith("print(") && line.endsWith(")")) {
            let inner = line.substring(6, line.length - 1).trim();
            let expression = inner;
            Object.keys(vars).forEach(k => {
              const val = typeof vars[k] === "string" ? `"${vars[k]}"` : vars[k];
              expression = expression.replace(new RegExp(`\\b${k}\\b`, "g"), val);
            });

            try {
              const result = new Function(`return (${expression})`)();
              executionOutput.push(String(result));
            } catch (err) {
              executionOutput.push(`SyntaxError: print expression '${inner}' is invalid.`);
            }
          }
        }

        if (executionOutput.length === 0) {
          executionOutput.push("(Script selesai dijalankan tanpa menghasilkan output)");
        }

        output = output.concat(executionOutput);

        // Mission 3 check
        if (fileName === "app.py") {
          setMission3(true);
        }
      } catch (err) {
        output.push("Python Execution Error: Ada kesalahan logika/sintaksis di dalam berkas.");
      }
    }

    output.push("");
    output.push("C:\\Users\\maba\\workspace> _");
    setTerminalOutput(output);
  };

  // Execute terminal command
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    let output = [...terminalOutput];
    const command = terminalInput.trim();

    const parts = command.split(" ");
    const mainCommand = parts[0].toLowerCase();

    if (mainCommand === "python") {
      const fileName = parts[1];
      if (!fileName) {
        output.pop();
        output.push(`C:\\Users\\maba\\workspace> ${command}`);
        output.push("Error: Silakan tentukan nama berkas. Contoh: python main.py");
        output.push("");
        output.push("C:\\Users\\maba\\workspace> _");
        setTerminalOutput(output);
      } else {
        runPythonFile(fileName);
      }
    } else {
      output.pop();
      output.push(`C:\\Users\\maba\\workspace> ${command}`);

      if (mainCommand === "ls" || mainCommand === "dir") {
        output.push(" Direktori Workspace saat ini:");
        files.forEach((f) => {
          output.push(`  -  ${f.name}   (${f.content.length} bytes)`);
        });
      } else if (mainCommand === "clear" || mainCommand === "cls") {
        output = [];
      } else if (mainCommand === "cat") {
        const fileName = parts[1];
        if (!fileName) {
          output.push("Error: Silakan ketik nama berkas. Contoh: cat readme.md");
        } else {
          const file = files.find(f => f.name === fileName);
          if (!file) {
            output.push(`Error: Berkas '${fileName}' tidak ditemukan.`);
          } else {
            output = output.concat(file.content.split("\n"));
          }
        }
      } else if (mainCommand === "pip" && parts[1]?.toLowerCase() === "install") {
        const pkg = parts[2];
        if (!pkg) {
          output.push("Error: Silakan tentukan package. Contoh: pip install pandas");
        } else {
          output.push(`Collecting ${pkg}...`);
          output.push(`  Downloading ${pkg}-2.1.4-py3-none-any.whl (12.4 MB)`);
          output.push("  Installing collected packages...");
          output.push(`Successfully installed ${pkg}`);
        }
      } else if (mainCommand === "help") {
        output.push("Perintah simulator yang tersedia:");
        output.push("  python [nama_file].py  - Menjalankan program Python");
        output.push("  ls / dir              - Melihat berkas di workspace");
        output.push("  cat [nama_file]       - Membaca isi berkas");
        output.push("  pip install [package] - Simulasi install module python");
        output.push("  clear / cls           - Membersihkan layar terminal");
        output.push("  help                  - Bantuan");
      } else {
        output.push(`'${command}' is not recognized as an internal or external command,`);
        output.push("operable program or batch file.");
        output.push("Ketik 'help' untuk melihat perintah simulator yang didukung.");
      }

      output.push("");
      output.push("C:\\Users\\maba\\workspace> _");
      setTerminalOutput(output);
    }

    setTerminalInput("");
  };

  const handleInstallExtension = (extId: string) => {
    setIsInstalling(extId);
    setTimeout(() => {
      setInstalledExtensions(prev => [...prev, extId]);
      setIsInstalling(null);
    }, 1500);
  };

  // Generate line numbers
  const fileLines = activeFile.content.split("\n");
  const lineCount = fileLines.length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  if (!user) return null;

  return (
    <div className="section-container" style={{ paddingBottom: "var(--space-8)" }}>
      {/* Title */}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.875rem", color: "var(--text-primary)" }}>
          VS Code Sandbox <span className="gradient-text">Simulator</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", marginTop: "4px" }}>
          Workspace simulasi mandiri untuk melatih cara pembuatan file, edit kode Python, dan penggunaan Terminal CLI!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px" }} className="sandbox-grid-container">
        {/* VS Code Window Container */}
        <div
          style={{
            background: "#1e1e1e",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            flexDirection: "column",
            height: "650px",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          {/* Top Titlebar */}
          <div
            style={{
              height: "35px",
              background: "#323233",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              borderBottom: "1px solid #2b2b2b",
              fontSize: "0.75rem",
              color: "#cccccc",
              userSelect: "none",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }}></span>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#eab308", display: "inline-block" }}></span>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
            </div>
            <div style={{ fontFamily: "var(--font-code)", color: "#a5a5a5" }}>
              {activeFileName} — Visual Studio Code (Sandbox)
            </div>
            <div style={{ width: "50px" }}></div>
          </div>

          {/* Editor Workspace Row */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Activity Bar */}
            <div
              style={{
                width: "48px",
                background: "#181818",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px 0",
                gap: "18px",
                borderRight: "1px solid #2b2b2b",
              }}
            >
              {[
                { id: "explorer", icon: <Folder size={22} weight={activeTab === "explorer" ? "fill" : "regular"} />, title: "Explorer" },
                { id: "search", icon: <MagnifyingGlass size={22} weight={activeTab === "search" ? "bold" : "regular"} />, title: "Pencarian" },
                { id: "git", icon: <GitBranch size={22} weight={activeTab === "git" ? "fill" : "regular"} />, title: "Git" },
                { id: "extensions", icon: <SquaresFour size={22} weight={activeTab === "extensions" ? "fill" : "regular"} />, title: "Ekstensi" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    title={tab.title}
                    style={{
                      background: "none",
                      border: "none",
                      color: isActive ? "var(--color-primary-500)" : "#858585",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      borderLeft: isActive ? "2px solid var(--color-primary-500)" : "2px solid transparent",
                      padding: "4px 0",
                      transition: "color var(--transition-fast)",
                    }}
                  >
                    {tab.icon}
                  </button>
                );
              })}

              <div style={{ marginTop: "auto" }}>
                <button
                  onClick={() => setActiveTab("settings")}
                  style={{
                    background: "none",
                    border: "none",
                    color: activeTab === "settings" ? "var(--color-primary-500)" : "#858585",
                    cursor: "pointer",
                  }}
                >
                  <Gear size={22} />
                </button>
              </div>
            </div>

            {/* Sidebar Panel */}
            <div
              style={{
                width: "220px",
                background: "#252526",
                borderRight: "1px solid #2d2d2d",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {/* Explorer Tab Panel */}
              {activeTab === "explorer" && (
                <div style={{ padding: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#bbbbbb", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Explorer: Workspace
                    </span>
                    <button
                      onClick={() => setIsCreatingFile(true)}
                      title="Buat Berkas Baru"
                      style={{ background: "none", border: "none", color: "#bbbbbb", cursor: "pointer", display: "flex" }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Create File Input Form */}
                  {isCreatingFile && (
                    <form onSubmit={createNewFile} style={{ marginBottom: "10px" }}>
                      <input
                        autoFocus
                        type="text"
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
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <FileCode size={16} color={file.name.endsWith(".py") ? "#38bdf8" : "#9ca3af"} />
                            <span>{file.name}</span>
                          </div>
                          <button
                            onClick={(e) => deleteFile(file.name, e)}
                            className="file-delete-btn"
                            style={{ background: "none", border: "none", color: "#888888", cursor: "pointer", display: "none" }}
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
                    {searchText && searchResults.map(res => (
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

              {/* Git Panel */}
              {activeTab === "git" && (
                <div style={{ padding: "12px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#bbbbbb", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Source Control (Git)
                  </span>
                  <div style={{ background: "#2d2d2d", padding: "10px", borderRadius: "var(--radius-md)", fontSize: "0.8rem", color: "#a5a5a5" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#ffffff", fontWeight: 600, marginBottom: "6px" }}>
                      <span>Workspace Git</span>
                      <span style={{ background: "var(--color-primary-500)", color: "white", padding: "1px 6px", borderRadius: "10px", fontSize: "0.7rem" }}>MOCK</span>
                    </div>
                    Semua perubahan telah di-track. Ketik <code>git commit</code> tiruan untuk melihat perubahan.
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
                    { id: "python", name: "Python (Microsoft)", desc: "Dukungan editor Python lengkap dengan penyorot sintaks dan Pylance." },
                    { id: "prettier", name: "Prettier - Code Formatter", desc: "Format berkas otomatis saat menekan tombol simpan." },
                  ].map((ext) => {
                    const isInstalled = installedExtensions.includes(ext.id);
                    return (
                      <div key={ext.id} style={{ background: "#1e1e1e", border: "1px solid #333333", padding: "10px", borderRadius: "var(--radius-md)" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#ffffff" }}>{ext.name}</div>
                        <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: "4px 0 8px" }}>{ext.desc}</p>
                        
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
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: isInstalled ? "default" : "pointer",
                            opacity: isInstalling === ext.id ? 0.7 : 1,
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

            {/* Code Editor and Terminal Layout */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* File Tabs */}
              <div
                style={{
                  height: "36px",
                  background: "#2d2d2d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #202020",
                  paddingRight: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", height: "100%", overflowX: "auto" }}>
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
                        }}
                      >
                        <FileCode size={15} color={file.name.endsWith(".py") ? "#38bdf8" : "#9ca3af"} />
                        <span>{file.name}</span>
                        {files.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.name, e);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#888888",
                              cursor: "pointer",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center",
                              borderRadius: "4px",
                            }}
                          >
                            <X size={10} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right side controls (Run Button) */}
                {activeFileName.endsWith(".py") && (
                  <button
                    type="button"
                    onClick={() => runPythonFile(activeFileName)}
                    title="Jalankan Kode Python"
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      border: "1.5px solid #22c55e",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      color: "#22c55e",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <Play size={14} weight="fill" />
                    <span>Run</span>
                  </button>
                )}
              </div>

              {/* Text Editor Area */}
              <div style={{ flex: 1, display: "flex", background: "#1e1e1e", overflow: "hidden", position: "relative" }}>
                {/* Line Numbers */}
                <div
                  ref={linesRef}
                  style={{
                    width: "42px",
                    background: "#1e1e1e",
                    padding: "16px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-code)",
                    color: "#858585",
                    userSelect: "none",
                    lineHeight: "1.6",
                    overflow: "hidden",
                    borderRight: "1px solid #2d2d2d",
                    paddingRight: "8px",
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
                    whiteSpace: "pre",
                    caretColor: "var(--color-primary-500)",
                  }}
                />
              </div>

              {/* Bottom Integrated Terminal */}
              <div style={{ height: "220px", background: "#181818", borderTop: "1px solid #2d2d2d", display: "flex", flexDirection: "column" }}>
                {/* Terminal Tabs */}
                <div style={{ height: "30px", background: "#252526", display: "flex", alignItems: "center", padding: "0 16px", gap: "16px", fontSize: "0.75rem", color: "#bbbbbb", borderBottom: "1px solid #1e1e1e" }}>
                  <span style={{ color: "white", fontWeight: 700, borderBottom: "2px solid var(--color-primary-500)", height: "100%", display: "flex", alignItems: "center" }}>
                    Terminal
                  </span>
                  <span style={{ cursor: "default" }}>Output</span>
                  <span style={{ cursor: "default" }}>Problems</span>
                </div>

                {/* Terminal Log Console */}
                <div style={{ flex: 1, padding: "12px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-code)",
                      fontSize: "0.825rem",
                      color: "#34D399",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.5",
                    }}
                  >
                    {terminalOutput.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>

                  {/* Terminal CLI Command Input Form */}
                  <form onSubmit={handleTerminalSubmit} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-code)", fontSize: "0.825rem", color: "#34D399", marginRight: "6px" }}>
                      C:\Users\maba\workspace&gt;
                    </span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Ketik perintah di sini... (contoh: python main.py)"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#ffffff",
                        fontFamily: "var(--font-code)",
                        fontSize: "0.825rem",
                      }}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Missions Panel (Right) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Guide Card */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkle size={18} color="var(--color-primary-500)" weight="fill" />
              Misi Sandbox
            </h3>
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
              <div><strong style={{ color: "var(--text-primary)" }}>pip install [lib]</strong>: install module</div>
              <div><strong style={{ color: "var(--text-primary)" }}>clear</strong>: bersihkan terminal</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .explorer-file-item:hover {
          background: #2a2d2e !important;
        }
        .explorer-file-item:hover .file-delete-btn {
          display: block !important;
        }
        @media (max-width: 768px) {
          .sandbox-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
        `}</style>
      <FeaturePopupQueue features={SANDBOX_FEATURES} delay={7000} />
    </div>
  );
}
