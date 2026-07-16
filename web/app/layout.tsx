import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fira_Code } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll").then((m) => m.SmoothScroll));

const OverlayEffects = dynamic(() => import("@/components/gamification/OverlayEffects").then((m) => m.OverlayEffects));

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
  description:
    "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL. Live coding, gamifikasi, kuis seru, dan meme relevan. Mulai coding sekarang!",
  keywords: ["matrikulasi", "TRPL", "belajar coding", "pemrograman", "Python", "gamifikasi"],
  authors: [{ name: "Divisi Pemrograman Matrikulasi TRPL" }],
  openGraph: {
    title: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
    description: "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable}`}
    >
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SmoothScroll>
          {children}
          <OverlayEffects />
        </SmoothScroll>
      </body>
    </html>
  );
}
