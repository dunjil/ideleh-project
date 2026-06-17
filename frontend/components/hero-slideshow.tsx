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
      className={cn("relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex flex-col lg:flex-row items-center bg-background/50 overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Left pane: Content */}
      <div className="w-full lg:w-1/2 relative flex items-center shrink-0 z-10 min-h-[45vh] sm:min-h-[50vh] lg:min-h-[85vh] order-2 lg:order-1">
        {images.map((image, index) => (
          <div
            key={`content-${image.id}`}
            className={cn(
              "absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 transition-all duration-1000",
              index === currentIndex
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8 pointer-events-none"
            )}
          >
            <div className="max-w-xl space-y-4 sm:space-y-6 lg:space-y-8 pb-16 sm:pb-20 lg:pb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight text-foreground">
                {image.title}
              </h1>
              {image.description && (
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                  {image.description}
                </p>
              )}

              {(image.ctaText || image.secondaryCtaText) && (
                <div className="pt-2 sm:pt-4 lg:pt-6 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  {image.ctaText && (
                    <Button
                      asChild
                      size="lg"
                      className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md shadow-sm xl:shadow-md w-full sm:w-auto"
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
                      className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg transition-all border-border text-foreground hover:bg-accent hover:text-accent-foreground rounded-md w-full sm:w-auto"
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
          <div className="absolute bottom-4 sm:bottom-8 left-6 sm:left-8 md:left-12 lg:left-16 xl:left-24 flex gap-2 sm:gap-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-md border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-md border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-sm"
              onClick={goToNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Right pane: Framed Image Slideshow */}
      <div className="w-full lg:w-1/2 relative min-h-[35vh] sm:min-h-[40vh] lg:min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-12 xl:p-16 order-1 lg:order-2">
        <div className="relative w-full max-w-md lg:max-w-none aspect-[4/5] lg:aspect-square overflow-hidden rounded-2xl sm:rounded-[2rem] lg:rounded-[4rem] shadow-2xl border-2 sm:border-4 border-white bg-gray-100">
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
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 xl:right-16 lg:bottom-8 xl:bottom-10 z-20 flex gap-2 sm:gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 sm:h-2 transition-all duration-300 rounded-full",
                index === currentIndex ? "bg-primary w-6 sm:w-8" : "bg-gray-300 w-1.5 sm:w-2 hover:bg-gray-400"
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
