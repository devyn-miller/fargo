"use client";

import { useUsername } from "@/hooks/use-username";
import { UsernameDialog } from "@/components/username-dialog";
import { HomeCarousel } from "@/components/home-carousel";
import { FeatureCards } from "@/components/feature-cards";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useLayoutStore } from '@/hooks/use-layout-store';
import { DraggableSection } from '@/components/layout/draggable-section';

export default function Home() {
  const { username, showNameDialog, setShowNameDialog, handleSetUsername } = useUsername();
  const { sections, updateSectionOrder } = useLayoutStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      updateSectionOrder(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const visibleSections = sections.filter((s) => s.visible);

  return (
    <div className="container mx-auto px-4 py-8">
      <UsernameDialog
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        onSubmit={handleSetUsername}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {visibleSections.map((section) => (
            <DraggableSection key={section.id} id={section.id}>
              {section.id === 'recent-photos' && <HomeCarousel />}
              {section.id === 'latest-memories' && <FeatureCards />}
            </DraggableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}