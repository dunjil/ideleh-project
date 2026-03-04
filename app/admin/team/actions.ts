"use server"

import { query } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createTeamMember(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const bio = formData.get("bio") as string
    const image_data = formData.get("image_data") as string | null

    if (!name || !position) throw new Error("Name and position are required")

    await query(
      "INSERT INTO team_members (name, position, bio, image_data) VALUES ($1, $2, $3, $4)",
      [name, position, bio || null, image_data || null],
    )

    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")
    return { success: true }
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
    const image_data = formData.get("image_data") as string | null

    if (!name || !position) throw new Error("Name and position are required")

    await query(
      `UPDATE team_members SET name = $1, position = $2, bio = $3${image_data ? ", image_data = $4" : ""} WHERE id = ${image_data ? "$5" : "$4"}`,
      image_data ? [name, position, bio || null, image_data, id] : [name, position, bio || null, id],
    )

    revalidatePath("/admin/team")
    revalidatePath("/team")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating team member:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await query("DELETE FROM team_members WHERE id = $1", [id])
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
    const [data] = await query("SELECT * FROM team_members WHERE id = $1", [id])
    if (!data) throw new Error("Team member not found")
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching team member:", error)
    return { success: false, error: (error as Error).message }
  }
}
