import { Branch } from '@/types/branch'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  Stack,
  TextField,
} from '@mui/material'
import { branchSchema } from './schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import MapPicker from '@/components/map-picker'
import useTableStore from '@/store/table'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  initialData?: Partial<Branch>
}

export default function BranchModal({
  open,
  onClose,
  initialData,
}: Props) {
  const queryClient = useQueryClient()
  const { mode } = useTableStore()
  const disabled = mode === 'view'

  const { handleSubmit, reset, control } = useForm<z.infer<typeof branchSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(branchSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      phone: '',
      coordinate: [],
    },
  })

  useEffect(() => {
    reset({
      code: initialData?.code || '',
      name: initialData?.name || '',
      address: initialData?.address || '',
      phone: initialData?.phone || '',
      coordinate: initialData?.coordinate || [],
    })
  }, [open, initialData, reset])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertBranch = async (body: any) => {
    const url = mode === 'add' ? '/api/branch' : `/api/branch/${initialData?.id}`
    const res = await fetch(url, {
      method: mode === 'add' ? 'POST' : 'PATCH',
      body: JSON.stringify(body),
    })
    const result = (await res.json())

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  const mutation = useMutation({
    mutationFn: upsertBranch,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['branches'] })
      onClose()
    },
    onError: (err) => {
      toast({ description: err.message, duration: 5000, variant: 'warning' })
    },
  })

  const onSubmit = handleSubmit(async (body) => {
    toast({ variant: 'info', description: 'Menyimpan...' })
    mutation.mutate(body)
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
