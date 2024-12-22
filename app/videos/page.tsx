'use client';

import { useState, useEffect } from 'react';
import { listFilesInFolder } from '../lib/googleDrive';
import PhotoUpload from '../components/PhotoUpload';

interface VideoFile {
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

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const files = await listFilesInFolder(undefined, 'video');
      setVideos(files as VideoFile[]);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUploadComplete = () => {
    fetchVideos();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Video Gallery" 
        description="Watch and share our family's precious moments"
      />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload New Videos</h2>
        <PhotoUpload onUploadComplete={handleUploadComplete} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://drive.google.com/file/d/${video.id}/preview`}
                allow="autoplay"
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{video.metadata.title || video.name}</h3>
              {video.metadata.description && (
                <p className="text-gray-600 mb-2">{video.metadata.description}</p>
              )}
              {video.metadata.date && (
                <p className="text-sm text-gray-500 mb-1">
                  Date: {new Date(video.metadata.date).toLocaleDateString()}
                </p>
              )}
              {video.metadata.location && (
                <p className="text-sm text-gray-500 mb-1">
                  Location: {video.metadata.location}
                </p>
              )}
              {video.metadata.tags && video.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {video.metadata.tags.map((tag, index) => (
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
                href={video.webContentLink}
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

      {videos.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No videos uploaded yet. Start by uploading your first video!
        </div>
      )}
    </div>
  );
}
