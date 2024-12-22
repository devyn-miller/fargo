import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface MemoryListProps {
  memories: any[];
}

export function MemoryList({ memories }: MemoryListProps) {
  return (
    <div className="space-y-6">
      {memories.map((memory) => (
        <Card key={memory.id} className="p-6">
          <p className="text-lg mb-4">{memory.content}</p>
          <div className="text-sm text-muted-foreground">
            <span>Shared by {memory.created_by}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(memory.created_at), "PPp")}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}