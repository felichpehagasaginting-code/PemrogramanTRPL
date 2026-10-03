import type { Metadata } from "next";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import "./globals.css";

const SmoothScroll = dynamic(() => import("@/components/SmoothScroll").then((m) => m.SmoothScroll));

const OverlayEffects = dynamic(() => import("@/components/gamification/OverlayEffects").then((m) => m.OverlayEffects));
const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette").then((m) => m.CommandPalette));
const KeyboardShortcutsHelp = dynamic(() => import("@/components/ui/KeyboardShortcutsHelp").then((m) => m.KeyboardShortcutsHelp));
const PWARegister = dynamic(() => import("@/components/pwa/PWARegister").then((m) => m.PWARegister));

const spaceGrotesk = localFont({
  src: "../public/fonts/space-grotesk-latin.woff2",
  variable: "--font-heading",
  display: "swap",
  weight: "400 700",
});

const inter = localFont({
  src: "../public/fonts/inter-latin.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "400 600",
});

const firaCode = localFont({
  src: "../public/fonts/fira-code-latin.woff2",
  variable: "--font-code",
  display: "swap",
  weight: "400 500",
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
    default: "Matrikulasi TRPL 2026 — Platform Pembelajaran Pemrograman",
    template: "%s | Matrikulasi TRPL",
  },
  description:
    "Platform pembelajaran pemrograman resmi Mahasiswa Baru D4 TRPL. Praktik Python langsung di browser dengan WebAssembly, kurikulum 9 modul terstruktur, dan auto-grader instan.",
  keywords: ["matrikulasi", "TRPL", "belajar coding", "pemrograman", "Python", "Politeknik CWE", "mahasiswa baru", "software engineering"],
  authors: [{ name: "Divisi Pemrograman Matrikulasi TRPL" }],
  creator: "Felich Pehagasa Ginting",
  publisher: "HIMA TRPL Politeknik Kelapa Sawit CWE",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "Matrikulasi TRPL 2026 — Platform Pembelajaran Pemrograman",
    description: "Platform pembelajaran pemrograman resmi Mahasiswa Baru D4 TRPL. Praktik Python di browser, kurikulum 9 modul terstruktur, dan auto-grader instan.",
    url: appUrl,
    siteName: "Matrikulasi TRPL",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matrikulasi TRPL 2026 — Platform Pembelajaran Pemrograman",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matrikulasi TRPL 2026 — Platform Pembelajaran Pemrograman",
    description: "Platform pembelajaran pemrograman resmi Mahasiswa Baru D4 TRPL. Praktik Python di browser & auto-grader instan.",
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
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('matrikulasi-theme');
                var colors = {
                  orange: ['#FF6B00','#FF9D00'],
                  purple: ['#7C3AED','#A855F7'],
                  blue: ['#0284C7','#38BDF8'],
                  emerald: ['#059669','#10B981']
                };
                var fam = 'orange';
                var mode = 'light';
                if (t) {
                  var p = JSON.parse(t);
                  if (p && p.family && colors[p.family]) fam = p.family;
                  if (p && p.mode) mode = p.mode;
                }
                document.documentElement.setAttribute('data-theme', fam);
                if (mode === 'dark') document.documentElement.classList.add('dark');
                var c = colors[fam] || colors.orange;
                var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="' + c[0] + '"/><stop offset="100%" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><path d="M11 11L6 16L11 21M21 11L26 16L21 21M18 9L14 23" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
                var link = document.createElement('link');
                link.rel = 'icon';
                link.type = 'image/svg+xml';
                link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                document.head.appendChild(link);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SmoothScroll>
          {children}
          <OverlayEffects />
          <CommandPalette />
          <KeyboardShortcutsHelp />
          <PWARegister />
        </SmoothScroll>
      </body>
    </html>
  );
}
