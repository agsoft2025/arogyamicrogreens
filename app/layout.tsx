import type { Metadata } from "next";
import { Libre_Caslon_Text, Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriNest | Organic Microgreens Delivered Fresh",
  description:
    "Farm-fresh microgreens packed with nutrients, delivered to your doorstep within hours. Experience the power of pure, hydroponic greens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreCaslon.variable} ${workSans.variable} scroll-smooth`}
    >
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
