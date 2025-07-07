'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/lib/theme';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/components/provider/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
