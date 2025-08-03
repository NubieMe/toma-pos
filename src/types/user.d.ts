export type UserWithRelations = {
  id: string
  username: string
  password?: string
  role_id?: string | null
  profile_id?: string | null
  branch_id?: string | null
  created_date: Date
  updated_date?: Date | null
  created_by?: string | null
  updated_by?: string | null
  deleted_date?: Date | null
  deleted_by?: string | null
  profile?: {
    id: string
    code: string
    name: string
    birthdate: Date | null
    religion: Religion | null
    gender: Gender | null
  } | null
  role?: {
    id: string
    name: string
  } | null
  branch?: {
    id: string
    name: string
  } | null
}