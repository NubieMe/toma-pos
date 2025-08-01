import { Menu } from '@/types/menu';
import { PermissionsState } from '@/types/permission';
import {
  Box,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { Role } from '@prisma/client';
import SelectableMenuTree from './tree/menu-list';

interface Props {
  roles: Role[];
  menus: Menu[];
  permissions: PermissionsState;
  onPermissionChange: (roleId: string, menuId: string, action: string, checked: boolean) => void;
  selectedMenu: Menu | null;
  onSelectMenu: (menu: Menu) => void;
  disabled: boolean
}

const PermissionByMenuTab: React.FC<Props> = ({ roles, menus, permissions, onPermissionChange, selectedMenu, onSelectMenu, disabled }) => {
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
            <Box className="mt-4">
              {roles.map((role, index) => {
                const hasAccess = permissions?.[role.id]?.[selectedMenu.id!] !== undefined;
                const grantedActionsForRole = permissions?.[role.id]?.[selectedMenu.id!] || [];
                
                return (
                  <Box key={role.id}>
                    <Box 
                      className="flex items-center rounded-md"
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <Typography variant="body1" className="flex-1 p-2 font-medium">
                        {role.name}
                      </Typography>
                      <FormControlLabel
                        className="pr-2"
                        control={
                          <Checkbox
                            size="small"
                            checked={hasAccess}
                            onChange={(e) => onPermissionChange(role.id, selectedMenu.id!, 'access', e.target.checked)}
                            disabled={disabled}
                          />
                        }
                        label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Access</Typography>}
                        labelPlacement="start"
                      />
                    </Box>

                    <Collapse in={hasAccess} timeout="auto" unmountOnExit>
                      <Box className="flex items-center flex-wrap gap-x-4 gap-y-1 pr-4 pb-2 pl-6">
                        {selectedMenu.features && selectedMenu.features.length > 0 ? (
                          typeof selectedMenu.features !== 'string' && selectedMenu.features.map(feature => (
                            <FormControlLabel
                              key={feature}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={grantedActionsForRole.includes(feature)}
                                  onChange={e => onPermissionChange(role.id, selectedMenu.id!, feature, e.target.checked)}
                                  disabled={disabled}
                                />
                              }
                              label={<Typography variant="caption" sx={{ color: 'text.secondary' }} className="capitalize">{feature}</Typography>}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 2 }}>
                            (Menu ini tidak memiliki actions spesifik)
                          </Typography>
                        )}
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