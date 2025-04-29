"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { getPublicStorageUrl } from "@/lib/storage-utils"
import { Plus, Edit, Trash2, Star, StarOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from("projects").select("*").order("display_order", { ascending: true })

      if (error) throw error

      // Get public URLs for all images
      const projectsWithUrls =
        data?.map((project) => ({
          ...project,
          imageUrl: getPublicStorageUrl("assets", project.image_path),
        })) || []

      setProjects(projectsWithUrls)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("projects").update({ is_featured: !currentStatus }).eq("id", id)

      if (error) throw error

      // Update local state
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? { ...project, is_featured: !currentStatus } : project)),
      )

      toast({
        title: `Project ${!currentStatus ? "Featured" : "Unfeatured"}`,
        description: `The project has been ${!currentStatus ? "featured" : "unfeatured"}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project status.",
        variant: "destructive",
      })
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error

      // Update local state
      setProjects((prev) => prev.filter((project) => project.id !== id))

      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects Management</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-center text-muted-foreground">
                No projects found. Add your first project to get started.
              </p>
              <Button asChild>
                <Link href="/admin/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {project.is_featured && (
                    <div className="absolute right-2 top-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/projects/${project.id}`}>
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => toggleFeatured(project.id, project.is_featured)}>
                      {project.is_featured ? (
                        <>
                          <StarOff className="mr-1 h-4 w-4" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Star className="mr-1 h-4 w-4" />
                          Feature
                        </>
                      )}
                    </Button>

                    <Button variant="destructive" size="sm" onClick={() => deleteProject(project.id)}>
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
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
