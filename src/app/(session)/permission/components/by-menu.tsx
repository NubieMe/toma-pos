import { Menu } from '@/types/menu';
import { Role } from '@prisma/client';
import { PermissionObject, PermissionsState } from '@/types/permission';
import { 
  Paper, 
  Typography, 
  Box, 
  Checkbox, 
  Collapse,
  Divider,
  useTheme
} from '@mui/material';
import SelectableMenuTree from './tree/menu-list';

interface Props {
  roles: Role[];
  menus: Menu[];
  permissions: PermissionsState;
  onPermissionChange: (roleId: string, menuId: string, permission: keyof PermissionObject, checked: boolean) => void;
  selectedMenu: Menu | null;
  onSelectMenu: (menu: Menu) => void;
}

const PermissionByMenuTab: React.FC<Props> = ({ roles, menus, permissions, onPermissionChange, selectedMenu, onSelectMenu }) => {
  const theme = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Paper variant="outlined" className="md:col-span-1 p-2">
        <Typography variant="h6" className="p-2 font-semibold">Daftar Menu</Typography>
        <SelectableMenuTree
          menus={menus}
          selectedMenuId={selectedMenu?.id || null}
          onSelectMenu={onSelectMenu}
        />
      </Paper>

      <Paper variant="outlined" className="md:col-span-3 p-4">
        {selectedMenu ? (
          <Box>
            <Typography variant="h6" className="mb-4 font-semibold">
              Atur permission untuk menu: <span style={{ color: theme.palette.primary.main }}>{selectedMenu.name}</span>
            </Typography>
            <Box>
              {roles.map((role, index) => {
                const hasAccess = permissions?.[role.id]?.[selectedMenu.id]?.access || false;
                
                return (
                  <Box key={role.id}>
                    <Box 
                      className="flex items-center rounded-md"
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <Typography variant="body1" className="flex-1 p-2 font-medium">
                        {role.name}
                      </Typography>
                      <label className="flex items-center space-x-1 cursor-pointer p-2 text-sm">
                        <Checkbox
                          size="small"
                          checked={hasAccess}
                          onChange={(e) => onPermissionChange(role.id, selectedMenu.id!, 'access', e.target.checked)}
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Access</Typography>
                      </label>
                    </Box>

                    <Collapse in={hasAccess} timeout="auto" unmountOnExit>
                      <Box className="flex items-center space-x-2 md:space-x-4 pr-4 pb-2 pl-6">
                        {(['read', 'create', 'update', 'delete'] as const).map(p => (
                          <label key={p} className="flex items-center space-x-1 cursor-pointer text-sm">
                            <Checkbox
                              size="small"
                              checked={permissions?.[role.id]?.[selectedMenu.id!]?.[p] || false}
                              onChange={e => onPermissionChange(role.id, selectedMenu.id!, p, e.target.checked)}
                            />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }} className="capitalize">{p}</Typography>
                          </label>
                        ))}
                      </Box>
                    </Collapse>
                    {index < roles.length - 1 && <Divider />}
                  </Box>
                )
              })}
            </Box>
          </Box>
        ) : (
          <Box className="flex items-center justify-center h-full" sx={{ color: 'text.secondary' }}>
            Pilih menu dari daftar untuk mengatur permission.
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default PermissionByMenuTab;