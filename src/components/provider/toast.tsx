// components/toast-provider.tsx
'use client'

import React from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useToast } from '@/hooks/use-toast'

export function ToastProvider() {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={toast.open}
          autoHideDuration={toast.duration ?? 3000}
          onClose={() => dismiss(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => dismiss(toast.id)}
            severity={(toast.variant ?? 'info') as 'success' | 'error' | 'info' | 'warning'}
            sx={{ width: '100%' }}
          >
            {toast.title}
            {toast.description && (
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{toast.description}</div>
            )}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}
