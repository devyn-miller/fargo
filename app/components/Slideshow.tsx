'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface SlideshowProps {
  images: { id: string; url: string; caption: string }[]
  onClose: () => void
}

export function Slideshow({ images, onClose }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      >
        <X size={24} />
      </button>
      <button
        onClick={prevSlide}
        className="absolute left-4 text-white"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 text-white"
      >
        <ChevronRight size={24} />
      </button>
      <div className="relative">
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].caption}
          width={800}
          height={600}
          className="max-w-full max-h-[80vh] object-contain"
        />
        <p className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 p-2">
          {images[currentIndex].caption}
        </p>
      </div>
    </div>
  )
}

