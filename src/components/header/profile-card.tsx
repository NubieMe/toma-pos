'use client';

import React from 'react';
import { Avatar, Box, Typography, Divider, MenuItem, ListItemIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileCard({ onClose, onLogout }: Props) {
  // Ganti dengan data pengguna asli dari session atau state management Anda
  const user = {
    name: 'Budi Santoso',
    role: 'Administrator',
    avatarUrl: '/images/avatar.png', // path ke avatar Anda
  };

  const handleEditProfile = () => {
    // Tambahkan logika navigasi ke halaman edit profil di sini
    console.log('Navigasi ke Edit Profile...');
    onClose(); // Tutup menu setelah diklik
  };

  const handleLogoutClick = () => {
    // Panggil fungsi logout dari parent
    onLogout();
    onClose();
  };

  return (
    // Kita tidak perlu <Menu> di sini, karena komponen ini akan dimasukkan ke dalam <Menu> di Header
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 40, height: 40 }} />
        <Box sx={{ ml: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.role}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <MenuItem onClick={handleEditProfile}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit Profile
      </MenuItem>
      <MenuItem onClick={handleLogoutClick}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </div>
  );
}