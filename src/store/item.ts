import { Item } from "@/types/item";
import { create } from "zustand";

interface ItemStore {
  items: Item[];
  setItems: (items: Item[]) => void;
  getItemById: (id: string) => Item | null;
  addItem: (item: Item) => void;
  editItem: (item: Item) => void;
  deleteItem: (id: string) => void;
}

const useItemStore = create<ItemStore>((set, get) => ({
  items: [],
  setItems: (items: Item[]) => set({ items }),
  getItemById: (id: string) => get().items.find(item => item.id === id) || null,
  addItem: (item: Item) => set({ items: [...get().items, item] }),
  editItem: (item: Item) => set({ items: get().items.map(i => i.id === item.id ? item : i) }),
  deleteItem: (id: string) => set({ items: get().items.filter(item => item.id !== id) }),
}))

export default useItemStore