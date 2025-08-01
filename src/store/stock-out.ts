import { StockIO } from '@/types/stock'
import { create } from 'zustand'

interface StockOutStore {
  stocksOut: StockIO[]
  setStocksOut: (stocksOut: StockIO[]) => void
  getStockOutById: (id: string) => StockIO | null
  addStockOut: (stock: StockIO) => void
  editStockOut: (stock: StockIO) => void
  deleteStockOut: (id: string) => void
}

const useStockOutStore = create<StockOutStore>((set, get) => ({
  stocksOut: [],
  setStocksOut: (stocksOut) => set({ stocksOut }),
  getStockOutById: (id: string) => get().stocksOut.find(stock => stock.id === id) || null,
  addStockOut: (stock: StockIO) => set({ stocksOut: [...get().stocksOut, stock] }),
  editStockOut: (stock: StockIO) => set({ stocksOut: get().stocksOut.map(m => m.id === stock.id ? stock : m) }),
  deleteStockOut: (id: string) => set({ stocksOut: get().stocksOut.filter(stock => stock.id !== id) }),
}))

export default useStockOutStore