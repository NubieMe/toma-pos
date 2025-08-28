import EntityModal from '@/components/modal'
import { toast } from '@/hooks/use-toast'
import { convertNumber, parseNumber } from '@/utils/helper'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Stack,
  TextField
} from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { stockIOSchema } from '../../app/(session)/product/schema'
import { IOType } from '@prisma/client'
import useItem from '@/hooks/use-item'
import useBranch from '@/hooks/use-branch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Item } from '@/types/item'
import { Branch } from '@/types/branch'

interface Props {
  open: boolean
  onClose: () => void
  options: Partial<IOType>[]
  title: string
  branchId?: string
  disabledBranch?: boolean
}

export default function StockIOModal({
  open,
  onClose,
  options,
  title,
  branchId,
  disabledBranch = false,
}: Props) {
  const queryClient = useQueryClient()
  const [displayQty, setDisplayQty] = React.useState('0')
  const [displayPrice, setDisplayPrice] = React.useState('0')
  const { query: itemsQuery } = useItem()
  const { query: branchesQuery } = useBranch()

  const { handleSubmit, reset, watch, control } = useForm<z.infer<typeof stockIOSchema>>({
    resolver: zodResolver(stockIOSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      item_id: '',
      branch_id: branchId || '',
      to_id: '',
      type: options.length === 1 ? options[0] : undefined,
      price: 0,
      qty: 0,
      note: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      itemsQuery.refetch()
      branchesQuery.refetch()
    }

    reset({
      item_id: '',
      branch_id: branchId || '',
      to_id: '',
      type: options.length === 1 ? options[0] : undefined,
      price: 0,
      qty: 0,
      note: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertStock = async (body: any) => {
    const url = `/api/stock`
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    const result = (await res.json())

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  const mutation = useMutation({
    mutationFn: upsertStock,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['stocks-in', 'stocks-out'] })
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
      mode={'add'}
      title={title}
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
                  options={itemsQuery.data || []}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={itemsQuery.data?.find((i: Item) => i.id === field.value) || null}
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
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
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
            name='type'
            control={control}
            render={({ field, fieldState }) => (
              <FormControl>
                <Autocomplete
                  disabled={disabledBranch}
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
                  options={branchesQuery.data?.filter((b: Branch) => b.id !== watch('branch_id'))}
                  size='small'
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={branchesQuery.data?.find((b: Branch) => b.id === field.value) || null}
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
