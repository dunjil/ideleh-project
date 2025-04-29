"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function StorageBucketChecker() {
  const [checking, setChecking] = useState(true)
  const [bucketIssues, setBucketIssues] = useState<string[]>([])
  const [fixing, setFixing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function checkBuckets() {
      try {
        const buckets = ["events", "gallery"]
        const issues: string[] = []

        for (const bucket of buckets) {
          // Check if bucket exists
          const { data, error } = await supabase.storage.getBucket(bucket)

          if (error) {
            issues.push(`${bucket} (doesn't exist)`)
            continue
          }

          // Check if bucket is public
          if (!data.public) {
            issues.push(`${bucket} (not public)`)
          }

          // Try to list files to check permissions
          const { error: listError } = await supabase.storage.from(bucket).list()
          if (listError) {
            issues.push(`${bucket} (permission denied)`)
          }
        }

        setBucketIssues([...new Set(issues)]) // Remove duplicates
      } catch (error) {
        console.error("Error checking buckets:", error)
        setBucketIssues(["Error checking buckets"])
      } finally {
        setChecking(false)
      }
    }

    checkBuckets()
  }, [])

  const fixBucketIssues = async () => {
    setFixing(true)

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
        title: "Storage Buckets Fixed",
        description: "Storage buckets have been created and policies have been configured.",
      })

      // Recheck buckets
      setChecking(true)
      setBucketIssues([])

      // Wait a moment before rechecking
      setTimeout(async () => {
        const buckets = ["events", "gallery"]
        const issues: string[] = []

        for (const bucket of buckets) {
          // Check if bucket exists
          const { data, error } = await supabase.storage.getBucket(bucket)

          if (error) {
            issues.push(`${bucket} (doesn't exist)`)
            continue
          }

          // Check if bucket is public
          if (!data.public) {
            issues.push(`${bucket} (not public)`)
          }

          // Try to list files to check permissions
          const { error: listError } = await supabase.storage.from(bucket).list()
          if (listError) {
            issues.push(`${bucket} (permission denied)`)
          }
        }

        setBucketIssues([...new Set(issues)]) // Remove duplicates
        setChecking(false)
      }, 2000)
    } catch (error: any) {
      console.error("Error fixing buckets:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fix storage buckets",
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
        <AlertTitle>Checking Storage Buckets</AlertTitle>
        <AlertDescription>Checking storage bucket configuration...</AlertDescription>
      </Alert>
    )
  }

  if (bucketIssues.length === 0) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Storage Buckets OK</AlertTitle>
        <AlertDescription>Storage buckets are properly configured.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle>Storage Bucket Issues Detected</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>The following storage bucket issues were detected:</p>
        <ul className="list-disc list-inside">
          {bucketIssues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
        <div className="flex gap-2 mt-2">
          <Button onClick={fixBucketIssues} disabled={fixing} size="sm" variant="outline" className="w-fit">
            {fixing ? "Fixing Buckets..." : "Fix Storage Buckets"}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
