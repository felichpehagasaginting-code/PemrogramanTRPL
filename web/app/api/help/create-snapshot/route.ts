import { NextResponse } from "next/server";

// In-memory / mock cache fallback for snapshots
const SNAPSHOT_CACHE = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, moduleId, error, authorName } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Kode tidak boleh kosong." },
        { status: 400 }
      );
    }

    const snapshotId = `help-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const snapshotData = {
      id: snapshotId,
      code,
      moduleId: moduleId || "Umum",
      error: error || null,
      authorName: authorName || "Mahasiswa TRPL",
      createdAt: new Date().toISOString(),
    };

    SNAPSHOT_CACHE.set(snapshotId, snapshotData);

    return NextResponse.json({
      success: true,
      snapshotId,
      shareUrl: `/help/${snapshotId}`,
      data: snapshotData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal membuat snapshot bantuan." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !SNAPSHOT_CACHE.has(id)) {
    return NextResponse.json(
      { error: "Cuplikan kode bantuan tidak ditemukan atau sudah kadaluarsa." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    snapshot: SNAPSHOT_CACHE.get(id),
  });
}
