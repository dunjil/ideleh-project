import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface ContactInfo {
  email?: string
  phone?: string
  address?: string
  facebook_url?: string
  twitter_url?: string
  instagram_url?: string
  linkedin_url?: string
  office_hours?: string
  whatsapp_number?: string
}

async function getContactInfo(): Promise<ContactInfo> {
  try {
    const data = await api.contactInfo.get()
    return data || {}
  } catch (error) {
    console.error("Failed to fetch contact info:", error)
    return {}
  }
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()

  // Fallback contact data
  const contact = {
    email: contactInfo.email || "idealeadhub@gmail.com",
    phone: contactInfo.phone || "07048588048",
    address: contactInfo.address || "Abuja: 1473 Innerblock street CBD, Abuja.\nJos: Greatworks complex Genesis Plaza, Latiya.",
    office_hours: contactInfo.office_hours || "Monday - Friday: 9:00 AM - 5:00 PM",
    facebook_url: contactInfo.facebook_url || "#",
    twitter_url: contactInfo.twitter_url || "#",
    instagram_url: contactInfo.instagram_url || "#",
    linkedin_url: contactInfo.linkedin_url || "#",
    whatsapp_number: contactInfo.whatsapp_number || "07048588048",
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Get in <span className="text-primary italic">Touch</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you. Reach out to us through any of the following channels.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        {/* Contact Information Cards */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Email</h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Phone</h3>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-muted-foreground hover:text-primary transition-colors block"
                >
                  {contact.phone}
                </a>
                {contact.whatsapp_number && (
                  <a
                    href={`https://wa.me/${contact.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 transition-colors text-sm mt-2 inline-block"
                  >
                    WhatsApp: {contact.whatsapp_number}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Office Hours</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {contact.office_hours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address and Social */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300 h-full">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">Our Offices</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, label: "Facebook", url: contact.facebook_url, color: "hover:bg-blue-600" },
                  { icon: Instagram, label: "Instagram", url: contact.instagram_url, color: "hover:bg-pink-600" },
                  { icon: Twitter, label: "Twitter", url: contact.twitter_url, color: "hover:bg-sky-500" },
                  { icon: Linkedin, label: "LinkedIn", url: contact.linkedin_url, color: "hover:bg-blue-700" }
                ].map((Social, i) => (
                  <Link
                    key={i}
                    href={Social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-12 h-12 rounded-full bg-muted text-foreground/70 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm ${Social.color}`}
                  >
                    <Social.icon className="h-5 w-5" />
                    <span className="sr-only">{Social.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center max-w-2xl mx-auto">
        <div className="glass-card p-10 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Leadership?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our programs and events to develop your leadership potential
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30"
            >
              View Events
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 bg-background text-foreground font-medium rounded-full border border-border hover:bg-muted transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
