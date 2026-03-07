import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const response = NextResponse.next()
  response.cookies.set("next-url", request.url)

  // ── Admin routes ──────────────────────────────────────────────────────────
  const isAdminPublicPath = path === "/admin/login" || path === "/admin/setup"
  const isAdminAuthenticated = request.cookies.has("admin_authenticated")

  if (path.startsWith("/admin") && !isAdminPublicPath && !isAdminAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  if (isAdminAuthenticated && path === "/admin/login") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // ── Public user routes (dashboard) ────────────────────────────────────────
  const isUserPublicPath =
    path === "/login" ||
    path === "/signup" ||
    !path.startsWith("/dashboard")

  const hasSessionToken = request.cookies.has("session_token")

  if (path.startsWith("/dashboard") && !hasSessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  if (hasSessionToken && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
