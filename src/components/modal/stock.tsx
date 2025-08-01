import { Stock } from '@/types/stock'
import EntityModal from '@/components/modal'
import { Controller, useForm } from 'react-hook-form'
import {
  AlertColor,
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
import useStockStore from '@/store/stock'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import useItem from '../../app/(session)/item/hooks'
import useBranch from '../../app/(session)/branch/hooks'
import { convertNumber, parseNumber, toCurrencyFormat } from '@/utils/helper'
import { ActionTable } from '@/types/action'

interface Props {
  open: boolean
  onClose: () => void
  mode: ActionTable
  initialData?: Partial<Stock>
}

export default function StockModal({
  open,
  onClose,
  mode,
  initialData,
}: Props) {
  const [displayQty, setDisplayQty] = React.useState('0')
  const [displayPrice, setDisplayPrice] = React.useState('0')
  const disabled = mode === 'view'
  const { editStock } = useStockStore()
  const { items, fetchItems } = useItem()
  const { branches, fetchBranches } = useBranch()

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
  
  React.useEffect(() => {
    fetchItems()
    fetchBranches()

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

  const onSubmit = handleSubmit(async (body) => {
    try {
      const url = `/api/stock/${initialData?.id}`
      const res = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      const parsed = (await res.json())

      let variant: AlertColor = 'warning'
      if (parsed) {
        editStock(parsed.data)

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
                  options={items}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={items.find(i => i.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Parent" size='small' variant='standard' />}
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
                  options={branches}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={branches.find(b => b.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Branch" size='small' variant='standard' />}
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
