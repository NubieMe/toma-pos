import { toast } from "@/hooks/use-toast"
import useUomStore from "@/store/uom"
import { ActionTable } from "@/types/action"
import { Uom } from "@prisma/client"
import React from "react"

export default function useUom() {
  const { uoms, setUoms, deleteUom } = useUomStore()
  const [total, setTotal] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Uom | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Uom>('created_date')
  
  const handleClick = (body: Uom | null, mode: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
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
      const res = await fetch(`/api/uom/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteUom(data!.id)
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
    }
  }
  
  const fetchUoms = async () => {
    if (!search) setLoading(true)
    try {
      let url = `/api/uom?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (search) {
        const value = JSON.stringify({ 'name-description': search })
        url += `&search=${value}`
      }
      const res = await fetch(url)
      const { data, total } = await res.json()

      setUoms(data)
      setTotal(total)
    } catch (err) {
      console.error('Error loading uoms', err)
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
    fetchUoms,
    uoms,
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