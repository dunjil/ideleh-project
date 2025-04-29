import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getPublicStorageUrl } from "@/lib/storage-utils"

async function getEvents() {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false }) // Newest first

    if (error) {
      console.error("Error fetching events:", error)
      return []
    }

    return data.map(event => ({
      ...event,
      imageUrl: event.image_path ? getPublicStorageUrl("events", event.image_path) : null
    })) || []
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

function categorizeEvents(events: any[]) {
  const now = new Date()
  return events.reduce((acc, event) => {
    const eventDate = new Date(event.event_date)
    if (eventDate >= now) {
      acc.upcoming.push(event)
    } else {
      acc.past.push(event)
    }
    return acc
  }, { upcoming: [], past: [] })
}

function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default async function EventsPage() {
  const events = await getEvents()
  const { upcoming, past } = categorizeEvents(events)

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our <span className="text-primary">Events</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Join us at our upcoming events and programs designed to inspire, educate, and connect future leaders.
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">Upcoming Events</h2>
        
        {upcoming.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} isUpcoming={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No upcoming events at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Past Events */}
      <div className="mt-24">
        <h2 className="mb-8 text-2xl font-bold">Past Events</h2>
        
        {past.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {past.map(event => (
              <EventCard key={event.id} event={event} isUpcoming={false} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No past events to display.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ event, isUpcoming }: { event: any, isUpcoming: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
      {/* Event image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={event.imageUrl || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(event.title)}`}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Upcoming badge */}
        {isUpcoming && (
          <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            Upcoming
          </div>
        )}
      </div>

      {/* Event content */}
      <div className="p-6">
        <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formatEventDate(event.event_date)}</span>
        </div>
        
        {event.location && (
          <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}

        <h3 className="mb-3 text-xl font-bold">{event.title}</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">
          {event.description}
        </p>
        
        <div className="flex justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          {isUpcoming && (
            <Button asChild size="sm">
              <Link href={`/events/${event.id}#register`}>Register</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
