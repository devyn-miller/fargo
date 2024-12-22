'use client';

import { useState, useEffect } from 'react';
import { listFilesInFolder, uploadFileToDrive, updateFileMetadata, deleteFile } from '../lib/googleDrive';
import Image from 'next/image';

interface Story {
  id: string;
  metadata: {
    title: string;
    content: string;
    author: string;
    date: string;
    images: string[];
    tags: string[];
  };
}

export default function MemoryWall() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    tags: [] as string[],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const files = await listFilesInFolder(undefined);
      const storyFiles = files
        .filter(file => file.name.endsWith('.story'))
        .map(file => ({
          id: file.id,
          metadata: JSON.parse(file.description || '{}'),
        }))
        .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()) as Story[];
      
      setStories(storyFiles);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, upload all images
      const uploadedImages = await Promise.all(
        selectedImages.map(async (image) => {
          const result = await uploadFileToDrive(image, {
            type: 'story-image',
            storyTitle: newStory.title,
          });
          return result.webContentLink;
        })
      );

      // Create the story file
      const file = new File([''], `${newStory.title.toLowerCase().replace(/\s+/g, '-')}.story`, {
        type: 'text/plain',
      });

      await uploadFileToDrive(file, {
        ...newStory,
        images: uploadedImages,
        date: newStory.date || new Date().toISOString().split('T')[0],
      });

      // Reset form
      setNewStory({
        title: '',
        content: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
      });
      setSelectedImages([]);
      setShowForm(false);

      // Refresh stories
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      await deleteFile(storyId);
      fetchStories();
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Memory Wall</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          {showForm ? 'Cancel' : 'Share a Memory'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Share Your Memory</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                className="w-full p-2 border rounded"
                rows={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={newStory.author}
                onChange={(e) => setNewStory({ ...newStory, author: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={newStory.date}
                onChange={(e) => setNewStory({ ...newStory, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={newStory.tags.join(', ')}
                onChange={(e) => setNewStory({
                  ...newStory,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Sharing...' : 'Share Memory'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {stories.map((story) => (
          <article key={story.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">{story.metadata.title}</h2>
              <button
                onClick={() => handleDelete(story.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{story.metadata.content}</p>
            
            {story.metadata.images && story.metadata.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {story.metadata.images.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image}
                      alt={`Image ${index + 1} from ${story.metadata.title}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Shared by {story.metadata.author} on{' '}
                {new Date(story.metadata.date).toLocaleDateString()}
              </p>
              {story.metadata.tags && story.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {story.metadata.tags.map((tag, index) => (
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
          </article>
        ))}

        {stories.length === 0 && (
          <div className="text-center text-gray-600">
            No memories shared yet. Be the first to share a memory!
          </div>
        )}
      </div>
    </div>
  );
}
