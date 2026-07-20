import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/about", "/contact", "/courses", "/donation", "/login", "/signup", "/auth"]

const protectedPaths = ["/dashboard", "/my-learning", "/checkout", "/admin"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token")

  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  if (sessionCookie && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!sessionCookie && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
