import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"
import { notFound } from "next/navigation"

interface EventPageProps {
  params: { id: string }
}

async function getEvent(id: string) {
  // Handle fallback events
  if (id.startsWith('fallback-')) {
    const fallbackEvents: Record<string, any> = {
      'fallback-1': {
        id: "fallback-1",
        title: "LeaderZ Conference 2026",
        description: "Join us for our annual conference designed to empower secondary school prefects with essential leadership skills. Network with fellow leaders, learn from industry experts, and unlock your leadership potential. Through interactive workshops, group exercises, and real-world case studies, participants will gain practical insights and tools to enhance their leadership capabilities.",
        event_date: "2026-08-15T09:00:00",
        location: "Abuja, Nigeria",
        image_data: "/images/leaderz.jpg",
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
      'fallback-2': {
        id: "fallback-2",
        title: "Nation Building Conference",
        description: "An inspiring conference for aspiring leaders to learn about nation building, patriotism, and community development. Designed for university students and young professionals who want to make a difference in their communities and the nation at large.",
        event_date: "2026-09-20T10:00:00",
        location: "University of Jos, Plateau State",
        image_data: "/images/nbc.jpg",
        max_attendees: 300,
        is_free: true,
        price: 0,
        currency: "NGN"
      },
      'fallback-3': {
        id: "fallback-3",
        title: "Mentorship Training Workshop",
        description: "A comprehensive workshop for mentors and mentees to build effective mentorship relationships. Learn proven strategies for personal growth and leadership development through structured mentorship programs.",
        event_date: "2026-07-10T14:00:00",
        location: "Virtual Event",
        image_data: "/images/mentorship.jpg",
        max_attendees: 150,
        is_free: true,
        price: 0,
        currency: "NGN"
      }
    }
    return fallbackEvents[id] || null
  }

  try {
    return await api.events.getOne(id)
  } catch (e) {
    console.error("Error fetching event:", e)
    return null
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.id)
  if (!event) notFound()
  const imageUrl = getImageSrc(event.image_data)

  const eventDate = new Date(event.event_date)
  const isPastEvent = eventDate < new Date()

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
          <Image
            src={imageUrl || "/placeholder.svg?height=600&width=800"}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{event.title}</h1>

          <div className="mt-6 space-y-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              <time dateTime={event.event_date}>{formatDate(event.event_date)}</time>
            </div>
            {event.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              <span className="font-semibold">
                {event.is_free ? (
                  <span className="text-green-600 dark:text-green-400">FREE</span>
                ) : (
                  <span>{event.currency || "NGN"} {event.price?.toLocaleString()}</span>
                )}
              </span>
            </div>
            {event.max_attendees && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="mr-2 h-5 w-5 text-primary" />
                <span>Max Attendees: {event.max_attendees}</span>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">About this event</h2>
            <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-400">
              <p>{event.description}</p>
            </div>
          </div>

          <div className="mt-8">
            {!isPastEvent ? (
              <Button asChild size="lg">
                <Link href={`/events/${event.id}/register`}>Register Now</Link>
              </Button>
            ) : (
              <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  This event has already taken place. Check out our upcoming events.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
