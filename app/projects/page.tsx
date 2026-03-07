import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

async function getProjects() {
  try {
    const data = await api.projects.getAll()
    return data.map((p: any) => ({ id: p.id, title: p.title, description: p.description, imageUrl: getImageSrc(p.image_data) }))
  } catch (e) {
    console.error("Error in getProjects:", e)
    return []
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  // If we have projects from the database, display them
  if (projects.length > 0) {
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
                      project.title === "LeaderZ Conferences" ? encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg") :
                        project.title === "Nation Building Conferences" ? encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0039.jpg") :
                          project.title === "Mentorship Hub" ? encodeURI("/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4893.jpg") :
                            encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg")
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

  // Fallback to static content if no projects in database
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
        {/* LeaderZ Conferences */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold">LeaderZ Conferences</h2>
            <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
              <p>
                The LeaderZ Conference aims to redefine the way secondary school prefects are trained, mentored, and
                empowered. With a focus on unlocking their leadership potential, we bring together esteemed speakers,
                expert trainers, and industry professionals to provide valuable insights, practical knowledge, and
                networking opportunities.
              </p>
              <p>
                Through our annual conferences, we strive to equip young prefects with the necessary skills, confidence,
                and inspiration to become influential leaders within their school communities and beyond.
              </p>
              <p>
                There is no better way to raise the leaders of tomorrow than to focus on equipping the leaders of today.
                The prefect-ship institution is an indispensable platform for early intentional leadership equipping. We
                seek to consolidate and advance the efforts in leadership development for secondary school prefects.
              </p>
              <p>
                By organizing annual conferences, we aim to create a transformative learning experience for the
                prefects, empowering them with essential leadership qualities, fostering a deeper sense of
                responsibility for their present roles and for future leadership roles.
              </p>
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href="/events">View Upcoming Conferences</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl order-1 md:order-2">
            <Image
              src={encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg")}
              alt="LeaderZ Conferences"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Nation Building Conferences */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
            <Image
              src={encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0039.jpg")}
              alt="Nation Building Conferences"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Nation Building Conferences</h2>
            <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
              <p>
                The Nation Building Conferences are an integral component of our leadership development programs
                designed to inspire aspiring leaders to position themselves with the requisite knowledge, skills, and
                values required to address the unique challenges faced by our country and the broader African continent.
              </p>
              <p>
                We aim to cultivate a cadre of leaders who not only understand the intricacies of their communities but
                also exhibit unwavering commitment to leadership and patriotism as integral facets of their lives.
              </p>
              <p>
                In all our leadership engagements and expressions, The Ideal Leadership Hub stands as an emblem
                steadfastly proclaiming a profound faith in Nigeria and the African Continent. It serves as a beacon of
                hope extended to young Nigerians aspiring for a better nation and seeking to become catalysts for
                national transformation.
              </p>
              <p>
                Our commitment lies in recognizing these young individuals, natural leaders who have assumed a posture
                of responsibility in the nation-building endeavor. We assert with unwavering certainty that such youths
                are abundant. Our role extends beyond mere identification; we actively empower and strategically deploy
                them to areas where their contributions can be most impactful.
              </p>
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href="/events">View Upcoming Conferences</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mentorship Hub */}
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold">Mentorship Hub</h2>
            <div className="mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400">
              <p>
                Our Mentorship Hub connects aspiring leaders with experienced mentors who provide guidance, support, and
                valuable insights to help them navigate their leadership journey.
              </p>
              <p>
                Through structured mentorship programs, we create opportunities for knowledge transfer, skill
                development, and personal growth, empowering the next generation of leaders to reach their full
                potential.
              </p>
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href="/contact">Inquire About Mentorship</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl order-1 md:order-2">
            <Image
              src={encodeURI("/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4893.jpg")}
              alt="Mentorship Hub"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
