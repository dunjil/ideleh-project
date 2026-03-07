"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { downloadCSV } from "@/lib/utils"

interface RegistrationsPageProps {
  params: {
    id: string
  }
}

export default function RegistrationsPage({ params }: RegistrationsPageProps) {
  const [event, setEvent] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, regRes] = await Promise.all([
          fetch(`/api/admin/events/${params.id}`),
          fetch(`/api/admin/events/${params.id}/registrations`),
        ])
        const eventData = await eventRes.json()
        const regData = await regRes.json()
        setEvent(eventData)
        setRegistrations(Array.isArray(regData) ? regData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  const handleDownloadCSV = () => {
    if (registrations.length === 0) return

    // Prepare data for CSV
    const csvData = registrations.map((reg) => ({
      First_Name: reg.first_name,
      Last_Name: reg.last_name,
      Email: reg.email,
      Phone: reg.phone,
      Gender: reg.gender,
      Expectation: reg.expectation || "N/A",
      Registration_Date: new Date(reg.created_at).toLocaleString(),
    }))

    // Download CSV
    downloadCSV(csvData, `${event.title}-registrations.csv`)
  }

  if (isLoading) {
    return <div>Loading registrations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Registrations</h1>
          <p className="text-gray-500 dark:text-gray-400">{event.title}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleDownloadCSV} disabled={registrations.length === 0}>
            Download as CSV
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/events">Back to Events</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {registrations.length > 0 ? (
                registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                      {registration.first_name} {registration.last_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{registration.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">{registration.phone}</td>
                    <td className="whitespace-nowrap px-6 py-4 capitalize">{registration.gender}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(registration.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No registrations found for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {registrations.length > 0 && (
        <div className="rounded-lg border bg-white p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Expectations</h2>
          <div className="space-y-4">
            {registrations.map(
              (registration) =>
                registration.expectation && (
                  <div key={`exp-${registration.id}`} className="rounded-lg border p-4">
                    <p className="mb-2 font-medium">
                      {registration.first_name} {registration.last_name}:
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{registration.expectation}</p>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
