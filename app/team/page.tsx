import Image from "next/image"
import { query } from "@/lib/db"
import { getImageSrc } from "@/lib/image-utils"

async function getTeamMembers() {
  try {
    const data = await query("SELECT * FROM team_members ORDER BY name ASC")
    return data.map((m) => ({ id: m.id, name: m.name, position: m.position, bio: m.bio, imageUrl: getImageSrc(m.image_data) }))
  } catch (e) {
    console.error("Error in getTeamMembers:", e)
    return []
  }
}

const defaultTeamMembers = [
  { id: "1", name: "Abel Ajayi", position: "Co-Founder, IDELEH", bio: "Abel is passionate about developing leadership skills in young people.", imageUrl: "/placeholder.svg?height=400&width=300&text=Abel+Ajayi" },
  { id: "2", name: "Priscilla Asher John", position: "Co-Founder, Executive Director", bio: "Priscilla leads our flagship leadership programs with passion and dedication.", imageUrl: "/placeholder.svg?height=400&width=300&text=Priscilla+Asher+John" },
  { id: "3", name: "Waltong David Tyoden", position: "Co-Founder, IDELEH", bio: "Waltong builds partnerships with local communities and organizations.", imageUrl: "/placeholder.svg?height=400&width=300&text=Waltong+David+Tyoden" },
]

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()
  const displayTeamMembers = teamMembers.length > 0 ? teamMembers : defaultTeamMembers

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our <span className="text-primary">Team</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Meet the dedicated professionals behind IDELEH who are passionate about leadership development and community
          impact.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {displayTeamMembers.map((member) => (
          <div
            key={member.id}
            className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
          >
            <div className="relative h-64 w-full">
              <Image
                src={
                  member.imageUrl || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(member.name)}`
                }
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="mb-3 text-primary">{member.position}</p>
              {member.bio && <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
