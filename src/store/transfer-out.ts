import { StockIO } from '@/types/stock'
import { create } from 'zustand'

interface TransferOutStore {
  transferOut: StockIO[]
  setTransferOut: (transferOut: StockIO[]) => void
  getTransferOutById: (id: string) => StockIO | null
  addTransferOut: (stock: StockIO) => void
  editTransferOut: (stock: StockIO) => void
  deleteTransferOut: (id: string) => void
}

const useTransferOutStore = create<TransferOutStore>((set, get) => ({
  transferOut: [],
  setTransferOut: (transferOut) => set({ transferOut }),
  getTransferOutById: (id: string) => get().transferOut.find(stock => stock.id === id) || null,
  addTransferOut: (stock: StockIO) => set({ transferOut: [...get().transferOut, stock] }),
  editTransferOut: (stock: StockIO) => set({ transferOut: get().transferOut.map(m => m.id === stock.id ? stock : m) }),
  deleteTransferOut: (id: string) => set({ transferOut: get().transferOut.filter(stock => stock.id !== id) }),
}))

export default useTransferOutStore