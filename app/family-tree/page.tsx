'use client';

import { useState, useEffect } from 'react';
import { listFilesInFolder, uploadFileToDrive, deleteFile } from '../lib/googleDrive';
import { PageHeader } from '../components/PageHeader';

interface FamilyMember {
  id: string;
  metadata: {
    name: string;
    birthDate?: string;
    deathDate?: string;
    bio?: string;
    relationships?: {
      type: 'parent' | 'child' | 'spouse';
      memberId: string;
    }[];
    photoUrl?: string;
  };
}

export default function FamilyTree() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    bio: '',
  });

  const fetchMembers = async () => {
    try {
      const files = await listFilesInFolder(undefined);
      const familyMembers = files
        .filter(file => file.name.endsWith('.family'))
        .map(file => ({
          id: file.id,
          metadata: JSON.parse(file.description || '{}'),
        })) as FamilyMember[];
      setMembers(familyMembers);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a text file with .family extension to store member data
      const file = new File([''], `${newMember.name.toLowerCase().replace(/\s+/g, '-')}.family`, {
        type: 'text/plain',
      });

      await uploadFileToDrive(file, {
        ...newMember,
        relationships: [],
      });

      setNewMember({
        name: '',
        birthDate: '',
        deathDate: '',
        bio: '',
      });

      fetchMembers();
    } catch (error) {
      console.error('Error adding family member:', error);
      alert('Failed to add family member. Please try again.');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this family member?')) return;

    try {
      await deleteFile(memberId);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting family member:', error);
      alert('Failed to delete family member. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading family tree...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Family Tree"
        description="Explore our family's roots and connections"
      />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Family Member</h2>
        <form onSubmit={handleAddMember} className="max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Birth Date</label>
              <input
                type="date"
                value={newMember.birthDate}
                onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Death Date</label>
              <input
                type="date"
                value={newMember.deathDate}
                onChange={(e) => setNewMember({ ...newMember, deathDate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{member.metadata.name}</h3>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            {member.metadata.birthDate && (
              <p className="text-sm text-gray-600 mb-2">
                Born: {new Date(member.metadata.birthDate).toLocaleDateString()}
              </p>
            )}
            {member.metadata.deathDate && (
              <p className="text-sm text-gray-600 mb-2">
                Died: {new Date(member.metadata.deathDate).toLocaleDateString()}
              </p>
            )}
            {member.metadata.bio && (
              <p className="text-gray-700 mt-2">{member.metadata.bio}</p>
            )}
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No family members added yet. Start by adding your first family member!
        </div>
      )}
    </div>
  );
}
