import type { Metadata } from "next";
import { Space_Grotesk, Inter, Fira_Code } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll").then((m) => m.SmoothScroll));

const OverlayEffects = dynamic(() => import("@/components/gamification/OverlayEffects").then((m) => m.OverlayEffects));
const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette").then((m) => m.CommandPalette));
const KeyboardShortcutsHelp = dynamic(() => import("@/components/ui/KeyboardShortcutsHelp").then((m) => m.KeyboardShortcutsHelp));

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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pemrograman-trpl.vercel.app";

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
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
    description: "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL. Live coding, gamifikasi, kuis seru, dan meme relevan.",
    url: appUrl,
    siteName: "Matrikulasi TRPL",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matrikulasi TRPL – Platform Belajar Coding Anti-Boring",
    description: "Platform belajar pemrograman interaktif untuk mahasiswa baru TRPL.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
          <CommandPalette />
          <KeyboardShortcutsHelp />
        </SmoothScroll>
      </body>
    </html>
  );
}
