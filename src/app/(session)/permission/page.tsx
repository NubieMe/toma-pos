'use client'

import AlertDialog from '@/components/ui/alert';
import { Box, Button, CircularProgress, Container, Icon, IconButton, Paper, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import React from 'react';
import PermissionByMenuTab from './components/by-menu';
import PermissionByRoleTab from './components/by-role';
import TabPanel from './components/tab';
import usePermission from './hooks';

const PermissionPage = () => {
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
    open,
    description,
    handleTabChange,
    handleCancelAction,
    handleConfirmAction,
    handleRefresh,
  } = usePermission();

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="xl" className="py-4">
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Box className='flex justify-between items-center mb-4'>
          <Box>
            <Typography variant="h4" component="h1" className="font-bold">Permission Management</Typography>
            <Typography variant="body1" color="text.secondary">
              Set permission role and menu.
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
              />
            )
          }
        </TabPanel>
      </Paper>
      <AlertDialog
        open={open}
        setOpen={(isOpen) => !isOpen && handleCancelAction()}
        description={description}
        onConfirm={handleConfirmAction}
      />
    </Container>
  );
};

export default PermissionPage;