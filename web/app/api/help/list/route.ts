import { NextResponse } from "next/server";

// Shared snapshot storage (in-memory simulation with fallback)
export async function GET() {
  try {
    // In production, this can query Firestore collection "help_snapshots"
    const mockTickets = [
      {
        id: "help-m4-101",
        authorName: "Ahmad Rizki",
        moduleId: "M4 (Percabangan)",
        error: "SyntaxError: expected ':' at line 4",
        code: "nilai = 85\nif nilai >= 80\n    print('Lulus!')",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        status: "waiting",
      },
      {
        id: "help-m5-202",
        authorName: "Dewi Lestari",
        moduleId: "M5 (Perulangan)",
        error: "ExecutionTimeout: Loop tanpa henti terdeteksi.",
        code: "i = 1\nwhile i <= 10:\n    print(i)\n    # lupa i += 1",
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        status: "in_progress",
        mentorNote: "Halo Dewi! Jangan lupa tambahkan `i += 1` di dalam blok while ya!",
      },
      {
        id: "help-m6-303",
        authorName: "Farhan TRPL",
        moduleId: "M6 (Fungsi)",
        error: "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
        code: "def sapa(nama, umur):\n    return 'Halo ' + nama + ' umurmu ' + umur\nprint(sapa('Farhan', 19))",
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: "resolved",
        mentorNote: "Bungkus parameter `umur` dengan `str(umur)` sebelum digabung dengan string.",
      },
    ];

    return NextResponse.json({
      success: true,
      tickets: mockTickets,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal mengambil daftar tiket bantuan." },
      { status: 500 }
    );
  }
}
