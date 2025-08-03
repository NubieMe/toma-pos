import { IOType, PaymentMethod, Religion } from "@prisma/client"

export const separator = [
  '/', 
  '-',
] as const

export type Separator = (typeof separator)[number] | null

export const payment_method = Object.values(PaymentMethod).map(m => ({
  value: m,
  label: m.replace('_', ' ')
}))

export const ioTypes = Object.values(IOType)

export const stockIn = [
  'purchase',
  'production'
] as const

export const stockOut = [
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
  'confirm',
  'filter',
] as const

export const genders = [
  {
    label: 'Laki-Laki',
    value: 'L',
  },
  {
    label: 'Perempuan',
    value: 'P',
  },
]

export const religions = Object.values(Religion)
