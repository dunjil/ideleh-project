import { query } from "@/lib/db"
import { getImageSrc } from "@/lib/image-utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Image from "next/image"
import { TeamMemberActions } from "@/components/admin/team-member-actions"

export const dynamic = "force-dynamic"

async function getTeamMembers() {
  const data = await query("SELECT * FROM team_members ORDER BY name ASC")
  return data.map((member) => ({
    id: member.id,
    name: member.name,
    position: member.position,
    bio: member.bio || "",
    imageUrl: getImageSrc(member.image_data),
  }))
}

export default async function AdminTeamPage() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Button asChild>
          <Link href="/admin/team/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-lg text-gray-600 dark:text-gray-400">No team members found. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.imageUrl || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(member.name)}`}
                  alt={member.name}
                  fill
                  className="object-scale-down"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="mb-3 text-primary">{member.position}</p>
                {member.bio && <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2">{member.bio}</p>}
                <TeamMemberActions id={member.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
