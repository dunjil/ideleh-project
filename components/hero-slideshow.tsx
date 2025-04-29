"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroImage {
  id: string
  title: string
  description?: string
  imageUrl: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}

interface HeroSlideshowProps {
  images: HeroImage[]
  autoplayInterval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
}

export function HeroSlideshow({
  images,
  autoplayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className,
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!images.length || !isAutoPlaying || isHovering) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [images.length, autoplayInterval, isAutoPlaying, isHovering])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (!images.length) {
    return (
      <div className={cn("relative min-h-[80vh] bg-gray-200", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg text-gray-500">No slideshow images available</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn("relative min-h-[80vh] overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <Image
            src={image.imageUrl || "/placeholder.svg"}
            alt={image.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-32 text-center text-white sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
                  {image.title}
                </span>
              </h1>
              {image.description && (
                <p className="mx-auto text-xl text-gray-200 md:text-2xl">
                  {image.description}
                </p>
              )}
              
              {(image.ctaText || image.secondaryCtaText) && (
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  {image.ctaText && (
                    <Button 
                      asChild 
                      size="lg" 
                      className="px-8 py-6 text-lg group transition-all"
                    >
                      <Link href={image.ctaLink || "#"}>
                        {image.ctaText}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                  {image.secondaryCtaText && (
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="px-8 py-6 text-lg group transition-all border-white text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link href={image.secondaryCtaLink || "#"}>
                        {image.secondaryCtaText}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {showControls && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white w-12" : "bg-white/50 hover:bg-white/75",
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-white"></div>
      </div>
    </div>
  )
}
