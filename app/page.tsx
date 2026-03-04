import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Lightbulb, Users, Building2 } from "lucide-react"
import { query } from "@/lib/db"
import { getImageSrc } from "@/lib/image-utils"
import { HeroSlideshow } from "@/components/hero-slideshow"

async function getHeroImages() {
  try {
    const data = await query(
      "SELECT * FROM hero_images WHERE is_active = true ORDER BY display_order ASC"
    )
    return data.map((image) => ({
      id: image.id,
      title: image.title,
      description: image.description,
      imageUrl: getImageSrc(image.image_data),
    }))
  } catch (e) {
    console.error("Error fetching hero images:", e)
    return []
  }
}

async function getSiteContent() {
  const defaults = {
    mission: {
      title: "Our Mission",
      content: "To identify young Leaders through a rigorous selection process that assess knowledge base; competence; skills; apt for learning; intuition, relational abilities and character. To raise Credible, Competent and Principled drivers of Effective and Progressive leadership in the Nations of life through strategic and deliberate leadership trainings and mentorship.",
    },
    vision: {
      title: "Our Vision",
      content: "High performing Leaders providing the nations with genuine leadership.",
    },
  }
  try {
    const data = await query("SELECT * FROM site_content WHERE key IN ('mission', 'vision')")
    data.forEach((item) => {
      ; (defaults as any)[item.key] = { title: item.title || (defaults as any)[item.key].title, content: item.content }
    })
  } catch (e) {
    console.error("Error fetching site content:", e)
  }
  return defaults
}

async function getFeaturedProjects() {
  try {
    const data = await query(
      "SELECT * FROM projects WHERE is_featured = true ORDER BY display_order ASC LIMIT 3"
    )
    return data.map((p) => ({ id: p.id, title: p.title, description: p.description, imageUrl: getImageSrc(p.image_data) }))
  } catch (e) {
    console.error("Error fetching featured projects:", e)
    return []
  }
}

async function getTeamMembers() {
  try {
    const data = await query("SELECT * FROM team_members LIMIT 3")
    return data.map((m) => ({ id: m.id, name: m.name, position: m.position, bio: m.bio, imageUrl: getImageSrc(m.image_data) }))
  } catch (e) {
    console.error("Error fetching team members:", e)
    return []
  }
}

async function getGalleryImages() {
  try {
    const data = await query("SELECT * FROM gallery ORDER BY created_at DESC LIMIT 6")
    return data.map((img) => ({ id: img.id, title: img.title, imageUrl: getImageSrc(img.image_data) }))
  } catch (e) {
    console.error("Error fetching gallery images:", e)
    return []
  }
}

async function getRandomGalleryImage() {
  try {
    const data = await query("SELECT image_data FROM gallery LIMIT 10")
    if (!data.length) return "/placeholder.svg?height=800&width=600"
    const random = data[Math.floor(Math.random() * data.length)]
    return getImageSrc(random.image_data)
  } catch (e) {
    return "/placeholder.svg?height=800&width=600"
  }
}

async function getUpcomingEvents() {
  try {
    const data = await query(
      "SELECT * FROM events WHERE event_date >= NOW() ORDER BY event_date ASC LIMIT 3"
    )
    return data.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      imageUrl: getImageSrc(event.image_data),
      eventDate: new Date(event.event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    }))
  } catch (e) {
    console.error("Error fetching events:", e)
    return []
  }
}

