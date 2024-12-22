'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem('familyWebsiteAuth')
    if (auth) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (password: string) => {
    // In a real application, you would verify this against your backend
    const correctPassword = password

    if (password === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('familyWebsiteAuth', 'true')
      setError(null)
    } else {
      setError('Incorrect password')
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('familyWebsiteAuth')
  }

  return { isAuthenticated, login, logout, error }
}

