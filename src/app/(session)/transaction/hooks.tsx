import { useAuth } from "@/context/auth-context"
import { usePermission } from "@/hooks/use-permission"
import useTableStore from "@/store/table"
import { ActionTable } from "@/types/action"
import { Transaction } from "@/types/transaction"
import { useState } from "react"

export default function useTransaction() {
  const { permission } = usePermission()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Transaction | null>(null)
  const [branches, setBranches] = useState<string[]>([])
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    search,
    setTotal,
    setMode,
    setOpenAlert,
  } = useTableStore()
  
  const handleClick = (body: Transaction | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
      const res = await fetch(`/api/transaction/${data?.id}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message)
      }

      return result
  }
  
  const fetchTransactions = async () => {
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

    setTotal(total)
    return data
  }

  return {
    open,
    data,
    branches,
    permission,
    handleClick,
    handleDelete,
    fetchTransactions,
    setOpen,
    setData,
    setBranches,
  }
}