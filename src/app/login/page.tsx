'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loginSchema } from './schema'
import { useAuth } from '@/context/auth-context'
import useMenuStore from '@/store/menu'

type FormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { user, setUser } = useAuth()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })
  const router = useRouter()
  const { setSidebar } = useMenuStore()

  const onSubmit = async (data: FormData) => {
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
  }
  
  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, borderRadius: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
