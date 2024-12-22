'use client'

import { useState } from 'react'
import { FamilyMemberType } from '../types/family'

interface AddFamilyMemberProps {
  onAdd: (newMember: Omit<FamilyMemberType, 'id'>) => void
  familyMembers: FamilyMemberType[]
}

export function AddFamilyMember({ onAdd, familyMembers }: AddFamilyMemberProps) {
  const [newMember, setNewMember] = useState<Omit<FamilyMemberType, 'id'>>({
    name: '',
    birthdate: '',
    bio: '',
    parentId: '',
    relationships: {},
    milestones: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(newMember)
    setNewMember({
      name: '',
      birthdate: '',
      bio: '',
      parentId: '',
      relationships: {},
      milestones: []
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Add Family Member</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={newMember.birthdate}
          onChange={(e) => setNewMember({ ...newMember, birthdate: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          value={newMember.bio}
          onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
          placeholder="Short bio"
          className="w-full p-2 border rounded"
          rows={3}
        />
        <select
          value={newMember.parentId}
          onChange={(e) => setNewMember({ ...newMember, parentId: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Parent (optional)</option>
          {familyMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark transition-colors"
        >
          Add Family Member
        </button>
      </div>
    </form>
  )
}

