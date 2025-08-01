export type Item = {
  id: string
  code: string
  name: string
  description?: string
  vendible: boolean
  uom_id: string
  category_id: string
  uom: {
    id: string
    name: string
    description?: string
  }
  category: {
    id: string
    code: string
    name: string
    description?: string
  }
  created_date: Date
  updated_date?: Date
}

export type ItemBody = {
  code?: string
  name: string
  description?: string
  vendible: boolean
  uom_id: string
  category_id: string
  price?: number
}