// /components/layout/ThemeToggleButton.tsx
'use client';

import { useTheme } from 'next-themes';
import { IconButton } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      sx={{
        position: 'relative', // Diperlukan untuk menempatkan ikon secara absolut
        width: 40,
        height: 40,
      }}
    >
      {/* Ikon Matahari (Light Mode) */}
      <LightModeOutlinedIcon
        sx={{
          position: 'absolute',
          transition: 'transform 0.3s ease-in-out, opacity 0.2s ease-in-out',
          // Tampilkan jika tema terang, sembunyikan jika gelap
          transform: resolvedTheme === 'light' ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)',
          opacity: resolvedTheme === 'light' ? 1 : 0,
        }}
      />
      {/* Ikon Bulan (Dark Mode) */}
      <DarkModeOutlinedIcon
        sx={{
          position: 'absolute',
          transition: 'transform 0.3s ease-in-out, opacity 0.2s ease-in-out',
          // Tampilkan jika tema gelap, sembunyikan jika terang
          transform: resolvedTheme === 'dark' ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(90deg)',
          opacity: resolvedTheme === 'dark' ? 1 : 0,
        }}
      />
    </IconButton>
  );
}