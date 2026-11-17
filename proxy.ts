import { NextRequest, NextResponse } from "next/server";

// Known aggressive scrapers and AI bots that drain bandwidth and cache reads
const BLOCKED_BOT_REGEX =
  /bytespider|claudebot|gptbot|ccbot|amazonbot|petalbot|ahrefsbot|semrushbot|dotbot|mj12bot|dataforseobot|seekportbot|barkrowler/i;

export default function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // Drop aggressive scrapers/crawlers immediately before any page rendering or cache lookup
  if (userAgent && BLOCKED_BOT_REGEX.test(userAgent)) {
    return new NextResponse("Access Denied", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }

  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const prefersHindi =
      acceptLanguage.includes("hi") && !acceptLanguage.includes("en");

    if (prefersHindi) {
      const url = request.nextUrl.clone();
      url.pathname = "/hi";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercept all page routes while excluding static assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|_static).*)",
  ],
};
