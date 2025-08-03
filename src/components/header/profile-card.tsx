'use client';

import React from 'react';
import { Avatar, Box, Typography, Divider, MenuItem, ListItemIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/context/auth-context';

interface Props {
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileCard({ onClose, onLogout }: Props) {
  const { user } = useAuth();

  const handleEditProfile = () => {
    console.log('Navigasi ke Edit Profile...');
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src={user?.profile?.picture || ''} alt={user?.profile?.name || user?.username} sx={{ width: 40, height: 40 }} />
        <Box sx={{ ml: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {user?.profile?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role.name}
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
    </>
  );
}