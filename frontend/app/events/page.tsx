import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

async function getEvents() {
  try {
    const data = await api.events.getAll()

    // If no data from API, return fallback events
    if (!data || data.length === 0) {
      return [
        {
          id: "fallback-1",
          title: "LeaderZ Conference 2026",
          description: "Join us for our annual conference designed to empower secondary school prefects with essential leadership skills. Network with fellow leaders, learn from industry experts, and unlock your leadership potential.",
          event_date: "2026-08-15T09:00:00",
          location: "Abuja, Nigeria",
          imageUrl: "/images/leaderz.jpg",
          max_attendees: 200,
          is_free: false,
          price: 5000,
          currency: "NGN",
          payment_details: `
            <h4>Bank Transfer Details:</h4>
            <p><strong>Bank Name:</strong> First Bank of Nigeria</p>
            <p><strong>Account Name:</strong> Ideal Leadership Hub</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <br/>
            <p>After making payment, please upload your payment receipt when registering.</p>
          `
        },
        {
          id: "fallback-2",
          title: "Nation Building Conference",
          description: "An inspiring conference for aspiring leaders to learn about nation building, patriotism, and community development. Designed for university students and young professionals who want to make a difference.",
          event_date: "2026-09-20T10:00:00",
          location: "University of Jos, Plateau State",
          imageUrl: "/images/nbc.jpg",
          max_attendees: 300,
          is_free: true,
          price: 0,
          currency: "NGN"
        },
        {
          id: "fallback-3",
          title: "Mentorship Training Workshop",
          description: "A comprehensive workshop for mentors and mentees to build effective mentorship relationships. Learn proven strategies for personal growth and leadership development.",
          event_date: "2026-07-10T14:00:00",
          location: "Virtual Event",
          imageUrl: "/images/mentorship.jpg",
          max_attendees: 150,
          is_free: true,
          price: 0,
          currency: "NGN"
        }
      ]
    }

    return data.map((event: any) => ({ ...event, imageUrl: getImageSrc(event.image_data) }))
  } catch (e) {
    console.error("Error fetching events:", e)
    // Return fallback events on error
    return [
      {
        id: "fallback-1",
        title: "LeaderZ Conference 2026",
        description: "Join us for our annual conference designed to empower secondary school prefects with essential leadership skills.",
        event_date: "2026-08-15T09:00:00",
        location: "Abuja, Nigeria",
        imageUrl: "/images/leaderz.jpg",
        max_attendees: 200,
        is_free: false,
        price: 5000,
        currency: "NGN",
        payment_details: `
          <h4>Bank Transfer Details:</h4>
          <p><strong>Bank Name:</strong> First Bank of Nigeria</p>
          <p><strong>Account Name:</strong> Ideal Leadership Hub</p>
          <p><strong>Account Number:</strong> 1234567890</p>
        `
      }
    ]
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
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
          Our <span className="text-primary">Events</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4 sm:px-0">
          Join us at our upcoming events and programs designed to inspire, educate, and connect future leaders.
        </p>
      </div>

      {/* Upcoming Events */}
      <div className="mt-12 sm:mt-16">
        <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold">Upcoming Events</h2>

        {upcoming.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event: any) => (
              <EventCard key={event.id} event={event} isUpcoming={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 sm:p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              No upcoming events at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Past Events */}
      <div className="mt-16 sm:mt-20 md:mt-24">
        <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold">Past Events</h2>

        {past.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event: any) => (
              <EventCard key={event.id} event={event} isUpcoming={false} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 sm:p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
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
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800 flex flex-col h-full">
      {/* Event image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden">
        <Image
          src={event.imageUrl || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(event.title)}`}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute left-3 sm:left-4 top-3 sm:top-4 flex gap-1.5 sm:gap-2 flex-wrap max-w-[calc(100%-24px)]">
          {isUpcoming && (
            <div className="rounded-full bg-green-500 px-2.5 sm:px-3 py-1 text-xs font-semibold text-white">
              Upcoming
            </div>
          )}
          {event.is_free ? (
            <div className="rounded-full bg-blue-500 px-2.5 sm:px-3 py-1 text-xs font-semibold text-white">
              FREE
            </div>
          ) : (
            <div className="rounded-full bg-purple-500 px-2.5 sm:px-3 py-1 text-xs font-semibold text-white">
              {event.currency || "NGN"} {event.price?.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Event content */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="mb-2 flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="line-clamp-1">{formatEventDate(event.event_date)}</span>
        </div>

        {event.location && (
          <div className="mb-2 flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}

        <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold line-clamp-2">{event.title}</h3>
        <p className="mb-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
          {event.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between mt-auto">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          {isUpcoming && (
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href={`/events/${event.id}/register`}>Register</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
