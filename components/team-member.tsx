import Image from "next/image"

interface TeamMemberProps {
  member: {
    id: string
    name: string
    position: string
    bio?: string
    image_url: string
  }
}

export function TeamMember({ member }: TeamMemberProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800">
      <div className="relative h-64 w-full">
        <Image src={member.image_url || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="mb-3 text-primary">{member.position}</p>
        {member.bio && <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>}
      </div>
    </div>
  )
}
