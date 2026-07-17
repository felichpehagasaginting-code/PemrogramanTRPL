import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-4)" }}>404</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Halaman Tidak Ditemukan
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginBottom: "var(--space-6)" }}>
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
