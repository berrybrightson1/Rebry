import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { GlobalSpotlight } from "@/components/ui/GlobalSpotlight";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RebryCreatives | Spatial Portfolio",
  description: "Personal Portfolio & Agency Portal - White Spatial UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} font-sans antialiased min-h-screen selection:bg-accent/30 selection:text-white pb-20`}
      >
        <GlobalSpotlight />
        <div className="aurora-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
