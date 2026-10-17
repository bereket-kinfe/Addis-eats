import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { verifySessionToken } from "@/lib/session";

export function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  const accountUrl = new URL("/account", request.url);
  accountUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(accountUrl);
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*"],
};
