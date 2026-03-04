import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { query } from "@/lib/db"
import { getImageSrc } from "@/lib/image-utils"
import { notFound } from "next/navigation"

interface EventPageProps {
  params: { id: string }
}

async function getEvent(id: string) {
  try {
    const [row] = await query("SELECT * FROM events WHERE id = $1", [id])
    return row || null
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
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <span>2 hours</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              <span>IDELEH Headquarters, City</span>
            </div>
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
