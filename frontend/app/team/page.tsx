import Image from "next/image"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

export default async function TeamPage() {
  let teamMembers = []

  try {
    teamMembers = await api.team.getAll()

    // If no data from API, use fallback team members
    if (!teamMembers || teamMembers.length === 0) {
      teamMembers = [
        {
          id: "fallback-1",
          name: "Abel Ajayi",
          position: "Co-Founder",
          image_data: "/images/team/abel.jpg",
          bio: "Abel is passionate about developing young leaders with integrity and vision for national transformation. With years of experience in leadership development, he has trained thousands of young people across Nigeria."
        },
        {
          id: "fallback-2",
          name: "Priscilla Asher John",
          position: "Executive Director",
          image_data: "/images/team/priscilla.jpg",
          bio: "Priscilla is dedicated to empowering the next generation through strategic leadership development programs. Her expertise in organizational management and youth development drives IDELEH's impactful initiatives."
        },
        {
          id: "fallback-3",
          name: "Waltong David Tyoden",
          position: "Co-Founder",
          image_data: "/images/team/waltong.jpeg",
          bio: "Waltong is committed to raising credible leaders who will drive positive change in society. His vision for youth empowerment and nation building has shaped IDELEH's mission and programs."
        }
      ]
    }
  } catch (error) {
    console.error("Failed to fetch team members:", error)
    // Fallback team members on error
    teamMembers = [
      {
        id: "fallback-1",
        name: "Abel Ajayi",
        position: "Co-Founder",
        image_data: "/images/team/abel.jpg",
        bio: "Passionate about developing young leaders with integrity and vision."
      },
      {
        id: "fallback-2",
        name: "Priscilla Asher John",
        position: "Executive Director",
        image_data: "/images/team/priscilla.jpg",
        bio: "Dedicated to empowering the next generation through strategic programs."
      },
      {
        id: "fallback-3",
        name: "Waltong David Tyoden",
        position: "Co-Founder",
        image_data: "/images/team/waltong.jpeg",
        bio: "Committed to raising credible leaders for positive change."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-24 relative overflow-hidden bg-primary/5 dark:bg-primary/10">
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
                className="glass-card p-4 rounded-[2rem] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-border/50"
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
                  <h3 className="text-2xl font-display font-bold mb-2 text-foreground">{member.name}</h3>
                  <p className="text-secondary font-semibold mb-6 uppercase tracking-wider text-sm">{member.position}</p>
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
