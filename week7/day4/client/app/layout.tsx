import type { Metadata } from "next";

import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/components/providers/ReduxProvider";



const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
export const metadata: Metadata = {
  title: "Nike Summer Collection",
  description: "Summertime mood collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <AppRouterCacheProvider>
          <ReduxProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </ThemeProvider>
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
