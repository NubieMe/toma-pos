import {
  alpha,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'

interface EnhancedTableToolbarProps {
  numSelected: number
  title?: string
  actions?: React.ReactNode
  children?: React.ReactNode
}

export default function EnhancedTableToolbar({
  numSelected,
  title = 'Table',
  actions,
}: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      <Typography
        sx={{ flex: '1 1 30%', pl: 1 }}
        color={numSelected > 0 ? 'inherit' : 'text.primary'}
        variant="h6"
        component="div"
      >
        {numSelected > 0 ? `${numSelected} selected` : title}
      </Typography>
      {actions ? (
        <Box>{actions}</Box>
      ) : (
        <Tooltip title={numSelected > 0 ? 'Delete' : 'Filter list'}>
          <IconButton>
            {numSelected > 0 ? <DeleteIcon /> : <FilterListIcon />}
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}
