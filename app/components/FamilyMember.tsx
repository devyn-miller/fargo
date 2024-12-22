'use client'

import { useState } from 'react'
import { FamilyMemberType } from '../types/family'
import { Edit2, Trash2, Plus, X } from 'lucide-react'

interface FamilyMemberProps {
  member: FamilyMemberType
  onUpdate: (updatedMember: Partial<FamilyMemberType>) => void
  onDelete: () => void
}

export function FamilyMember({ member, onUpdate, onDelete }: FamilyMemberProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedMember, setEditedMember] = useState(member)
  const [newMilestone, setNewMilestone] = useState({ date: '', description: '' })

  const handleSave = () => {
    onUpdate(editedMember)
    setIsEditing(false)
  }

  const handleAddMilestone = () => {
    if (newMilestone.date && newMilestone.description) {
      setEditedMember(prev => ({
        ...prev,
        milestones: [...(prev.milestones || []), newMilestone]
      }))
      setNewMilestone({ date: '', description: '' })
    }
  }

  const handleRemoveMilestone = (index: number) => {
    setEditedMember(prev => ({
      ...prev,
      milestones: prev.milestones?.filter((_, i) => i !== index)
    }))
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          value={editedMember.name}
          onChange={(e) => setEditedMember({ ...editedMember, name: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="date"
          value={editedMember.birthdate}
          onChange={(e) => setEditedMember({ ...editedMember, birthdate: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          value={editedMember.bio}
          onChange={(e) => setEditedMember({ ...editedMember, bio: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <h4 className="font-semibold mt-4 mb-2">Milestones</h4>
        {editedMember.milestones?.map((milestone, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="date"
              value={milestone.date}
              onChange={(e) => {
                const newMilestones = [...(editedMember.milestones || [])]
                newMilestones[index] = { ...milestone, date: e.target.value }
                setEditedMember({ ...editedMember, milestones: newMilestones })
              }}
              className="p-2 border rounded mr-2"
            />
            <input
              type="text"
              value={milestone.description}
              onChange={(e) => {
                const newMilestones = [...(editedMember.milestones || [])]
                newMilestones[index] = { ...milestone, description: e.target.value }
                setEditedMember({ ...editedMember, milestones: newMilestones })
              }}
              className="flex-grow p-2 border rounded mr-2"
            />
            <button onClick={() => handleRemoveMilestone(index)} className="text-red-500">
              <X size={20} />
            </button>
          </div>
        ))}
        <div className="flex items-center mt-2">
          <input
            type="date"
            value={newMilestone.date}
            onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="text"
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            placeholder="New milestone"
            className="flex-grow p-2 border rounded mr-2"
          />
          <button onClick={handleAddMilestone} className="text-green-500">
            <Plus size={20} />
          </button>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded">Save</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{member.name}</h3>
          {member.birthdate && <p className="text-sm text-gray-600">Born: {member.birthdate}</p>}
          {member.bio && <p className="text-sm mt-2">{member.bio}</p>}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="text-blue-500">
            <Edit2 size={20} />
          </button>
          <button onClick={onDelete} className="text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      {member.milestones && member.milestones.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Milestones</h4>
          <ul className="list-disc list-inside">
            {member.milestones.map((milestone, index) => (
              <li key={index} className="text-sm">
                {milestone.date}: {milestone.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

