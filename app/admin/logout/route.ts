import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  // Clear the authentication cookie
  cookies().delete("admin_authenticated")

  // Redirect to the login page
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000"))
}
