import { Menu } from '@/types/menu'
import EntityModal from '@/components/modal'
import { useForm } from 'react-hook-form'
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material'
import { menuSchema } from './schema'
import { z } from 'zod'
import useMenuStore from '@/store/menu'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

interface Props {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit' | 'view'
  initialData?: Partial<Menu>
  menu: Menu[]
}

export default function MenuModal({
  open,
  onClose,
  mode,
  initialData,
  menu,
}: Props) {
  const disabled = mode === 'view'
  const { addMenu, editMenu } = useMenuStore()
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, defaultValues } } = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: '',
      path: '',
      parent_id: null,
      icon: '',
      order: 0,
      is_active: true,
    },
  })
  
  useEffect(() => {
    reset({
      name: initialData?.name ?? '',
      path: initialData?.path ?? '',
      parent_id: initialData?.parent_id ?? null,
      icon: initialData?.icon ?? '',
      order: initialData?.order ?? 0,
      is_active: initialData?.is_active ?? true,
    })
  }, [open, initialData, reset])

  const onSubmit = handleSubmit(async (body) => {
    const url = mode === 'add' ? '/api/menu' : `/api/menu/${initialData?.id}`
    const res = await fetch(url, {
      method: mode === 'add' ? 'POST' : 'PATCH',
      body: JSON.stringify(body),
    })
    const data = (await res.json()).data

    if (data) {
      if (mode === 'add') addMenu(data)
      else editMenu(data)
    }
    
    onClose()
  })

  return (
    <EntityModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      mode={mode}
      title={`${mode[0].toUpperCase() + mode.slice(1)} Menu`}
    >
      <form onSubmit={onSubmit} className='w-full flex justify-center'>
        <Stack spacing={2} className='w-130 flex' >
          <TextField
            variant='standard'
            {...register('name')}
            label="Name"
            size='small'
            disabled={disabled}
            defaultValue={defaultValues!.name}
            error={!!errors.name}
            helperText={errors.name?.message}
            required
          />

          <Autocomplete
            disabled={disabled}
            options={menu}
            size='small'
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={menu.find((m) => m.id === watch('parent_id')) || null}
            onChange={(_, newValue) => {
              setValue('parent_id', newValue?.id || null)
            }}
            renderInput={(params) => <TextField {...params} label="Parent" size='small' variant='standard' />}
          />

          <div className='grid grid-cols-2 gap-5'>
            <TextField
              variant='standard'
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
          </div>

          <div className='grid grid-cols-2 gap-5'>
            <TextField
              variant='standard'
              type="number"
              {...register('order', { valueAsNumber: true })}
              label="Order"
              size='small'
              defaultValue={defaultValues!.order}
              disabled={disabled}
            />

            <FormControlLabel
              className='bg-red'
              control={
                <Checkbox
                  {...register('is_active')}
                  disabled={disabled}
                  checked={watch('is_active')}
                  onChange={(e) => setValue('is_active', e.target.checked)}
                />
              }
              label="Active"
            />
          </div>
        </Stack>
      </form>
    </EntityModal>
  )
}
