import { toast } from "@/hooks/use-toast";
import useStockStore from "@/store/stock";
import { ActionTable } from "@/types/action";
import { Stock } from "@/types/stock";
import React from "react";

export default function useStock() {
  const { stocks, setStocks, deleteStock } = useStockStore()
  const [total, setTotal] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<ActionTable>('view')
  const [data, setData] = React.useState<Stock | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [branches, setBranches] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Stock>('created_date')

  const fetchStocks = async () => {
    setLoading(true)
    try {
      let url = `/api/stock?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let search: any = { vendible: false }
      if (branches.length) {
        search = { ...search, branch_id: branches }
      }
      url += `&search=${JSON.stringify(search)}`
      const res = await fetch(url)
      const { data, total } = await res.json()

      setStocks(data)
      setData(data)
      setTotal(total)
    } catch (error) {
      console.error('Error loading stocks', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (body: Stock | null, mode: ActionTable = 'view') => {
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
      const res = await fetch(`/api/stock/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteStock(data!.id)
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
    branches,
    page,
    rowsPerPage,
    order,
    orderBy,
    handleClick,
    handleDelete,
    fetchStocks,
    stocks,
    setBranches,
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