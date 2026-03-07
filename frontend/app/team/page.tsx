import Image from "next/image"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

export default async function TeamPage() {
  let teamMembers = []

  try {
    teamMembers = await api.team.getAll()
  } catch (error) {
    console.error("Failed to fetch team members:", error)
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <section className="py-24 relative overflow-hidden bg-primary/5">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">The People Behind IDELEH</span>
          <h1 className="text-5xl md:text-6xl font-display mb-6">
            Meet Our <span className="text-gradient">Leadership</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            A dedicated team passionate about raising credible leaders for global impact.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member: any) => (
              <div
                key={member.id}
                className="glass p-4 rounded-[2rem] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl mb-8">
                  <Image
                    src={getImageSrc(member.image_data)}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-secondary font-semibold mb-6">{member.position}</p>
                  {member.bio && (
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
