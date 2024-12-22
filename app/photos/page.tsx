'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '../lib/firebase'
import Image from 'next/image'
import { PhotoUpload } from '../components/PhotoUpload'
import { PageHeader } from '../components/PageHeader'

interface Photo {
  id: string
  url: string
  caption: string
  uploader: string
  comments?: { [key: string]: { author: string; content: string; timestamp: number } }
}

function Comment({ comment }: { comment: { author: string; content: string; timestamp: number } }) {
  return (
    <div className="bg-gray-100 rounded p-2 mb-2">
      <p className="text-sm">{comment.content}</p>
      <p className="text-xs text-gray-600">
        By {comment.author} on {new Date(comment.timestamp).toLocaleString()}
      </p>
    </div>
  )
}

function AddComment({ photoId, onCommentAdded }: { photoId: string; onCommentAdded: () => void }) {
  const [comment, setComment] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !author.trim()) return

    const commentRef = ref(db, `photos/${photoId}/comments`)
    const newCommentRef = push(commentRef)
    await set(newCommentRef, {
      content: comment,
      author: author,
      timestamp: Date.now()
    })

    setComment('')
    setAuthor('')
    onCommentAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your Name"
        className="w-full p-2 border rounded mb-2 text-sm"
        required
      />
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border rounded mb-2 text-sm"
        required
      />
      <button type="submit" className="bg-primary text-white p-2 rounded text-sm">Post Comment</button>
    </form>
  )
}


export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const photosRef = ref(db, 'photos')
    onValue(photosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const photoList = Object.entries(data).map(([id, photo]: [string, any]) => ({
          id,
          ...photo,
        }))
        setPhotos(photoList.sort((a, b) => b.timestamp - a.timestamp))
      }
    })
  }, [])

  return (
    <div>
      <PageHeader 
        title="Photo Gallery" 
        description="Cherish our family moments through pictures"
      />
      <PhotoUpload />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <Image
              src={photo.url}
              alt={photo.caption}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">{photo.caption}</p>
              <p className="text-xs text-gray-500 mb-2">Uploaded by: {photo.uploader}</p>
              <div className="flex space-x-2 mb-2">
                <button className="text-gray-500 hover:text-blue-500">👍 Like</button>
                <button className="text-gray-500 hover:text-red-500">❤️ Love</button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Comments</h4>
                {photo.comments && Object.entries(photo.comments).map(([id, comment]: [string, any]) => (
                  <Comment key={id} comment={comment} />
                ))}
                <AddComment photoId={photo.id} onCommentAdded={() => {}} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

