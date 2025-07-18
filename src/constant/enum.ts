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