import { NextRequest, NextResponse } from "next/server";

export interface BroadcastData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "urgent";
  isActive: boolean;
  createdAt: string;
  author: string;
}

// In-memory global store for active broadcast (fallback and instant response)
let currentBroadcast: BroadcastData = {
  id: "announcement-default",
  title: "📢 Pengumuman Matrikulasi TRPL 2026",
  message: "Selamat datang di Platform Matrikulasi Pemrograman! Selesaikan Modul M0 s/d M8 sebelum pekan UTS.",
  type: "info",
  isActive: true,
  createdAt: new Date().toISOString(),
  author: "Tim Matrikulasi TRPL",
};

export async function GET() {
  return NextResponse.json({
    success: true,
    broadcast: currentBroadcast,
  });
}

export async function POST(req: NextRequest) {
  // Verify Admin authorization via cookie or Authorization header
  const authCookie = req.cookies.get("matrikulasi-auth")?.value;
  const authHeader = req.headers.get("authorization");

  const isAuthorized =
    authCookie === "dosen_verified" ||
    authCookie === "true" ||
    (authHeader && authHeader.startsWith("Bearer "));

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Akses ditolak: Hanya Admin Dosen TRPL yang dapat memperbarui pengumuman." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { title, message, type, isActive, author } = body;

    if (!title || typeof title !== "string" || !message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Judul dan pesan pengumuman wajib diisi dengan teks valid." },
        { status: 400 }
      );
    }

    if (title.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { error: "Judul maksimal 200 karakter dan pesan maksimal 2000 karakter." },
        { status: 400 }
      );
    }

    currentBroadcast = {
      id: `announcement-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      type: ["info", "warning", "urgent"].includes(type) ? type : "info",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
      author: typeof author === "string" && author.trim() ? author.trim() : "Admin Dosen TRPL",
    };

    return NextResponse.json({
      success: true,
      broadcast: currentBroadcast,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui pengumuman." },
      { status: 500 }
    );
  }
}
