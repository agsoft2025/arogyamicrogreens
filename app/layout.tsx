import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";

import { SiteShell } from "@/app/_components/layout/site-shell";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Microgreens",
  description: "Fresh microgreens delivered with a clean modern storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <div className="flex min-h-full flex-col">
          <SiteShell>{children}</SiteShell>
        </div>
      </body>
    </html>
  );
}
