import { Lightbulb, Users, Building2, Target, BookOpen, Globe } from "lucide-react"
import { api } from "@/lib/api"

// Icon mapping
const iconMap: Record<string, any> = {
  Lightbulb,
  Users,
  Building2,
  Target,
  BookOpen,
  Globe,
}

async function getServices() {
  try {
    const data = await api.services.getAll()

    // If no data from API, return fallback services
    if (!data || data.length === 0) {
      return [
        {
          id: "1",
          title: "Trainings",
          description: "Our leadership training programs are designed to equip young leaders with the skills, knowledge, and mindset necessary to excel in their roles. Through interactive workshops, group exercises, and real-world case studies, participants will gain practical insights and tools to enhance their leadership capabilities.",
          icon: "Lightbulb",
          display_order: 1
        },
        {
          id: "2",
          title: "Mentorship",
          description: "Our mentorship program pairs young leaders with experienced mentors who provide guidance, support, and valuable industry insights. Through regular one-on-one sessions, mentors will help mentees set and achieve goals, develop strategic thinking, and build confidence in their leadership abilities.",
          icon: "Users",
          display_order: 2
        },
        {
          id: "3",
          title: "Corporate Consultation",
          description: "Our consultation services provide young leaders with expert advice and strategic guidance on specific leadership challenges or organizational issues. Through tailored consulting engagements, we help clients identify key areas for improvement, develop effective solutions, and implement sustainable change initiatives.",
          icon: "Building2",
          display_order: 3
        }
      ]
    }

    // Sort by display_order
    return data.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
  } catch (error) {
    console.error("Error fetching services:", error)
    // Return fallback on error
    return [
      {
        id: "1",
        title: "Trainings",
        description: "Interactive workshops and real-world case studies to enhance leadership capabilities.",
        icon: "Lightbulb",
        display_order: 1
      },
      {
        id: "2",
        title: "Mentorship",
        description: "Pairing young leaders with experienced mentors for guidance and industry insights.",
        icon: "Users",
        display_order: 2
      }
    ]
  }
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Our <span className="text-primary italic">Services</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We offer comprehensive leadership development services designed to empower the next generation of leaders.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service: any, index: number) => {
          const IconComponent = iconMap[service.icon] || Lightbulb

          return (
            <div
              key={service.id}
              className="group glass-card p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110">
                <IconComponent className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-display font-bold text-foreground">{service.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{service.description}</p>
            </div>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center max-w-2xl mx-auto">
        <div className="glass-card p-10 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Interested in Our Services?
          </h2>
          <p className="text-muted-foreground mb-6">
            Contact us to learn more about how we can help develop your leadership potential
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}
