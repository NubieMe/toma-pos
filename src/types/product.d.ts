import { Stock } from "./stock"

export type Product = {
  id: string;
  stock_id: string;
  transaction_id: string;
  price: number;
  qty: number;
  discount_percent: boolean;
  discount_percentage: number;
  discount_amount: number;
  net_price: number;
  ppn_percentage: number;
  ppn_amount: number;
  subtotal: number;
  created_date: Date;
  updated_date?: Date | null;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_date?: Date | null;
  deleted_by?: string | null;

  stock?: Stock;
  transaction?: Transaction;
}