import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nell - Never forget a birthday again",
  description: "SMS-based birthday reminders and personal relationship CRM. Text Nell at (279) 529-0731 to get started.",
  keywords: ["birthday", "reminder", "SMS", "CRM", "relationships", "text"],
  authors: [{ name: "Nell" }],
  openGraph: {
    title: "Nell - Never forget a birthday again",
    description: "SMS-based birthday reminders and personal relationship CRM. Text Nell at (279) 529-0731 to get started.",
    type: "website",
    url: "https://textnell.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nell - Never forget a birthday again",
    description: "SMS-based birthday reminders and personal relationship CRM. Text Nell at (279) 529-0731 to get started.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff7849",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}