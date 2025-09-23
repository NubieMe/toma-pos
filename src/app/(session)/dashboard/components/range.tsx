import { Box, Button, ButtonGroup } from '@mui/material'

interface Props {
  value: RangeType
  setValue: (value: RangeType) => void
}

export default function Range({
  value,
  setValue
}: Props) {
  const values = ['week', 'month', 'year']

  return (
    <Box>
      <ButtonGroup
        variant='contained'
      >
        {values.map((val, i) => (
          <Button
            key={i}
            onClick={() => setValue(val as RangeType)}
            disabled={value === val}
          >
            {val}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}
