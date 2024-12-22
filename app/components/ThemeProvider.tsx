'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { listFilesInFolder, uploadFileToDrive, updateFileMetadata } from '../lib/googleDrive'

interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

interface ThemeFile {
  id: string
  metadata: {
    theme: string
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('light')
  const [themeFileId, setThemeFileId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const files = await listFilesInFolder(undefined)
        const themeFile = files.find(file => file.name === 'theme.config') as ThemeFile | undefined

        if (themeFile) {
          setThemeFileId(themeFile.id)
          setThemeState(themeFile.metadata.theme || 'light')
        } else {
          // Create theme file if it doesn't exist
          const file = new File([''], 'theme.config', { type: 'text/plain' })
          const result = await uploadFileToDrive(file, { theme: 'light' })
          setThemeFileId(result.id)
        }
      } catch (error) {
        console.error('Error fetching theme:', error)
      }
    }

    fetchTheme()
  }, [])

  const setTheme = async (newTheme: string) => {
    try {
      if (themeFileId) {
        await updateFileMetadata(themeFileId, { theme: newTheme })
      } else {
        const file = new File([''], 'theme.config', { type: 'text/plain' })
        const result = await uploadFileToDrive(file, { theme: newTheme })
        setThemeFileId(result.id)
      }
      setThemeState(newTheme)
    } catch (error) {
      console.error('Error updating theme:', error)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
