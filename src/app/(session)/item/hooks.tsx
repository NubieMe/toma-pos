import { toast } from '@/hooks/use-toast'
import useItemStore from '@/store/item'
import { ActionTable } from '@/types/action'
import { Item } from '@/types/item'
import React from 'react'

export default function useItem() {
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Item | null>(null)
  const [loading, setLoading] = React.useState(false)
  const { items, setItems, deleteItem } = useItemStore()
  const [total, setTotal] = React.useState(0)
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Item>('created_date')

  const handleClick = (body: Item | null = null, modes: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
    setData(body)
    if (modes === 'delete') {
      setOpenDelete(true)
    } else {
      setOpen(true)
      setMode(modes)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/item/${data?.id}`, {
        method: 'DELETE',
      })
      
      const result = (await res.json()).message

      toast({ description: result, duration: 5000 })
      deleteItem(data!.id)
      setData(null)
    } catch (error) {
      toast({ description: (error as Error).message, variant: 'warning', duration: 5000 })
    } finally {
      setOpenDelete(false)
    }
  }

  const fetchItems = async () => {
    if (!search) setLoading(true)
    try {
      let url = `/api/item?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (search) {
        const value = JSON.stringify({ 'name-code-description': search })
        url += `&search=${value}`
      }

      const res = await fetch(url)
      const { data, total } = await res.json()

      setItems(data)
      setTotal(total)
    } catch (err) {
      console.error('Error loading items', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    handleClick,
    handleDelete,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    setMode,
    data,
    setData,
    loading,
    setLoading,
    action,
    setAction,
    search,
    setSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    items,
    setItems,
    fetchItems,
    total,
  }
}