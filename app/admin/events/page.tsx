import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

async function getEvents() {
  try {
    const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false })

    if (error) {
      console.error("Error fetching events:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export default async function AdminEventsPage() {
  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <Button asChild>
          <Link href="/admin/events/new">Add New Event</Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Registrations</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <Image
                          src={getImageUrl(event.image_path) || "/placeholder.svg"}
                          alt={event.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{event.title}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatDate(event.event_date)}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link href={`/admin/events/${event.id}/registrations`} className="text-primary hover:underline">
                        View Registrations
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/events/${event.id}`}>View</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/events/${event.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No events found. Create a new event to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Helper function to safely get image URL
function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/placeholder.svg?height=100&width=100"
  }

  // Check if it's a data URL
  if (typeof imagePath === "string" && imagePath.startsWith("data:")) {
    return imagePath
  }

  // Check if it's a URL
  if (typeof imagePath === "string" && (imagePath.startsWith("http://") || imagePath.startsWith("https://"))) {
    return imagePath
  }

  // Otherwise, assume it's a path in Supabase Storage
  try {
    const { data } = supabase.storage.from("events").getPublicUrl(imagePath)
    return data?.publicUrl || "/placeholder.svg?height=100&width=100"
  } catch (error) {
    console.error("Error getting image URL:", error)
    return "/placeholder.svg?height=100&width=100"
  }
}
