"use client"

import type React from "react"
import Link from "next/link"
import { LogOut, Shield, Lock, PenToolIcon as Tools, HardDrive, ImageIcon, FileText, Home } from "lucide-react"
import { DatabaseSetupNotice } from "@/components/database-setup-notice"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            IDELEH Admin
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin/events" className="text-sm font-medium hover:underline">
              Events
            </Link>
            <Link href="/admin/gallery" className="text-sm font-medium hover:underline">
              Gallery
            </Link>
            <Link href="/admin/projects" className="text-sm font-medium hover:underline">
              Projects
            </Link>
            <Link href="/admin/team" className="text-sm font-medium hover:underline">
              Team
            </Link>
            <Link
              href="/admin/hero-images"
              className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
            >
              <ImageIcon className="h-4 w-4" />
              Hero Images
            </Link>
            <Link
              href="/admin/site-content"
              className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:underline"
            >
              <FileText className="h-4 w-4" />
              Site Content
            </Link>
            <Link
              href="/admin/storage"
              className="flex items-center gap-1 text-sm font-medium text-green-600 hover:underline"
            >
              <HardDrive className="h-4 w-4" />
              Storage
            </Link>
            <Link
              href="/admin/rls-tools"
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
            >
              <Tools className="h-4 w-4" />
              RLS Tools
            </Link>
            <Link
              href="/admin/setup-rls"
              className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:underline"
            >
              <Shield className="h-4 w-4" />
              Setup RLS
            </Link>
            <Link
              href="/admin/setup-auth"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              <Lock className="h-4 w-4" />
              Auth Setup
            </Link>
            <Link href="/" className="text-sm font-medium hover:underline">
              <Home className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/logout"
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:underline"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <DatabaseSetupNotice />
          {children}
        </div>
      </main>
    </div>
  )
}
