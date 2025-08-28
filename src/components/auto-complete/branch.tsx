import useBranch from '@/hooks/use-branch'
import { Branch } from '@/types/branch'
import { Autocomplete, Box, TextField } from '@mui/material'
import { useEffect } from 'react'

interface Props {
  value: string[]
  setValue: React.Dispatch<React.SetStateAction<string[]>>
  label?: string
  disabled?: boolean
}

export default function BranchAuto({
  value,
  setValue,
  label = 'Branch',
  disabled = false,
}: Props) {
  const { query } = useBranch()

  useEffect(() => {
    query.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ minWidth: 300, mt: -2 }}>
      <Autocomplete
        options={query.data}
        size='small'
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        value={query.data?.filter((b: Branch) => value.includes(b.id))}
        onChange={(_, newValue) => setValue(newValue.map(branch => branch.id))}
        multiple
        renderInput={(params) => <TextField {...params} label={label} size='small' />}
        disabled={disabled}
      />
    </Box>
  )
}
