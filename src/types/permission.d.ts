import { ActionTable } from "./action";

export type PermissionID = {
  role_id: string
  menu_id: string
}

export type Permission = {
  created_date: Date;
  updated_date: Date | null;
  created_by: string | null;
  updated_by: string | null;
  role_id: string;
  menu_id: string;
  actions: ActionTable[];
}

export type PermissionsState = Record<string, Record<string, string[]>>;

export type RawPermissionData = {
  role_id: string;
  menu_id: string;
  actions: string[];
};
