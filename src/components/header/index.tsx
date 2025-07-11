'use client';

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ThemeToggleButton from '../ui/toggle';
import ProfileCard from './profile-card';
import { useAuth } from '@/context/auth-context';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    })

    logout()
  }
  return (
    <AppBar
      position="static"
      elevation={1}
      // FIX: Menggunakan sx prop agar warna header otomatis mengikuti light/dark mode
      sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
    >
      <Toolbar>
        <div className="flex-grow" />

        <ThemeToggleButton />

        <div>
          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            MenuListProps={{ sx: { padding: 0 } }} 
          >
            <ProfileCard onClose={handleClose} onLogout={handleLogout} />
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}