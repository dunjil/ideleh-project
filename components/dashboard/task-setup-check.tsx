"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function TaskSetupCheck() {
  const [setupNeeded, setSetupNeeded] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkTasksTable() {
      try {
        // Try to select from the tasks table
        const { error } = await supabase.from("tasks").select("id").limit(1)

        if (error && error.code === "42P01") {
          // Table doesn't exist
          setSetupNeeded(true)
        } else if (error && error.message.includes("permission denied")) {
          // RLS issue
          setSetupNeeded(true)
        } else {
          setSetupNeeded(false)
        }
      } catch (error) {
        console.error("Error checking tasks table:", error)
        setSetupNeeded(true)
      } finally {
        setChecking(false)
      }
    }

    checkTasksTable()
  }, [])

  if (checking || !setupNeeded) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle>Tasks Setup Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          The tasks feature requires additional setup. Please run the SQL script from the admin page to set up the tasks
          table and configure RLS policies.
        </p>
        <div className="flex gap-2 mt-2">
          <Button asChild size="sm" variant="outline" className="w-fit">
            <Link href="/admin/setup-auth">Setup Tasks</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
