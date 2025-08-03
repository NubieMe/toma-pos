'use client'

import { userSchema } from '@/app/(session)/users/schema'
import { genders, religions } from '@/constant/enum'
import { UserWithRelations } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Branch, Role } from '@prisma/client'
import { subYears } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

interface UserFormProps {
  mode: 'add' | 'edit' | 'view'
  roles: Role[]
  branches: Branch[]
  initialData?: UserWithRelations
  initialCode?: string
  autoGenerate: boolean
  onSubmit: SubmitHandler<z.infer<typeof userSchema>>
}

export function UserForm({
  mode,
  roles,
  branches,
  initialData,
  initialCode,
  autoGenerate,
  onSubmit
}: UserFormProps) {
  const router = useRouter()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { control, handleSubmit } = useForm<z.infer<typeof userSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialData?.username || '',
      password: '',
      code: initialCode || initialData?.profile?.code || '',
      name: initialData?.profile?.name || '',
      birthdate: initialData?.profile?.birthdate ? new Date(initialData?.profile?.birthdate) : undefined,
      gender: initialData?.profile?.gender || undefined,
      religion: initialData?.profile?.religion || undefined,
      role_id: initialData?.role_id || '',
      branch_id: initialData?.branch_id || '',
    }
  })

  const handleFormSubmit: SubmitHandler<z.infer<typeof userSchema>> = (data) => {
    const { confirm, ...rest } = data

    const payload = {
      ...rest,
      confirm: mode === 'edit' && rest.password ? confirm : undefined,
      password: mode === 'edit' && !rest.password ? undefined : rest.password
    }

    onSubmit(payload)
  }

  const minBirthDate = subYears(new Date(), 15)
  const disabled = mode === 'view'

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 3 }}>
      <Grid container spacing={isSmallScreen ? 1 : 3}>
        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={`User Code ${autoGenerate ? '(Auto-Generated)' : ''}`}
                disabled={disabled || autoGenerate}
                required={!autoGenerate}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Username"
                disabled={disabled}
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Grid>

        {mode !== 'view' && (
          <>
            <Grid size={isSmallScreen ? 12 : 6}>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label={`Password ${mode === 'edit' ? 'Baru (Kosongkan jika tidak diubah)' : ''}`}
                    disabled={disabled}
                    required={mode === 'add'}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={isSmallScreen ? 12 : 6}>
              <Controller
                name="confirm"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Konfirmasi Password"
                    disabled={disabled}
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </>
        )}

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Full Name"
                disabled={disabled}
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Grid>

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="birthdate"
            control={control}
            render={({ field, fieldState }) => (
              <DatePicker
                {...field}
                label="Birthdate"
                format="dd-MM-yyyy"
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                maxDate={minBirthDate}
                minDate={new Date(1900, 0, 1)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    variant: 'standard',
                  },
                  actionBar: {
                    actions: ['clear', 'accept'],
                  },
                }}
                views={['year', 'month', 'day']}
              />
            )}
          />
        </Grid>

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth>
                <Autocomplete
                  {...field}
                  disabled={disabled}
                  options={genders}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, value) => field.onChange(value?.value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled={disabled}
                    />
                  )}
                  value={genders.find(g => g.value === field.value) || null}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="religion"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth>
                <Autocomplete
                  {...field}
                  disabled={disabled}
                  options={religions}
                  getOptionLabel={(option) => option}
                  onChange={(_, value) => field.onChange(value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Religion"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled={disabled}
                    />
                  )}
                  value={religions.find(r => r === field.value) || null}
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="role_id"
            control={control}
            defaultValue={initialData?.role_id || ''}
            render={({ field, fieldState }) => (
              <FormControl fullWidth>
                <Autocomplete
                  {...field}
                  options={roles}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value) => field.onChange(value?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled={disabled}
                    />
                  )}
                  value={roles.find(role => role.id === field.value) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={isSmallScreen ? 12 : 6}>
          <Controller
            name="branch_id"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth>
                <Autocomplete
                  {...field}
                  options={branches}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value) => field.onChange(value?.id || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled={disabled}
                    />
                  )}
                  value={branches.find(b => b.id === field.value) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </FormControl>
            )}
          />
        </Grid>

          <Grid size={12}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/users')}
              >
                Back
              </Button>
              {mode !== 'view' && (
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  {mode === 'add' ? 'Create User' : 'Save Changes'}
                </Button>
              )}
            </Stack>
          </Grid>
      </Grid>
    </Box>
  )
}