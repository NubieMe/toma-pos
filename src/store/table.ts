import { ActionTable } from "@/types/action"
import { create } from "zustand"

interface TableStore {
  page: number
  setPage: (page: number) => void
  rowsPerPage: number
  setRowsPerPage: (rows: number) => void
  total: number
  setTotal: (total: number) => void
  order: 'asc' | 'desc'
  setOrder: (order: 'asc' | 'desc') => void
  orderBy: string
  setOrderBy: (orderBy: string) => void
  openAlert: boolean
  setOpenAlert: (open: boolean) => void
  mode: ActionTable
  setMode: (mode: ActionTable) => void
  search: string
  setSearch: (search: string) => void
}

const useTableStore = create<TableStore>((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
  rowsPerPage: 10,
  setRowsPerPage: (rows) => set({ rowsPerPage: rows }),
  total: 0,
  setTotal: (total) => set({ total }),
  order: 'desc',
  setOrder: (order) => set({ order }),
  orderBy: 'created_date',
  setOrderBy: (orderBy) => set({ orderBy }),
  openAlert: false,
  setOpenAlert: (open) => set({ openAlert: open }),
  mode: 'view',
  setMode: (mode) => set({ mode }),
  search: '',
  setSearch: (search) => set({ search }),
}))

export default useTableStore
