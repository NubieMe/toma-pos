import useBranch from '@/app/(session)/branch/hooks'
import { Branch } from '@/types/branch'
import { Autocomplete, Box, TextField } from '@mui/material'
import React from 'react'

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
  const [branches, setBranches] = React.useState<Branch[]>([])
  const { setPage, setRowsPerPage, fetchBranches } = useBranch()

  React.useEffect(() => {
    setPage(0)
    setRowsPerPage(10000)
    fetchBranches(data => {
      setBranches(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ minWidth: 300, mt: -2 }}>
      <Autocomplete
        options={branches}
        size='small'
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        value={branches.filter(branch => value.includes(branch.id))}
        onChange={(_, newValue) => setValue(newValue.map(branch => branch.id))}
        multiple
        renderInput={(params) => <TextField {...params} label={label} size='small' />}
        disabled={disabled}
      />
    </Box>
  )
}
