'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '../lib/firebase'
import { PageHeader } from './PageHeader'

interface Memory {
  id: string
  content: string
  author: string
  timestamp: number
}

export function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [newMemory, setNewMemory] = useState('')
  const [authorName, setAuthorName] = useState('')

  useEffect(() => {
    const memoriesRef = ref(db, 'memories')
    onValue(memoriesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const memoryList = Object.entries(data).map(([id, memory]: [string, any]) => ({
          id,
          ...memory,
        }))
        setMemories(memoryList.sort((a, b) => b.timestamp - a.timestamp))
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemory.trim() || !authorName.trim()) return

    const memoriesRef = ref(db, 'memories')
    const newMemoryRef = push(memoriesRef)
    await set(newMemoryRef, {
      content: newMemory,
      author: authorName,
      timestamp: Date.now()
    })

    setNewMemory('')
  }

  return (
    <div>
      <PageHeader 
        title="Memory Wall" 
        description="Share and cherish our family memories"
      />
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <textarea
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          placeholder="Share a memory..."
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
        >
          Post Memory
        </button>
      </form>
      <div className="space-y-6">
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-lg shadow-md p-4">
            <p className="mb-2">{memory.content}</p>
            <p className="text-sm text-gray-600">
              Posted by {memory.author} on {new Date(memory.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

