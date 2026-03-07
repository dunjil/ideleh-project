import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Database } from "lucide-react"

export default function StorageManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Storage Management</h1>
        <Button asChild variant="outline">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Image Storage — PostgreSQL (Base64)
          </CardTitle>
          <CardDescription>
            Images are stored as base64 strings directly in the PostgreSQL database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This project no longer uses Supabase Storage. All images are uploaded via the admin forms and saved
            as <code className="rounded bg-muted px-1 font-mono text-sm">image_data</code> columns (base64-encoded strings) in their respective tables.
          </p>
          <p className="text-muted-foreground">
            To manage images, use the respective admin sections:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm">
            <li><Link href="/admin/hero-images" className="text-primary underline-offset-4 hover:underline">Hero Images</Link> — homepage slideshow images</li>
            <li><Link href="/admin/gallery" className="text-primary underline-offset-4 hover:underline">Gallery</Link> — public gallery images</li>
            <li><Link href="/admin/events" className="text-primary underline-offset-4 hover:underline">Events</Link> — event cover images</li>
            <li><Link href="/admin/projects" className="text-primary underline-offset-4 hover:underline">Projects</Link> — project images</li>
            <li><Link href="/admin/team" className="text-primary underline-offset-4 hover:underline">Team</Link> — team member profile photos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
