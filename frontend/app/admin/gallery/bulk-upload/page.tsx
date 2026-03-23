"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BulkUpload } from "@/components/admin/bulk-upload"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BulkGalleryUploadPage() {
  const [isComplete, setIsComplete] = useState(false)
  const [meetingName, setMeetingName] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/gallery">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Upload Gallery Images</h1>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <div className="mb-4 space-y-2">
          <label htmlFor="meeting_name" className="text-sm font-medium">Meeting / Conference Name (Applied to all images)</label>
          <input
            id="meeting_name"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="e.g., Abuja Prefects Conference, 2023"
          />
        </div>
      </div>

      <BulkUpload
        bucket="gallery"
        title="Upload Gallery Images"
        description="Select multiple images to upload to the gallery at once."
        additionalData={{ meeting_name: meetingName || "General" }}
        onComplete={() => setIsComplete(true)}
      />

      {isComplete && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/gallery">Return to Gallery</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
