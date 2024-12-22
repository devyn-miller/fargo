'use client'

import { useState, useCallback } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageEditorProps {
  src: string
  onSave: (croppedImageUrl: string) => void
}

export function ImageEditor({ src, onSave }: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>()
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    setImageRef(img)
  }, [])

  const handleSave = useCallback(() => {
    if (imageRef && crop) {
      const canvas = document.createElement('canvas')
      const scaleX = imageRef.naturalWidth / imageRef.width
      const scaleY = imageRef.naturalHeight / imageRef.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(
          imageRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        )

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob)
            onSave(croppedImageUrl)
          }
        })
      }
    }
  }, [imageRef, crop, onSave])

  return (
    <div>
      <ReactCrop crop={crop} onChange={c => setCrop(c)}>
        <img src={src} onLoad={e => onImageLoaded(e.currentTarget)} />
      </ReactCrop>
      <button onClick={handleSave} className="mt-4 bg-primary text-white p-2 rounded">
        Save Cropped Image
      </button>
    </div>
  )
}

