import { Stock } from '@/types/stock'
import { create } from 'zustand'

interface StockStore {
  stocks: Stock[]
  setStocks: (stocks: Stock[]) => void
  getStockById: (id: string) => Stock | null
  addStock: (stock: Stock) => void
  editStock: (stock: Stock) => void
  deleteStock: (id: string) => void
}

const useStockStore = create<StockStore>((set, get) => ({
  stocks: [],
  setStocks: (stocks) => set({ stocks }),
  getStockById: (id: string) => get().stocks.find(stock => stock.id === id) || null,
  addStock: (stock: Stock) => set({ stocks: [...get().stocks, stock] }),
  editStock: (stock: Stock) => set({ stocks: get().stocks.map(m => m.id === stock.id ? stock : m) }),
  deleteStock: (id: string) => set({ stocks: get().stocks.filter(stock => stock.id !== id) }),
}))

export default useStockStore