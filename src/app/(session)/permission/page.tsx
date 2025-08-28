'use client'

import AlertDialog from '@/components/ui/alert';
import { Box, Button, CircularProgress, Icon, IconButton, Paper, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import React from 'react';
import PermissionByMenuTab from './components/by-menu';
import PermissionByRoleTab from './components/by-role';
import TabPanel from './components/tab';
import usePermission from './hooks';
import { usePermission as usePermissionState } from '@/hooks/use-permission';

const PermissionPage = () => {
  const { permission } = usePermissionState();
  const {
    fetchData,
    menus,
    roles,
    loading,
    permissions,
    selectedRoleId,
    isDirty,
    selectedMenu,
    activeTab,
    handleMenuSelection,
    handleRoleSelection,
    handleSave,
    handlePermissionChange,
    description,
    handleTabChange,
    handleConfirmAction,
    handleRefresh,
  } = usePermission();

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Box className='flex justify-between items-center mb-4'>
          <Box>
            <Typography variant="h4" component="h1" className="font-bold">Permission Management</Typography>
            <Typography variant="body1" color="text.secondary">
              Atur hak akses untuk setiap role pada menu yang tersedia.
            </Typography>
          </Box>
          <Box className='gap-10'>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
              >
                <Icon>refresh</Icon>
              </IconButton>
            </Tooltip>
            {isDirty && (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => {
            handleTabChange(newValue);
          }}>
            <Tab label="Permission by Role" />
            <Tab label="Permission by Menu" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          {loading ? (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={100}>
                <CircularProgress />
              </Box>
            ) : (
              <PermissionByRoleTab
                roles={roles}
                menus={menus}
                permissions={permissions}
                onPermissionChange={handlePermissionChange}
                selectedRoleId={selectedRoleId}
                onSelectRole={handleRoleSelection}
                disabled={!permission.includes('edit')}
              />
            )
          }
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {loading ? (
              <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={100}>
                <CircularProgress />
              </Box>
            ) : (
              <PermissionByMenuTab
                roles={roles}
                menus={menus}
                permissions={permissions}
                onPermissionChange={handlePermissionChange}
                selectedMenu={selectedMenu}
                onSelectMenu={handleMenuSelection}
                disabled={!permission.includes('edit')}
              />
            )
          }
        </TabPanel>
      </Paper>
      <AlertDialog
        description={description}
        onConfirm={handleConfirmAction}
      />
    </Box>
  );
};

export default PermissionPage;