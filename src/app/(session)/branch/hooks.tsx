import { toast } from "@/hooks/use-toast";
import useBranchStore from "@/store/branch";
import { ActionTable } from "@/types/action";
import { Branch } from "@/types/branch";
import React from "react";

export default function useBranch() {
  const { branches, setBranches, deleteBranch } = useBranchStore()
  const [total, setTotal] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Branch | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Branch>('created_date')

  const fetchBranches = async () => {
    setLoading(true)
    try {
      let url = `/api/branch?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (search) {
        const value = JSON.stringify({ 'name-phone-address': search })
        url += `&search=${value}`
      }
      const res = await fetch(url)
      const { data, total } = await res.json()

      setBranches(data)
      setData(data)
      setTotal(total)
    } catch (error) {
      console.error('Error loading branches', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (body: Branch | null, mode: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
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
      const res = await fetch(`/api/branch/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteBranch(data!.id)
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
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
    fetchBranches,
    branches,
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