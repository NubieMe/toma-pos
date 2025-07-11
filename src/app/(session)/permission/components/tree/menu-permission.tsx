'use client'

import { Menu } from '@/types/menu';
import { PermissionObject } from '@/types/permission';
import { Checkbox, IconButton, Typography, Box, Collapse, useTheme } from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface PermissionTreeItemProps {
  menu: Menu;
  permissionsForRole: Record<string, PermissionObject>;
  onPermissionChange: (menuId: string, permission: keyof PermissionObject, checked: boolean) => void;
  level: number;
}

const PermissionTreeItem: React.FC<PermissionTreeItemProps> = ({ menu, permissionsForRole, onPermissionChange, level }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = menu.children && menu.children.length > 0;

  const currentPermissions = permissionsForRole?.[menu.id];
  const hasAccess = currentPermissions?.access || false;

  const handleCheckboxChange = (permission: keyof PermissionObject, checked: boolean) => {
    onPermissionChange(menu.id, permission, checked);
  };

  return (
    <Box sx={{ pl: level * 2 }}>
      <Box 
        className="flex items-center py-1 rounded-md"
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          }
        }}
      >
        <Box className="w-10 flex-shrink-0 text-center">
          {hasChildren && (
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          )}
        </Box>

        <Typography 
          variant="body2" 
          className={`flex-1 font-medium ${hasChildren ? 'font-bold' : ''}`}
          sx={{ color: 'text.primary' }}
        >
          {menu.name}
        </Typography>

        {!hasChildren && (
          <Checkbox
            size="small"
            checked={hasAccess}
            onChange={(e) => handleCheckboxChange('access', e.target.checked)}
          />
        )}
      </Box>

      <Collapse in={hasAccess && !hasChildren} timeout="auto" unmountOnExit>
        <Box sx={{ pl: 5 }} className="flex items-center space-x-2 md:space-x-4 pr-4 pb-2">
            {(['read', 'create', 'update', 'delete'] as const).map(p => (
              <label key={p} className="flex items-center space-x-1 cursor-pointer text-sm">
                <Checkbox
                  size="small"
                  checked={currentPermissions?.[p] || false}
                  onChange={e => handleCheckboxChange(p, e.target.checked)}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }} className="capitalize">
                  {p}
                </Typography>
              </label>
            ))}
        </Box>
      </Collapse>

      {hasChildren && isExpanded && (
        <Box className="mt-1">
          {menu.children?.map((childMenu: Menu) => (
            <PermissionTreeItem
              key={childMenu.id}
              menu={childMenu}
              permissionsForRole={permissionsForRole}
              onPermissionChange={onPermissionChange}
              level={level + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

interface PermissionTreeProps {
  menus: Menu[];
  roleId: string;
  permissionsForRole: Record<string, PermissionObject>;
  onPermissionChange: (roleId: string, menuId: string, permission: keyof PermissionObject, checked: boolean) => void;
}

const PermissionTree: React.FC<PermissionTreeProps> = ({ menus, roleId, permissionsForRole, onPermissionChange }) => {
  const handlePermissionChangeForRole = (menuId: string, permission: keyof PermissionObject, checked: boolean) => {
    onPermissionChange(roleId, menuId, permission, checked);
  }

  return (
    <Box>
      {menus.map(menu => (
        <PermissionTreeItem
          key={menu.id}
          menu={menu}
          permissionsForRole={permissionsForRole}
          onPermissionChange={handlePermissionChangeForRole}
          level={0}
        />
      ))}
    </Box>
  );
}

export default PermissionTree;