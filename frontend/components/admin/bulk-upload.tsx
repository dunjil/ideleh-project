"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { fileToBase64 } from "@/lib/image-utils"
import { X, Upload } from "lucide-react"

interface BulkUploadProps {
  bucket: string
  onComplete?: () => void
  title?: string
  description?: string
  maxFiles?: number
  acceptedFileTypes?: string
}

export function BulkUpload({
  bucket,
  onComplete,
  title = "Bulk Upload",
  description = "Upload multiple files at once",
  maxFiles = 20,
  acceptedFileTypes = "image/*",
}: BulkUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)

    // Check if adding these files would exceed the maximum
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files at once.`,
        variant: "destructive",
      })
      return
    }

    // Add new files to the existing array
    setFiles((prev) => [...prev, ...selectedFiles])

    // Generate previews for the new files
    selectedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setIsUploading(true)
    setProgress(0)
    setUploadedCount(0)
    setFailedCount(0)
    let succeeded = 0
    let failed = 0
    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const image_data = await fileToBase64(files[i])
          const title = files[i].name.split(".")[0].replace(/-/g, " ")
          const res = await fetch("/api/admin/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, image_data }),
          })
          if (res.ok) { succeeded++ } else { failed++ }
        } catch { failed++ }
        setProgress(Math.round(((i + 1) / files.length) * 100))
        setUploadedCount(succeeded)
        setFailedCount(failed)
      }
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${succeeded} files.${failed > 0 ? ` Failed: ${failed}.` : ""}`,
        variant: failed > 0 ? "destructive" : "default",
      })
      if (failed === 0) {
        setFiles([]); setPreviews([])
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
      if (onComplete) onComplete()
    } catch {
      toast({ title: "Upload Failed", description: "An error occurred during the upload process.", variant: "destructive" })
    } finally {
      setIsUploading(false)
      setProgress(100)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="files">Select Files</Label>
            <Input
              ref={fileInputRef}
              id="files"
              type="file"
              multiple
              accept={acceptedFileTypes}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">You can select up to {maxFiles} files at once.</p>
          </div>

          {previews.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Selected Files ({files.length})</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {previews.map((preview, index) => (
                  <div key={index} className="group relative aspect-square overflow-hidden rounded-md border">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={files[index].name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-xs text-white">
                      {files[index].name.length > 15 ? files[index].name.substring(0, 12) + "..." : files[index].name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>
                  {uploadedCount} of {files.length} complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setFiles([])
            setPreviews([])
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }}
          disabled={isUploading || files.length === 0}
        >
          Clear
        </Button>
        <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="gap-1">
          <Upload className="h-4 w-4" />
          Upload {files.length > 0 ? `(${files.length})` : ""}
        </Button>
      </CardFooter>
    </Card>
  )
}
