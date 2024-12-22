'use client';

import { useState, useEffect } from 'react';
import { listFilesInFolder, uploadFileToDrive, deleteFile } from '../lib/googleDrive';
import { PageHeader } from '../components/PageHeader';

interface Event {
  id: string;
  metadata: {
    title: string;
    date: string;
    location?: string;
    description?: string;
    attendees?: string[];
  };
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    attendees: [] as string[],
  });

  const fetchEvents = async () => {
    try {
      const files = await listFilesInFolder(undefined);
      const eventFiles = files
        .filter(file => file.name.endsWith('.event'))
        .map(file => ({
          id: file.id,
          metadata: JSON.parse(file.description || '{}'),
        }))
        .sort((a, b) => new Date(a.metadata.date).getTime() - new Date(b.metadata.date).getTime()) as Event[];
      setEvents(eventFiles);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a text file with .event extension to store event data
      const file = new File([''], `${newEvent.title.toLowerCase().replace(/\s+/g, '-')}.event`, {
        type: 'text/plain',
      });

      await uploadFileToDrive(file, newEvent);

      setNewEvent({
        title: '',
        date: '',
        location: '',
        description: '',
        attendees: [],
      });

      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await deleteFile(eventId);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Family Events"
        description="Keep track of our family gatherings and celebrations"
      />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
        <form onSubmit={handleAddEvent} className="max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Attendees (comma-separated)</label>
              <input
                type="text"
                value={newEvent.attendees.join(', ')}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  attendees: e.target.value.split(',').map(a => a.trim()).filter(Boolean),
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{event.metadata.title}</h3>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Date: {new Date(event.metadata.date).toLocaleString()}
            </p>
            {event.metadata.location && (
              <p className="text-sm text-gray-600 mb-2">
                Location: {event.metadata.location}
              </p>
            )}
            {event.metadata.description && (
              <p className="text-gray-700 mt-2">{event.metadata.description}</p>
            )}
            {event.metadata.attendees && event.metadata.attendees.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Attendees:</h4>
                <div className="flex flex-wrap gap-2">
                  {event.metadata.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No events added yet. Start by adding your first event!
        </div>
      )}
    </div>
  );
}
