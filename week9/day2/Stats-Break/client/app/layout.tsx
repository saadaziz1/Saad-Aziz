import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/provider";
import { Toaster } from "react-hot-toast";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CricStats - Your Cricket Data Companion",
  description: "Get real-time cricket statistics and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${pressStart.variable} ${spaceMono.variable} antialiased font-mono`}
      >
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "pixel-box border-cyan-400 bg-panel text-cyan-400 !font-mono !text-xs",
              style: {
                borderRadius: "0px",
                border: "2px solid #2de2e6",
                background: "#0d0221",
                color: "#2de2e6",
                boxShadow: "0 0 10px rgba(45,226,230,0.5)",
              },
              success: {
                style: {
                  borderColor: "#2de2e6",
                },
              },
              error: {
                style: {
                  borderColor: "#f6019d",
                  color: "#f6019d",
                },
              },
            }}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
