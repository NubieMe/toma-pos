import { Role } from '@prisma/client'
import EntityModal from '@/components/modal'
import { useForm } from 'react-hook-form'
import {
  AlertColor,
  Stack,
  TextField,
} from '@mui/material'
import { roleSchema } from './schema'
import { z } from 'zod'
import useRoleStore from '@/store/role'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { ActionTable } from '@/types/action'

interface Props {
  open: boolean
  onClose: () => void
  mode: ActionTable
  initialData?: Partial<Role>
}

export default function RoleModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const disabled = mode === 'view'
  const { addRole, editRole } = useRoleStore()

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

  const onSubmit = handleSubmit(async (body) => {
    try {
      const url = mode === 'add' ? '/api/role' : `/api/role/${initialData?.id}`
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PATCH',
        body: JSON.stringify(body),
      })
      const parsed = (await res.json())

      let variant: AlertColor = 'warning'
      if (parsed) {
        if (mode === 'add') addRole(parsed.data)
        else editRole(parsed.data)

        variant = 'success'
      }
      toast({ description: parsed.message, variant })
    } catch (error) {
      toast({
        description: (error as Error).message,
        variant: 'error',
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
