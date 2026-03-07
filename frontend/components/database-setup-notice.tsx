"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function DatabaseSetupNotice() {
  const [showNotice, setShowNotice] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkLocalStorage = () => {
      // Check if notice has been dismissed
      if (typeof window !== "undefined") {
        const isDismissed = localStorage.getItem("database_setup_complete") === "true"
        setShowNotice(!isDismissed)
        setIsLoading(false)
      }
    }

    // Use a short timeout to ensure localStorage is available
    setTimeout(checkLocalStorage, 100)
  }, [])

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("database_setup_complete", "true")
      setShowNotice(false)
    }
  }

  if (isLoading || !showNotice) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle>Database Setup Notice</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          If you're seeing errors or missing data, you may need to initialize the database tables. You can also
          configure Row Level Security (RLS) to allow adding and editing content.
        </p>
        <div className="flex gap-2 mt-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/setup">Setup Database</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/setup-rls">Configure RLS</Link>
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDismiss}>
            Dismiss Notice
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
