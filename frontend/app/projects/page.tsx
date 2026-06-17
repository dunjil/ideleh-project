import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

async function getProjects() {
  try {
    const data = await api.projects.getAll()

    // If no data from API, return fallback projects
    if (!data || data.length === 0) {
      return [
        {
          id: "1",
          title: "LeaderZ Conferences",
          description: "The LeaderZ Conference aims to redefine the way secondary school prefects are trained, mentored, and empowered. With a focus on unlocking their leadership potential, we bring together esteemed speakers, expert trainers, and industry professionals to provide valuable insights, practical knowledge, and networking opportunities.",
          imageUrl: "/images/leaderz.jpg"
        },
        {
          id: "2",
          title: "Nation Building Conferences",
          description: "The Nation Building Conferences are an integral component of our leadership development programs designed to inspire aspiring leaders to position themselves with the requisite knowledge, skills, and values required to address the unique challenges faced by our country and the broader African continent.",
          imageUrl: "/images/nbc.jpg"
        },
        {
          id: "3",
          title: "Mentorship Hub",
          description: "Our Mentorship Hub connects aspiring leaders with experienced mentors who provide guidance, support, and valuable insights to help them navigate their leadership journey. Through structured mentorship programs, we create opportunities for knowledge transfer, skill development, and personal growth.",
          imageUrl: "/images/mentorship.jpg"
        }
      ]
    }

    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      imageUrl: getImageSrc(p.image_data)
    }))
  } catch (e) {
    console.error("Error in getProjects:", e)
    // Return fallback on error
    return [
      {
        id: "1",
        title: "LeaderZ Conferences",
        description: "Annual conference for secondary school prefects leadership training and empowerment.",
        imageUrl: "/images/leaderz.jpg"
      },
      {
        id: "2",
        title: "Nation Building Conferences",
        description: "Inspiring young leaders to address national challenges and build a better future.",
        imageUrl: "/images/nbc.jpg"
      }
    ]
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Our <span className="text-primary">Projects</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Discover our impactful initiatives designed to develop and empower the next generation of leaders.
          </p>
        </div>

        <div className="mt-16 space-y-24">
          {projects.map((project: any, index: number) => (
            <div key={project.id} className="grid gap-12 md:grid-cols-2 md:items-center">
              <div className={`order-2 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                <h2 className="text-3xl font-bold">{project.title}</h2>
                <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
                  <p>{project.description}</p>
                </div>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/events">View Related Events</Link>
                  </Button>
                </div>
              </div>
              <div
                className={`relative h-[400px] overflow-hidden rounded-lg shadow-xl order-1 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}
              >
                <Image
                  src={
                    project.imageUrl !== "/placeholder.svg" ? project.imageUrl : (
                      project.title === "LeaderZ Conferences" ? "/images/leaderz.jpg" :
                        project.title === "Nation Building Conferences" ? "/images/nbc.jpg" :
                          project.title === "Mentorship Hub" ? "/images/mentorship.jpg" :
                            "/images/leaderz.jpg"
                    )
                  }
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}
