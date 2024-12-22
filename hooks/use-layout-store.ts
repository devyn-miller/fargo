"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutSection {
  id: string;
  order: number;
  visible: boolean;
}

interface LayoutStore {
  sections: LayoutSection[];
  updateSectionOrder: (sections: LayoutSection[]) => void;
  toggleSectionVisibility: (id: string) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      sections: [
        { id: 'recent-photos', order: 0, visible: true },
        { id: 'upcoming-events', order: 1, visible: true },
        { id: 'latest-memories', order: 2, visible: true },
      ],
      updateSectionOrder: (sections) => set({ sections }),
      toggleSectionVisibility: (id) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id
              ? { ...section, visible: !section.visible }
              : section
          ),
        })),
    }),
    {
      name: 'family-layout',
    }
  )
);