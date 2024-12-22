"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FontStore {
  font: string;
  setFont: (font: string) => void;
}

export const useFontStore = create<FontStore>()(
  persist(
    (set) => ({
      font: 'inter',
      setFont: (font) => set({ font }),
    }),
    {
      name: 'family-font',
    }
  )
);