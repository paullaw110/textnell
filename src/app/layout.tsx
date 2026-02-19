import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nell - Never forget a birthday again",
  description: "Your playful SMS birthday reminder friend. Text Nell at (279) 529-0731 to get started.",
  keywords: ["birthday", "reminder", "SMS", "CRM", "relationships", "text"],
  authors: [{ name: "Nell" }],
  openGraph: {
    title: "Nell - Never forget a birthday again",
    description: "Your playful SMS birthday reminder friend. Text Nell at (279) 529-0731 to get started.",
    type: "website",
    url: "https://textnell.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nell - Never forget a birthday again",
    description: "Your playful SMS birthday reminder friend. Text Nell at (279) 529-0731 to get started.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff6b4a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}