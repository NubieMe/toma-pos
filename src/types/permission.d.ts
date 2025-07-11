export type PermissionID = {
  role_id: string
  menu_id: string
}

export type PermissionObject = {
  access: boolean;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};

export type PermissionsState = Record<string, Record<string, PermissionObject>>;

export type RawPermissionData = {
  role_id: string;
  menu_id: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
};
