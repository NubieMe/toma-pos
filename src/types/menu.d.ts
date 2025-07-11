import { Permission } from "@prisma/client"

export interface IMenu
  extends Record<
    string,
    string | number | boolean | undefined | null | IMenu[]
  > {
  id: string
  name: string
  icon?: string | null
  path?: string | null
  parent_id?: string | null
  is_active?: boolean
  children?: IMenu[] | null
}

export type Menu = {
  id: string
  name: string
  icon?: string
  path?: string
  parent_id: string | null
  parent: Menu | null
  children?: Menu[]
  permissions?: Permission[]
  order: number
  is_active: boolean
  created_date: Date
  updated_date?: Date
  deleted_date: Date | null
}

export type MenuBody = {
  id?: string
  name: string
  icon?: string
  path?: string
  parent_id: string | null
  order: number
  is_active?: boolean
}
