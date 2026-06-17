"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { Calendar, MapPin, DollarSign } from "lucide-react"

interface RegistrationPageProps {
  params: {
    id: string
  }
}

export default function RegistrationPage({ params }: RegistrationPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    expectation: "",
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Handle fallback events
        if (params.id.startsWith('fallback-')) {
          const fallbackEvents: Record<string, any> = {
            'fallback-1': {
              id: "fallback-1",
              title: "LeaderZ Conference 2026",
              description: "Join us for our annual conference designed to empower secondary school prefects.",
              event_date: "2026-08-15T09:00:00",
              location: "Abuja, Nigeria",
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
              description: "An inspiring conference for aspiring leaders.",
              event_date: "2026-09-20T10:00:00",
              location: "University of Jos, Plateau State",
              is_free: true,
              price: 0,
              currency: "NGN"
            },
            'fallback-3': {
              id: "fallback-3",
              title: "Mentorship Training Workshop",
              description: "A comprehensive workshop for mentors and mentees.",
              event_date: "2026-07-10T14:00:00",
              location: "Virtual Event",
              is_free: true,
              price: 0,
              currency: "NGN"
            }
          }
          setEvent(fallbackEvents[params.id] || null)
          return
        }

        const eventData = await api.events.getOne(params.id)
        setEvent(eventData)
      } catch (error) {
        console.error("Failed to fetch event:", error)
      }
    }
    fetchEvent()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentReceipt(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate payment receipt for paid events
    if (!event?.is_free && !paymentReceipt) {
      toast({
        title: "Payment Receipt Required",
        description: "Please upload your payment receipt to complete registration.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('data', JSON.stringify({
        ...formData,
        event: params.id,
        payment_status: event?.is_free ? 'confirmed' : 'pending'
      }))

      if (paymentReceipt) {
        submitData.append('files.payment_receipt', paymentReceipt)
      }

      // Submit registration with file
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api'}/registrations`, {
        method: 'POST',
        body: submitData,
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      toast({
        title: "Registration Successful",
        description: event?.is_free
          ? "You have successfully registered for this event."
          : "Your registration is pending payment verification. You will receive a confirmation email once verified."
      })
      router.push(`/events/${params.id}/confirmation`)
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message || "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Event Registration</h1>
          {event && (
            <div className="mt-6 space-y-3">
              <h2 className="text-2xl font-semibold text-primary">{event.title}</h2>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {event.event_date && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span className="font-semibold">
                    {event.is_free ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      <span className="text-primary">{event.currency || "NGN"} {event.price?.toLocaleString()}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          {!event?.is_free && event?.payment_details && (
            <div className="mb-6 rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Payment Details</h3>
              <div className="text-sm text-blue-800 dark:text-blue-200 prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: event.payment_details }}
              />
              <p className="mt-3 text-sm font-semibold text-blue-900 dark:text-blue-100">
                Amount: {event.currency || "NGN"} {event.price?.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                Please upload your payment receipt below after making payment.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={handleGenderChange}
                className="flex space-x-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectation">What do you expect to gain from this event?</Label>
              <Textarea
                id="expectation"
                name="expectation"
                value={formData.expectation}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {!event?.is_free && (
              <div className="space-y-2">
                <Label htmlFor="payment_receipt" className="text-base font-semibold">
                  Payment Receipt <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Upload proof of payment (image or PDF)
                </p>
                <Input
                  id="payment_receipt"
                  name="payment_receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  required={!event?.is_free}
                  className="cursor-pointer"
                />
                {paymentReceipt && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✓ {paymentReceipt.name} selected
                  </p>
                )}
              </div>
            )}

            <div className="flex space-x-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Register"}
              </Button>
              <Button asChild variant="outline">
                <Link href={`/events/${params.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
