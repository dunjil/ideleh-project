import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getImageSrc } from "@/lib/image-utils"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    image_data?: string
    event_date: string
  }
}

export function EventCard({ event }: EventCardProps) {
  const imageUrl = getImageSrc(event.image_data)

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="relative h-48">
        <Image
          src={imageUrl || "/placeholder.svg?height=400&width=600"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="mr-2 h-4 w-4" />
          <time dateTime={event.event_date}>{formatDate(event.event_date)}</time>
        </div>
        <h3 className="mb-2 text-xl font-bold tracking-tight">{event.title}</h3>
        <p className="mb-4 text-gray-600 line-clamp-3 dark:text-gray-400">{event.description}</p>
        <div className="flex space-x-2">
          <Button asChild variant="default" size="sm">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/${event.id}/register`}>Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
