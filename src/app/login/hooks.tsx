import { useAuth } from "@/context/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { loginSchema } from "./schema"
import useMenuStore from "@/store/menu"
import { z } from "zod"
import { useRouter } from "next/navigation"

type FormData = z.infer<typeof loginSchema>

export default function useLogin() {
  const { user, setUser } = useAuth()
  const [error, setError] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })
  const router = useRouter()
  const { setSidebar } = useMenuStore()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (res.ok) {
      const data = (await res.json()).data
      setUser(data)

      const result = await fetch('/api/menu?sidebar=true')
      const menu = (await result.json()).data
      setSidebar(menu)
      
      router.push('/dashboard')
    } else {
      const result = await res.json()
      setError(result.message || 'Login failed')
    }
    setLoading(false)
  }

  return {
    router,
    user,
    error,
    showPassword,
    setShowPassword,
    loading,
    register,
    handleSubmit,
    onSubmit,
    errors,
  }
}