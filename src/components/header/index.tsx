'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ThemeToggleButton from '../ui/toggle';
import ProfileCard from './profile-card';
import { useAuth } from '@/context/auth-context';
import { Box, Menu, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import useSidebarStore from '@/hooks/use-sidebar';
import SidebarIcon from '../icon/sidebar-icon';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth()
  const { toggleMobileOpen, toggleOpen } = useSidebarStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
    >
      <Toolbar>
        <Tooltip title="Toggle Sidebar">
          <IconButton
            color='inherit'
            edge='start'
            sx={{ mr: 2 }}
            onClick={isMobile ? toggleMobileOpen : toggleOpen}
          >
            <SidebarIcon width={20} height={20} />
          </IconButton>
        </Tooltip>

        <Box className="flex-grow" />

        <ThemeToggleButton />

        <Box>
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
            slotProps={{
              list: {
                sx: {
                  padding: 0,
                }
              }
            }}
          >
            <ProfileCard onClose={handleClose} onLogout={logout} />
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}