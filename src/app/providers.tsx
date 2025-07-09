'use client';

import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material';
import theme from '@/lib/theme';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/components/provider/toast';
import { useTheme } from 'next-themes';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const muiTheme = React.useMemo(
    () => theme(resolvedTheme as PaletteMode),
    [resolvedTheme]
  );

  if (!mounted) {
    return null; 
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
