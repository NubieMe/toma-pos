import { Uom } from '@prisma/client'
import EntityModal from '@/components/modal'
import { useForm } from 'react-hook-form'
import {
  Stack,
  TextField,
} from '@mui/material'
import { uomSchema } from './schema'
import { z } from 'zod'
import useUomStore from '@/store/uom'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

interface Props {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit' | 'view'
  initialData?: Partial<Uom>
}

export default function UomModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const disabled = mode === 'view'
  const { addUom, editUom } = useUomStore()

  const { register, handleSubmit, reset, formState: { errors, defaultValues } } = useForm<z.infer<typeof uomSchema>>({
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

  const onSubmit = handleSubmit(async (body) => {
    try {
      const url = mode === 'add' ? '/api/uom' : `/api/uom/${initialData?.id}`
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PATCH',
        body: JSON.stringify(body),
      })
      const data = (await res.json())
  
      if (data) {
        if (mode === 'add') addUom(data.data)
        else editUom(data.data)
      }
      toast({ description: data.message })
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
      title={`${mode[0].toUpperCase() + mode.slice(1)} UOM`}
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
