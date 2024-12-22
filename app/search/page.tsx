'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ref, query, orderByChild, startAt, endAt, get } from 'firebase/database'
import { db } from '../lib/firebase'
import { PageHeader } from '../components/PageHeader'
import Image from 'next/image'

interface SearchResult {
  id: string
  type: 'photo' | 'video' | 'story'
  title: string
  content?: string
  url?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery) {
        const photoResults = await searchInNode('photos', searchQuery)
        const videoResults = await searchInNode('videos', searchQuery)
        const storyResults = await searchInNode('stories', searchQuery)

        setResults([...photoResults, ...videoResults, ...storyResults])
      }
    }

    fetchResults()
  }, [searchQuery])

  const searchInNode = async (node: string, searchTerm: string) => {
    const nodeRef = ref(db, node)
    const searchQuery = query(
      nodeRef,
      orderByChild('title'),
      startAt(searchTerm),
      endAt(searchTerm + '\uf8ff')
    )

    const snapshot = await get(searchQuery)
    const results: SearchResult[] = []

    snapshot.forEach((childSnapshot) => {
      const id = childSnapshot.key
      const data = childSnapshot.val()
      results.push({
        id: id!,
        type: node.slice(0, -1) as 'photo' | 'video' | 'story',
        title: data.title || data.caption,
        content: data.content,
        url: data.url,
      })
    })

    return results
  }

  return (
    <div>
      <PageHeader 
        title={`Search Results for "${searchQuery}"`} 
        description={`Found ${results.length} results`}
      />
      <div className="space-y-6">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Type: {result.type}</p>
            {result.content && <p className="mb-2">{result.content}</p>}
            {result.url && (
              <Image
                src={result.url}
                alt={result.title}
                width={200}
                height={150}
                className="rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

