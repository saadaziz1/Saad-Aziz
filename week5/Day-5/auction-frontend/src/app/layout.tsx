import type { Metadata } from "next";
import "../styles/globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Navigation } from "@/components/layout/navigation";
import { QueryProvider } from "@/providers/QueryProvider";
import { SocketProvider } from "@/providers/SocketProvider";

export const metadata: Metadata = {
  title: "Auction App",
  description: "Created by Saad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <QueryProvider>
          <SocketProvider>
            <div className="flex flex-col">
              <Header />
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
