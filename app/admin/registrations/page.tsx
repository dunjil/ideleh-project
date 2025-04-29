import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

async function getRegistrationsWithEvents() {
  const { data, error } = await supabase
    .from("registrations")
    .select(`
      *,
      events:event_id (
        id,
        title,
        event_date
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching registrations:", error)
    return []
  }

  return data || []
}

export default async function AdminRegistrationsPage() {
  const registrations = await getRegistrationsWithEvents()

  // Group registrations by event
  const eventGroups: Record<string, any> = {}

  registrations.forEach((registration) => {
    const eventId = registration.event_id
    if (!eventGroups[eventId]) {
      eventGroups[eventId] = {
        event: registration.events,
        registrations: [],
        count: 0,
      }
    }
    eventGroups[eventId].registrations.push(registration)
    eventGroups[eventId].count++
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">All Registrations</h1>
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Registrations by Event</h2>
        {Object.keys(eventGroups).length > 0 ? (
          <div className="space-y-4">
            {Object.values(eventGroups).map((group: any) => (
              <div key={group.event.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{group.event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(group.event.event_date).toLocaleDateString()} |{group.count}{" "}
                      {group.count === 1 ? "registration" : "registrations"}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/events/${group.event.id}/registrations`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No registrations found.</p>
        )}
      </div>

      <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Recent Registrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Event</th>
                <th className="px-6 py-3">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {registrations.slice(0, 10).map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">
                    {registration.first_name} {registration.last_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{registration.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link href={`/admin/events/${registration.event_id}`} className="text-primary hover:underline">
                      {registration.events.title}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{new Date(registration.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
