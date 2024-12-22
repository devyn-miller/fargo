'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set, remove } from 'firebase/database'
import { db } from '../lib/firebase'
import { PageHeader } from '../components/PageHeader'
import { FamilyMember } from '../components/FamilyMember'
import { AddFamilyMember } from '../components/AddFamilyMember'

interface FamilyMemberType {
  id: string
  name: string
  birthdate?: string
  bio?: string
  parentId?: string
  relationships?: { [key: string]: string }
  milestones?: { date: string, description: string }[]
}

export default function FamilyTree() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberType[]>([])

  useEffect(() => {
    const membersRef = ref(db, 'familyMembers')
    onValue(membersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const memberList = Object.entries(data).map(([id, member]: [string, any]) => ({
          id,
          ...member,
        }))
        setFamilyMembers(memberList)
      }
    })
  }, [])

  const handleAddMember = async (newMember: Omit<FamilyMemberType, 'id'>) => {
    const membersRef = ref(db, 'familyMembers')
    const newMemberRef = push(membersRef)
    await set(newMemberRef, newMember)
  }

  const handleUpdateMember = async (id: string, updatedMember: Partial<FamilyMemberType>) => {
    const memberRef = ref(db, `familyMembers/${id}`)
    await set(memberRef, { ...familyMembers.find(m => m.id === id), ...updatedMember })
  }

  const handleDeleteMember = async (id: string) => {
    const memberRef = ref(db, `familyMembers/${id}`)
    await remove(memberRef)
  }

  const renderFamilyTree = (parentId: string | null = null, depth = 0) => {
    const children = familyMembers.filter(member => member.parentId === parentId)
    
    if (children.length === 0) return null

    return (
      <ul className={`pl-${depth * 8}`}>
        {children.map(member => (
          <li key={member.id} className="mb-4">
            <FamilyMember
              member={member}
              onUpdate={(updatedMember) => handleUpdateMember(member.id, updatedMember)}
              onDelete={() => handleDeleteMember(member.id)}
            />
            {renderFamilyTree(member.id, depth + 1)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <PageHeader 
        title="Family Tree" 
        description="Explore and edit our family connections"
      />
      <div className="mb-8">
        <AddFamilyMember onAdd={handleAddMember} familyMembers={familyMembers} />
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">Our Family Tree</h2>
        {renderFamilyTree()}
      </div>
    </div>
  )
}

