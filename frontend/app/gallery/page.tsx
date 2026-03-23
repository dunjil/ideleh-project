import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"
import { slugify } from "@/lib/utils"

async function getGalleryData() {
  try {
    const data = await api.gallery.getAll()
    if (!data || data.length === 0) return {}

    // Group by meeting_name
    const groups: Record<string, any[]> = {}

    data.forEach((item: any) => {
      const meeting = item.meeting_name || "General"
      if (!groups[meeting]) {
        groups[meeting] = []
      }

      let img = getImageSrc(item.image_data)
      groups[meeting].push({
        id: item.id,
        title: item.title,
        imageUrl: img
      })
    })

    return groups
  } catch (e) {
    console.error("Error fetching gallery data:", e)
    return {}
  }
}

export default async function GalleryPage() {
  const galleryGroups = await getGalleryData()
  const meetings = Object.keys(galleryGroups).sort((a, b) => {
    if (a === "General") return 1
    if (b === "General") return -1
    return b.localeCompare(a)
  })

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Programs & <span className="text-secondary italic">Moments</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Select a program to view its full gallery of impactful leadership activities.
        </p>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No programs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {meetings.map((meeting) => {
            const firstImage = galleryGroups[meeting][0].imageUrl
            const count = galleryGroups[meeting].length
            return (
              <Link
                key={meeting}
                href={`/gallery/${encodeURIComponent(meeting)}`}
                className="group relative h-[400px] overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-white/10"
              >
                <Image
                  src={firstImage}
                  alt={meeting}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-2 inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-md">
                    {count} {count === 1 ? "Photo" : "Photos"}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white tracking-tight">
                    {meeting}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-white/70 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>View Full Gallery</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
