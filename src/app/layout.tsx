import type { Metadata } from "next";
import { Inter } from "next/font/google";
import EasterStar from "@/components/EasterStar";
import ConsoleArt from "@/components/ConsoleArt";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "OneX SpaceTechnologies — Member Portal",
  description: "Member portal for the OneX SpaceTechnologies private community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <div className="grain-overlay" />
        <EasterStar />
        <ConsoleArt />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
