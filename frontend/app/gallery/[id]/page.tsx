import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface GalleryDetailPageProps {
    params: {
        id: string
    }
}

async function getGallery(id: string) {
    try {
        // If it's a fallback ID, return fallback data
        if (id === "1") {
            return {
                id: "1",
                title: "NBC Jos 2024",
                category: "Nation Building Conference University of Jos, 2024",
                description: "Highlights from the Nation Building Conference at University of Jos",
                images: [
                    "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0011.jpg",
                    "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0014.jpg",
                    "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0023.jpg",
                    "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0029.jpg",
                    "/images/Nation Building Conference University of Jos, 2024/IMG-20240627-WA0037.jpg",
                ]
            }
        } else if (id === "2") {
            return {
                id: "2",
                title: "LeaderZ Conference 2023",
                category: "LeaderZ Conferences",
                description: "Annual conference for secondary school prefects",
                images: [
                    "/images/leaderz.jpg",
                    "/images/community.jpg",
                    "/images/networking.jpg",
                ]
            }
        } else if (id === "3") {
            return {
                id: "3",
                title: "Leadership Training Sessions",
                category: "Training & Workshops",
                description: "Interactive workshops and training activities",
                images: [
                    "/images/training.jpg",
                    "/images/mentorship2.jpg",
                    "/images/workshop.jpg",
                ]
            }
        }

        const galleries = await api.gallery.getAll()
        const gallery = galleries.find((g: any) => g.id === id || g.documentId === id)

        if (!gallery) return null

        // Process images
        let imageUrls = []
        if (gallery.images && Array.isArray(gallery.images)) {
            imageUrls = gallery.images.map((img: any) => {
                if (typeof img === 'string') return getImageSrc(img)
                return img.url ? (img.url.startsWith('http') ? img.url : `http://localhost:1337${img.url}`) : '/placeholder.svg'
            })
        }

        return {
            id: gallery.id,
            title: gallery.title,
            category: gallery.category,
            description: gallery.description,
            images: imageUrls
        }
    } catch (e) {
        console.error("Error fetching gallery:", e)
        return null
    }
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
    const gallery = await getGallery(params.id)

    if (!gallery) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mb-12">
                <Button asChild variant="ghost" className="mb-6 -ml-4 hover:bg-muted group">
                    <Link href="/gallery" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Galleries
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center rounded-full bg-secondary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary border border-secondary/20 mb-3">
                            {gallery.category}
                        </div>
                        <h1 className="text-4xl font-display font-bold text-foreground">
                            {gallery.title}
                        </h1>
                        {gallery.description && (
                            <p className="text-muted-foreground text-lg">
                                {gallery.description}
                            </p>
                        )}
                    </div>
                    <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary font-bold text-sm uppercase tracking-widest">
                        {gallery.images.length} {gallery.images.length === 1 ? "Photo" : "Photos"}
                    </div>
                </div>
            </div>

            {gallery.images.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                    <p className="text-xl text-muted-foreground">No images in this gallery.</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {gallery.images.map((imageUrl: string, index: number) => (
                        <div
                            key={`${gallery.id}-${index}`}
                            className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-white/20 bg-card"
                        >
                            <div className={`relative w-full ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden bg-muted`}>
                                <Image
                                    src={imageUrl}
                                    alt={`${gallery.title} - Photo ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
