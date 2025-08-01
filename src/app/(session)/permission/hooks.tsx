import { toast } from "@/hooks/use-toast";
import { Menu } from "@/types/menu";
import { PermissionsState, RawPermissionData } from "@/types/permission";
import { findParents } from "@/utils/helper";
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roleRes, menuRes, permissionRes] = await Promise.all([
        fetch('/api/role'),
        fetch('/api/menu?permission=true'),
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
        initialPerms[p.role_id][p.menu_id] = p.actions;
      });

      setPermissions(initialPerms);
      setOriginalPermissions(JSON.parse(JSON.stringify(initialPerms)));
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  function getComparableState(perms: PermissionsState): PermissionsState {
    const clonedPerms = JSON.parse(JSON.stringify(perms));
    
    for (const roleId in clonedPerms) {
      for (const menuId in clonedPerms[roleId]) {
        if (Array.isArray(clonedPerms[roleId][menuId])) {
          clonedPerms[roleId][menuId].sort();
        }
      }
    }
    return clonedPerms;
  };

  const isDirty = React.useMemo(() => {
    const comparableCurrent = getComparableState(permissions);
    const comparableOriginal = getComparableState(originalPermissions);

    return JSON.stringify(comparableCurrent) !== JSON.stringify(comparableOriginal);
  }, [permissions, originalPermissions]);

  const handleSave = async () => {
    let endpoint = '';
    let payload: { role_id: string; menu_id: string; actions: string[] }[] = [];

    if (activeTab === 0 && selectedRoleId) {
      endpoint = `/api/permission/role/${selectedRoleId}`;
      const permsForRole = permissions[selectedRoleId] || {};
      payload = Object.keys(permsForRole).map(menuId => ({
        role_id: selectedRoleId,
        menu_id: menuId,
        actions: permsForRole[menuId],
      }));
    } else if (activeTab === 1 && selectedMenu?.id) {
      endpoint = `/api/permission/menu/${selectedMenu.id}`;
      payload = Object.keys(permissions)
        .filter(roleId => permissions[roleId]?.[selectedMenu.id!])
        .map(roleId => ({
          role_id: roleId,
          menu_id: selectedMenu.id,
          actions: permissions[roleId][selectedMenu.id!],
        }));
    } 

    if (!endpoint) return;

    try {
      toast({ description: 'Menyimpan...' });
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Gagal menyimpan');
      const result = await res.json();

      setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
      toast({ variant: 'success', description: result.message })
    } catch (error) {
      toast({ variant: 'warning', description: (error as Error).message });
    }
  };

  function handlePermissionChange(roleId: string, menuId: string, action: string, checked: boolean) {
    setPermissions(prev => {
      const newPermissions = JSON.parse(JSON.stringify(prev));

      if (!newPermissions[roleId]) newPermissions[roleId] = {};

      if (action === 'access') {
        if (checked) {
          if (!newPermissions[roleId][menuId]) {
            newPermissions[roleId][menuId] = [];
          }
        } else {
          delete newPermissions[roleId][menuId];
          if (Object.keys(newPermissions[roleId]).length === 0) {
            delete newPermissions[roleId];
          }
        }
        return newPermissions;
      }

      if (!newPermissions[roleId][menuId]) {
        newPermissions[roleId][menuId] = [];
      }

      const currentActions = newPermissions[roleId][menuId] as string[];
      const actionExists = currentActions.includes(action);

      if (checked && !actionExists) {
        newPermissions[roleId][menuId] = [...currentActions, action];

        const parents = findParents(menus, menuId);
        parents.forEach(parent => {
          if (!newPermissions[roleId][parent.id]) {
            newPermissions[roleId][parent.id] = [];
          }
        });

      } else if (!checked && actionExists) {
        newPermissions[roleId][menuId] = currentActions.filter(a => a !== action);
      }

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