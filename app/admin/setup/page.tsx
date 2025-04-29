"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Database } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function AdminSetupPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const copyToClipboard = () => {
    const sql = `-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`

    navigator.clipboard.writeText(sql)
    toast({
      title: "SQL Copied",
      description: "The SQL script has been copied to your clipboard.",
    })
  }

  const handleDismissNotice = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("database_setup_complete", "true")
      toast({
        title: "Notice Dismissed",
        description: "The database setup notice has been dismissed.",
      })
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Database Setup
          </CardTitle>
          <CardDescription>Set up the database tables for the IDELEH website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Manual Setup Required</AlertTitle>
            <AlertDescription>
              You need to run the SQL script below in your Supabase SQL Editor to create the necessary database tables.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">SQL Script</h3>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
                <Copy className="h-4 w-4 mr-1" />
                Copy SQL
              </Button>
            </div>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-80">
              {`-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_path TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Steps to set up the database:</p>
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
                <li>Paste the SQL above</li>
                <li>Click "Run" to execute the SQL</li>
              </ol>
            </div>
          </div>

          <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Next Step: Configure RLS</AlertTitle>
            <AlertDescription>
              After setting up the database tables, you'll need to configure Row Level Security (RLS) to allow adding
              and editing content.
              <div className="mt-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/setup-rls">Configure RLS</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleDismissNotice}>Dismiss Setup Notice</Button>
          <Button asChild variant="outline">
            <Link href="/admin">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
