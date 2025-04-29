"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function SetupAuthPage() {
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
            "The exec_sql function doesn't exist in your database. Please follow the manual instructions below to set up authentication.",
        })

        toast({
          title: "Automatic Setup Failed",
          description: "Please use the manual setup instructions.",
          variant: "destructive",
        })

        setIsLoading(false)
        return
      }

      // Try to create the tasks table and configure RLS
      const createTasksSQL = `
        -- Create the tasks table if it doesn't exist
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          is_complete BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable Row Level Security
        ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

        -- Create policy for users to only see their own tasks
        CREATE POLICY "Users can only see their own tasks" ON tasks
          FOR SELECT USING (auth.uid() = user_id);

        -- Create policy for users to insert their own tasks
        CREATE POLICY "Users can insert their own tasks" ON tasks
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Create policy for users to update their own tasks
        CREATE POLICY "Users can update their own tasks" ON tasks
          FOR UPDATE USING (auth.uid() = user_id);

        -- Create policy for users to delete their own tasks
        CREATE POLICY "Users can delete their own tasks" ON tasks
          FOR DELETE USING (auth.uid() = user_id);
      `

      // Try to execute the SQL using the exec_sql RPC function
      const { error: createError } = await supabase.rpc("exec_sql", {
        sql_query: createTasksSQL,
      })

      if (createError) {
        console.error("Error creating tasks table:", createError)
        throw new Error("Could not create tasks table. Please use the manual instructions below.")
      }

      // Try to disable RLS for public tables
      const tables = ["events", "registrations", "gallery", "team_members"]

      for (const table of tables) {
        const { error } = await supabase.rpc("exec_sql", {
          sql_query: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`,
        })

        if (error) {
          console.error(`Error disabling RLS for ${table}:`, error)
          // Continue with other tables even if one fails
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
          "Tasks table created and authentication RLS policies have been configured. You should now be able to use the tasks feature with proper authentication.",
      })

      toast({
        title: "Setup Complete",
        description: "Tasks table created and authentication RLS policies have been configured successfully.",
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

  const authSetupSQL = `-- Create the tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own tasks
CREATE POLICY "Users can only see their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own tasks
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Disable RLS for public tables
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
          <CardTitle>Configure Authentication and RLS</CardTitle>
          <CardDescription>
            Create the tasks table and set up Row Level Security (RLS) policies for authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This will create the tasks table and configure RLS policies for your application. Public tables like
              events and gallery will have RLS disabled for admin access, while the tasks table will have RLS enabled
              with proper policies.
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
              Follow these steps to manually configure authentication in your Supabase project:
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
              <p className="text-sm font-medium mb-2">Step 2: Create tasks table and configure RLS</p>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => copyToClipboard(authSetupSQL)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-80">{authSetupSQL}</pre>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Steps to manually configure authentication:</p>
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
                <li>Then paste and run the authentication setup code (Step 2)</li>
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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  document.querySelector('[data-toast-id="copy-toast"]')?.remove()

  const toast = document.createElement("div")
  toast.setAttribute("data-toast-id", "copy-toast")
  toast.className = "fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg"
  toast.textContent = "SQL copied to clipboard"
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}
