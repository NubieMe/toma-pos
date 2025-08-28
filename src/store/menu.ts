import { Menu } from '@/types/menu'
import { create } from 'zustand'

interface MenuStore {
  sidebar: Menu[]
  setSidebar: (sidebar: Menu[]) => void
  activeMenu: Menu | null
  setActiveMenu: (menu: Menu | null) => void
}

const useMenuStore = create<MenuStore>((set) => ({
  sidebar: [],
  setSidebar: (sidebar) => set({ sidebar }),
  activeMenu: null,
  setActiveMenu: (menu => set({ activeMenu: menu })),
}))

export default useMenuStore