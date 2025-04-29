"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function RlsDiagnostics() {
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [testing, setTesting] = useState(false)
  const { toast } = useToast()

  const testTables = async () => {
    setTesting(true)
    const tables = ["events", "registrations", "gallery", "team_members", "admins"]
    const testResults: Record<string, boolean> = {}

    for (const table of tables) {
      try {
        // Try to insert a test row (we'll delete it right after)
        const { error: insertError } = await supabase
          .from(table)
          .insert([
            {
              // Different tables need different columns
              title: "RLS Test",
              description: "Testing RLS",
              name: "RLS Test",
              email: "test@example.com",
              image_path: "test.jpg",
              event_date: new Date().toISOString(),
              role: "Test Role",
              username: "test_user",
              password: "test_password",
              // Add any other required columns with dummy values
            },
          ])
          .select()

        // Check if we got an RLS error
        const hasRlsError = insertError?.message?.includes("row-level security") || false
        testResults[table] = !hasRlsError

        // If we successfully inserted, delete the test row
        if (!insertError) {
          await supabase.from(table).delete().eq("title", "RLS Test")
        }
      } catch (error) {
        console.error(`Error testing table ${table}:`, error)
        testResults[table] = false
      }
    }

    setResults(testResults)
    setTesting(false)

    // Check if any tables still have RLS issues
    const tablesWithIssues = Object.entries(testResults)
      .filter(([_, isDisabled]) => !isDisabled)
      .map(([table]) => table)

    if (tablesWithIssues.length > 0) {
      toast({
        title: "RLS Issues Detected",
        description: `The following tables still have RLS enabled: ${tablesWithIssues.join(", ")}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "All Tables Checked",
        description: "No RLS issues detected in the tested tables.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>RLS Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          This tool will test each table to see if RLS is properly disabled. It will attempt to insert a test row and
          check if it's blocked by RLS.
        </p>
        <Button onClick={testTables} disabled={testing}>
          {testing ? "Testing Tables..." : "Test Tables for RLS Issues"}
        </Button>

        {Object.keys(results).length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Results:</h3>
            <ul className="space-y-1">
              {Object.entries(results).map(([table, isDisabled]) => (
                <li key={table} className="flex items-center">
                  <span className={`w-4 h-4 rounded-full mr-2 ${isDisabled ? "bg-green-500" : "bg-red-500"}`}></span>
                  <span>
                    {table}: {isDisabled ? "RLS Disabled" : "RLS Still Enabled"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
