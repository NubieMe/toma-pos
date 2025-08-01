import { IOType } from "@prisma/client"

export const separator = [
  '/', 
  '-',
] as const

export type Separator = (typeof separator)[number] | null

export const payment_method = [
  'cash',
  'qris',
  'credit_card',
  'debit_card',
  'transfer',
  'emoney',
] as const

export const ioTypes = Object.values(IOType)

export const stockIn = [
  'purchase',
  'production'
] as const

export const stockOut = [
  'transfer',
  'consumption',
  'defect',
  'return',
] as const

export const COMMON_FEATURES = [
  'add', 
  'view', 
  'edit', 
  'delete', 
  'export', 
  'import', 
  'print',
  'approve',
  'confirm'
] as const