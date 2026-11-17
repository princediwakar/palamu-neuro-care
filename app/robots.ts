import type { MetadataRoute } from "next";

// Block AI crawlers and aggressive scraping bots that burn server/data cache read quota
const BLOCKED_BOTS = [
  // AI Crawlers & Scrapers
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Bytespider",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Google-Extended",
  "PerplexityBot",
  "Amazonbot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "YouBot",
  // Aggressive SEO & Scraping Crawlers
  "PetalBot",
  "AhrefsBot",
  "SemrushBot",
  "DotBot",
  "MJ12bot",
  "DataForSeoBot",
  "BLEXBot",
  "SeekportBot",
  "Barkrowler",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/"],
      },
      {
        userAgent: BLOCKED_BOTS,
        disallow: "/",
      },
    ],
    sitemap: "https://www.palamuneurocare.com/sitemap.xml",
  };
}
