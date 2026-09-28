import { NextRequest, NextResponse } from "next/server";

// Server-side secret PIN for Dosen Penguji / Evaluator access
const DOSEN_PIN = process.env.DOSEN_EVAL_PIN || "1213";

// Simple IP-based rate limiting: max 5 failed attempts per minute
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = failedAttempts.get(ip);
  if (!record || now > record.resetAt) {
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = failedAttempts.get(ip);
  if (!record || now > record.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: now + LOCKOUT_WINDOW });
  } else {
    record.count++;
  }
}

function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak percobaan salah. Silakan coba lagi dalam 1 menit.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "Format PIN tidak valid." },
        { status: 400 }
      );
    }

    if (pin.trim() !== DOSEN_PIN) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: "PIN salah! Akses khusus Dosen Penguji.",
        },
        { status: 401 }
      );
    }

    // Success
    clearFailedAttempts(ip);

    const response = NextResponse.json({
      success: true,
      message: "Verifikasi Dosen Penguji berhasil.",
      role: "dosen_penguji",
    });

    // Set secure auth cookie indicating verified dosen session
    response.cookies.set("matrikulasi-auth", "dosen_verified", {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: false, // Accessible by client store check
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
