"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarDays, ImageIcon, Users, AlertCircle, Shield, Database, Copy, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RlsStatusChecker } from "@/components/admin/rls-status-checker"
import { StorageBucketChecker } from "@/components/admin/storage-bucket-checker"

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: message,
    })
  }

  const dbSetupSQL = `-- Create events table
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
  FOR DELETE USING (auth.uid() = user_id);`

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

      {/* Add the RLS Status Checker here */}
      <RlsStatusChecker />
      <StorageBucketChecker />

      <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle>Setup Notice</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>
            If you're experiencing issues with the application, you may need to set up the database tables, configure
            Row Level Security (RLS), and set up authentication.
          </p>
          <div className="flex gap-2 mt-2">
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href="#setup">View Setup Instructions</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-fit"
              onClick={() => {
                window.open("https://supabase.com/dashboard", "_blank")
              }}
            >
              <Link href="https://supabase.com/dashboard" target="_blank">
                Open Supabase Dashboard
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
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

      <div id="setup">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="database">Database Setup</TabsTrigger>
            <TabsTrigger value="rls">RLS Configuration</TabsTrigger>
            <TabsTrigger value="auth">Auth Setup</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Setup Overview</CardTitle>
                <CardDescription>
                  Complete these steps to ensure your IDELEH website functions correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    Step 1: Database Setup
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create the necessary database tables to store events, registrations, gallery items, and team
                    members.
                  </p>
                  <Button variant="outline" size="sm" className="mt-1" onClick={() => setActiveTab("database")}>
                    View Database Setup
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    Step 2: RLS Configuration
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure Row Level Security to allow adding and editing content in your database.
                  </p>
                  <Button variant="outline" size="sm" className="mt-1" onClick={() => setActiveTab("rls")}>
                    View RLS Configuration
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    Step 3: Authentication Setup
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create the tasks table and configure authentication and user-specific RLS policies.
                  </p>
                  <Button variant="outline" size="sm" className="mt-1" onClick={() => setActiveTab("auth")}>
                    View Auth Setup
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-green-500" />
                    Step 4: Create Storage Buckets
                  </h3>
                  <p className="text-sm text-gray-600">Create storage buckets for event images and gallery items.</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => {
                      window.open("https://supabase.com/dashboard", "_blank")
                    }}
                  >
                    <Link href="https://supabase.com/dashboard" target="_blank">
                      Open Supabase Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  Database Setup
                </CardTitle>
                <CardDescription>Create the necessary database tables</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">
                  Run the following SQL in your Supabase SQL Editor to create the required tables:
                </p>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(dbSetupSQL, "Database setup SQL copied to clipboard")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-xs overflow-auto mb-4 max-h-80">
                    {dbSetupSQL}
                  </pre>
                </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rls" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  RLS Configuration
                </CardTitle>
                <CardDescription>Configure Row Level Security policies</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">
                  Run the following SQL in your Supabase SQL Editor to configure RLS:
                </p>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(rlsSetupSQL, "RLS setup SQL copied to clipboard")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-xs overflow-auto mb-4 max-h-80">
                    {rlsSetupSQL}
                  </pre>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Steps to configure RLS:</p>
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
                <div className="mt-4 p-3 bg-amber-50 rounded-md text-amber-800 text-sm">
                  <p className="font-medium">Note:</p>
                  <p>
                    This configuration disables Row Level Security for all tables. In a production environment, you
                    should configure more restrictive policies.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-500" />
                  Authentication Setup
                </CardTitle>
                <CardDescription>Create the tasks table and configure authentication RLS policies</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">
                  Run the following SQL in your Supabase SQL Editor to create the tasks table and configure
                  authentication RLS policies:
                </p>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => copyToClipboard(authSetupSQL, "Auth setup SQL copied to clipboard")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-xs overflow-auto mb-4 max-h-80">
                    {authSetupSQL}
                  </pre>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Steps to configure authentication:</p>
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
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
                  <p className="font-medium">Important:</p>
                  <p>
                    This script creates the tasks table and configures RLS policies for it. The <code>user_id</code>{" "}
                    column in the tasks table will match the <code>auth.uid()</code> value from Supabase Auth, ensuring
                    that users can only access their own tasks.
                  </p>
                </div>
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/admin/setup-auth">Configure Authentication</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Quick Help</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <span className="font-medium">Events:</span> Create, edit, and manage events. View and export registrations.
          </li>
          <li>
            <span className="font-medium">Gallery:</span> Upload and manage images for the gallery section.
          </li>
          <li>
            <span className="font-medium">Team:</span> Manage team member profiles and information.
          </li>
          <li>
            <span className="font-medium">Tasks:</span> User-specific tasks with proper authentication and RLS.
          </li>
          <li>
            <span className="font-medium">Setup:</span> Configure database tables, Row Level Security, and
            authentication.
          </li>
        </ul>
      </div>
    </div>
  )
}
