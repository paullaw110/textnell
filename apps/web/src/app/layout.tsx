import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const ppNeueMontreal = localFont({
  src: [
    { path: "./fonts/PPNeueMontreal-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/PPNeueMontreal-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/PPNeueMontreal-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-pp-neue-montreal",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nell — Never Forget the People Who Matter",
  description:
    "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed. Just text (279) 529-0731.",
  keywords: ["birthday", "reminder", "SMS", "relationships", "gift suggestions", "AI assistant"],
  authors: [{ name: "Nell" }],
  openGraph: {
    title: "Nell — Never Forget the People Who Matter",
    description:
      "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed. Just text (279) 529-0731.",
    type: "website",
    url: "https://textnell.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nell — Never Forget the People Who Matter",
    description:
      "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed. Just text (279) 529-0731.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#205A3B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ppNeueMontreal.variable} ${ibmPlexMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
