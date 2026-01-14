import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/outfit/400.css";
import { Box } from "@mui/material";
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
  title: "Decentral - Blockchain Asset Platform",
  description: "Save, Buy and Sell Your blockchain asset",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { ReduxProvider } from "@/store/ReduxProvider";
import NextTopLoader from 'nextjs-toploader';

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
        <NextTopLoader
          color="#73FDAA"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #73FDAA,0 0 5px #73FDAA"
        />
        <ReduxProvider>
          <ThemeRegistry>
            <Toaster position="bottom-right" toastOptions={{
              duration: 4000,
              style: {
                background: '#0F172A',
                color: '#fff',
                border: '1px solid rgba(115, 253, 170, 0.2)',
              },
            }} />
            <Box sx={{ maxWidth: 1440, mx: 'auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', px: 2 }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>

            </Box>
            <Footer />
          </ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
