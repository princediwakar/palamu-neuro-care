import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
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

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*|favicon.ico|sitemap.xml|robots.txt).*)"],
};
