import { create } from "zustand";

interface SidebarState {
  open: boolean;
  mobileOpen: boolean;
  openMenu: string[];
  setOpen: (open: boolean) => void;
  setOpenMenu: (menus: string[]) => void;
  toggleOpen: () => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  open: true,
  mobileOpen: false,
  openMenu: [],
  setOpen: (open) => set({ open }),
  setOpenMenu: (menus) => set({ openMenu: menus }),
  toggleOpen: () => set((s) => ({ open: !s.open })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
  toggleMobileOpen: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
}));

export default useSidebarStore;
