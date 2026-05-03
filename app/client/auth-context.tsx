'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface LoggedInClient {
  username: string
  businessName: string
  service: string
}

interface AuthContextType {
  client: LoggedInClient | null
  login: (data: LoggedInClient) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<LoggedInClient | null>(null)

  function login(data: LoggedInClient) {
    setClient(data)
  }

  function logout() {
    setClient(null)
  }

  return (
    <AuthContext.Provider value={{ client, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useClientAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useClientAuth must be used inside ClientAuthProvider')
  return ctx
}
