"use client"

import { Separator, separator } from '@/constant/enum'
import { useCompany } from '@/hooks/use-company'
import { Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { Controller } from 'react-hook-form'
import FormatInput from './components/format-input'

type Type = 'category' | 'item' | 'user'

export default function Page() {
  const {
    fetchCompany,
    loading,
    onSubmit,
    company,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitted }
  } = useCompany()

  const [catFormatParts, setCatFormatParts] = React.useState(['', '', '', '']);
  const [catTouchedParts, setCatTouchedParts] = React.useState([false, false, false, false]);
  const [itemFormatParts, setItemFormatParts] = React.useState(['', '', '', '']);
  const [itemTouchedParts, setItemTouchedParts] = React.useState([false, false, false, false]);
  const [userFormatParts, setUserFormatParts] = React.useState(['', '', '', '']);
  const [userTouchedParts, setUserTouchedParts] = React.useState([false, false, false, false]);

  React.useEffect(() => {
    if (company) {
      const catParts = company.category_format?.split('-') || [];
      const catFullParts = Array.from({ length: 4 }, (_, i) => catParts[i] || '');
      const itemParts = company.item_format?.split('-') || [];
      const itemFullParts = Array.from({ length: 4 }, (_, i) => itemParts[i] || '');
      const userParts = company.user_format?.split('-') || [];
      const userFullParts = Array.from({ length: 4 }, (_, i) => userParts[i] || '');
      
      setCatFormatParts(catFullParts);
      setItemFormatParts(itemFullParts);
      setUserFormatParts(userFullParts);
    }
  }, [company]);

  React.useEffect(() => {
    const catFilledParts = catFormatParts.filter(part => part && part.trim() !== '');
    const catCombinedFormat = catFilledParts.join('-');

    const itemFilledParts = itemFormatParts.filter(part => part && part.trim() !== '');
    const itemCombinedFormat = itemFilledParts.join('-');

    const userFilledParts = userFormatParts.filter(part => part && part.trim() !== '');
    const userCombinedFormat = userFilledParts.join('-');
    
    if (catCombinedFormat !== watch('category_format')) {
      setValue('category_format', catCombinedFormat, { shouldDirty: true });
    }

    if (itemCombinedFormat !== watch('item_format')) {
      setValue('item_format', itemCombinedFormat, { shouldDirty: true });
    }

    if (userCombinedFormat !== watch('user_format')) {
      setValue('user_format', userCombinedFormat, { shouldDirty: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catFormatParts, setValue, watch]);

  const handlePartChange = (type: Type, index: number, value: string) => {
    if (type === 'category') {
      const newParts = [...catFormatParts];
      newParts[index] = value;
      setCatFormatParts(newParts);
    } else if (type === 'item') {
      const newParts = [...itemFormatParts];
      newParts[index] = value;
      setItemFormatParts(newParts);
    } else if (type === 'user') {
      const newParts = [...userFormatParts];
      newParts[index] = value;
      setUserFormatParts(newParts);
    }
  };

  const handlePartBlur = (type: Type, index: number) => {
    if (type === 'category') {
      const newTouched = [...catTouchedParts];
      newTouched[index] = true;
      setCatTouchedParts(newTouched);
    } else if (type === 'item') {
      const newTouched = [...itemTouchedParts];
      newTouched[index] = true;
      setItemTouchedParts(newTouched);
    } else if (type === 'user') {
      const newTouched = [...userTouchedParts];
      newTouched[index] = true;
      setUserTouchedParts(newTouched);
    }
  };

  React.useEffect(() => {
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
                {/* <TextField
                  {...register('category_format')}
                  label="Category Format"
                  fullWidth
                  disabled={loading}
                  error={!!errors.category_format}
                  helperText={errors.category_format?.message}
                /> */}

                <FormControl fullWidth>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {catFormatParts.map((part, index) => (
                      <React.Fragment key={index}>
                        <TextField
                          value={part}
                          onChange={(e) => handlePartChange('category', index, e.target.value)}
                          variant="outlined"
                          size="small"
                          onBlur={() => handlePartBlur('category', index)}
                          required={index < 2}
                          error={(catTouchedParts[index] || isSubmitted) && index < 2 && !part}
                          label={`Part ${index + 1}`}
                          disabled={loading}
                        />
                        {index < catFormatParts.length - 1 && (
                          <Typography variant="h6" component="span">-</Typography>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>

                  {errors.category_format && (
                    <FormHelperText error>{errors.category_format.message}</FormHelperText>
                  )}
                </FormControl>

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
                          setValue('category_separator', value === '' ? null : value as Separator)
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
                      value={field.value}
                    />
                  }
                />
              )}
            />

            {watch('item_auto') && (
              <Box className="grid grid-cols-2 items-center gap-10 col-span-2 mt-3">
                <FormControl fullWidth>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {itemFormatParts.map((part, index) => (
                      <React.Fragment key={index}>
                        <TextField
                          value={part}
                          onChange={(e) => handlePartChange('item', index, e.target.value)}
                          variant="outlined"
                          size="small"
                          onBlur={() => handlePartBlur('item', index)}
                          required={index < 2}
                          error={(itemTouchedParts[index] || isSubmitted) && index < 2 && !part}
                          label={`Part ${index + 1}`}
                          disabled={loading}
                        />
                        {index < itemFormatParts.length - 1 && (
                          <Typography variant="h6" component="span">-</Typography>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>

                  {errors.item_format && (
                    <FormHelperText error>{errors.item_format.message}</FormHelperText>
                  )}
                </FormControl>

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
                        onChange={e => setValue('item_separator', ((e.target.value as Separator) ?? null))}
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
                      value={field.value}
                    />
                  }
                />
              )}
            />

            {watch('user_auto') && (
              <Box className="grid grid-cols-2 items-center gap-10 col-span-2 mt-3">
                {/* <FormControl fullWidth>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {userFormatParts.map((part, index) => (
                      <React.Fragment key={index}>
                        <TextField
                          value={part}
                          onChange={(e) => handlePartChange('user', index, e.target.value)}
                          variant="outlined"
                          size="small"
                          onBlur={() => handlePartBlur('user', index)}
                          required={index < 2}
                          error={(userTouchedParts[index] || isSubmitted) && index < 2 && !part}
                          label={`Part ${index + 1}`}
                          disabled={loading}
                        />
                        {index < userFormatParts.length - 1 && (
                          <Typography variant="h6" component="span">-</Typography>
                        )}
                      </React.Fragment>
                    ))}
                  </Stack>

                  {errors.user_format && (
                    <FormHelperText error>{errors.user_format.message}</FormHelperText>
                  )}
                </FormControl> */}
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
                        onChange={e => setValue('user_separator', ((e.target.value as Separator) ?? null))}
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

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              Save
            </Button>
          </div>
        </form>
      </Paper>

    </Box>
  )
}
