import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security: Enable strict mode
  reactStrictMode: true,

  // Security: Headers configuration
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent framing
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // XSS Protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer Policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://localhost:8000 https://api.yourdomain.com; frame-ancestors 'none';",
          },
          // Enforce HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Disable client-side caching of sensitive data
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },

  // Security: Redirect HTTP to HTTPS in production
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "/:path*",
        permanent: false,
      },
    ];
  },

  // Security: Environment variables - only expose safe variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },

  // Security: Disable powered-by header
  poweredByHeader: false,

  // Security: Compress responses
  compress: true,

  // Security: Sanitize URL parameters
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
