import "./globals.css";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { Header } from "@/components/header";
import { ThemeScript } from "@/components/theme-script";

import { cn } from "../lib/utils";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-league",
  display: "swap",
});


const roboto = Roboto({ weight: ["500", "400", "300"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job listings with filtering",
  description: "Site to filter jobs based on selected categories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={cn(leagueSpartan.variable, "font-spartan bg-cyan-50 dark:bg-gray-900 transition-colors")}>
        <Header />
        {children}
      </body>
    </html>
  );
}
