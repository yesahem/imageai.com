import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

import {Quicksand} from "next/font/google" 
import { NavBar } from "./components/NavBar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const quicksandLight = Quicksand({
  weight: "300",
  subsets:['latin'],
  variable:"--font-quicksand"
})
const quicksandBold = Quicksand({
  weight: "700",
  subsets:['latin'],
  variable:"--font-quicksand-bold"
})


export const metadata: Metadata = {
  title: "images-ai",
  description: "Generate images for friends and family in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any"/>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            <main className={`${quicksandLight.variable}`}>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
