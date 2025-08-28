import { Stock } from '@/types/stock'
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
import { stockSchema } from '../../app/(session)/product/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { convertNumber, parseNumber, toCurrencyFormat } from '@/utils/helper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import useItem from '@/hooks/use-item'
import useBranch from '@/hooks/use-branch'
import { useEffect, useState } from 'react'
import { Item } from '@/types/item'
import { Branch } from '@/types/branch'

interface Props {
  open: boolean
  onClose: () => void
  initialData?: Partial<Stock>
}

export default function StockModal({
  open,
  onClose,
  initialData,
}: Props) {
  const queryClient = useQueryClient()
  const { mode } = useTableStore()
  const [displayQty, setDisplayQty] = useState('0')
  const [displayPrice, setDisplayPrice] = useState('0')
  const disabled = mode === 'view'
  const { query: itemsQuery } = useItem()
  const { query: branchesQuery } = useBranch()

  const { handleSubmit, reset, control } = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      item_id: initialData?.item_id || '',
      branch_id: initialData?.branch_id || '',
      price: initialData?.price || 0,
      qty: initialData?.qty || 0,
      vendible: initialData?.vendible || false
    },
  })
  
  useEffect(() => {
    if (open) {
      itemsQuery.refetch()
      branchesQuery.refetch()
    }

    reset({
      item_id: initialData?.item_id || '',
      branch_id: initialData?.branch_id || '',
      price: initialData?.price || 0,
      qty: initialData?.qty || 0,
      vendible: initialData?.vendible || false
    })
    setDisplayPrice(toCurrencyFormat(initialData?.price || 0))
    setDisplayQty(toCurrencyFormat(initialData?.qty || 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData, reset])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertStock = async (body: any) => {
    const url = `/api/stock/${initialData?.id}`
    const res = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  const mutation = useMutation({
    mutationFn: upsertStock,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['non-products', 'products'] })
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
      title={`${mode} Stock`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Controller
            name='item_id'
            control={control}
            defaultValue={initialData?.item_id || ''}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  disabled
                  options={itemsQuery.data || []}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={itemsQuery.data?.find((i: Item) => i.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Parent" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='branch_id'
            control={control}
            defaultValue={initialData?.branch_id || ''}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  disabled
                  options={branchesQuery.data || []}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={branchesQuery.data?.find((b: Branch) => b.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Branch" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='price'
            control={control}
            defaultValue={initialData?.price || 0}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Price"
                size='small'
                value={displayPrice}
                disabled={disabled}
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

          <Controller
            name='qty'
            control={control}
            defaultValue={initialData?.qty || 0}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Quantity"
                size='small'
                value={displayQty}
                disabled
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={e => {
                  field.onChange(parseNumber(e.target.value));
                  const formatted = convertNumber(e.target.value);

                  setDisplayQty(formatted);
                }}
              />
            )}
          />

          <Controller
            name='vendible'
            control={control}
            defaultValue={initialData?.vendible || false}
            render={({ field }) => (
              <FormControlLabel
                label="Untuk dijual?"
                disabled={disabled}
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />}
              />
            )}
          />
        </Stack>
      </form>
    </EntityModal>
  )
}
