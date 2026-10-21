import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-constants";

export function proxy(request) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const accountUrl = new URL("/account", request.url);
  accountUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(accountUrl);
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*"],
};
