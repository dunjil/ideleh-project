import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { getPublicStorageUrl } from "@/lib/storage-utils"

// Function to get a random gallery image
async function getRandomGalleryImage() {
  const { data, error } = await supabase.from("gallery").select("*").limit(10)

  if (error || !data || data.length === 0) {
    console.error("Error fetching random gallery image:", error)
    return null
  }

  const randomIndex = Math.floor(Math.random() * data.length)
  const randomImage = data[randomIndex]

  return getPublicStorageUrl("gallery", randomImage.image_path)
}

export default async function AboutPage() {
  const randomGalleryImage = await getRandomGalleryImage()

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          About <span className="text-primary">IDELEH</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Leading the Future - Ideal Leadership Hub</p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-center">
        <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
          <Image
            src={randomGalleryImage || "/placeholder.svg?height=800&width=600"}
            alt="About IDELEH"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Vision</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            High performing Leaders providing the nations with genuine leadership.
          </p>
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            To identify young Leaders through a rigorous selection process that assess knowledge base; competence;
            skills; apt for learning; intuition, relational abilities and character.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            To raise Credible, Competent and Principled drivers of Effective and Progressive leadership in the Nations
            of life through strategic and deliberate leadership trainings and mentorship.
          </p>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="mb-8 text-center text-3xl font-bold">Our Values</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold">Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We strive for excellence in all our programs and initiatives, setting high standards and continuously
              improving our offerings.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold">Integrity</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We act with honesty, transparency, and ethical behavior in all our interactions and decision-making
              processes.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We embrace creativity and forward-thinking approaches to leadership development, adapting to changing
              needs and contexts.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold">Inclusivity</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We value diversity and create inclusive environments where all individuals feel welcome, respected, and
              empowered.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold">Collaboration</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We believe in the power of partnership and work collaboratively with organizations and individuals to
              achieve greater impact.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold">Impact</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We are committed to creating meaningful, measurable change through our programs and the leaders we
              develop.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
