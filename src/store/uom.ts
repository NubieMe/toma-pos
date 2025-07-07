import { Uom } from '@prisma/client'
import { create } from 'zustand'

interface UomStore {
  uoms: Uom[]
  setUoms: (uoms: Uom[]) => void
  getUomById: (id: string) => Uom | null
  addUom: (role: Uom) => void
  editUom: (role: Uom) => void
  deleteUom: (id: string) => void
}

const useUomStore = create<UomStore>((set, get) => ({
  uoms: [],
  setUoms: (uoms) => set({ uoms }),
  getUomById: (id: string) => get().uoms.find(role => role.id === id) || null,
  addUom: (role: Uom) => set({ uoms: [...get().uoms, role] }),
  editUom: (role: Uom) => set({ uoms: get().uoms.map(m => m.id === role.id ? role : m) }),
  deleteUom: (id: string) => set({ uoms: get().uoms.filter(role => role.id !== id) }),
}))

export default useUomStore