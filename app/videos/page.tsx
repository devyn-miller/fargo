'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { PageHeader } from '../components/PageHeader'
import { Upload, Play } from 'lucide-react'

interface Video {
  id: string
  url: string
  title: string
  uploader: string
  timestamp: number
  category: string
}

export default function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([])
  const [newVideo, setNewVideo] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const videosRef = ref(db, 'videos')
    onValue(videosRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const videoList = Object.entries(data).map(([id, video]: [string, any]) => ({
          id,
          ...video,
        }))
        setVideos(videoList.sort((a, b) => b.timestamp - a.timestamp))
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(videoList.map(video => video.category).filter(Boolean)))
      setCategories(['All', ...uniqueCategories])
      }
    })
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewVideo(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!newVideo || !title || !category) return

    setUploading(true)

    try {
      const fileRef = storageRef(storage, `videos/${newVideo.name}`)
      await uploadBytes(fileRef, newVideo)
      const downloadURL = await getDownloadURL(fileRef)

      const videosRef = ref(db, 'videos')
      const newVideoRef = push(videosRef)
      await set(newVideoRef, {
        url: downloadURL,
        title: title,
        category: category,
        uploader: 'Anonymous', // Replace with actual user name when implemented
        timestamp: Date.now()
      })

      setNewVideo(null)
      setTitle('')
      setCategory('')
      alert('Video uploaded successfully!')
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Failed to upload video. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <PageHeader 
        title="Video Gallery" 
        description="Watch and share our family's precious moments"
      />
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-primary">Upload a Video</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">MP4, MOV or AVI (MAX. 100MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="video/*" />
            </label>
          </div>
          <input
            type="text"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Enter category (e.g., vacation, birthday)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleUpload}
            disabled={!newVideo || !title || !category || uploading}
            className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos
          .filter(video => selectedCategory === 'All' || video.category === selectedCategory)
          .map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <video className="w-full h-48 object-cover">
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-75" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600">
                  Uploaded by {video.uploader} on {new Date(video.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

