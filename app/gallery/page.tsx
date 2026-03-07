import Image from "next/image"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"

const fallbackGalleryImages = [
  { id: 1, title: "Nation Building Conference", imageUrl: encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg") },
  { id: 2, title: "Jos 2024", imageUrl: encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0014.jpg") },
  { id: 3, title: "Leadership Workshop", imageUrl: encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0037.jpg") },
  { id: 4, title: "Mentorship", imageUrl: encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0039.jpg") },
  { id: 5, title: "Training", imageUrl: encodeURI("/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0040.jpg") },
  { id: 6, title: "Community", imageUrl: encodeURI("/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4737.jpg") },
  { id: 7, title: "Keynote", imageUrl: encodeURI("/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4893.jpg") },
  { id: 8, title: "Networking", imageUrl: encodeURI("/images/Nation Building Conference, Federal College of Education Pankshin 2024/_BIL4932.jpg") }
];

async function getGalleryImages() {
  try {
    const data = await api.gallery.getAll()
    if (!data || data.length === 0) return fallbackGalleryImages
    return data.map((item: any, index: number) => {
      let img = getImageSrc(item.image_data);
      if (img === "/placeholder.svg") {
        img = fallbackGalleryImages[index % fallbackGalleryImages.length].imageUrl;
      }
      return { id: item.id, title: item.title, imageUrl: img };
    })
  } catch (e) {
    console.error("Error fetching gallery images:", e)
    return fallbackGalleryImages
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages()

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
          Our <span className="text-primary italic">Gallery</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore moments from our past events, programs, and community activities.
        </p>
      </div>

      <div className="mt-16">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryImages.map((item: any, index: number) => (
            <div
              key={item.id}
              className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 bg-white"
            >
              <div className={`relative w-full ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden bg-gray-100`}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
