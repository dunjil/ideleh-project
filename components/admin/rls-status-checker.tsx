"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { execSqlAsAdmin, checkRlsStatus } from "@/lib/admin-utils"
import { useToast } from "@/components/ui/use-toast"

export function RlsStatusChecker() {
  const [checking, setChecking] = useState(true)
  const [rlsIssues, setRlsIssues] = useState<string[]>([])
  const [fixing, setFixing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function checkRls() {
      const tables = ["events", "registrations", "gallery", "team_members", "admins"]
      const issues: string[] = []

      for (const table of tables) {
        const { disabled, error } = await checkRlsStatus(table)
        if (!disabled || error) {
          issues.push(table)
        }
      }

      setRlsIssues(issues)
      setChecking(false)
    }

    checkRls()
  }, [])

  const fixRlsIssues = async () => {
    setFixing(true)

    try {
      const sql = `
        -- Disable RLS for all public tables used by the admin dashboard
        ALTER TABLE events DISABLE ROW LEVEL SECURITY;
        ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
        ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
        ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
        ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
      `

      const { success, error } = await execSqlAsAdmin(sql)

      if (success) {
        toast({
          title: "RLS Disabled",
          description: "Row Level Security has been disabled for admin tables.",
        })
        setRlsIssues([])
      } else {
        toast({
          title: "Error",
          description: "Failed to disable RLS. Please run the SQL manually.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fixing RLS:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setFixing(false)
    }
  }

  if (checking) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checking RLS Status</AlertTitle>
        <AlertDescription>Checking Row Level Security status for admin tables...</AlertDescription>
      </Alert>
    )
  }

  if (rlsIssues.length === 0) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle>RLS Issues Detected</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Row Level Security is enabled for the following tables, which may prevent admin operations:</p>
        <ul className="list-disc list-inside">
          {rlsIssues.map((table) => (
            <li key={table}>{table}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-2">
          <Button onClick={fixRlsIssues} disabled={fixing} size="sm" variant="outline" className="w-fit">
            {fixing ? "Disabling RLS..." : "Disable RLS for Admin"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
