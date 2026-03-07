"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ImageIcon, Users, AlertCircle, Database, FileText } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/events">
          <Card className="h-full transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Manage events and registrations</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/registrations">
          <Card className="h-full transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registrations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>View all event registrations</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/gallery">
          <Card className="h-full transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Manage gallery images</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/team">
          <Card className="h-full transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>Manage team members</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Self-Hosted PostgreSQL</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          This application is running on a self-hosted PostgreSQL database. All data, including images,
          is stored directly in the database.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            <span className="font-medium">Events:</span> Create, edit, and manage events.
          </li>
          <li>
            <span className="font-medium">Gallery:</span> Upload and manage images for the public gallery.
          </li>
          <li>
            <span className="font-medium">Team:</span> Manage team member profiles and information.
          </li>
          <li>
            <span className="font-medium">Storage:</span> Images are automatically converted and saved as secure base64 strings.
          </li>
        </ul>
      </div>
    </div>
  )
}
