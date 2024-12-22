'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from '../lib/firebase'

interface Theme {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

const defaultTheme: Theme = {
  primaryColor: '#3b82f6',
  secondaryColor: '#60a5fa',
  fontFamily: 'Inter, sans-serif',
}

const ThemeContext = createContext<{
  theme: Theme
  updateTheme: (newTheme: Partial<Theme>) => void
}>({
  theme: defaultTheme,
  updateTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const themeRef = ref(db, 'theme')
    onValue(themeRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setTheme(data)
      }
    })
  }, [])

  const updateTheme = async (newTheme: Partial<Theme>) => {
    const updatedTheme = { ...theme, ...newTheme }
    setTheme(updatedTheme)
    const themeRef = ref(db, 'theme')
    await set(themeRef, updatedTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <div style={{ 
        '--color-primary': theme.primaryColor, 
        '--color-secondary': theme.secondaryColor,
        fontFamily: theme.fontFamily
      } as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

