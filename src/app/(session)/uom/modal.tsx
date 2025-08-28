import { Uom } from '@prisma/client'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  Stack,
  TextField,
} from '@mui/material'
import { uomSchema } from './schema'
import { z } from 'zod'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'

interface Props {
  open: boolean
  onClose: () => void
  initialData?: Partial<Uom>
}

export default function UomModal({
  open,
  onClose,
  initialData,
}: Props) {
  const queryClient = useQueryClient()
  const { mode } = useTableStore()
  const disabled = mode === 'view'

  const { control, handleSubmit, reset } = useForm<z.infer<typeof uomSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(uomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })
  
  useEffect(() => {
    reset({
      name: initialData?.name || '',
      description: initialData?.description || '',
    })
  }, [open, initialData, reset])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertUom = async (body: any) => {
    const url = mode === 'add' ? '/api/uom' : `/api/uom/${initialData?.id}`
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
    mutationFn: upsertUom,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['uoms'] })
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
      title={`${mode} UOM`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
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
