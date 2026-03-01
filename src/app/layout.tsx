import type { Metadata } from "next";
import { Geist, Geist_Mono, Exo_2 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundShapes from "@/components/BackgroundShapes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Rival",
  description: "Rival — built with Next.js & Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${exo2.variable} min-h-screen bg-[#0a1f10] antialiased`}
      >
        <BackgroundShapes />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
