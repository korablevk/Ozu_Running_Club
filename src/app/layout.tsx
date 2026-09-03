import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ÖzÜ Running Club | Özyeğin University Running Community",
  description:
    "Official website of ÖzÜ Running Club at Özyeğin University, Istanbul. Weekly campus loops, intervals, city long runs, competitions, and inclusive community for all paces.",
  keywords: [
    "ÖzÜ Running Club",
    "Özyeğin University",
    "Istanbul Running Club",
    "Campus Run",
    "Student Running Community",
    "Çekmeköy",
    "Runaway Zone",
  ],
  authors: [{ name: "ÖzÜ Running Club Athletics Board" }],
  openGraph: {
    title: "ÖzÜ Running Club | Run With The Pack",
    description:
      "Join the student running community at Özyeğin University. Free weekly runs, all pace groups, coaching, and campus events.",
    type: "website",
    locale: "en_US",
    siteName: "ÖzÜ Running Club",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#081935",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-canvas-light text-asphalt-black antialiased selection:bg-volt selection:text-asphalt-black pb-16 lg:pb-0">
        {children}
      </body>
    </html>
  );
}
