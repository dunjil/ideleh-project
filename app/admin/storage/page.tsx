"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Copy, Database, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { StorageBucketChecker } from "@/components/admin/storage-bucket-checker"

export default function StorageManagementPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "SQL Copied",
      description: "The SQL script has been copied to your clipboard.",
    })
  }

  const fixStorageBuckets = async () => {
    setIsLoading(true)
    try {
      // Create buckets if they don't exist
      const buckets = ["events", "gallery"]

      for (const bucket of buckets) {
        // Try to create the bucket (will fail if it already exists)
        await supabase.storage
          .createBucket(bucket, {
            public: true,
          })
          .catch(() => {
            // If it exists, update it to be public
            return supabase.storage.updateBucket(bucket, {
              public: true,
            })
          })
      }

      // Execute SQL to create policies
      const sql = `
        -- Drop existing policies to avoid conflicts
        DROP POLICY IF EXISTS "Allow public access to events bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow insert to events bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow update to events bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow delete from events bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow public access to gallery bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow insert to gallery bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow update to gallery bucket" ON storage.objects;
        DROP POLICY IF EXISTS "Allow delete from gallery bucket" ON storage.objects;

        -- Create unrestricted policies for the events bucket
        CREATE POLICY "Allow public access to events bucket" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'events');

        CREATE POLICY "Allow insert to events bucket" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'events');

        CREATE POLICY "Allow update to events bucket" 
        ON storage.objects FOR UPDATE 
        USING (bucket_id = 'events');

        CREATE POLICY "Allow delete from events bucket" 
        ON storage.objects FOR DELETE 
        USING (bucket_id = 'events');

        -- Create unrestricted policies for the gallery bucket
        CREATE POLICY "Allow public access to gallery bucket" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'gallery');

        CREATE POLICY "Allow insert to gallery bucket" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'gallery');

        CREATE POLICY "Allow update to gallery bucket" 
        ON storage.objects FOR UPDATE 
        USING (bucket_id = 'gallery');

        CREATE POLICY "Allow delete from gallery bucket" 
        ON storage.objects FOR DELETE 
        USING (bucket_id = 'gallery');
      `

      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Storage buckets have been created and policies have been configured.",
      })
    } catch (error: any) {
      console.error("Error fixing storage buckets:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fix storage buckets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const storageBucketSQL = `-- First, make sure the buckets exist and are public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('events', 'events', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public access to events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert to events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete from events bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to gallery bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete from gallery bucket" ON storage.objects;

-- Create unrestricted policies for the events bucket
CREATE POLICY "Allow public access to events bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'events');

CREATE POLICY "Allow insert to events bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'events');

CREATE POLICY "Allow update to events bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'events');

CREATE POLICY "Allow delete from events bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'events');

-- Create unrestricted policies for the gallery bucket
CREATE POLICY "Allow public access to gallery bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Allow insert to gallery bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow update to gallery bucket" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'gallery');

CREATE POLICY "Allow delete from gallery bucket" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'gallery');

-- Enable RLS on storage.objects (it should be enabled by default, but just to be sure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Storage Management</h1>
        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      <StorageBucketChecker />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            Storage Bucket Configuration
          </CardTitle>
          <CardDescription>Configure storage buckets and policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Storage buckets in Supabase have their own RLS system that's separate from database tables. Even if you
              make a bucket "public", you still need to create specific policies for different operations.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">SQL Script for Storage Buckets</h3>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => copyToClipboard(storageBucketSQL)}>
                <Copy className="h-4 w-4 mr-1" />
                Copy SQL
              </Button>
            </div>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-80">{storageBucketSQL}</pre>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Steps to configure storage buckets:</p>
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={fixStorageBuckets} disabled={isLoading}>
            {isLoading ? "Configuring..." : "Fix Storage Buckets"}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("https://supabase.com/dashboard/project/_/storage/buckets", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Storage in Supabase
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Storage Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Common Storage RLS Issues:</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                <li>Missing storage buckets</li>
                <li>Buckets exist but aren't set to public</li>
                <li>Missing RLS policies for storage.objects</li>
                <li>Conflicting RLS policies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">Manual Steps in Supabase Dashboard:</h3>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-gray-600">
                <li>Go to Storage in the Supabase Dashboard</li>
                <li>Create buckets named "events" and "gallery" if they don't exist</li>
                <li>Make sure both buckets are set to "Public"</li>
                <li>Go to Authentication → Policies</li>
                <li>Find "storage.objects" in the table list</li>
                <li>Create policies for SELECT, INSERT, UPDATE, and DELETE for each bucket</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
