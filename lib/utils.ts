import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/lib/supabaseClient"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function downloadCSV(data: any[], filename: string) {
  // Convert object array to CSV string
  const csvRows = []

  // Get headers
  const headers = Object.keys(data[0])
  csvRows.push(headers.join(","))

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Handle strings with commas by wrapping in quotes
      return `"${value}"`
    })
    csvRows.push(values.join(","))
  }

  // Create CSV content
  const csvString = csvRows.join("\n")

  // Create download link
  const blob = new Blob([csvString], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute("download", filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// Add this function to handle file uploads to Supabase Storage
export async function uploadFileToStorage(file: File, bucket: string): Promise<string | null> {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

    if (error) throw error

    // Return the path to the file
    return fileName
  } catch (error) {
    console.error("Error uploading file:", error)
    return null
  }
}
