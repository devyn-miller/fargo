'use client'

import { useState, useEffect } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '../lib/firebase'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

moment.locale('en-GB')
const localizer = momentLocalizer(moment)

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  description: string
}

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' })

  useEffect(() => {
    const eventsRef = ref(db, 'events')
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const eventList = Object.entries(data).map(([id, event]: [string, any]) => ({
          id,
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
        setEvents(eventList)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title.trim() || !newEvent.start || !newEvent.end) return

    const eventsRef = ref(db, 'events')
    const newEventRef = push(eventsRef)
    await set(newEventRef, newEvent)

    setNewEvent({ title: '', start: '', end: '', description: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Event Calendar</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          placeholder="Event Title"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <textarea
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          placeholder="Event Description"
          className="w-full p-2 border rounded mb-4"
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Event
        </button>
      </form>
      <div className="mt-8" style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  )
}

