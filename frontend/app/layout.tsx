import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zero-Config Starter",
  description:
    "Instantly generate production-ready full-stack projects without manual setup! Create fully configured MERN/MEAN/PERN stack projects with TypeScript, authentication, and best practices.",
  keywords:
    "MERN, MEAN, PERN, starter, generator, full-stack, React, Angular, Vue, Next.js, Express, NestJS, Spring Boot",
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
        className={`${spaceGrotesk.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
