import Image from "next/image"
import Link from "next/link"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface GalleryDetailPageProps {
    params: {
        meetingName: string
    }
}

async function getMeetingImages(meetingName: string) {
    try {
        const data = await api.gallery.getAll()
        if (!data) return []

        // Sort and filter in the app since the API is basic
        return data
            .filter((item: any) => (item.meeting_name || "General") === meetingName)
            .map((item: any) => ({
                id: item.id,
                title: item.title,
                imageUrl: getImageSrc(item.image_data)
            }))
    } catch (e) {
        console.error("Error fetching meeting images:", e)
        return []
    }
}

export default async function GalleryDetailPage({ params }: any) {
    const meetingName = decodeURIComponent(params.meetingName)
    const images = await getMeetingImages(meetingName)

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mb-12">
                <Button asChild variant="ghost" className="mb-6 -ml-4 hover:bg-muted group">
                    <Link href="/gallery" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Programs
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-display font-bold text-foreground">
                            {meetingName}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Full gallery of moments and leadership impact.
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20 text-secondary font-bold text-sm uppercase tracking-widest">
                        {images.length} {images.length === 1 ? "Image" : "Images"}
                    </div>
                </div>
            </div>

            {images.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                    <p className="text-xl text-muted-foreground">No images found for this program.</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {images.map((item: any, index: number) => (
                        <div
                            key={item.id}
                            className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-white/20 bg-card"
                        >
                            <div className={`relative w-full ${index % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/3]"} overflow-hidden bg-muted`}>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
