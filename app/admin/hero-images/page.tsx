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
import { supabase } from "@/lib/supabase"
import { uploadToStorage, getPublicStorageUrl } from "@/lib/storage-utils"
import { Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function HeroImagesPage() {
  const [heroImages, setHeroImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_active: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchHeroImages()
  }, [])

  const fetchHeroImages = async () => {
    try {
      const { data, error } = await supabase.from("hero_images").select("*").order("display_order", { ascending: true })

      if (error) throw error

      // Get public URLs for all images
      const imagesWithUrls =
        data?.map((item) => ({
          ...item,
          imageUrl: getPublicStorageUrl("assets", item.image_path),
        })) || []

      setHeroImages(imagesWithUrls)
    } catch (error) {
      console.error("Error fetching hero images:", error)
      toast({
        title: "Error",
        description: "Failed to load hero images.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please select an image for the hero slideshow.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload image to assets bucket
      const { path, error: uploadError } = await uploadToStorage(imageFile, "assets")

      if (uploadError) throw uploadError

      // Get the highest display order
      const maxOrder = heroImages.length > 0 ? Math.max(...heroImages.map((img) => img.display_order)) : -1

      // Insert hero image into database
      const { data, error } = await supabase
        .from("hero_images")
        .insert([
          {
            title: formData.title,
            description: formData.description,
            image_path: path,
            is_active: formData.is_active,
            display_order: maxOrder + 1,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Hero Image Added",
        description: "The image has been added to the slideshow.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        is_active: true,
      })
      setImageFile(null)
      setImagePreview(null)
      setShowAddForm(false)

      // Refresh hero images
      fetchHeroImages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add hero image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleImageActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("hero_images").update({ is_active: !currentStatus }).eq("id", id)

      if (error) throw error

      // Update local state
      setHeroImages((prev) => prev.map((img) => (img.id === id ? { ...img, is_active: !currentStatus } : img)))

      toast({
        title: `Image ${!currentStatus ? "Activated" : "Deactivated"}`,
        description: `The image has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update image status.",
        variant: "destructive",
      })
    }
  }

  const moveImage = async (id: string, direction: "up" | "down") => {
    const currentIndex = heroImages.findIndex((img) => img.id === id)
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === heroImages.length - 1)
    ) {
      return
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const targetImage = heroImages[targetIndex]

    try {
      // Swap display orders in database
      const updates = [
        supabase.from("hero_images").update({ display_order: targetImage.display_order }).eq("id", id),
        supabase
          .from("hero_images")
          .update({ display_order: heroImages[currentIndex].display_order })
          .eq("id", targetImage.id),
      ]

      const results = await Promise.all(updates)
      const errors = results.filter((result) => result.error)

      if (errors.length > 0) {
        throw errors[0].error
      }

      // Update local state
      const newImages = [...heroImages]
      newImages[currentIndex] = { ...targetImage }
      newImages[targetIndex] = { ...heroImages[currentIndex] }

      // Sort by display order
      newImages.sort((a, b) => a.display_order - b.display_order)

      setHeroImages(newImages)

      toast({
        title: "Order Updated",
        description: "The slideshow order has been updated.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update image order.",
        variant: "destructive",
      })
    }
  }

  const deleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("hero_images").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setHeroImages((prev) => prev.filter((img) => img.id !== id))

      toast({
        title: "Image Deleted",
        description: "The image has been removed from the slideshow.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete image.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading hero images...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Hero Slideshow Management</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add New Image"}</Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Hero Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="mb-2 text-sm">Preview:</p>
                    <div className="h-40 w-full overflow-hidden rounded-md">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Image"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Slideshow Images</h2>
        {heroImages.length === 0 ? (
          <p className="text-muted-foreground">No images in the slideshow yet. Add some images to get started.</p>
        ) : (
          <div className="space-y-4">
            {heroImages.map((image, index) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-md">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleImageActive(image.id, image.is_active)}
                        >
                          {image.is_active ? (
                            <>
                              <EyeOff className="mr-1 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="mr-1 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(image.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="mr-1 h-4 w-4" />
                          Move Up
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(image.id, "down")}
                          disabled={index === heroImages.length - 1}
                        >
                          <ArrowDown className="mr-1 h-4 w-4" />
                          Move Down
                        </Button>

                        <Button variant="destructive" size="sm" onClick={() => deleteImage(image.id)}>
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
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
