import { NextResponse } from "next/server";
import { db, isMockFirebase } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export async function GET() {
  try {
    if (!isMockFirebase) {
      const q = query(
        collection(db, "help_snapshots"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const tickets: any[] = [];
      snapshot.forEach((d) => {
        tickets.push({ id: d.id, ...d.data() });
      });
      return NextResponse.json({
        success: true,
        tickets,
      });
    }

    return NextResponse.json({
      success: true,
      tickets: [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal mengambil daftar tiket bantuan." },
      { status: 500 }
    );
  }
}
