"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getTeamMember, updateTeamMember } from "../../actions"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { getImageSrc } from "@/lib/image-utils"

interface TeamMember {
  id: string
  name: string
  position: string
  bio: string | null
  image_path: string | null
  image_url: string | null
}

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [keepExistingImage, setKeepExistingImage] = useState(true)

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const result = await getTeamMember(params.id)
        if (!result.success || !result.data) {
          setError("Failed to load team member data")
          return
        }

        setTeamMember(result.data)

        if (result.data.image_data) {
          setImagePreview(getImageSrc(result.data.image_data))
        }
      } catch (err) {
        setError((err as Error).message || "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMember()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append("keepExistingImage", keepExistingImage.toString())

      const result = await updateTeamMember(params.id, formData)

      if (result.success) {
        // Handle successful update on the client side
        router.push("/admin/team")
        router.refresh()
      } else {
        setError(result.error || "Failed to update team member")
        setIsSubmitting(false)
      }
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size > 0) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setKeepExistingImage(false)
    } else {
      setKeepExistingImage(true)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!teamMember) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600">Team member not found</h2>
          <p className="mt-2 text-red-500">The requested team member could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/team">Back to Team Members</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/team">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team Members
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Team Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Information</CardTitle>
          <CardDescription>Update the details for this team member.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required placeholder="Enter full name" defaultValue={teamMember.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                name="position"
                required
                placeholder="Enter position or title"
                defaultValue={teamMember.position}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Enter a short biography"
                rows={4}
                defaultValue={teamMember.bio || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              {imagePreview && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keepImage"
                      checked={keepExistingImage}
                      onCheckedChange={(checked) => setKeepExistingImage(checked as boolean)}
                    />
                    <Label htmlFor="keepImage" className="text-sm font-normal">
                      Keep existing image
                    </Label>
                  </div>
                  <div className="mt-2">
                    <p className="mb-2 text-sm text-gray-500">Current image:</p>
                    <div className="relative h-40 w-40 overflow-hidden rounded-md">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Team Member"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
