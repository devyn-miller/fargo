'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '../lib/firebase'

interface Story {
  id: string
  content: string
  author: string
  timestamp: number
}

export default function MemoryWall() {
  const [stories, setStories] = useState<Story[]>([])
  const [newStory, setNewStory] = useState('')
  const [authorName, setAuthorName] = useState('')

  useEffect(() => {
    const storiesRef = ref(db, 'stories')
    onValue(storiesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const storyList = Object.entries(data).map(([id, story]: [string, any]) => ({
          id,
          ...story,
        }))
        setStories(storyList.sort((a, b) => b.timestamp - a.timestamp))
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStory.trim() || !authorName.trim()) return

    const storiesRef = ref(db, 'stories')
    const newStoryRef = push(storiesRef)
    await set(newStoryRef, {
      content: newStory,
      author: authorName,
      timestamp: Date.now()
    })

    setNewStory('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Memory Wall</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <textarea
          value={newStory}
          onChange={(e) => setNewStory(e.target.value)}
          placeholder="Share a memory..."
          className="w-full p-2 border rounded mb-4"
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Post Memory
        </button>
      </form>
      <div className="space-y-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-md p-4">
            <p className="mb-2">{story.content}</p>
            <p className="text-sm text-gray-600">
              Posted by {story.author} on {new Date(story.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

