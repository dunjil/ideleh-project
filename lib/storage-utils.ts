import { supabase } from "./supabase"

/**
 * Upload a file to a Supabase storage bucket with proper error handling
 */
export async function uploadToStorage(
  file: File,
  bucket: string,
  options?: {
    path?: string
    upsert?: boolean
    cacheControl?: string
  },
): Promise<{ path: string | null; error: Error | null }> {
  try {
    // Check if file is valid
    if (!file || !(file instanceof File) || file.size === 0) {
      console.error("Invalid file provided to uploadToStorage")
      return { path: null, error: new Error("Invalid file provided") }
    }

    // Generate a unique file name to avoid collisions
    const fileName = options?.path || `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, fileBuffer, {
      upsert: options?.upsert || false,
      cacheControl: options?.cacheControl || "3600",
      contentType: file.type,
    })

    if (error) {
      console.error(`Error uploading to ${bucket}:`, error)
      return { path: null, error }
    }

    return { path: data?.path || fileName, error: null }
  } catch (error) {
    console.error(`Exception uploading to ${bucket}:`, error)
    return { path: null, error: error as Error }
  }
}

/**
 * Upload multiple files to a Supabase storage bucket
 */
export async function uploadMultipleToStorage(
  files: File[],
  bucket: string,
): Promise<{ successful: { file: File; path: string }[]; failed: { file: File; error: Error }[] }> {
  const results = {
    successful: [] as { file: File; path: string }[],
    failed: [] as { file: File; error: Error }[],
  }

  // Process files sequentially to avoid overwhelming the API
  for (const file of files) {
    const { path, error } = await uploadToStorage(file, bucket)

    if (path) {
      results.successful.push({ file, path })
    } else if (error) {
      results.failed.push({ file, error })
    }
  }

  return results
}

/**
 * Get a public URL for a file in a storage bucket
 */
export function getPublicStorageUrl(bucket: string, path: string): string {
  if (!path) return ""

  // Check if it's already a URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Get the public URL from Supabase
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ""
}

/**
 * Delete a file from a storage bucket
 */
export async function deleteFromStorage(
  bucket: string,
  path: string,
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error(`Error deleting from ${bucket}:`, error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error(`Exception deleting from ${bucket}:`, error)
    return { success: false, error: error as Error }
  }
}
