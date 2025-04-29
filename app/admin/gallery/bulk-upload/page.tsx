"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BulkUpload } from "@/components/admin/bulk-upload"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BulkGalleryUploadPage() {
  const [isComplete, setIsComplete] = useState(false)

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

      <BulkUpload
        bucket="gallery"
        title="Upload Gallery Images"
        description="Select multiple images to upload to the gallery at once."
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
