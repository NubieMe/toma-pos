'use client'

import { Menu } from '@/types/menu';
import { Checkbox, IconButton, Typography, Box, useTheme, Collapse, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface PermissionTreeItemProps {
  menu: Menu;
  permissionsForRole: Record<string, string[]>;
  onPermissionChange: (menuId: string, action: string, checked: boolean) => void;
  level: number;
  disabled: boolean;
}

const PermissionTreeItem: React.FC<PermissionTreeItemProps> = ({ menu, permissionsForRole, onPermissionChange, level, disabled }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = menu.children && menu.children.length > 0;

  const hasAccess = permissionsForRole?.[menu.id] !== undefined;
  const currentGrantedActions = permissionsForRole?.[menu.id] || [];
  
  return (
    <Box sx={{ pl: level * 2 }}>
      <Box 
        className="flex items-center py-1 rounded-md"
        sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
      >
        <Box className="w-10 flex-shrink-0 text-center">
          {hasChildren && (
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          )}
        </Box>

        <Typography variant="body2" className="flex-1 font-medium">
          {menu.name}
        </Typography>

        {!hasChildren && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={hasAccess}
                onChange={(e) => onPermissionChange(menu.id, 'access', e.target.checked)}
                title="Grant Access"
                disabled={disabled}
              />
            }
            label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Access</Typography>}
            labelPlacement="start"
          />
        )}
      </Box>

      {!hasChildren && (
        <Collapse in={hasAccess} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 5 }} className="flex items-center flex-wrap gap-x-4 gap-y-1 pb-2">
            {menu.features && menu.features.length > 0 ? (
              menu.features.map(feature => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      size="small"
                      checked={currentGrantedActions.includes(feature)}
                      onChange={e => onPermissionChange(menu.id, feature, e.target.checked)}
                      disabled={disabled}
                    />
                  }
                  label={<Typography variant="caption" sx={{ color: 'text.secondary' }} className="capitalize">{feature}</Typography>}
                />
              ))
            ) : (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                Menu ini tidak memiliki actions.
              </Typography>
            )}
          </Box>
        </Collapse>
      )}

      {hasChildren && isExpanded && (
        <Box className="mt-1">
          {menu.children?.map((childMenu: Menu) => (
            <PermissionTreeItem
              key={childMenu.id}
              menu={childMenu}
              permissionsForRole={permissionsForRole}
              onPermissionChange={onPermissionChange}
              level={level + 1}
              disabled={disabled}
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
  permissionsForRole: Record<string, string[]>;
  onPermissionChange: (roleId: string, menuId: string, action: string, checked: boolean) => void;
  disabled: boolean
}

const PermissionTree: React.FC<PermissionTreeProps> = ({ menus, roleId, permissionsForRole, onPermissionChange, disabled }) => {
  const handlePermissionChangeForRole = (menuId: string, action: string, checked: boolean) => {
    onPermissionChange(roleId, menuId, action, checked);
  }

  return (
    <Box className='mt-4'>
      {menus.map(menu => (
        <PermissionTreeItem
          key={menu.id}
          menu={menu}
          permissionsForRole={permissionsForRole}
          onPermissionChange={handlePermissionChangeForRole}
          level={0}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}

export default PermissionTree;