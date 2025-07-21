import { Branch } from '@/types/branch'
import { create } from 'zustand'

interface BranchStore {
  branches: Branch[]
  setBranches: (branches: Branch[]) => void
  getBranchById: (id: string) => Branch | null
  addBranch: (role: Branch) => void
  editBranch: (role: Branch) => void
  deleteBranch: (id: string) => void
}

const useBranchStore = create<BranchStore>((set, get) => ({
  branches: [],
  setBranches: (branches) => set({ branches }),
  getBranchById: (id: string) => get().branches.find(role => role.id === id) || null,
  addBranch: (role: Branch) => set({ branches: [...get().branches, role] }),
  editBranch: (role: Branch) => set({ branches: get().branches.map(m => m.id === role.id ? role : m) }),
  deleteBranch: (id: string) => set({ branches: get().branches.filter(role => role.id !== id) }),
}))

export default useBranchStore