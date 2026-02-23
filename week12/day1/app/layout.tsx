import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/lib/Web3Provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BhaiKaSikka | Premium ERC-20 Token",
  description: "Experience the next generation of token management with BhaiKaSikka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'glass text-white border-white/10',
              style: {
                maxWidth: '400px',
                wordBreak: 'break-word',
              },
              duration: 5000,
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}
