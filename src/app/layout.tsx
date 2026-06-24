import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import { PROJECT } from "@/lib/project";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: PROJECT.name,
  description: PROJECT.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
