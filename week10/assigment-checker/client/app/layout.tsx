import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssignCheck AI | Intelligence-Driven Assignment Evaluation",
  description: "Automate your assignment checking with AI. Upload instructions and student submissions to get instant, accurate marks and remarks.",
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased selection:bg-primary/30`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
