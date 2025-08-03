'use client'

import { UserForm } from '@/components/user/form'
import { toast } from '@/hooks/use-toast'
import { Branch } from '@/types/branch'
import { UserWithRelations } from '@/types/user'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { Role } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { z } from 'zod'
import { userSchema } from '../schema'
import { useCompany } from '@/hooks/use-company'

export default function UserDetailPage({
  params,
  searchParams
}: {
  params: { id: string }
  searchParams: { mode?: 'edit' | 'view' }
}) {
  const mode = searchParams.mode === 'edit' ? 'edit' : 'view'
  const router = useRouter()
  const { company, fetchCompany } = useCompany()
  const [user, setUser] = React.useState<UserWithRelations | undefined>(undefined)
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [roles, setRoles] = React.useState<Role[]>([])
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(data: z.infer<typeof userSchema>) {
    const duration = 10000
    try {
      toast({ description: 'Menyimpan...', variant: 'info', duration })
      const response = await fetch(`/api/user/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      const result = await response.json()
      if (!response.ok) toast({ description: result.message, variant: 'warning', duration })
      else {
        toast({ description: 'User berhasil ditambahkan', variant: 'success', duration })
        router.push('/users')
      }
    } catch (error) {
      console.error(error)
      toast({ description: (error as Error).message, variant: 'error', duration })
    }
  }

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [userRes, branchesRes, rolesRes] = await Promise.all([
          fetch(`/api/user/${params.id}`),
          fetch('/api/branch?limit=10000'),
          fetch('/api/role?limit=10000')
        ])
        if (!userRes.ok) {
          toast({ description: 'User tidak ditemukan', variant: 'error' })
          router.push('/users')
        }
  
        const userData = await userRes.json()
        const branchesData = await branchesRes.json()
        const rolesData = await rolesRes.json()
        setUser(userData.data)
        setBranches(branchesData.data)
        setRoles(rolesData.data)
      } catch (error) {
        console.error('Error loading user data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {mode === 'edit' ? 'Edit' : 'View'} User
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : (
          <UserForm
            mode={mode}
            roles={roles}
            branches={branches}
            initialData={user}
            autoGenerate={company?.user_auto || false}
            onSubmit={handleSubmit}
          />
        )}
      </Paper>
    </Box>
  )
}