'use client'

import { UserForm } from '@/components/user/form'
import { Box, Paper, Typography } from '@mui/material'
import { z } from 'zod'
import { userSchema } from '../schema'
import { useCompany } from '@/hooks/use-company'
import { Branch } from '@/types/branch'
import React from 'react'
import { Role } from '@prisma/client'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const { company, fetchCompany } = useCompany()
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [roles, setRoles] = React.useState<Role[]>([])

  async function handleSubmit(data: z.infer<typeof userSchema>) {
    const duration = 10000
    try {
      toast({ description: 'Menyimpan...', variant: 'info', duration })
      const response = await fetch(`/api/user`, {
        method: 'POST',
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
      const [branchesRes, rolesRes] = await Promise.all([
        fetch('/api/branch?limit=10000'),
        fetch('/api/role?limit=10000')
      ])
      const branchesData = await branchesRes.json()
      const rolesData = await rolesRes.json()
      setBranches(branchesData.data)
      setRoles(rolesData.data)
    }

    fetchData()
    fetchCompany()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New User
        </Typography>
        <UserForm
          mode="add"
          roles={roles}
          branches={branches}
          initialCode={''}
          autoGenerate={company?.user_auto || false}
          onSubmit={handleSubmit}
        />
      </Paper>
    </Box>
  )
}