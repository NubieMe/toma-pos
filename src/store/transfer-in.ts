import { StockIO } from '@/types/stock'
import { create } from 'zustand'

interface TransferInStore {
  transferIn: StockIO[]
  setTransferIn: (transferIn: StockIO[]) => void
  getTransferInById: (id: string) => StockIO | null
  addTransferIn: (stock: StockIO) => void
  editTransferIn: (stock: StockIO) => void
  deleteTransferIn: (id: string) => void
}

const useTransferInStore = create<TransferInStore>((set, get) => ({
  transferIn: [],
  setTransferIn: (transferIn) => set({ transferIn }),
  getTransferInById: (id: string) => get().transferIn.find(stock => stock.id === id) || null,
  addTransferIn: (stock: StockIO) => set({ transferIn: [...get().transferIn, stock] }),
  editTransferIn: (stock: StockIO) => set({ transferIn: get().transferIn.map(m => m.id === stock.id ? stock : m) }),
  deleteTransferIn: (id: string) => set({ transferIn: get().transferIn.filter(stock => stock.id !== id) }),
}))

export default useTransferInStore