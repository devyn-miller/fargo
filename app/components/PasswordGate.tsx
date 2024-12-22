'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('')
  const { isAuthenticated, login, error } = useAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Family Website</h2>
        <p className="mb-4">Please enter the password to access the site:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter password"
        />
        <button
          onClick={() => login(password)}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Enter
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  )
}

