"use client"

import { Separator, separator } from '@/constant/enum'
import { useCompany } from '@/hooks/use-company'
import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import FormatInput from './components/format-input'
import { convertNumber, parseNumber } from '@/utils/helper'

export default function Page() {
  const {
    fetchCompany,
    loading,
    onSubmit,
    company,
    control,
    watch,
  } = useCompany()
  const [displayPPN, setDisplayPPN] = useState('0')

  useEffect(() => {
    fetchCompany()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Paper className='px-10 pb-5 pt-5'>
        <form onSubmit={onSubmit}>
          <h1 className='mb-5 font-semibold'>Company Configuration</h1>

          <Box className="grid grid-cols-2 items-center gap-10 mb-5">
            <Controller
              name='name'
              control={control}
              defaultValue={company?.name}
              render={({ field, fieldState }) => (
                <TextField
                  label="Name"
                  {...field}
                  fullWidth
                  disabled={loading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  required
                />
              )}
            />

            <Controller
              name='logo'
              control={control}
              defaultValue={company?.logo || ''}
              render={({ field, fieldState }) => (
                <Box className='flex gap-4'>
                  <TextField
                    label="Logo"
                    {...field}
                    fullWidth
                    disabled={loading}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />

                  <Avatar
                    src={field.value}
                  />
                </Box>
              )}
            />
          </Box>

          <Box className="grid grid-cols-2 items-center gap-10 mb-5">
            <Controller
              name='phone'
              control={control}
              defaultValue={company?.phone || ''}
              render={({ field, fieldState }) => (
                <TextField
                  label="Phone"
                  {...field}
                  fullWidth
                  disabled={loading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              defaultValue={company?.email || ''}
              render={({ field, fieldState }) => (
                <TextField
                  label="Email"
                  {...field}
                  fullWidth
                  disabled={loading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Box className="grid grid-cols-1 items-center gap-10 mb-5">
            <Controller
              name='address'
              control={control}
              defaultValue={company?.address || ''}
              render={({ field, fieldState }) => (
                <TextField
                  label="Address"
                  {...field}
                  multiline
                  minRows={3}
                  disabled={loading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Box className="grid grid-cols-2 items-center gap-10 mb-5">
            <Controller
              name='ppn'
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="PPN (%)"
                  {...field}
                  fullWidth
                  value={displayPPN}
                  onChange={e => {
                    field.onChange(parseNumber(e.target.value));
                    const formatted = convertNumber(e.target.value);
  
                    setDisplayPPN(formatted);
                  }}
                  disabled={loading}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ? fieldState.error?.message : 'Masukkan 0 jika harga produk sudah termasuk PPN'}
                />
              )}
            />
          </Box>

          <Box className="mb-5">
            <Controller
              name='category_auto'
              control={control}
              defaultValue={company?.category_auto || false}
              render={({ field }) => (
                <FormControlLabel
                  label="Auto-Generate Category Code"
                  control={
                    <Checkbox
                      {...field}
                      disabled={loading}
                      checked={field.value}
                    />
                  }
                />
              )}
            />

            {watch('category_auto') && (
              <Box className="grid grid-cols-2 gap-10 col-span-2 mt-3">
                <FormatInput
                  name='user_format'
                  control={control}
                  disabled={loading}
                />

                <Controller
                  name='category_separator'
                  control={control}
                  defaultValue={company?.category_separator}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <InputLabel id='cat-separator' size='small'>Pilih pemisah antar kode</InputLabel>
                      <Select
                        {...field}
                        labelId='cat-separator'
                        label='Pilih pemisah antar kode'
                        variant='outlined'
                        size='small'
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === '' ? null : value as Separator)
                        }}
                        value={watch('category_separator')}
                        error={!!fieldState.error}
                      >
                        <MenuItem value=''>none</MenuItem>
                        {separator.map((val, i) => (
                          <MenuItem value={val} key={i}>{val}</MenuItem>
                        ))}
                      </Select>

                      <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>
            )}
          </Box>

          <Box className="mb-5">
            <Controller
              name='item_auto'
              control={control}
              defaultValue={company?.item_auto || false}
              render={({ field }) => (
                <FormControlLabel
                  label="Auto-Generate Item Code"
                  control={
                    <Checkbox
                      {...field}
                      disabled={loading}
                      checked={field.value}
                    />
                  }
                />
              )}
            />

            {watch('item_auto') && (
              <Box className="grid grid-cols-2 items-center gap-10 col-span-2 mt-3">
                <FormatInput
                  name='item_format'
                  control={control}
                  disabled={loading}
                />

                <Controller
                  name='item_separator'
                  control={control}
                  defaultValue={company?.item_separator}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <InputLabel id='item-separator' size='small'>Pilih pemisah antar kode</InputLabel>
                      <Select
                        {...field}
                        labelId='item-separator'
                        label='Pilih pemisah antar kode'
                        size='small'
                        variant='outlined'
                        onChange={e => field.onChange(((e.target.value as Separator) ?? null))}
                        value={watch('item_separator')}
                        error={!!fieldState.error}
                      >
                        <MenuItem value=''>none</MenuItem>
                        {separator.map((val, i) => (
                          <MenuItem value={val} key={i}>{val}</MenuItem>
                        ))}
                      </Select>

                      <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>
            )}
          </Box>

          <Box className="mb-5">
            <Controller
              name='user_auto'
              control={control}
              defaultValue={company?.user_auto || false}
              render={({ field }) => (
                <FormControlLabel
                  label="Auto-Generate User Code"
                  control={
                    <Checkbox
                      {...field}
                      disabled={loading}
                      checked={field.value}
                    />
                  }
                />
              )}
            />

            {watch('user_auto') && (
              <Box className="grid grid-cols-2 items-center gap-10 col-span-2 mt-3">
                <FormatInput
                  name='user_format'
                  control={control}
                  disabled={loading}
                />

                <Controller
                  name='user_separator'
                  control={control}
                  defaultValue={company?.user_separator}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <InputLabel id='user-separator' size='small'>Pilih pemisah antar kode</InputLabel>
                      <Select
                        {...field}
                        labelId='user-separator'
                        label='Pilih pemisah antar kode'
                        size='small'
                        variant='outlined'
                        onChange={e => field.onChange(((e.target.value as Separator) ?? null))}
                        value={watch('user_separator') ?? ''}
                        error={!!fieldState.error}
                      >
                        <MenuItem value=''>none</MenuItem>
                        {separator.map((val, i) => (
                          <MenuItem value={val} key={i}>{val}</MenuItem>
                        ))}
                      </Select>

                      <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
              </Box>
            )}
          </Box>

          <Box className='flex justify-end'>
            <Button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              Save
            </Button>
          </Box>
        </form>
      </Paper>

    </Box>
  )
}
