"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type HeroImageCarouselProps = {
  images: string[]
  intervalMs?: number
}

export default function HeroImageCarousel({ images, intervalMs = 5000 }: HeroImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [images.length, intervalMs])

  if (images.length === 0) return null

  return (
    <div className="absolute inset-0" aria-label="Hero image carousel">
      {images.map((image, index) => (
        <Image
          key={image}
          alt="Agriculture field"
          src={image}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
          {images.map((image, index) => (
            <button
              key={`${image}-dot`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
