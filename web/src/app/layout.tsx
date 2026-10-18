import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Koenigsegg | Automotive Mastery",
  description: "Explore Koenigsegg automotive design, engineering, and performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="sequence-loading">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased sequence-loading`}
      >
        {children}
      </body>
    </html>
  );
}
