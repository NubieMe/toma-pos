import { toCurrencyFormat } from '@/utils/helper'
import { Box, Paper, Typography } from '@mui/material'

interface Props {
  children: React.ReactNode
  title: string
  now: number
  then: number
}

export default function Summary({
  children,
  title,
  now,
  then,
}: Props) {
  const percentage = then / 100 * ((now - then) / 100)
  const isNegative = percentage < 0

  return (
    <Paper sx={{ p: 2, borderRadius: 5 }}>
      <Box
        className='w-10 h-10 rounded-xl flex items-center justify-center bg-gray-300 mb-5'
      >
        {children}
      </Box>
      <Typography>
        {title}
      </Typography>
      <Box className='flex justify-between mt-2'>
        <Typography variant='h6' component='h2'>  
          {toCurrencyFormat(now)}
        </Typography>

        <Typography
          component='span'
          className={`px-3 py-1 rounded-full text-sm font-medium ${isNegative ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {`${percentage.toFixed(2)}%`}
        </Typography>
      </Box>
    </Paper>
  )
}
