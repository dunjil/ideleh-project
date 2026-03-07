"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { fileToBase64, getImageSrc } from "@/lib/image-utils"
import { Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function HeroImagesPage() {
  const [heroImages, setHeroImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", is_active: true })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => { fetchHeroImages() }, [])

  const fetchHeroImages = async () => {
    try {
      const res = await fetch("/api/admin/hero-images")
      const data = await res.json()
      setHeroImages(data.map((item: any) => ({ ...item, imageUrl: getImageSrc(item.image_data) })))
    } catch {
      toast({ title: "Error", description: "Failed to load hero images.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      toast({ title: "Image Required", description: "Please select an image.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const image_data = await fileToBase64(imageFile)
      const res = await fetch("/api/admin/hero-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image_data }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: "Hero Image Added", description: "The image has been added to the slideshow." })
      setFormData({ title: "", description: "", is_active: true })
      setImageFile(null)
      setImagePreview(null)
      setShowAddForm(false)
      fetchHeroImages()
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add hero image.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleImageActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/hero-images/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })
      setHeroImages((prev) => prev.map((img) => (img.id === id ? { ...img, is_active: !currentStatus } : img)))
      toast({ title: `Image ${!currentStatus ? "Activated" : "Deactivated"}` })
    } catch {
      toast({ title: "Error", description: "Failed to update image status.", variant: "destructive" })
    }
  }

  const moveImage = async (id: string, direction: "up" | "down") => {
    const idx = heroImages.findIndex((img) => img.id === id)
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === heroImages.length - 1)) return
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    const target = heroImages[targetIdx]
    await Promise.all([
      fetch(`/api/admin/hero-images/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ display_order: target.display_order }) }),
      fetch(`/api/admin/hero-images/${target.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ display_order: heroImages[idx].display_order }) }),
    ])
    const newImages = [...heroImages]
    newImages[idx] = { ...target }
    newImages[targetIdx] = { ...heroImages[idx] }
    setHeroImages(newImages.sort((a, b) => a.display_order - b.display_order))
    toast({ title: "Order Updated" })
  }

  const deleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    try {
      await fetch(`/api/admin/hero-images/${id}`, { method: "DELETE" })
      setHeroImages((prev) => prev.filter((img) => img.id !== id))
      toast({ title: "Image Deleted" })
    } catch {
      toast({ title: "Error", description: "Failed to delete image.", variant: "destructive" })
    }
  }

  if (isLoading) return <div>Loading hero images...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Hero Slideshow Management</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add New Image"}</Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader><CardTitle>Add New Hero Image</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
                {imagePreview && (
                  <div className="mt-2 h-40 w-full overflow-hidden rounded-md">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={(v) => setFormData((p) => ({ ...p, is_active: v }))} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Image"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Slideshow Images</h2>
        {heroImages.length === 0 ? (
          <p className="text-muted-foreground">No images in the slideshow yet.</p>
        ) : (
          <div className="space-y-4">
            {heroImages.map((image, index) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-md">
                      <Image src={image.imageUrl || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                      {!image.is_active && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <p className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">Inactive</p>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium">{image.title}</h3>
                      {image.description && <p className="mt-1 text-sm text-muted-foreground">{image.description}</p>}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleImageActive(image.id, image.is_active)}>
                          {image.is_active ? <><EyeOff className="mr-1 h-4 w-4" />Deactivate</> : <><Eye className="mr-1 h-4 w-4" />Activate</>}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => moveImage(image.id, "up")} disabled={index === 0}><ArrowUp className="mr-1 h-4 w-4" />Move Up</Button>
                        <Button variant="outline" size="sm" onClick={() => moveImage(image.id, "down")} disabled={index === heroImages.length - 1}><ArrowDown className="mr-1 h-4 w-4" />Move Down</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteImage(image.id)}><Trash2 className="mr-1 h-4 w-4" />Delete</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
