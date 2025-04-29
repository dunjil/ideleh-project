"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTeamMember } from "../actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewTeamMemberPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await createTeamMember(formData)

      if (result.success) {
        router.push("/admin/team")
        router.refresh()
      } else {
        setError(result.error || "Failed to create team member")
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
    } else {
      setImagePreview(null)
    }
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
        <h1 className="text-3xl font-bold">Add New Team Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Information</CardTitle>
          <CardDescription>Enter the details for the new team member.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required placeholder="Enter full name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input id="position" name="position" required placeholder="Enter position or title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" placeholder="Enter a short biography" rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              {imagePreview && (
                <div className="mt-2 mb-4">
                  <p className="mb-2 text-sm text-gray-500">Image preview:</p>
                  <div className="relative h-40 w-40 overflow-hidden rounded-md">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Team Member"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
