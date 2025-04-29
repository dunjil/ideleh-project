"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { uploadToStorage } from "@/lib/storage-utils"

export async function createTeamMember(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const bio = formData.get("bio") as string
    const imageFile = formData.get("image") as File | null

    if (!name || !position) {
      throw new Error("Name and position are required")
    }

    let image_path = null

    // Handle image upload if provided
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { path, error } = await uploadToStorage(imageFile, "team")
      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }
      image_path = path
    }

    // Insert the team member
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        name,
        position,
        bio: bio || null,
        image_path,
      })
      .select()

    if (error) {
      throw new Error(`Failed to create team member: ${error.message}`)
    }

    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating team member:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function updateTeamMember(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const bio = formData.get("bio") as string
    const imageFile = formData.get("image") as File | null
    const keepExistingImage = formData.get("keepExistingImage") === "true"

    if (!name || !position) {
      throw new Error("Name and position are required")
    }

    // Prepare update data
    const updateData: any = {
      name,
      position,
      bio: bio || null,
    }

    // Handle image upload if provided
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { path, error } = await uploadToStorage(imageFile, "team")
      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`)
      }
      updateData.image_path = path
    } else if (!keepExistingImage) {
      // Clear image if not keeping existing and no new image provided
      updateData.image_path = null
      updateData.image_url = null
    }

    // Update the team member
    const { error } = await supabase.from("team_members").update(updateData).eq("id", id)

    if (error) {
      throw new Error(`Failed to update team member: ${error.message}`)
    }

    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")

    // Return success instead of redirecting
    return { success: true }
  } catch (error) {
    console.error("Error updating team member:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    // Delete the team member
    const { error } = await supabase.from("team_members").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete team member: ${error.message}`)
    }

    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting team member:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function getTeamMember(id: string) {
  try {
    const { data, error } = await supabase.from("team_members").select("*").eq("id", id).single()

    if (error) {
      throw new Error(`Failed to fetch team member: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching team member:", error)
    return { success: false, error: (error as Error).message }
  }
}
