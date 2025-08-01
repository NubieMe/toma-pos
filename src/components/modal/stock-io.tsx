import EntityModal from '@/components/modal'
import { toast } from '@/hooks/use-toast'
import useStockStore from '@/store/stock'
import { convertNumber, parseNumber } from '@/utils/helper'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertColor,
  Autocomplete,
  FormControl,
  FormHelperText,
  Stack,
  TextField
} from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import useBranch from '../../app/(session)/branch/hooks'
import useItem from '../../app/(session)/item/hooks'
import { stockIOSchema } from '../../app/(session)/product/schema'
import { IOType } from '@prisma/client'

interface Props {
  open: boolean
  onClose: () => void
  options: Partial<IOType>[]
}

export default function StockIOModal({
  open,
  onClose,
  options,
}: Props) {
  const [displayQty, setDisplayQty] = React.useState('0')
  const [displayPrice, setDisplayPrice] = React.useState('0')
  const { editStock } = useStockStore()
  const { items, fetchItems } = useItem()
  const { branches, fetchBranches } = useBranch()

  const { handleSubmit, reset, watch, control } = useForm<z.infer<typeof stockIOSchema>>({
    resolver: zodResolver(stockIOSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      item_id: '',
      branch_id: '',
      to_id: '',
      type: undefined,
      price: 0,
      qty: 0,
      note: '',
    },
  })

  React.useEffect(() => {
    fetchItems()
    fetchBranches()

    reset({
      item_id: '',
      branch_id: '',
      to_id: '',
      type: undefined,
      price: 0,
      qty: 0,
      note: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset])

  const onSubmit = handleSubmit(async (body) => {
    try {
      const url = `/api/stock`
      const res = await fetch(url, {
        method: 'POST',
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
      mode={'add'}
      title={`Add Stock`}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Controller
            name='item_id'
            control={control}
            defaultValue=''
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  options={items}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={items.find(i => i.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Item" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='branch_id'
            control={control}
            defaultValue=''
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  options={branches}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={branches.find(b => b.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Branch" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            name='type'
            control={control}
            defaultValue={undefined}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  options={options}
                  size='small'
                  getOptionLabel={(option) => option.split('').map((c, i) => i === 0 ? c.toUpperCase() : c).join('')}
                  isOptionEqualToValue={(option, value) => option === value}
                  value={options.find(v => v === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue || '')}
                  renderInput={(params) => <TextField {...params} label="Type" size='small' />}
                />

                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />

          {watch('type') === 'transfer' && (
            <Controller
              name='to_id'
              control={control}
              defaultValue={''}
              render={({ field, fieldState }) => (
                <FormControl>
                <Autocomplete
                  options={branches.filter(b => b.id !== watch('branch_id'))}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={branches.find(b => b.id === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="To" size='small' />}
                />
  
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
              )}
            />
          )}

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

          <Controller
            name='qty'
            control={control}
            defaultValue={undefined}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Quantity"
                value={displayQty}
                size='small'
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
            name='note'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                label="Note"
                size='small'
                multiline
                rows={3}
              />
            )}
          />
        </Stack>
      </form>
    </EntityModal>
  )
}
