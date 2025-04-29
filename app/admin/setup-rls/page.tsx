"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SetupRLSPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupRLS = async () => {
    setIsLoading(true)
    try {
      // First, try to create the exec_sql function if it doesn't exist
      const createFunctionSQL = `
      -- Create a function to execute SQL
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;

      -- Grant execute permission to the anon role
      GRANT EXECUTE ON FUNCTION exec_sql TO anon;
      `

      // Try to execute the SQL directly
      const { error: functionError } = await supabase
        .rpc("exec_sql", {
          sql_query: createFunctionSQL,
        })
        .catch(() => {
          // If this fails, it's likely because the function doesn't exist yet
          // We'll handle this in the manual instructions
          return { error: new Error("Function exec_sql doesn't exist") }
        })

      if (functionError) {
        // If we couldn't create the function, we'll need to provide manual instructions
        setResult({
          success: false,
          message:
            "The exec_sql function doesn't exist in your database. Please follow the manual instructions below to set up RLS.",
        })

        toast({
          title: "Automatic Setup Failed",
          description: "Please use the manual setup instructions.",
          variant: "destructive",
        })

        setIsLoading(false)
        return
      }

      // If we get here, the function exists or was created successfully
      // Try to disable RLS using SQL
      const sqlQueries = [
        "ALTER TABLE events DISABLE ROW LEVEL SECURITY;",
        "ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;",
        "ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;",
        "ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;",
        "INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true) ON CONFLICT (id) DO UPDATE SET public = true;",
        "INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO UPDATE SET public = true;",
      ]

      for (const sql of sqlQueries) {
        const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

        if (error) {
          console.error("Error executing SQL:", error)
          throw new Error("Could not automatically configure RLS. Please use the manual instructions below.")
        }
      }

      // Create storage buckets if they don't exist
      const buckets = ["events", "gallery"]

      for (const bucket of buckets) {
        const { error: bucketError } = await supabase.storage.createBucket(bucket, {
          public: true,
        })

        if (bucketError && !bucketError.message.includes("already exists")) {
          console.error(`Error creating bucket ${bucket}:`, bucketError)
        }
      }

      setResult({
        success: true,
        message:
          "RLS policies have been successfully configured. You should now be able to add events and gallery items.",
      })

      toast({
        title: "Setup Complete",
        description: "RLS policies have been configured successfully.",
      })
    } catch (error: any) {
      console.error("Error setting up RLS:", error)

      setResult({
        success: false,
        message: `${error.message || "An unknown error occurred"}. Please use the manual instructions below.`,
      })

      toast({
        title: "Automatic Setup Failed",
        description: "Please use the manual setup instructions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "SQL Copied",
      description: "The SQL script has been copied to your clipboard.",
    })
  }

  const execSqlFunction = `-- Create a function to execute SQL
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION exec_sql TO anon;`

  const rlsSetupSQL = `-- Disable RLS for the tables
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- Make storage buckets public
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;`

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Configure Row Level Security</CardTitle>
          <CardDescription>
            Set up Row Level Security (RLS) policies to allow adding events and gallery items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This will disable Row Level Security for the database tables used by this application. In a production
              environment, you should configure more restrictive policies.
            </AlertDescription>
          </Alert>

          {result && (
            <Alert
              variant={result.success ? "default" : "destructive"}
              className={result.success ? "bg-green-50 text-green-800 border-green-200" : ""}
            >
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-2">Manual Setup Instructions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Follow these steps to manually configure RLS in your Supabase project:
            </p>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Step 1: Create the exec_sql function</p>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(execSqlFunction)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{execSqlFunction}</pre>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Step 2: Configure RLS policies</p>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(rlsSetupSQL)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{rlsSetupSQL}</pre>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Steps to manually configure RLS:</p>
              <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
                <li>
                  Go to the{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>Select your project</li>
                <li>Go to the SQL Editor</li>
                <li>First paste and run the exec_sql function code (Step 1)</li>
                <li>Then paste and run the RLS configuration code (Step 2)</li>
              </ol>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              >
                Open Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={setupRLS} disabled={isLoading}>
            {isLoading ? "Configuring..." : "Try Automatic Setup"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