export default async function Home() {
  const events = await getUpcomingEvents()
  const heroImages = await getHeroImages()
  const siteContent = await getSiteContent()
  const featuredProjects = await getFeaturedProjects()
  const galleryImages = await getGalleryImages()
  const teamMembers = await getTeamMembers()
  const randomGalleryImage = await getRandomGalleryImage()

  const fallbackHeroImages =
    heroImages.length > 0
      ? heroImages
      : [{ id: "fallback", title: "IDEAL LEADERSHIP HUB", description: "Empowering the next generation of leaders through innovative programs, events, and community engagement.", imageUrl: "/placeholder.svg?height=1080&width=1920" }]

  const displayTeamMembers =
    teamMembers.length > 0
      ? teamMembers
      : [
        { id: "1", name: "Abel Ajayi", position: "Co-Founder, IDELEH", bio: "Abel is passionate about developing leadership skills in young people.", imageUrl: "/placeholder.svg?height=400&width=300&text=Abel+Ajayi" },
        { id: "2", name: "Priscilla Asher John", position: "Co-Founder, Executive Director", bio: "Priscilla leads our flagship leadership programs with passion and dedication.", imageUrl: "/placeholder.svg?height=400&width=300&text=Priscilla+Asher+John" },
        { id: "3", name: "Waltong David Tyoden", position: "Co-Founder, IDELEH", bio: "Waltong builds partnerships with local communities and organizations.", imageUrl: "/placeholder.svg?height=400&width=300&text=Waltong+David+Tyoden" },
      ]

  return (
    <>
      {/* Hero Section */}
      <HeroSlideshow images={fallbackHeroImages} />

      {/* Vision & Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Our <span className="text-primary">Vision &amp; Mission</span>
              </h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{siteContent.vision.title}</h3>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{siteContent.vision.content}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{siteContent.mission.title}</h3>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{siteContent.mission.content}</p>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild><Link href="/about">Read More About Us</Link></Button>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
              <Image src={randomGalleryImage || "/placeholder.svg"} alt="About IDELEH" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-16 dark:bg-gray-900 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our <span className="text-primary">Services</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">We offer comprehensive leadership development services designed to empower the next generation of leaders.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Lightbulb className="h-6 w-6 text-primary" /></div>
              <h3 className="mb-3 text-xl font-bold">Trainings</h3>
              <p className="text-gray-600 dark:text-gray-400">Our leadership training programs are designed to equip young leaders with the skills, knowledge, and mindset necessary to excel in their roles.</p>
              <div className="mt-4"><Button asChild variant="outline" size="sm"><Link href="/services">Learn More</Link></Button></div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
              <h3 className="mb-3 text-xl font-bold">Mentorship</h3>
              <p className="text-gray-600 dark:text-gray-400">Our mentorship program pairs young leaders with experienced mentors who provide guidance, support, and valuable industry insights.</p>
              <div className="mt-4"><Button asChild variant="outline" size="sm"><Link href="/services">Learn More</Link></Button></div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Building2 className="h-6 w-6 text-primary" /></div>
              <h3 className="mb-3 text-xl font-bold">Corporate Consultation</h3>
              <p className="text-gray-600 dark:text-gray-400">Our consultation services provide young leaders with expert advice and strategic guidance on specific leadership challenges or organizational issues.</p>
              <div className="mt-4"><Button asChild variant="outline" size="sm"><Link href="/services">Learn More</Link></Button></div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Upcoming <span className="text-primary">Events</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">Join us at our upcoming events and programs designed to inspire, educate, and connect future leaders.</p>
          </div>
          {events.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-lg bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image src={event.imageUrl || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(event.title)}`} alt={event.title} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="text-right"><span className="inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">{event.eventDate}</span></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-3">{event.description}</p>
                    <Button asChild variant="outline" size="sm"><Link href={`/events/${event.id}`}>View Details</Link></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-lg text-gray-600 dark:text-gray-400">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
          <div className="mt-12 text-center"><Button asChild><Link href="/events">View All Events</Link></Button></div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-gray-100 py-16 dark:bg-gray-900 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our <span className="text-primary">Projects</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">Discover our impactful initiatives designed to develop and empower the next generation of leaders.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.length > 0 ? featuredProjects.map((project) => (
              <div key={project.id} className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                  <Image src={project.imageUrl || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(project.title)}`} alt={project.title} fill className="object-cover" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{project.description}</p>
                <div className="mt-4"><Button asChild variant="outline" size="sm"><Link href="/projects">Learn More</Link></Button></div>
              </div>
            )) : (
              <>
                {["LeaderZ Conferences", "Nation Building Conferences", "Mentorship Hub"].map((name) => (
                  <div key={name} className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                      <Image src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(name)}`} alt={name} fill className="object-cover" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{name}</h3>
                    <div className="mt-4"><Button asChild variant="outline" size="sm"><Link href="/projects">Learn More</Link></Button></div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="mt-12 text-center"><Button asChild><Link href="/projects">View All Projects</Link></Button></div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our <span className="text-primary">Team</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">Meet the dedicated professionals behind IDELEH who are passionate about leadership development and community impact.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayTeamMembers.map((member) => (
              <div key={member.id} className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800">
                <div className="relative h-64 w-full">
                  <Image src={member.imageUrl || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(member.name)}`} alt={member.name} fill className="object-contain" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="mb-3 text-primary">{member.position}</p>
                  {member.bio && <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center"><Button asChild variant="outline"><Link href="/team">Meet Our Full Team</Link></Button></div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-gray-100 py-16 dark:bg-gray-900 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our <span className="text-primary">Gallery</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">Explore moments from our past events, programs, and community activities.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.length > 0
              ? galleryImages.map((image) => (
                <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image src={image.imageUrl || `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(image.title)}`} alt={image.title} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              ))
              : [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image src={`/placeholder.svg?height=400&width=400&text=Gallery+Image+${i}`} alt={`Gallery Image ${i}`} fill className="object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              ))}
          </div>
          <div className="mt-12 text-center"><Button asChild><Link href="/gallery">View Full Gallery</Link></Button></div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in <span className="text-primary">Touch</span></h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Have questions or want to learn more about our programs? Reach out to us and we&apos;ll get back to you as soon as possible.</p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Addresses</h3>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Abuja:</strong> 1473 Innerblock street Central Business District, Abuja.</p>
                    <p className="text-gray-600 dark:text-gray-400"><strong>Jos:</strong> Greatworks complex Genesis Plaza, Latiya Rayfield.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="mt-1 h-6 w-6 text-primary" />
                  <div><h3 className="font-medium">Email</h3><p className="text-gray-600 dark:text-gray-400">idealeadhub@gmail.com</p></div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="mt-1 h-6 w-6 text-primary" />
                  <div><h3 className="font-medium">Phone</h3><p className="text-gray-600 dark:text-gray-400">07048588048</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold">Send us a message</h3>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
                    <input type="text" id="name" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
                    <input type="email" id="email" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1 block text-sm font-medium">Subject</label>
                  <input type="text" id="subject" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium">Message</label>
                  <textarea id="message" rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"></textarea>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
