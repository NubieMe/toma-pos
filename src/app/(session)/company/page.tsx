"use client"

import { useCompany } from '@/hooks/use-company'
import { Avatar, Box, Button, Paper, TextField } from '@mui/material'
import React from 'react'

export default function Page() {
  const { register, watch, errors, fetchCompany, loading, onSubmit, company } = useCompany()

  React.useEffect(() => {
    if (!company) fetchCompany()
  }, [])

  return (
    <Box>
      <Paper className='px-10 pb-5 pt-5'>
        <form onSubmit={onSubmit}>
          <h1 className='mb-5 font-semibold'>Company Configuration</h1>

          <Box className="grid grid-cols-2 items-center gap-10 mb-3">
            <TextField
              {...register('name')}
              label="Name"
              fullWidth
              disabled={loading}
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />

            <div className='flex gap-4'>
              <TextField
                {...register('logo')}
                label="Logo"
                fullWidth
                disabled={loading}
                error={!!errors.logo}
                helperText={errors.logo?.message}
              />

              <Avatar
                src={watch('logo')}
              />
            </div>
          </Box>

          <Box className="grid grid-cols-2 items-center gap-10 mb-3">
            <TextField
              {...register('phone')}
              label="Phone"
              fullWidth
              disabled={loading}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              {...register('email')}
              label="Email"
              fullWidth
              disabled={loading}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>

          <Box className="grid grid-cols-1 items-center gap-10 mb-3">
            <TextField
              {...register('address')}
              label="Address"
              maxRows={Infinity}
              disabled={loading}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Box>

          <div className='flex justify-end'>
            <Button
              className='btn btn-primary'
              disabled={loading}
            >
              Save
            </Button>
          </div>
        </form>
      </Paper>

    </Box>
  )
}
