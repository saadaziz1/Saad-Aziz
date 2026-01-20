"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./lib/store";
import { Suspense } from "react";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"bg-white"}>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            {/* Navbar */}
            <Navbar />
            {children}
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
