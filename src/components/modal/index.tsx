'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type Mode = 'add' | 'edit' | 'view'

interface EntityModalProps {
  open: boolean
  onClose: () => void
  title?: string
  mode?: Mode
  children: React.ReactNode
  onSubmit?: () => void
}

export default function EntityModal({
  open,
  onClose,
  title,
  mode = 'view',
  children,
  onSubmit,
}: EntityModalProps) {
  const getTitle = () => {
    if (title) return title
    if (mode === 'edit') return 'Edit'
    if (mode === 'add') return 'Add'
    return 'View'
  }
  const disabled = mode === 'view'

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '3.5rem' }}>
        <Typography>{getTitle()}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pb: 5 }}>{children}</DialogContent>

      {(mode === 'edit' || mode === 'add') && (
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={onSubmit} variant="contained" disabled={disabled}>
            Save
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
