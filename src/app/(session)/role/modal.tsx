import EntityModal from '@/components/modal'
import { toast } from '@/hooks/use-toast'
import useTableStore from '@/store/table'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Stack,
  TextField
} from '@mui/material'
import { Role } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { roleSchema } from './schema'

interface Props {
  open: boolean
  onClose: () => void
  initialData?: Partial<Role>
}

export default function RoleModal({
  open,
  onClose,
  initialData,
}: Props) {
  const queryClient = useQueryClient()
  const { mode } = useTableStore()
  const disabled = mode === 'view'

  const { register, handleSubmit, reset, formState: { errors, defaultValues } } = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
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
  const upsertRole = async (body: any) => {
    const url = mode === 'add' ? '/api/role' : `/api/role/${initialData?.id}`
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
    mutationFn: upsertRole,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
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
      title={`${mode} Role`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField
            {...register('name')}
						variant='standard'
            label="Name"
            disabled={disabled}
            defaultValue={defaultValues!.name}
            error={!!errors.name}
            helperText={errors.name?.message}
						required
					/>

          <TextField
            {...register('description')}
						variant='standard'
            label="Description"
            disabled={disabled}
            defaultValue={defaultValues!.description}
            error={!!errors.description}
						multiline
						minRows={3}
					/>
        </Stack>
      </form>
    </EntityModal>
  )
}
