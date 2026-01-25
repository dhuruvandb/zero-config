import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zero-Config Starter",
  description:
    "Instantly generate production-ready full-stack projects without manual setup! Create fully configured MERN/MEAN/PERN stack projects with TypeScript, authentication, and best practices.",
  keywords:
    "MERN, MEAN, PERN, starter, generator, full-stack, React, Angular, Express, NestJS",
  authors: [{ name: "dhuruvandb" }],
  openGraph: {
    title: "Zero-Config Starter Generator",
    description:
      "Generate production-ready full-stack projects instantly with one click",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
