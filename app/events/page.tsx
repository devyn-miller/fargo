"use client";

import { useState, useEffect } from "react";
import { useUsername } from "@/hooks/use-username";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventList } from "@/components/events/event-list";
import { EventForm } from "@/components/events/event-form";
import { getEvents } from "@/lib/events";

export default function EventsPage() {
  const { username } = useUsername();
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Family Events</h1>
        <Button onClick={() => setShowEventForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <EventList events={events} />
      </div>

      <EventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        username={username}
      />
    </div>
  );
}