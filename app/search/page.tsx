'use client';

import { useState } from 'react';
import { listFilesInFolder } from '../lib/googleDrive';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  metadata: {
    title?: string;
    content?: string;
    author?: string;
    date?: string;
    type: 'photo' | 'memory' | 'event' | 'profile';
    [key: string]: any;
  };
  webContentLink?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const files = await listFilesInFolder(undefined);
      
      // Filter and process results based on query
      const searchResults = files
        .filter(file => {
          const metadata = JSON.parse(file.description || '{}');
          const searchableText = [
            file.name,
            metadata.title,
            metadata.content,
            metadata.author,
            metadata.name,
            metadata.bio,
            (metadata.tags || []).join(' '),
          ].join(' ').toLowerCase();
          
          return searchableText.includes(query.toLowerCase());
        })
        .map(file => ({
          id: file.id,
          name: file.name,
          metadata: JSON.parse(file.description || '{}'),
          webContentLink: file.webContentLink,
        }));

      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (result: SearchResult) => {
    const fileType = result.name.split('.').pop();
    const metadata = result.metadata;

    switch (fileType) {
      case 'memory':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{metadata.title}</h3>
            <p className="text-gray-700 mb-2">{metadata.content}</p>
            <p className="text-sm text-gray-600">
              Shared by {metadata.author} on {new Date(metadata.date!).toLocaleDateString()}
            </p>
          </div>
        );

      case 'profile':
        return (
          <Link href={`/profile/${result.name.replace('.profile', '')}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                {metadata.avatar ? (
                  <Image
                    src={metadata.avatar}
                    alt={metadata.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">{metadata.name[0]}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{metadata.name}</h3>
                  <p className="text-gray-600">{metadata.bio}</p>
                </div>
              </div>
            </div>
          </Link>
        );

      case 'event':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{metadata.title}</h3>
            <p className="text-gray-700 mb-2">{metadata.description}</p>
            <p className="text-sm text-gray-600">
              {new Date(metadata.date!).toLocaleDateString()}
            </p>
          </div>
        );

      default:
        if (result.webContentLink && (result.name.endsWith('.jpg') || result.name.endsWith('.png'))) {
          return (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative w-full h-48">
                <Image
                  src={result.webContentLink}
                  alt={metadata.title || result.name}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              {metadata.title && (
                <div className="mt-2">
                  <h3 className="font-semibold">{metadata.title}</h3>
                  {metadata.date && (
                    <p className="text-sm text-gray-600">
                      {new Date(metadata.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Family Content</h1>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for photos, memories, events, or family members..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div key={result.id}>
              {renderResult(result)}
            </div>
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center text-gray-600">
          No results found for "{query}"
        </div>
      ) : null}
    </div>
  );
}
