import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streamvideo",
  description: "Ott",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-[#141414] antialiased`}
      >
        <QueryProvider>
          <Header />
          {children}
          <Footer 
            socialLinks={{
              facebook: "https://facebook.com",
              twitter: "https://twitter.com",
              linkedin: "https://linkedin.com"
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
