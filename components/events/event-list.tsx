import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface EventListProps {
  events: any[];
}

export function EventList({ events }: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-4">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-muted-foreground">
            {format(new Date(event.date), "PPP")}
          </p>
          {event.description && (
            <p className="mt-2">{event.description}</p>
          )}
        </Card>
      ))}
    </div>
  );
}