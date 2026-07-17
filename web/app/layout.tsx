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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
    template: "%s | Matrikulasi TRPL",
  },
  description:
    "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL. Live coding, gamifikasi, kuis seru, dan meme relevan. Mulai coding sekarang!",
  keywords: ["matrikulasi", "TRPL", "belajar coding", "pemrograman", "Python", "gamifikasi", "kampus", "mahasiswa"],
  authors: [{ name: "Divisi Pemrograman Matrikulasi TRPL" }],
  creator: "Felich Pehagasa Ginting",
  publisher: "HIMA TRPL",
  metadataBase: new URL("https://matrikulasi-trpl.vercel.app"),
  openGraph: {
    title: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
    description: "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL. Live coding, gamifikasi, kuis seru, dan meme relevan.",
    type: "website",
    locale: "id_ID",
    siteName: "Matrikulasi TRPL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
    description: "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL.",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
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
