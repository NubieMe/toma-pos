import { toast } from "@/hooks/use-toast"
import useCategoryStore from "@/store/category"
import { ActionTable } from "@/types/action"
import { Category } from "@prisma/client"
import React from "react"

export default function useCategory() {
  const { categories, setCategories, deleteCategory } = useCategoryStore()
  const [total, setTotal] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Category | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Category>('created_date')
  
  const handleClick = (body: Category | null, mode: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenDelete(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const duration = 5000
    try {
      const res = await fetch(`/api/category/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteCategory(data!.id)
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
    }
  }
  
  const fetchCategories = async () => {
    if (!search) setLoading(true)
    try {
      const res = await fetch(`/api/category?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`)
      const { data, total } = await res.json()

      setCategories(data)
      setTotal(total)
    } catch (err) {
      console.error('Error loading categories', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    open,
    openDelete,
    mode,
    data,
    loading,
    action,
    search,
    page,
    rowsPerPage,
    order,
    orderBy,
    handleClick,
    handleDelete,
    fetchCategories,
    categories,
    setAction,
    setSearch,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setOpen,
    setOpenDelete,
    setMode,
    setData,
    total,
  }
}