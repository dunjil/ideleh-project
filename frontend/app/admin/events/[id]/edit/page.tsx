"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { fileToBase64, getImageSrc } from "@/lib/image-utils"
import { api } from "@/lib/api"

interface EditEventPageProps {
  params: { id: string }
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", event_date: "" })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.events.getOne(params.id)
        const formattedDate = new Date(data.event_date).toISOString().slice(0, 16)
        setFormData({ title: data.title, description: data.description, event_date: formattedDate })
        setImagePreview(getImageSrc(data.image_data))
      } catch {
        toast({ title: "Error", description: "Failed to load event details.", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvent()
  }, [params.id, toast])

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
    setIsSubmitting(true)
    try {
      const body: any = { ...formData }
      if (imageFile) body.image_data = await fileToBase64(imageFile)
      await api.events.update(params.id, body)
      toast({ title: "Event Updated", description: "The event has been updated successfully." })
      router.push("/admin/events")
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update event.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return
    try {
      await api.events.delete(params.id)
      toast({ title: "Event Deleted", description: "The event has been deleted successfully." })
      router.push("/admin/events")
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete event.", variant: "destructive" })
    }
  }

  if (isLoading) return <div>Loading event details...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
        <Button variant="destructive" onClick={handleDelete}>Delete Event</Button>
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
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && imagePreview !== "/placeholder.svg" && (
              <div className="mt-2">
                <p className="mb-2 text-sm">Current Image:</p>
                <div className="h-40 w-full overflow-hidden rounded-md">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update Event"}</Button>
            <Button asChild variant="outline"><Link href="/admin/events">Cancel</Link></Button>
          </div>
        </form>
      </div>
    </div>
  )
}
