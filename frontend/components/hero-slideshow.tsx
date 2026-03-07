"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
      className={cn("relative min-h-[85vh] flex flex-col lg:flex-row items-center bg-gray-50/50 overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Left pane: Content */}
      <div className="w-full lg:w-1/2 relative flex items-center shrink-0 z-10 min-h-[50vh] lg:min-h-[85vh]">
        {images.map((image, index) => (
          <div
            key={`content-${image.id}`}
            className={cn(
              "absolute inset-0 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24 transition-all duration-1000",
              index === currentIndex
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
            )}
          >
            <div className="max-w-xl space-y-8 pt-12 lg:pt-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-black">
                {image.title}
              </h1>
              {image.description && (
                <p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
                  {image.description}
                </p>
              )}

              {(image.ctaText || image.secondaryCtaText) && (
                <div className="pt-6 flex flex-col sm:flex-row items-start gap-4">
                  {image.ctaText && (
                    <Button
                      asChild
                      size="lg"
                      className="px-8 py-6 text-lg bg-primary text-white hover:bg-primary/90 transition-all rounded-md shadow-sm xl:shadow-md"
                    >
                      <Link href={image.ctaLink || "#"}>
                        {image.ctaText}
                      </Link>
                    </Button>
                  )}
                  {image.secondaryCtaText && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-lg transition-all border-gray-300 text-black hover:bg-gray-100 hover:text-black rounded-md"
                    >
                      <Link href={image.secondaryCtaLink || "#"}>
                        {image.secondaryCtaText}
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <div className="absolute bottom-8 left-8 sm:left-12 lg:left-20 xl:left-24 flex gap-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-md border-gray-200 bg-white text-black hover:bg-gray-50 hover:text-primary transition-all shadow-sm"
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-md border-gray-200 bg-white text-black hover:bg-gray-50 hover:text-primary transition-all shadow-sm"
              onClick={goToNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Right pane: Framed Image Slideshow */}
      <div className="w-full lg:w-1/2 relative min-h-[40vh] lg:min-h-[85vh] flex items-center justify-center p-6 lg:p-12 xl:p-16">
        <div className="relative w-full aspect-[4/5] lg:aspect-square overflow-hidden rounded-[2rem] lg:rounded-[4rem] shadow-2xl border-4 border-white bg-gray-100">
          {images.map((image, index) => (
            <div
              key={`image-${image.id}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt={image.title}
                fill
                className={cn(
                  "object-cover transition-transform duration-[15000ms] ease-out",
                  index === currentIndex ? "scale-105" : "scale-100"
                )}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-16 lg:bottom-10 z-20 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 transition-all duration-300 rounded-full",
                index === currentIndex ? "bg-primary w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
