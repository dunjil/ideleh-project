import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}
