import { useAuth } from "@/context/auth-context"
import { usePermission } from "@/hooks/use-permission"
import { toast } from "@/hooks/use-toast"
import useTransactionStore from "@/store/transaction"
import { ActionTable } from "@/types/action"
import { Transaction } from "@/types/transaction"
import React from "react"

export default function useTransaction() {
  const { permission } = usePermission()
  const { user } = useAuth()
  const { transactions, setTransactions, deleteTransaction } = useTransactionStore()
  const [total, setTotal] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<ActionTable>('view')
  const [data, setData] = React.useState<Transaction | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Transaction>('created_date')
  const [branches, setBranches] = React.useState<string[]>([])
  
  const handleClick = (body: Transaction | null, mode: ActionTable = 'view') => {
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
      const res = await fetch(`/api/transaction/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteTransaction(data!.id)
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
    }
  }
  
  const fetchTransactions = async () => {
    if (!search) setLoading(true)
    try {
      const filter: Record<string, React.ReactNode> = {}
      let url = `/api/transaction?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      
      if (!permission.includes('filter')) {
        if (user?.branch.id) {
          filter['branch_id'] = [user.branch.id]
        }
      } else {
        if (branches.length) {
          filter['branch_id'] = branches
        }
      }

      if (search) {
        filter['code'] = search
        url += `&search=${JSON.stringify(filter)}`
      } 
      const res = await fetch(url)
      const { data, total } = await res.json()

      setTransactions(data)
      setTotal(total)
    } catch (err) {
      console.error('Error loading transactions', err)
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
    search,
    page,
    rowsPerPage,
    order,
    orderBy,
    handleClick,
    handleDelete,
    fetchTransactions,
    transactions,
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
    branches,
    setBranches,
    permission,
  }
}