import { Branch } from '@/types/branch'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  AlertColor,
  Stack,
  TextField,
} from '@mui/material'
import { branchSchema } from './schema'
import { z } from 'zod'
import useBranchStore from '@/store/branch'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import MapPicker from '@/components/map-picker'
import { ActionTable } from '@/types/action'

interface Props {
  open: boolean
  onClose: () => void
  mode: ActionTable
  initialData?: Partial<Branch>
}

export default function BranchModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const disabled = mode === 'view'
  const { addBranch, editBranch } = useBranchStore()

  const { handleSubmit, reset, control } = useForm<z.infer<typeof branchSchema>>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      phone: '',
      coordinate: [],
    },
  })

  React.useEffect(() => {
    reset({
      code: initialData?.code || '',
      name: initialData?.name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      coordinate: initialData?.coordinate || [],
    })
  }, [open, initialData, reset])

  const onSubmit = handleSubmit(async (body) => {
    try {
      const url = mode === 'add' ? '/api/branch' : `/api/branch/${initialData?.id}`
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PATCH',
        body: JSON.stringify(body),
      })
      const parsed = (await res.json())

      let variant: AlertColor = 'warning'
      if (parsed.data) {
        if (mode === 'add') addBranch(parsed.data)
        else editBranch(parsed.data)

        variant = 'success'
      }

      toast({ description: parsed.message, variant })
    } catch (error) {
      toast({
        description: (error as Error).message,
        variant: 'warning',
      })
    }

    onClose()
  })

  return (
    <EntityModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      mode={mode}
      title={`${mode} Branch`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Controller
            name='name'
            control={control}
            defaultValue={initialData?.name || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />

          <Controller
            name='code'
            control={control}
            defaultValue={initialData?.code || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Shorts"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />

          <Controller
            name='phone'
            control={control}
            defaultValue={initialData?.phone || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Phone"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name='address'
            control={control}
            defaultValue={initialData?.address || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Address"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                multiline
                minRows={3}
              />
            )}
          />

          <Controller
            name="coordinate"
            control={control}
            render={({ field, fieldState }) => (
              <Stack spacing={1.5}>
                <MapPicker
                  value={field.value as number[]}
                  onChange={field.onChange}
                  disabled={disabled}
                />
                <TextField
                  label="Coordinate (Latitude, Longitude)"
                  value={field.value && field.value.length > 0 ? field.value.join(', ') : ''}
                  disabled
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              </Stack>
            )}
          />
        </Stack>
      </form>
    </EntityModal>
  )
}
