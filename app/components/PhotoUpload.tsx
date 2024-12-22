'use client';

import { useState } from 'react';
import { uploadFileToDrive } from '../lib/googleDrive';

interface PhotoUploadProps {
  onUploadComplete?: (fileData: any) => void;
}

export default function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    date: '',
    tags: [] as string[],
    location: ''
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadFileToDrive(file, {
          ...metadata,
          date: metadata.date || new Date().toISOString()
        });
        return result;
      });

      const results = await Promise.all(uploadPromises);
      onUploadComplete?.(results);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={metadata.description}
          onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={metadata.date}
          onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={metadata.tags.join(', ')}
          onChange={(e) => setMetadata({ ...metadata, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={metadata.location}
          onChange={(e) => setMetadata({ ...metadata, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Choose Files</label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          className="w-full p-2 border rounded"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="text-center text-sm text-gray-600">
          Uploading files...
        </div>
      )}
    </div>
  );
}
