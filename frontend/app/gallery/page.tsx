import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"
import { slugify } from "@/lib/utils"

async function getGalleryData() {
  try {
    const data = await api.gallery.getAll()

    // If no data from API, use fallback data
    if (!data || data.length === 0) {
      return [
        {
          id: "1",
          category: "Nation Building Conference University of Jos, 2024",
          title: "NBC Jos 2024",
          description: "Highlights from the Nation Building Conference at University of Jos",
          images: [
            "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg",
            "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0014.jpg",
            "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0023.jpg",
            "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0029.jpg",
            "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0037.jpg",
          ]
        },
        {
          id: "2",
          category: "LeaderZ Conferences",
          title: "LeaderZ Conference 2023",
          description: "Annual conference for secondary school prefects",
          images: [
            "/images/leaderz.jpg",
            "/images/community.jpg",
            "/images/networking.jpg",
          ]
        },
        {
          id: "3",
          category: "Training & Workshops",
          title: "Leadership Training Sessions",
          description: "Interactive workshops and training activities",
          images: [
            "/images/training.jpg",
            "/images/mentorship2.jpg",
            "/images/workshop.jpg",
          ]
        }
      ]
    }

    // Process gallery data from API
    return data.map((item: any) => {
      // Handle images - could be array or single image
      let imageUrls = []
      if (item.images && Array.isArray(item.images)) {
        imageUrls = item.images.map((img: any) => {
          if (typeof img === 'string') return getImageSrc(img)
          return img.url ? (img.url.startsWith('http') ? img.url : `http://localhost:1337${img.url}`) : '/placeholder.svg'
        })
      } else if (item.image_data) {
        imageUrls = [getImageSrc(item.image_data)]
      }

      return {
        id: item.id,
        category: item.category || "General",
        title: item.title,
        description: item.description || "",
        images: imageUrls
      }
    })
  } catch (e) {
    console.error("Error fetching gallery data:", e)
    // Return fallback on error
    return [
      {
        id: "1",
        category: "Nation Building Conference University of Jos, 2024",
        title: "NBC Jos 2024",
        description: "Highlights from the conference",
        images: [
          "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg",
          "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0014.jpg",
        ]
      }
    ]
  }
}

export default async function GalleryPage() {
  const galleries = await getGalleryData()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl text-foreground">
          Photo <span className="text-secondary italic">Galleries</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
          Explore our collection of memorable moments from events, programs, and activities.
        </p>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <p className="text-lg sm:text-xl text-muted-foreground">No galleries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {galleries.map((gallery) => {
            const firstImage = gallery.images[0] || "/placeholder.svg"
            const photoCount = gallery.images.length
            return (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.id}`}
                className="group relative h-[320px] sm:h-[380px] md:h-[400px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-white/10"
              >
                <Image
                  src={firstImage}
                  alt={gallery.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-end">
                  <div className="mb-2 flex gap-1.5 sm:gap-2 flex-wrap">
                    <div className="inline-flex items-center rounded-full bg-primary/20 px-2.5 sm:px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20 backdrop-blur-md">
                      {photoCount} {photoCount === 1 ? "Photo" : "Photos"}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-secondary/20 px-2.5 sm:px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/20 backdrop-blur-md line-clamp-1 max-w-[200px]">
                      {gallery.category}
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight line-clamp-2">
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="mt-2 text-white/80 text-xs sm:text-sm line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-white/70 text-xs sm:text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span>View Gallery</span>
                    <span className="text-base sm:text-xl">→</span>
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
