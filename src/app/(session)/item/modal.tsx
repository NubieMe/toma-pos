import { Item, ItemBody } from '@/types/item'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
} from '@mui/material'
import { itemSchema } from './schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Category, Uom } from '@prisma/client'
import { useCompany } from '@/hooks/use-company'
import { convertNumber, parseNumber } from '@/utils/helper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { useEffect, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  initialData?: Partial<Item>
}

export default function ItemModal({
  open,
  onClose,
  initialData,
}: Props) {
  const queryClient = useQueryClient()
  const { mode } = useTableStore()
  const [displayPrice, setDisplayPrice] = useState('')
  const [uoms, setUoms] = useState<Uom[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const disabled = mode === 'view'
  const { company, fetchCompany } = useCompany()
  
  const { handleSubmit, reset, watch, control } = useForm<z.infer<typeof itemSchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      uom_id: '',
      category_id: '',
      vendible: false,
      price: 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const [uomRes, categoryRes] = await Promise.all([
        fetch('/api/uom?limit=10000').then(res => res.json()),
        fetch('/api/category?limit=10000').then(res => res.json()),
      ])

      setUoms(uomRes.data)
      setCategories(categoryRes.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (open) fetchCompany()

    setDisplayPrice('0')
    reset({
      name: initialData?.name ?? '',
      code: initialData?.code ?? '',
      description: initialData?.description ?? '',
      uom_id: initialData?.uom_id ?? '',
      category_id: initialData?.category_id ?? '',
      vendible: initialData?.vendible ?? false,
      price: 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertItem = async (body: any) => {
    let sentBody: ItemBody = body;
    let url = '/api/item', method = 'POST';
    if (mode === 'edit') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { price, ...rest } = body
      sentBody = rest
      url += `/${initialData?.id}`
      method = 'PATCH'
    }

    const res = await fetch(url, {
      method,
      body: JSON.stringify(sentBody),
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  const mutation = useMutation({
    mutationFn: upsertItem,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['items'] })
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
      title={`${mode} Item`}
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
            name='code'
            control={control}
            defaultValue={initialData?.code || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={`Code${company?.item_auto ? ' (Auto-Generate)' : ''}`}
                size='small'
                disabled={disabled || company?.item_auto}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required={!company?.item_auto}
              />
            )}
          />

          <Controller
            name='category_id'
            control={control}
            defaultValue={initialData?.category_id || ''}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  disabled={disabled}
                  options={categories}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={categories.find((c) => c.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Category" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='uom_id'
            control={control}
            defaultValue={initialData?.uom_id || ''}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  disabled={disabled}
                  options={uoms}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={uoms.find((u) => u.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="UOM" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='description'
            control={control}
            defaultValue={initialData?.description || ''}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                size='small'
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                multiline
                rows={3}
              />
            )}
          />

          <Controller
            name='vendible'
            control={control}
            defaultValue={initialData?.vendible || false}
            render={({ field }) => (
              <FormControlLabel
                label='Untuk Dijual?'
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={e => field.onChange(e.target.checked)}
                  />
                }
              />
            )}
          />

          {mode === 'add' && watch('vendible') && (
            <Controller
              name='price'
              control={control}
              defaultValue={0}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Price"
                  size='small'
                  value={displayPrice}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onChange={e => {
                    field.onChange(parseNumber(e.target.value));
                    const formatted = convertNumber(e.target.value);
  
                    setDisplayPrice(formatted)
                  }}
                />
              )}
            />
          )}
        </Stack>
      </form>
    </EntityModal>
  )
}
