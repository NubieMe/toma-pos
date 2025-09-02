import { PaymentMethod } from "@prisma/client"
import { Branch } from "./branch"
import { Stock } from "./stock"

type CartItem = {
  stock: Stock
  quantity: number
  subtotal: number
  discount_percent: boolean
  discount_percentage: number
  discount_amount: number
  net_price: number
}

type ChargeItem = {
  id: string
  name: string
  percent: boolean
  percentage: number
  amount: number
}

type TransactionResult = {
  code: string
  date: Date
  branch: Branch
  cart: CartItem[]
  charges: ChargeItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  paidAmount: number
  change: number
  cashierName: string
}