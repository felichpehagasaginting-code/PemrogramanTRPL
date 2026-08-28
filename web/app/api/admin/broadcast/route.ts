import { NextResponse } from "next/server";

export interface BroadcastData {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "urgent";
  isActive: boolean;
  createdAt: string;
  author: string;
}

// In-memory global store for active broadcast (simulating database document)
let currentBroadcast: BroadcastData = {
  id: "announcement-default",
  title: "📢 Sambutan Dosen Pengampu TRPL 2026",
  message: "Selamat datang di Platform Matrikulasi Pemrograman! Selesaikan Modul M0 s/d M8 sebelum pekan UTS.",
  type: "info",
  isActive: true,
  createdAt: new Date().toISOString(),
  author: "Dosen Pengampu TRPL",
};

export async function GET() {
  return NextResponse.json({
    success: true,
    broadcast: currentBroadcast,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, type, isActive, author } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Judul dan pesan pengumuman wajib diisi." },
        { status: 400 }
      );
    }

    currentBroadcast = {
      id: `announcement-${Date.now()}`,
      title,
      message,
      type: type || "info",
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
      author: author || "Admin Dosen TRPL",
    };

    return NextResponse.json({
      success: true,
      broadcast: currentBroadcast,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui pengumuman." },
      { status: 500 }
    );
  }
}
