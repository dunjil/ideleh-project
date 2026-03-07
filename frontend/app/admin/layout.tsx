import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"

export const metadata: Metadata = {
  title: "Admin Dashboard - IDELEH",
  description: "Admin dashboard for IDELEH website",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Get the current path
  const pathname = cookies().get("next-url")?.value || ""

  // Skip authentication for login and setup pages
  if (pathname.includes("/admin/login") || pathname.includes("/admin/setup")) {
    return children
  }

  // Check authentication for other admin pages
  const isAuthenticated = cookies().has("admin_authenticated")

  if (!isAuthenticated && pathname.includes("/admin")) {
    redirect("/admin/login")
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
