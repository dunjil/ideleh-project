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
import { fileToBase64, getImageSrc } from "@/lib/image-utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProjectPageProps {
  params: { id: string }
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
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isNew) fetchProject()
  }, [isNew, params.id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`)
      if (!res.ok) throw new Error("Failed to load project")
      const data = await res.json()
      setFormData({
        title: data.title,
        description: data.description,
        content: data.content || "",
        is_featured: data.is_featured,
        display_order: data.display_order,
      })
      if (data.image_data) setImagePreview(getImageSrc(data.image_data))
    } catch {
      toast({ title: "Error", description: "Failed to load project details.", variant: "destructive" })
      router.push("/admin/projects")
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
    if (isNew && !imageFile) {
      toast({ title: "Image Required", description: "Please select an image for the project.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const body: any = { ...formData }
      if (imageFile) body.image_data = await fileToBase64(imageFile)

      const res = isNew
        ? await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch(`/api/admin/projects/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })

      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: isNew ? "Project Created" : "Project Updated", description: `The project has been ${isNew ? "created" : "updated"} successfully.` })
      router.push("/admin/projects")
    } catch (error: any) {
      toast({ title: "Error", description: error.message || `Failed to ${isNew ? "create" : "update"} project.`, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading project details...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/projects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{isNew ? "Create New Project" : "Edit Project"}</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>{isNew ? "Project Details" : "Edit Project Details"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={2} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea id="content" name="content" value={formData.content} onChange={handleInputChange} rows={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Project Image{isNew ? " (required)" : " (leave empty to keep current)"}</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && imagePreview !== "/placeholder.svg" && (
                <div className="mt-2">
                  <p className="mb-2 text-sm">Image Preview:</p>
                  <div className="aspect-video w-full overflow-hidden rounded-md">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(v) => setFormData((p) => ({ ...p, is_featured: v }))} />
              <Label htmlFor="is_featured">Featured Project</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>Cancel</Button>
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
