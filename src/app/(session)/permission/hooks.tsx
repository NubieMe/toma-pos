import { toast } from "@/hooks/use-toast";
import { Menu } from "@/types/menu";
import { PermissionObject, PermissionsState, RawPermissionData } from "@/types/permission";
import { Role } from "@prisma/client";
import React from "react";

export default function usePermission() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [menus, setMenus] = React.useState<Menu[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [permissions, setPermissions] = React.useState<PermissionsState>({});
  const [originalPermissions, setOriginalPermissions] = React.useState<PermissionsState>({});
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = React.useState<Menu | null>(null);
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  function normalizePermissions(perms: PermissionsState): PermissionsState {
    const normalized: PermissionsState = {};

    for (const roleId in perms) {
      const rolePerms = perms[roleId];
      const normalizedRolePerms: Record<string, PermissionObject> = {};
      let hasAnyAccessInRole = false;

      for (const menuId in rolePerms) {

        if (rolePerms[menuId] && rolePerms[menuId].access) {
          normalizedRolePerms[menuId] = rolePerms[menuId];
          hasAnyAccessInRole = true;
        }
      }

      if (hasAnyAccessInRole) {
        normalized[roleId] = normalizedRolePerms;
      }
    }
    return normalized;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roleRes, menuRes, permissionRes] = await Promise.all([
        fetch('/api/role'),
        fetch('/api/menu?sidebar=true'),
        fetch('/api/permission')
      ]);

      const roleData: Role[] = (await roleRes.json()).data || [];
      const menuData: Menu[] = (await menuRes.json()).data || [];
      const permissionData: RawPermissionData[] = (await permissionRes.json()).data || [];

      setRoles(roleData);
      setMenus(menuData);
      
      if (roleData.length > 0) {
        setSelectedRoleId(roleData[0].id);
      }

      const initialPerms: PermissionsState = {};
      permissionData.forEach(p => {
        if (!initialPerms[p.role_id]) initialPerms[p.role_id] = {};
        initialPerms[p.role_id][p.menu_id] = { 
          access: true, 
          read: p.read, create: p.create, update: p.update, delete: p.delete 
        };
      });

      setPermissions(initialPerms);
      setOriginalPermissions(JSON.parse(JSON.stringify(initialPerms)));
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDirty = React.useMemo(() => {
    const normalizedCurrent = normalizePermissions(permissions);
    const normalizedOriginal = normalizePermissions(originalPermissions);
    
    return JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedOriginal);
  }, [permissions, originalPermissions]);

  const handleSave = async () => {
    let endpoint = '';
    let payload: RawPermissionData[] = [];

    if (activeTab === 0 && selectedRoleId) {
      endpoint = `/api/permission/role/${selectedRoleId}`;
      const permsForRole = permissions[selectedRoleId] || {};
      
      payload = Object.keys(permsForRole)
        .filter(menuId => permsForRole[menuId].access)
        .map(menuId => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { access, ...rest } = permsForRole[menuId];
          return { role_id: selectedRoleId, menu_id: menuId, ...rest };
        });
    } else if (activeTab === 1 && selectedMenu?.id) {
      endpoint = `/api/permission/menu/${selectedMenu.id}`;
      payload = roles
        .filter(role => permissions[role.id]?.[selectedMenu.id!]?.access)
        .map(role => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { access, ...rest } = permissions[role.id][selectedMenu.id!];
          return { role_id: role.id, menu_id: selectedMenu.id, ...rest };
        });
    }

    if (!endpoint) return;

    try {
      toast({ description: 'Menyimpan...' });
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menyimpan permission');
      }

      const result = await res.json();

      setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
      toast({ variant: 'success', description: result.message })
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      toast({ variant: 'warning', description: (error as Error).message });
    }
  };

  function handlePermissionChange(roleId: string, menuId: string, permission: keyof PermissionObject, checked: boolean) {
    setPermissions(prev => {
      const newPermissions = JSON.parse(JSON.stringify(prev));

      if (!newPermissions[roleId]) newPermissions[roleId] = {};
      if (!newPermissions[roleId][menuId]) {
        newPermissions[roleId][menuId] = { access: false, read: false, create: false, update: false, delete: false };
      }
      
      newPermissions[roleId][menuId][permission] = checked;

      if (checked && permission !== 'access') {
        newPermissions[roleId][menuId].access = true;
      }

      if (permission === 'access' && !checked) {
        Object.assign(newPermissions[roleId][menuId], { read: false, create: false, update: false, delete: false });
      }

      const syncAllParents = (menuList: Menu[]): void => {
        menuList.forEach(menu => {

          if (menu.children && menu.children.length) {

            syncAllParents(menu.children);

            const hasAnyChildAccess = menu.children.some(
              child => newPermissions[roleId]?.[child.id]?.access
            );

            if (!newPermissions[roleId][menu.id]) {
              newPermissions[roleId][menu.id] = { access: false, read: false, create: false, update: false, delete: false };
            }

            newPermissions[roleId][menu.id].access = hasAnyChildAccess;
            
            if (hasAnyChildAccess) {
              Object.assign(newPermissions[roleId][menu.id], { read: false, create: false, update: false, delete: false });
            }
          }
        });
      };

      syncAllParents(menus);

      return newPermissions;
    });
  };

  function handleRoleSelection(newRoleId: string) {
    if (newRoleId === selectedRoleId) return;

    if (isDirty) {
      setDescription("Anda memiliki perubahan yang belum disimpan. Yakin ingin beralih dan membatalkan perubahan?");

      setPendingAction(() => () => {
        setPermissions(originalPermissions);
        setSelectedRoleId(newRoleId);
      });
      setOpen(true);
    } else {
      setSelectedRoleId(newRoleId);
    }
  };

  function handleMenuSelection(newMenu: Menu) {
    if (newMenu.id === selectedMenu?.id) return;
    
    if (isDirty) {
      setDescription("Anda memiliki perubahan yang belum disimpan. Yakin ingin beralih dan membatalkan perubahan?");
      setPendingAction(() => () => {
        setPermissions(originalPermissions);
        setSelectedMenu(newMenu);
      });
      setOpen(true);
    } else {
      setSelectedMenu(newMenu);
    }
  };

  function handleTabChange(newValue: number) {
    if (activeTab === newValue) return;

    if (isDirty) {
      setDescription("Anda memiliki perubahan yang belum disimpan. Yakin ingin pindah tab dan membatalkan perubahan?");
      setPendingAction(() => () => {
        setPermissions(originalPermissions);
        setActiveTab(newValue);
      });
      setOpen(true);
    } else {
      setActiveTab(newValue);
    }
  };

  function handleRefresh() {
    if (isDirty) {
      setDescription("Anda memiliki perubahan yang belum disimpan. Yakin ingin refresh dan membatalkan perubahan?");
      setPendingAction(() => () => {
        setPermissions(originalPermissions);
        fetchData();
      })
      setOpen(true);
    } else {
      fetchData();
    }
  }

  function handleConfirmAction() {
    if (pendingAction) {
      pendingAction();
    }
    setOpen(false);
    setPendingAction(null);
  };

  function handleCancelAction() {
    setOpen(false);
    setPendingAction(null);
  };

  return {
    normalizePermissions,
    fetchData,
    roles,
    menus,
    loading,
    permissions,
    setPermissions,
    originalPermissions,
    selectedRoleId,
    isDirty,
    handleSave,
    handleRoleSelection,
    handleMenuSelection,
    handleTabChange,
    selectedMenu,
    activeTab,
    setActiveTab,
    handlePermissionChange,
    open,
    setOpen,
    description,
    handleConfirmAction,
    handleCancelAction,
    handleRefresh,
  }
}