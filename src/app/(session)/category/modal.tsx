import { Category } from '@prisma/client'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  Stack,
  TextField,
} from '@mui/material'
import { categorySchema, categoryWithCodeSchema } from './schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { useCompany } from '@/hooks/use-company'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { useEffect, useMemo } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  initialData?: Partial<Category>
}

export default function CategoryModal({
  open,
  onClose,
  initialData,
}: Props) {
  const queryClient = useQueryClient()
  const { mode } = useTableStore()
  const disabled = mode === 'view'
  const { company, fetchCompany } = useCompany()

  const activeSchema = useMemo(() => {
    if (company?.category_auto === false) {
      return categoryWithCodeSchema
    }

    return categorySchema
  }, [company?.category_auto])

  const { control, handleSubmit, reset } = useForm<z.infer<typeof activeSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(activeSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  })
  
  useEffect(() => {
    if (open) fetchCompany()
    reset({
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertCategory = async (body: any) => {
    const url = mode === 'add' ? '/api/category' : `/api/category/${initialData?.id}`
    const res = await fetch(url, {
      method: mode === 'add' ? 'POST' : 'PATCH',
      body: JSON.stringify(body),
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  const mutation = useMutation({
    mutationFn: upsertCategory,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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
      title={`${mode} Category`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Controller
            name='code'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={`Code${company?.category_auto ? ' (Auto-Generated)' : ''}`}
                disabled={company?.category_auto}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required={!company?.category_auto}
              />
            )}
          />

          <Controller
            name='name'
            control={control}
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
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                multiline
                minRows={3}
              />
            )}
          />
        </Stack>
      </form>
    </EntityModal>
  )
}
