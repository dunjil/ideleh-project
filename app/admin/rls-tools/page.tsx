"use client"

import { RlsDiagnostics } from "@/components/admin/rls-diagnostics"
import { RlsBypassForm } from "@/components/admin/rls-bypass-form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function RlsToolsPage() {
  const { toast } = useToast()

  const runForceDisableRls = async () => {
    try {
      // Execute the SQL to disable RLS for all tables
      const sql = `
        DO $$
        DECLARE
          r RECORD;
        BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
          LOOP
            EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', r.tablename);
          END LOOP;
        END;
        $$;
      `

      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        toast({
          title: "Error",
          description: `Failed to disable RLS: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "RLS has been disabled for all tables",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error?.message || "Unknown error"}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">RLS Tools</h1>
        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RlsDiagnostics />
        <RlsBypassForm />
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Force Disable RLS</h2>
        <p className="mb-4">
          This will attempt to disable RLS for all tables in the public schema. Use this as a last resort if other
          methods fail.
        </p>
        <Button onClick={runForceDisableRls}>Force Disable RLS for All Tables</Button>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Manual SQL Instructions</h2>
        <p className="mb-4">If all else fails, you can run the following SQL in the Supabase SQL Editor:</p>
        <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto mb-4">
          {`-- Disable RLS for specific tables
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Or disable RLS for all tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END;
$$;`}
        </pre>
      </div>
    </div>
  )
}
