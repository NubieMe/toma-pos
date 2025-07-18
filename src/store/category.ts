import { Category } from '@prisma/client'
import { create } from 'zustand'

interface CategoryStore {
  categories: Category[]
  setCategories: (categories: Category[]) => void
  getCategoryById: (id: string) => Category | null
  addCategory: (role: Category) => void
  editCategory: (role: Category) => void
  deleteCategory: (id: string) => void
}

const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  getCategoryById: (id: string) => get().categories.find(role => role.id === id) || null,
  addCategory: (role: Category) => set({ categories: [...get().categories, role] }),
  editCategory: (role: Category) => set({ categories: get().categories.map(m => m.id === role.id ? role : m) }),
  deleteCategory: (id: string) => set({ categories: get().categories.filter(role => role.id !== id) }),
}))

export default useCategoryStore