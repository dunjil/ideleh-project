"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface RegistrationPageProps {
  params: {
    id: string
  }
}

export default function RegistrationPage({ params }: RegistrationPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    expectation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/events/${params.id}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: params.id, ...formData }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast({ title: "Registration Successful", description: "You have successfully registered for this event." })
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
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Please fill out the form below to register for this event.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
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
