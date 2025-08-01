import { Category } from '@prisma/client'
import EntityModal from '@/components/modal'
import { useForm } from 'react-hook-form'
import {
  AlertColor,
  Stack,
  TextField,
} from '@mui/material'
import { categorySchema, categoryWithCodeSchema } from './schema'
import { z } from 'zod'
import useCategoryStore from '@/store/category'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { useCompany } from '@/hooks/use-company'
import { ActionTable } from '@/types/action'

interface Props {
  open: boolean
  onClose: () => void
  mode: ActionTable
  initialData?: Partial<Category>
}

export default function CategoryModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const disabled = mode === 'view'
  const { addCategory, editCategory } = useCategoryStore()
  const { company, fetchCompany } = useCompany()

  const activeSchema = React.useMemo(() => {
    if (company?.category_auto === false) {
      return categoryWithCodeSchema
    }

    return categorySchema
  }, [company?.category_auto])

  const { register, handleSubmit, reset, formState: { errors, defaultValues } } = useForm<z.infer<typeof activeSchema>>({
    resolver: zodResolver(activeSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  })
  
  React.useEffect(() => {
    if (open) fetchCompany()
    reset({
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset])

  const onSubmit = handleSubmit(async (body) => {
    try {
      const url = mode === 'add' ? '/api/category' : `/api/category/${initialData?.id}`
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PATCH',
        body: JSON.stringify(body),
      })
      const parsed = (await res.json())
  
      let variant: AlertColor = 'warning'
      if (parsed.data) {
        if (mode === 'add') addCategory(parsed.data)
        else editCategory(parsed.data)

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
      title={`${mode} Category`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField
            {...register('code')}
            label={`Code${company?.category_auto ? ' (Auto-Generated)' : ''}`}
            disabled={company?.category_auto}
            defaultValue={defaultValues!.code}
            error={!!errors.code}
            helperText={errors.code?.message}
            required={!company?.category_auto}
          />

          <TextField
            {...register('name')}
            label="Name"
            disabled={disabled}
            defaultValue={defaultValues!.name}
            error={!!errors.name}
            helperText={errors.name?.message}
						required
					/>

          <TextField
            {...register('description')}
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
