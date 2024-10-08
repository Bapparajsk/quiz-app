import {ReactNode} from "react";
import type { Metadata } from "next";
import "./globals.css";
import "./font.css";
import {Providers} from "@/app/providers";
import AppNav from "@/components/Navbar";
import QueryClientProviders from "@/app/QueryClientProvider";
import {ThemeProvider} from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  return (
    <html lang="en">
      <body >
      <Providers>
          <QueryClientProviders>
              <ThemeProvider>
                  <AppNav />
                {children}
              </ThemeProvider>
          </QueryClientProviders>
      </Providers>
      </body>
    </html>
  );
}
