'use client';

import { useState, useEffect } from 'react';
import { listFilesInFolder } from '../lib/googleDrive';
import PhotoUpload from '../components/PhotoUpload';
import { PageHeader } from '../components/PageHeader';

interface PhotoFile {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
  metadata: {
    title?: string;
    description?: string;
    date?: string;
    tags?: string[];
    location?: string;
  };
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [tags, setTags] = useState<string[]>(['All']);

  const fetchPhotos = async () => {
    try {
      const files = await listFilesInFolder(undefined, 'image');
      setPhotos(files as PhotoFile[]);
      
      // Extract unique tags
      const uniqueTags = new Set<string>();
      files.forEach(file => {
        file.metadata.tags?.forEach(tag => uniqueTags.add(tag));
      });
      setTags(['All', ...Array.from(uniqueTags)]);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUploadComplete = () => {
    fetchPhotos();
  };

  const filteredPhotos = selectedTag === 'All'
    ? photos
    : photos.filter(photo => photo.metadata.tags?.includes(selectedTag));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Photo Gallery" 
        description="Browse through our cherished family photos"
      />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload New Photos</h2>
        <PhotoUpload onUploadComplete={handleUploadComplete} />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Tag:
        </label>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={`https://drive.google.com/uc?id=${photo.id}`}
                alt={photo.metadata.title || photo.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{photo.metadata.title || photo.name}</h3>
              {photo.metadata.description && (
                <p className="text-gray-600 mb-2">{photo.metadata.description}</p>
              )}
              {photo.metadata.date && (
                <p className="text-sm text-gray-500 mb-1">
                  Date: {new Date(photo.metadata.date).toLocaleDateString()}
                </p>
              )}
              {photo.metadata.location && (
                <p className="text-sm text-gray-500 mb-1">
                  Location: {photo.metadata.location}
                </p>
              )}
              {photo.metadata.tags && photo.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {photo.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={photo.webContentLink}
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No photos uploaded yet. Start by uploading your first photo!
        </div>
      )}
    </div>
  );
}
