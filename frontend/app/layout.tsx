import type { Metadata } from "next";
import "./globals.css";

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
        className="antialiased"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
