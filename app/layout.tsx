import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { GlobalSpotlight } from "@/components/ui/GlobalSpotlight";

export const metadata: Metadata = {
  metadataBase: new URL("https://rebrycreatives.com"),
  title: {
    default: "Rebry Creatives | Websites, Apps, Graphics & Digital Content",
    template: "%s | Rebry Creatives",
  },
  description: "Rebry Creatives builds websites, web apps, mobile experiences, graphic design assets, 3D product visuals, and content systems for growing brands.",
  openGraph: {
    title: "Rebry Creatives",
    description: "Websites, apps, graphics, 3D product visuals, and content systems for growing brands.",
    url: "/",
    siteName: "Rebry Creatives",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className={`${GeistSans.className} font-sans antialiased min-h-screen selection:bg-accent/30 selection:text-white pb-20`}
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
