import { Item } from '@/types/item'
import EntityModal from '@/components/modal'
import { useForm } from 'react-hook-form'
import {
  AlertColor,
  Autocomplete,
  // Checkbox,
  // FormControlLabel,
  Stack,
  TextField,
} from '@mui/material'
import { itemSchema } from './schema'
import { z } from 'zod'
import useItemStore from '@/store/item'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Category, Uom } from '@prisma/client'
import { useCompany } from '@/hooks/use-company'

interface Props {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit' | 'view'
  initialData?: Partial<Item>
}

export default function ItemModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const [uoms, setUoms] = React.useState<Uom[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const disabled = mode === 'view'
  const { addItem, editItem } = useItemStore()
  const { company, fetchCompany } = useCompany()
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, defaultValues } } = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      uom_id: '',
      category_id: '',
    },
  })

  React.useEffect(() => {
    const fetchData = async () => {
      const [uomRes, categoryRes] = await Promise.all([
        fetch('/api/uom').then(res => res.json()),
        fetch('/api/category').then(res => res.json()),
      ])

      setUoms(uomRes.data)
      setCategories(categoryRes.data)
    }

    fetchData()
  }, [])
  
  React.useEffect(() => {
    fetchCompany()
    reset({
      name: initialData?.name ?? '',
      code: initialData?.code ?? '',
      description: initialData?.description ?? '',
      uom_id: initialData?.uom_id ?? '',
      category_id: initialData?.category_id ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset])

  const onSubmit = handleSubmit(async (body) => {
    toast({ variant: 'info', description: 'Saving...' })
    try {
      const url = mode === 'add' ? '/api/item' : `/api/item/${initialData?.id}`
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PATCH',
        body: JSON.stringify(body),
      })
      const parsed = await res.json()
  
      let variant: AlertColor = 'warning'
      if (parsed) {
        if (mode === 'add') addItem(parsed.data)
        else editItem(parsed.data)

        variant = 'success'
      }
      
      toast({ variant, description: parsed.message })
      onClose()
    } catch (error) {
      toast({ variant: 'error', description: (error as Error).message })
    }
  })

  return (
    <EntityModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      mode={mode}
      title={`${mode[0].toUpperCase() + mode.slice(1)} Item`}
    >
      <form onSubmit={onSubmit} className='w-full flex justify-center'>
        <Stack spacing={2} className='w-130 flex' >
          <TextField
            {...register('name')}
            label="Name"
            size='small'
            disabled={disabled}
            defaultValue={defaultValues!.name}
            error={!!errors.name}
            helperText={errors.name?.message}
            required
          />

          <TextField
            {...register('code')}
            label={`Code${company?.item_auto ? ' (Auto-Generate)' : ''}`}
            size='small'
            disabled={disabled}
            defaultValue={defaultValues!.name}
            error={!!errors.name}
            helperText={errors.name?.message}
            required={!company?.item_auto}
          />

          <Autocomplete
            disabled={disabled}
            options={categories}
            size='small'
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={categories.find((c) => c.id === watch('category_id')) || null}
            onChange={(_, newValue) => {
              setValue('category_id', newValue?.id || '')
            }}
            renderInput={(params) => <TextField {...params} label="Category" size='small' variant='standard' />}
          />

          <Autocomplete
            disabled={disabled}
            options={uoms}
            size='small'
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={uoms.find((u) => u.id === watch('uom_id')) || null}
            onChange={(_, newValue) => {
              setValue('uom_id', newValue?.id || '')
            }}
            renderInput={(params) => <TextField {...params} label="UOM" size='small' variant='standard' />}
          />

          <TextField
            {...register('description')}
            label="Description"
            size='small'
            disabled={disabled}
            defaultValue={defaultValues!.description}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
          />

          {/* <div className='grid grid-cols-2 gap-5'>
            <TextField
              {...register('path')}
              label="Path"
              size='small'
              defaultValue={defaultValues!.path}
              disabled={disabled}
            />

            <TextField
              variant='standard'
              {...register('icon')}
              label="Icon"
              size='small'
              defaultValue={defaultValues!.icon}
              disabled={disabled}
            />
          </div> */}
        </Stack>
      </form>
    </EntityModal>
  )
}
