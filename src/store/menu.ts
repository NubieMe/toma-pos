import { Menu } from '@/types/menu'
import { create } from 'zustand'

interface MenuStore {
  menus: Menu[]
  setMenus: (menus: Menu[]) => void
  getMenuById: (id: string) => Menu | null
  addMenu: (menu: Menu) => void
  editMenu: (menu: Menu) => void
  deleteMenu: (id: string) => void
  sidebar: Menu[]
  setSidebar: (sidebar: Menu[]) => void
  activeMenu: Menu | null
  setActiveMenu: (menu: Menu | null) => void
}

const useMenuStore = create<MenuStore>((set, get) => ({
  menus: [],
  setMenus: (menus) => set({ menus }),
  getMenuById: (id: string) => get().menus.find(menu => menu.id === id) || null,
  addMenu: (menu: Menu) => set({ menus: [...get().menus, menu] }),
  editMenu: (menu: Menu) => set({ menus: get().menus.map(m => m.id === menu.id ? menu : m) }),
  deleteMenu: (id: string) => set({ menus: get().menus.filter(menu => menu.id !== id) }),
  sidebar: [],
  setSidebar: (sidebar) => set({ sidebar }),
  activeMenu: null,
  setActiveMenu: (menu => set({ activeMenu: menu })),
}))

export default useMenuStore