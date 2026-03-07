import Image from "next/image"
import { Lightbulb, Users, Building2 } from "lucide-react"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

async function getGalleryImagesSafely() {
  try {
    const data = await api.gallery.getAll()
    return data || []
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}

export default async function ServicesPage() {
  const images = await getGalleryImagesSafely()

  const trainingImage = images.length > 0 ? getImageSrc(images[Math.floor(Math.random() * images.length)].image_data) : null
  const mentorshipImage = images.length > 1 ? getImageSrc(images[Math.floor(Math.random() * images.length)].image_data) : null
  const consultationImage = images.length > 2 ? getImageSrc(images[Math.floor(Math.random() * images.length)].image_data) : null

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our <span className="text-primary">Services</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          We offer comprehensive leadership development services designed to empower the next generation of leaders.
        </p>
      </div>

      <div className="mt-16 space-y-24">
        {/* Training Service */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Trainings</h2>
            </div>
            <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
              <p>
                Our leadership training programs are designed to equip young leaders with the skills, knowledge, and
                mindset necessary to excel in their roles.
              </p>
              <p>
                Through interactive workshops, group exercises, and real-world case studies, participants will gain
                practical insights and tools to enhance their leadership capabilities.
              </p>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl order-1 md:order-2">
            <Image
              src={trainingImage || "/images/purpose.jpg"}
              alt="Leadership Training"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Mentorship Service */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl">
            <Image
              src={mentorshipImage || "/images/mentorship2.jpg"}
              alt="Mentorship Program"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Mentorship</h2>
            </div>
            <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
              <p>
                Our mentorship program pairs young leaders with experienced mentors who provide guidance, support, and
                valuable industry insights.
              </p>
              <p>
                Through regular one-on-one sessions, mentors will help mentees set and achieve goals, develop strategic
                thinking, and build confidence in their leadership abilities.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Consultation Service */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Corporate Consultation</h2>
            </div>
            <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
              <p>
                Our consultation services provide young leaders with expert advice and strategic guidance on specific
                leadership challenges or organizational issues.
              </p>
              <p>
                Through tailored consulting engagements, we help clients identify key areas for improvement, develop
                effective solutions, and implement sustainable change initiatives.
              </p>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-lg shadow-xl order-1 md:order-2">
            <Image
              src={consultationImage || "/images/community.jpg"}
              alt="Corporate Consultation"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
