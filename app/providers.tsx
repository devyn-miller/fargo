'use client'

import { PasswordGate } from './components/PasswordGate'

export function Providers({ children }: { children: React.ReactNode }) {
  return <PasswordGate>{children}</PasswordGate>
}

