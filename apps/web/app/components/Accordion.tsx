"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const images = [
  {
    src: "/jwellery.jpeg?height=500&width=500",
    alt: "AI generated jwellery",
    prompt: "Breathtaking mountain landscape at sunset with vibrant colors",
  },
  {
    src: "/girl.jpeg?height=500&width=500",
    alt: "AI generated portrait",
    prompt: "Portrait of a young woman with flowing hair in a cyberpunk style",
  },
  {
    src: "/auto.jpeg?height=500&width=500",
    alt: "AI generated fantasy scene",
    prompt: "Magical forest with glowing mushrooms and fantasy creatures",
  },
  {
    src: "/shadow.jpeg?height=500&width=500",
    alt: "AI generated futuristic city",
    prompt: "Futuristic cityscape with flying vehicles and neon lights",
  },
  {
    src: "/tunnel.jpeg?height=500&width=500",
    alt: "AI generated futuristic city",
    prompt: "Futuristic cityscape with flying vehicles and neon lights",
  },
]

export function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative rounded-xl overflow-hidden border shadow-xl">
      <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden ">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <p className="text-sm font-medium mb-1">Prompt:</p>
        <p className="text-xs opacity-90">{images[activeIndex]?.prompt}</p>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn("w-2 h-2 rounded-full transition-colors", index === activeIndex ? "bg-white" : "bg-white/30")}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}