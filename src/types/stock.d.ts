import { IOType, Item, StatusType } from "@prisma/client"
import { Branch } from "./branch"

export type Stock = {
  id: string
  item_id: string
  branch_id: string
  vendible: boolean
  qty: number
  price: number
  created_date: Date

  item: Item
  branch: Branch
}

export type StockBody = {
  item_id: string
  branch_id: string
  vendible: boolean
  qty: number
  price: number
  created_by?: string
  updated_by?: string
}

export type StockIOBody = {
  stock_id: string
  to_id?: string
  type: IOType
  qty: number
  price: number
  note?: string
  status: StatusType
  created_by?: string
  updated_by?: string
}

export type StockIO = {
  id: string
  type: IOType
  stock_id: string
  to_id: string | null
  qty: number
  price: number
  status: StatusType
  note?: string
  created_date: Date

  stock: Stock
  to: Stock | null
}
