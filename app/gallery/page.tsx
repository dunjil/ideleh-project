import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { getPublicStorageUrl } from "@/lib/storage-utils"

async function getGalleryImages() {
  try {
    const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching gallery images:", error)
      return []
    }

    return (
      data.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: getPublicStorageUrl("gallery", item.image_path),
      })) || []
    )
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages()

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our <span className="text-primary">Gallery</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Explore moments from our past events, programs, and community activities.
        </p>
      </div>

      <div className="mt-16">
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.map((item) => (
              <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={item.imageUrl || `/placeholder.svg?height=400&width=400&text=${item.title}`}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-center text-lg font-medium text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={`/placeholder.svg?height=400&width=400&text=Gallery+Image+${i}`}
                  alt={`Gallery Image ${i}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
