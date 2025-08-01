import { stockIn } from "@/constant/enum";
import { toast } from "@/hooks/use-toast";
import useStockInStore from "@/store/stock-in";
import { ActionTable } from "@/types/action";
import { StockIO } from "@/types/stock";
import React from "react";

export default function useStockIn() {
  const { stocksIn, setStocksIn, deleteStockIn } = useStockInStore()
  const [total, setTotal] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<ActionTable>('view')
  const [data, setData] = React.useState<StockIO | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [branches, setBranches] = React.useState<string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof StockIO>('created_date')

  const fetchStocksIn = async () => {
    setLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = { type: stockIn }
      let url = `/api/stock-io?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (branches.length) {
        value = { ...value, 'stock.branch_id': branches }
      }
      value = JSON.stringify(value)
      url += `&search=${value}`
      const res = await fetch(url)
      const { data, total } = await res.json()

      setStocksIn(data)
      setData(data)
      setTotal(total)
    } catch (error) {
      console.error('Error loading stocks', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (body: StockIO | null, mode: ActionTable = 'view') => {
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
      deleteStockIn(data!.id)
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
    branches,
    page,
    rowsPerPage,
    order,
    orderBy,
    handleClick,
    handleDelete,
    fetchStocksIn,
    stocksIn,
    setAction,
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