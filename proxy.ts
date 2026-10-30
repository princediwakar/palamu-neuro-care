import { NextRequest, NextResponse } from "next/server";

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
