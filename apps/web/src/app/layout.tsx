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
  title: "Nell — Never Forget the People Who Matter",
  description: "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed. Just text (279) 529-0731.",
  keywords: ["birthday", "reminder", "SMS", "relationships", "gift suggestions", "AI assistant"],
  authors: [{ name: "Nell" }],
  openGraph: {
    title: "Nell — Never Forget the People Who Matter",
    description: "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed. Just text (279) 529-0731.",
    type: "website",
    url: "https://textnell.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nell — Never Forget the People Who Matter",
    description: "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed. Just text (279) 529-0731.",
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