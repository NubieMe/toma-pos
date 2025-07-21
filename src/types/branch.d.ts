export type Branch = {
  id: string
  name: string
  address: string | null
  phone: string | null
  coordinate: number[]
  created_date: Date
  updated_date: Date
  created_by: string | null
  updated_by: string | null
  deleted_date: Date | null
  deleted_by: string | null
}