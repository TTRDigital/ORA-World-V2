import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isProd = process.env.NEXT_PUBLIC_SITE_ENV === "production";

/** Content Security Policy: only the origins the site actually needs. */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://core.sanity-cdn.com https://www.youtube.com https://s.ytimg.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://cdn.sanity.io https://www.googletagmanager.com https://www.google-analytics.com https://*.openfreemap.org",
  "font-src 'self' data:",
  "media-src 'self' blob: https://cdn.sanity.io",
  "connect-src 'self' https://*.api.sanity.io https://cdn.sanity.io https://*.sanity.io wss://*.api.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://tiles.openfreemap.org https://*.openfreemap.org https://challenges.cloudflare.com",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://kuula.co https://*.kuula.co https://calendly.com https://*.calendly.com https://cal.com https://*.cal.com https://api.leadconnectorhq.com https://link.msgsndr.com https://challenges.cloudflare.com https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  "form-action 'self'",
  "upgrade-insecure-requests",
]
  .join("; ")
  .replace(/\s{2,}/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // WebP only: AVIF encodes several times slower on first request and left visitors looking at a soft
    // image while each size was generated. Quality 80 everywhere.
    formats: ["image/webp"],
    qualities: [80],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [64, 96, 128, 192, 256, 320],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [...securityHeaders, ...(isProd ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }])],
      },
      {
        // Sanity Studio needs a looser policy for its own bundles.
        source: "/studio/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
