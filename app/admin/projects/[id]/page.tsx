"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { uploadToStorage, getPublicStorageUrl } from "@/lib/storage-utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const isNew = params.id === "new"
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    is_featured: false,
    display_order: 0,
    image_path: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isNew) {
      fetchProject()
    }
  }, [isNew, params.id])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

      if (error) throw error

      setFormData({
        title: data.title,
        description: data.description,
        content: data.content,
        is_featured: data.is_featured,
        display_order: data.display_order,
        image_path: data.image_path,
      })

      // Set image preview
      if (data.image_path) {
        setImagePreview(getPublicStorageUrl("assets", data.image_path))
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      toast({
        title: "Error",
        description: "Failed to load project details.",
        variant: "destructive",
      })
      router.push("/admin/projects")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }))
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
    setIsSubmitting(true)

    try {
      let imagePath = formData.image_path

      // If a new image was selected, upload it
      if (imageFile) {
        const { path, error: uploadError } = await uploadToStorage(imageFile, "assets")

        if (uploadError) throw uploadError
        imagePath = path
      } else if (isNew) {
        // New project requires an image
        toast({
          title: "Image Required",
          description: "Please select an image for the project.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (isNew) {
        // Get the highest display order
        const { data: projectsData } = await supabase
          .from("projects")
          .select("display_order")
          .order("display_order", { ascending: false })
          .limit(1)

        const maxOrder = projectsData && projectsData.length > 0 ? projectsData[0].display_order : -1

        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert([
            {
              title: formData.title,
              description: formData.description,
              content: formData.content,
              image_path: imagePath,
              is_featured: formData.is_featured,
              display_order: maxOrder + 1,
            },
          ])
          .select()

        if (error) throw error

        toast({
          title: "Project Created",
          description: "The project has been created successfully.",
        })

        router.push("/admin/projects")
      } else {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update({
            title: formData.title,
            description: formData.description,
            content: formData.content,
            image_path: imagePath,
            is_featured: formData.is_featured,
            updated_at: new Date().toISOString(),
          })
          .eq("id", params.id)

        if (error) throw error

        toast({
          title: "Project Updated",
          description: "The project has been updated successfully.",
        })

        router.push("/admin/projects")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isNew ? "create" : "update"} project.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading project details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{isNew ? "Create New Project" : "Edit Project"}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Project Details" : "Edit Project Details"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                required
              />
              <p className="text-xs text-muted-foreground">
                A brief description that will appear in project cards and previews.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                required
              />
              <p className="text-xs text-muted-foreground">
                The full project description that will appear on the project detail page.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Project Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <p className="mb-2 text-sm">Image Preview:</p>
                  <div className="aspect-video w-full overflow-hidden rounded-md">
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
              <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_featured">Featured Project</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isNew ? "Creating..." : "Updating...") : isNew ? "Create Project" : "Update Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
