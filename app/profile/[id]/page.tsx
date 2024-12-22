'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ref, onValue } from 'firebase/database'
import { db } from '../../lib/firebase'
import { PageHeader } from '../../components/PageHeader'
import Image from 'next/image'

interface UserProfile {
  name: string
  bio: string
  avatar: string
}

interface UserContribution {
  id: string
  type: 'photo' | 'video' | 'story'
  title: string
  timestamp: number
}

export default function UserProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [contributions, setContributions] = useState<UserContribution[]>([])

  useEffect(() => {
    const profileRef = ref(db, `users/${id}`)
    onValue(profileRef, (snapshot) => {
      setProfile(snapshot.val())
    })

    const contributionsRef = ref(db, `contributions/${id}`)
    onValue(contributionsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const contributionList = Object.entries(data).map(([id, contribution]: [string, any]) => ({
          id,
          ...contribution,
        }))
        setContributions(contributionList.sort((a, b) => b.timestamp - a.timestamp))
      }
    })
  }, [id])

  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <PageHeader 
        title={profile.name} 
        description="User Profile and Contributions"
      />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={100}
            height={100}
            className="rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.bio}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Recent Contributions</h3>
        <ul className="space-y-4">
          {contributions.map((contribution) => (
            <li key={contribution.id} className="border-b pb-2">
              <p className="font-semibold">{contribution.title}</p>
              <p className="text-sm text-gray-600">
                {contribution.type.charAt(0).toUpperCase() + contribution.type.slice(1)} • 
                {new Date(contribution.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

