import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "CCBot", "anthropic-ai", "PerplexityBot"],
        allow: "/",
        disallow: ["/_next/", "/_static/gallery/", "/_static/illustrations/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
    ],
    sitemap: "https://www.palamuneurocare.com/sitemap.xml",
  };
}
