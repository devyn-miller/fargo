"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../ui/card';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative mb-6"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-move p-2 text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      {children}
    </Card>
  );
}