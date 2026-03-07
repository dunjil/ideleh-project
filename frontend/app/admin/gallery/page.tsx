"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Upload } from "lucide-react"
import { fileToBase64, getImageSrc } from "@/lib/image-utils"
import Link from "next/link"

export default function AdminGalleryPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [newImage, setNewImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageTitle, setImageTitle] = useState("")

  useEffect(() => { fetchGalleryImages() }, [])

  const fetchGalleryImages = async () => {
    try {
      const res = await fetch("/api/admin/gallery")
      const data = await res.json()
      setGalleryImages(data.map((item: any) => ({ ...item, imageUrl: getImageSrc(item.image_data) })))
    } catch (e) {
      toast({ title: "Error", description: "Failed to load gallery images.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewImage(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newImage) {
      toast({ title: "Image Required", description: "Please select an image to upload.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const image_data = await fileToBase64(newImage)
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: imageTitle || "Gallery Image", image_data }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: "Image Added", description: "The image has been added to the gallery." })
      setNewImage(null)
      setImagePreview(null)
      setImageTitle("")
      fetchGalleryImages()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add image.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: "Image Deleted", description: "The image has been deleted." })
      setGalleryImages(galleryImages.filter((img) => img.id !== id))
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete image.", variant: "destructive" })
    }
  }

  if (isLoading) return <div>Loading gallery...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gallery Management</h1>
        <Button asChild>
          <Link href="/admin/gallery/bulk-upload">
            <Upload className="mr-2 h-4 w-4" />Bulk Upload
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Add New Image</h2>
        <form onSubmit={handleAddImage} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Image Title</Label>
            <Input id="title" value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} placeholder="Enter image title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
            {imagePreview && (
              <div className="mt-2">
                <p className="mb-2 text-sm">Preview:</p>
                <div className="h-40 w-full overflow-hidden rounded-md">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add to Gallery"}</Button>
        </form>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Gallery Images</h2>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {galleryImages.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg">
                <div className="relative aspect-square">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <p className="mb-2 text-center text-white">{item.title}</p>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(item.id)}>
                    <Trash2 className="mr-1 h-4 w-4" />Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No gallery images found. Add some images to get started.</p>
        )}
      </div>
    </div>
  )
}
