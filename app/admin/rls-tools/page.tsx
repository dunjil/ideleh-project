"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

// RLS (Row Level Security) was a Supabase concept.
// With self-hosted PostgreSQL this page is no longer needed.
// This page just redirects admins to the main admin dashboard.
export default function RlsToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Database Setup</h1>
        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Migrated to Self-Hosted PostgreSQL</h2>
        <p className="mb-4 text-muted-foreground">
          This project has been migrated from Supabase to a self-hosted PostgreSQL database. Row Level Security
          (RLS) policies are no longer used — access control is handled at the application layer.
        </p>
        <p className="mb-4 text-muted-foreground">
          To set up the database schema, run the following command against your PostgreSQL instance:
        </p>
        <pre className="overflow-auto rounded-md bg-gray-100 p-4 text-xs dark:bg-gray-900">
          psql $DATABASE_URL -f schema.sql
        </pre>
      </div>
    </div>
  )
}
