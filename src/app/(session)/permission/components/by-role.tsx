// src/components/permissions/by-role.tsx
'use client'

import PermissionTree from '@/app/(session)/permission/components/tree/menu-permission';
import { Menu } from '@/types/menu';
import { PermissionObject, PermissionsState } from '@/types/permission';
import { Role } from '@prisma/client';
import { 
  Paper, 
  Typography, 
  Box, 
  List, 
  ListItemButton, 
  ListItemText, 
  useTheme
} from '@mui/material';

interface Props {
  roles: Role[];
  menus: Menu[];
  permissions: PermissionsState;
  onPermissionChange: (roleId: string, menuId: string, permission: keyof PermissionObject, checked: boolean) => void;
  selectedRoleId: string | null;
  onSelectRole: (id: string) => void;
}

const PermissionByRoleTab: React.FC<Props> = ({ 
  roles, menus, permissions, onPermissionChange, selectedRoleId, onSelectRole 
}) => {
  const theme = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Paper variant="outlined" className="md:col-span-1 p-2">
        <Typography variant="h6" className="p-2 font-semibold">Daftar Role</Typography>
        <List component="nav">
          {roles.map(role => (
            <ListItemButton
              key={role.id}
              selected={selectedRoleId === role.id}
              onClick={() => onSelectRole(role.id)} // Baris ini yang error sebelumnya
            >
              <ListItemText primary={role.name} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Paper variant="outlined" className="md:col-span-3 p-4">
        {selectedRoleId ? (
          <Box>
            <Typography variant="h6" className="mb-4 font-semibold">
              Atur permission untuk role: <span style={{ color: theme.palette.primary.main }}>{roles.find(r => r.id === selectedRoleId)?.name}</span>
            </Typography>
            <PermissionTree
              menus={menus}
              roleId={selectedRoleId}
              permissionsForRole={permissions[selectedRoleId] || {}} 
              onPermissionChange={onPermissionChange}
            />
          </Box>
        ) : (
          <Box className="flex items-center justify-center h-full">
            <Typography color="text.secondary">Pilih role untuk mengatur permission.</Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default PermissionByRoleTab;