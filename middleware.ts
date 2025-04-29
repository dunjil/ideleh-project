import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Store the current URL in a cookie for reference
  const response = NextResponse.next()
  response.cookies.set("next-url", request.url)

  // Define public paths that don't require authentication
  const isPublicPath = path === "/admin/login" || path === "/admin/setup" || !path.startsWith("/admin")

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("admin_authenticated")

  // If the path starts with /admin and it's not a public path and the user is not authenticated
  if (path.startsWith("/admin") && !isPublicPath && !isAuthenticated) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // If the user is authenticated and trying to access the login page
  if (isAuthenticated && path === "/admin/login") {
    // Redirect to the admin dashboard
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return response
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
