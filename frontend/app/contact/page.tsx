"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We will get back to you soon.",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Have questions or want to learn more about our programs? Reach out to us and we'll get back to you as soon as
          possible.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Addresses</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Abuja:</strong> 1473 Innerblock street Central Business District, Abuja.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Jos:</strong> Greatworks complex Genesis Plaza, Latiya Rayfield.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">idealeadhub@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600 dark:text-gray-400">07048588048</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-4 text-xl font-semibold">Office Hours</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday: 10:00 AM - 2:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold">Send us a message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <div className="h-96 w-full overflow-hidden rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3525292901087!2d3.3751315!3d6.5951815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzUnNDIuNyJOIDPCsDIyJzMwLjUiRQ!5e0!3m2!1sen!2sng!4v1620120000000!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
