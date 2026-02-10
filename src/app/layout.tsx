import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "桜 Sakura — Manga on Solana",
  description: "Read manga, collect chapters, own your library. A Solana-powered manga reading platform with beautiful Japanese aesthetics.",
  icons: {
    icon: "/sakuraicon.png",
    apple: "/sakuraicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Background */}
        <div className="app-background">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/background.png" alt="" />
        </div>

        {/* Sakura Petals */}
        <div className="sakura-petals">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="petal" />
          ))}
        </div>

        {children}
      </body>
    </html>
  );
}
