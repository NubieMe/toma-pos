// auth-context.tsx
'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Session } from '@/types/session'

interface AuthContextType {
  user: Session | null
  setUser: React.Dispatch<React.SetStateAction<Session | null>>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<Session | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/session')
        const data = (await res.json()).data
        setUser(data)
        
        if (!data) {
          router.replace('/login')
        }
      } catch (error) {
        console.error('Error decoding session cookie:', error)
      }
    }

    if (!user && pathname !== '/login') fetchData()
  }, [router, user, pathname])

  const logout = () => {
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth harus digunakan dalam AuthProvider')
  return context
}
