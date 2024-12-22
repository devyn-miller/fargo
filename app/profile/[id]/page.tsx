'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { listFilesInFolder, uploadFileToDrive, updateFileMetadata, deleteFile } from '../../lib/googleDrive'
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const files = await listFilesInFolder(undefined)
        const profileFile = files.find(
          file => file.name === `${id}.profile`
        ) as UserProfile | undefined

        if (profileFile) {
          setProfile(profileFile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  if (!profile) {
    return (
      <div>Profile not found</div>
    )
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
