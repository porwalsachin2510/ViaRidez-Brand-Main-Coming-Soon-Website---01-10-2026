import { NextRequest, NextResponse } from "next/server"

const REDIRECT_HOSTS = new Set(["viaridez.com", "www.viaridez.com"])
const DESTINATION_ORIGIN = "https://www.viaridez.ae"

export function proxy(request: NextRequest) {
  if (!REDIRECT_HOSTS.has(request.nextUrl.hostname.toLowerCase())) {
    return NextResponse.next()
  }

  const destination = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, DESTINATION_ORIGIN)
  return NextResponse.redirect(destination, 301)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
