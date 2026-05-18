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
  title: "Zero-Config Starter | CLI-Powered Full-Stack Generator",
  description:
    "Generate production-ready full-stack projects with one command. React, Angular, Vue, Next.js, Express, NestJS, Fastify — with JWT auth, Prisma ORM, CRUD, and tests built in.",
  keywords:
    "zero-config, CLI, starter, generator, full-stack, React, Angular, Vue, Next.js, Express, NestJS, Fastify, Prisma, JWT, TypeScript",
  authors: [{ name: "dhuruvandb" }],
  openGraph: {
    title: "Zero-Config Starter — CLI Generator",
    description:
      "Generate a full-stack project in under 30 seconds with one command: npx zero-config-cli my-project",
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
