const createNextIntlPlugin = require("next-intl/plugin");
const withSerwist = require("@serwist/next").default;

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/_static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/en",
      },
      {
        source: "/:path((?!hi|_next|_static|offline|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
        destination: "/en/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

const serwistConfig = {
  swSrc: "sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV !== "production",
  scope: "/",
  reloadOnOnline: true,
  additionalPrecacheEntries: [{ url: "/offline", revision: null }],
};

module.exports = withSerwist(serwistConfig)(withNextIntl(nextConfig));
