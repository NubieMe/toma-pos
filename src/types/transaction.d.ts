import { PaymentMethod } from "@prisma/client";
import { Branch } from "./branch";
import { Product } from "./product";

export type Transaction = {
  id: string;
  code: string;
  branch_id: string;
  net_price: number;
  total_ppn: number;
  subtotal: number;
  total: number;
  paid: boolean;
  amount?: number;
  date?: Date | null;
  note?: string | null;
  created_date: Date;
  created_by: string;
  updated_date?: Date | null;
  updated_by?: string | null;
  deleted_date?: Date | null;
  deleted_by?: string | null;

  branch: Branch;
  products?: Product[];
  charges?: Charges_Detail[];
  payment_method: PaymentMethod;
}

export type Charges_Detail = {
  id: string;
  transaction_id: string;
  name: string;
  percent: boolean;
  percentage: number;
  amount: number;
  created_date: Date;
  updated_date?: Date | null;

  transaction: Transaction;
}