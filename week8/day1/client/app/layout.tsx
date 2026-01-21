"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Resume Builder</title>
        <meta name="description" content="Build your professional resume in minutes." />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Toaster position="top-right" />
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            {children}
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
