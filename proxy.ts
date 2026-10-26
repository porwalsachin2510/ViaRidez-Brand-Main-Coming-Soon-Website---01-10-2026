import { NextRequest, NextResponse } from "next/server"

const REDIRECT_HOSTS = new Set(["viaridez.com", "www.viaridez.com"])
const DESTINATION_ORIGIN = "https://www.viaridez.ae"

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const hostname = (forwardedHost || request.nextUrl.hostname).toLowerCase().replace(/:\d+$/, "")

  if (!REDIRECT_HOSTS.has(hostname)) {
    return NextResponse.next()
  }

  const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, DESTINATION_ORIGIN)
  return NextResponse.redirect(destination, 301)
}

export const config = {
  matcher: ["/:path*"],
}
