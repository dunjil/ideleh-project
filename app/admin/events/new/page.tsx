"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { fileToBase64 } from "@/lib/image-utils"

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", event_date: "" })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      toast({ title: "Image Required", description: "Please select an image for the event.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const image_data = await fileToBase64(imageFile)
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_data }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: "Event Created", description: "The event has been created successfully." })
      router.push("/admin/events")
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create event.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_date">Event Date and Time</Label>
            <Input id="event_date" name="event_date" type="datetime-local" value={formData.event_date} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} required />
            {imagePreview && (
              <div className="mt-2">
                <p className="mb-2 text-sm">Preview:</p>
                <div className="h-40 w-full overflow-hidden rounded-md">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Event"}</Button>
            <Button asChild variant="outline"><Link href="/admin/events">Cancel</Link></Button>
          </div>
        </form>
      </div>
    </div>
  )
}
