import { Menu } from '@/types/menu'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  AlertColor,
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from '@mui/material'
import { menuSchema } from './schema'
import { z } from 'zod'
import useMenuStore from '@/store/menu'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { COMMON_FEATURES } from '@/constant/enum'
import { ActionTable } from '@/types/action'

interface Props {
  open: boolean
  onClose: () => void
  mode: ActionTable
  initialData?: Partial<Menu>
}

export default function MenuModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const [menu, setMenu] = React.useState<Menu[]>([])
  const disabled = mode === 'view'
  const { addMenu, editMenu } = useMenuStore()
  
  const { handleSubmit, reset, control } = useForm<z.infer<typeof menuSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: '',
      path: '',
      parent_id: null,
      icon: '',
      order: 0,
      is_active: true,
      features: [],
    },
  })
  
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/menu?limit=10000')
      const { data } = await res.json()
      setMenu(data)
    }

    if (open) fetchData()
    reset({
      name: initialData?.name ?? '',
      path: initialData?.path ?? '',
      parent_id: initialData?.parent_id ?? null,
      icon: initialData?.icon ?? '',
      order: initialData?.order ?? 0,
      is_active: initialData?.is_active ?? true,
      features: initialData?.features ?? [],
    })
  }, [open, initialData, reset])

  const onSubmit = handleSubmit(async (body) => {
    toast({ variant: 'info', description: 'Menyimpan...' })
    try {
      const url = mode === 'add' ? '/api/menu' : `/api/menu/${initialData?.id}`
      const res = await fetch(url, {
        method: mode === 'add' ? 'POST' : 'PATCH',
        body: JSON.stringify(body),
      })
      const parsed = await res.json()
  
      let variant: AlertColor = 'warning'
      if (parsed) {
        if (mode === 'add') addMenu(parsed.data)
        else editMenu(parsed.data)

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
      title={`${mode[0].toUpperCase() + mode.slice(1)} Menu`}
    >
      <form onSubmit={onSubmit} className='w-full flex justify-center'>
        <Stack spacing={2} className='w-130 flex' >
          <Controller
            name='name'
            control={control}
            defaultValue={initialData?.name || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Name"
                size='small'
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />

          <Controller
            name="features"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                disabled={disabled}
                options={COMMON_FEATURES}
                value={field.value}
                onChange={(_, newValue) => field.onChange(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size='small'
                    label="Features"
                  />
                )}
              />
            )}
          />

          <Controller
            name='parent_id'
            control={control}
            defaultValue={initialData?.parent_id || null}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  {...field}
                  disabled={disabled}
                  options={menu}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={menu.find((m) => m.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || null)}
                  renderInput={(params) => <TextField {...params} label="Parent" size='small' variant='standard' />}
                />

                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <div className='grid grid-cols-2 gap-5'>
            <Controller
              name='path'
              control={control}
              defaultValue={initialData?.path || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Path"
                  size='small'
                  disabled={disabled}
                />
              )}
            />

            <Controller
              name='icon'
              control={control}
              defaultValue={initialData?.icon || ''}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Icon"
                  size='small'
                  disabled={disabled}
                />
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-5'>
            <Controller
              name='order'
              control={control}
              defaultValue={initialData?.order || 0}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Order"
                  size='small'
                  disabled={disabled}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value)); 
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name='is_active'
              control={control}
              defaultValue={initialData?.is_active || true}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      disabled={disabled}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Active"
                />
              )}
            />
          </div>
        </Stack>
      </form>
    </EntityModal>
  )
}
