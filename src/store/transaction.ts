import { Transaction } from "@/types/transaction";
import { create } from "zustand";

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  getTransactionById: (id: string) => Transaction | null;
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
}

const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  setTransactions: (transactions: Transaction[]) => set({ transactions }),
  getTransactionById: (id: string) => get().transactions.find(transaction => transaction.id === id) || null,
  addTransaction: (transaction: Transaction) => set({ transactions: [...get().transactions, transaction] }),
  editTransaction: (transaction: Transaction) => set({ transactions: get().transactions.map(i => i.id === transaction.id ? transaction : i) }),
  deleteTransaction: (id: string) => set({ transactions: get().transactions.filter(transaction => transaction.id !== id) }),
}))

export default useTransactionStore