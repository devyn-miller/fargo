'use client';

import { useState, useEffect } from 'react';
import { listFilesInFolder, uploadFileToDrive, deleteFile } from '../lib/googleDrive';

interface Memory {
  id: string;
  metadata: {
    title: string;
    content: string;
    author: string;
    date: string;
    tags?: string[];
  };
}

export default function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
  });

  const fetchMemories = async () => {
    try {
      const files = await listFilesInFolder(undefined);
      const memoryFiles = files
        .filter(file => file.name.endsWith('.memory'))
        .map(file => ({
          id: file.id,
          metadata: JSON.parse(file.description || '{}'),
        }))
        .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()) as Memory[];
      setMemories(memoryFiles);
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const file = new File([''], `${newMemory.title.toLowerCase().replace(/\s+/g, '-')}.memory`, {
        type: 'text/plain',
      });

      await uploadFileToDrive(file, {
        ...newMemory,
        date: newMemory.date || new Date().toISOString().split('T')[0],
      });

      setNewMemory({
        title: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
      });

      fetchMemories();
    } catch (error) {
      console.error('Error adding memory:', error);
      alert('Failed to add memory. Please try again.');
    }
  };

  const handleDelete = async (memoryId: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;

    try {
      await deleteFile(memoryId);
      fetchMemories();
    } catch (error) {
      console.error('Error deleting memory:', error);
      alert('Failed to delete memory. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading memories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Memory Wall</h2>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Share a Memory</h3>
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={newMemory.author}
                onChange={(e) => setNewMemory({ ...newMemory, author: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={newMemory.tags.join(', ')}
                onChange={(e) => setNewMemory({
                  ...newMemory,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark"
            >
              Share Memory
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{memory.metadata.title}</h3>
              <button
                onClick={() => handleDelete(memory.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-700 mb-4">{memory.metadata.content}</p>
            <p className="text-sm text-gray-600">
              Shared by {memory.metadata.author} on{' '}
              {new Date(memory.metadata.date).toLocaleDateString()}
            </p>
            {memory.metadata.tags && memory.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {memory.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No memories shared yet. Be the first to share a memory!
        </div>
      )}
    </div>
  );
}
