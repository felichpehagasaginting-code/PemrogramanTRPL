import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, status, mentorNote } = body;

    if (!ticketId) {
      return NextResponse.json(
        { error: "Ticket ID wajib disertakan." },
        { status: 400 }
      );
    }

    // In production with Firebase Admin SDK: updateDoc in help_snapshots/{ticketId}

    return NextResponse.json({
      success: true,
      ticketId,
      status: status || "in_progress",
      mentorNote,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal memperbarui status tiket." },
      { status: 500 }
    );
  }
}
