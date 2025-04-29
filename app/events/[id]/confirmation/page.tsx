import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface ConfirmationPageProps {
  params: {
    id: string
  }
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-md rounded-lg border bg-white p-8 text-center shadow-md dark:border-gray-700 dark:bg-gray-800">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-2xl font-bold">Registration Successful!</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Thank you for registering for our event. We have sent a confirmation email with all the details to your email
          address.
        </p>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href={`/events/${params.id}`}>Back to Event</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/events">Browse More Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
