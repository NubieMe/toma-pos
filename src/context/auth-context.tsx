// auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@/types/session'
import { SESSION_NAME } from '@/lib/session'

interface AuthContextType {
  user: Session | null
  setUser: React.Dispatch<React.SetStateAction<Session | null>>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
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
    
    if (!user) fetchData()
  }, [router, user])

  const logout = () => {
    // Hapus cookie (trigger logout server-side juga bisa)
    document.cookie = `${SESSION_NAME}=; Max-Age=0; path=/`
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
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus digunakan dalam AuthProvider')
  return context
}
