import Image from "next/image"
import Link from "next/link"
import { getImageSrc } from "@/lib/image-utils"

interface GalleryGridProps {
  images: {
    id: string
    title: string
    image_data?: string
  }[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {images.map((item) => {
        const imageUrl = getImageSrc(item.image_data)

        return (
          <Link
            key={item.id}
            href={`/gallery/${item.id}`}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="text-center text-lg font-medium text-white">{item.title}</h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
