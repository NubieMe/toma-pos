import { StockIO } from '@/types/stock'
import { create } from 'zustand'

interface StockInStore {
  stocksIn: StockIO[]
  setStocksIn: (stocksIn: StockIO[]) => void
  getStockInById: (id: string) => StockIO | null
  addStockIn: (stock: StockIO) => void
  editStockIn: (stock: StockIO) => void
  deleteStockIn: (id: string) => void
}

const useStockInStore = create<StockInStore>((set, get) => ({
  stocksIn: [],
  setStocksIn: (stocksIn) => set({ stocksIn }),
  getStockInById: (id: string) => get().stocksIn.find(stock => stock.id === id) || null,
  addStockIn: (stock: StockIO) => set({ stocksIn: [...get().stocksIn, stock] }),
  editStockIn: (stock: StockIO) => set({ stocksIn: get().stocksIn.map(m => m.id === stock.id ? stock : m) }),
  deleteStockIn: (id: string) => set({ stocksIn: get().stocksIn.filter(stock => stock.id !== id) }),
}))

export default useStockInStore