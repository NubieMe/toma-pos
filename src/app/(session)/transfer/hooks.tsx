import { useAuth } from "@/context/auth-context"
import { usePermission } from "@/hooks/use-permission"
import useTableStore from "@/store/table"
import { ActionTable } from "@/types/action"
import { StockIO } from "@/types/stock"
import { useEffect, useState } from "react"

export default function useTransfer() {
  const { user } = useAuth()
  const { permission } = usePermission()
  const {
    rowsPerPage,
    order,
    orderBy,
    search,
    setPage,
    setTotal,
    setMode,
    setOpenAlert,
  } = useTableStore()
  
  // Shared state
  const [totalIn, setTotalIn] = useState(0)
  const [totalOut, setTotalOut] = useState(0)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<StockIO | null>(null)
  const [pageIn, setPageIn] = useState(0)
  const [pageOut, setPageOut] = useState(0)
  const [activeTab, setActiveTab] = useState<'in' | 'out'>('out')

  // Filter state
  const [fromBranchOut, setFromBranchOut] = useState<string[]>([])
  const [toBranchOut, setToBranchOut] = useState<string[]>([])
  const [fromBranchIn, setFromBranchIn] = useState<string[]>([])
  const [toBranchIn, setToBranchIn] = useState<string[]>([])

  useEffect(() => {
    if (!user) return

    if (!permission.includes('filter')) {
      if (activeTab === 'out' && user.branch.id) {
        setFromBranchOut([user.branch.id])
        setPage(pageOut)
        setTotal(totalOut)
      } else if (activeTab === 'in' && user.branch.id) {
        setToBranchIn([user.branch.id])
        setPage(pageIn)
        setTotal(totalIn)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, permission, activeTab])

  const handleClick = (body: StockIO | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/stock-io/${data?.id}`, {
      method: 'DELETE',
    })
    const result = await res.json()
    
    if (!res.ok) {
      throw new Error(result.message)
    }

    return { ...result, type: activeTab }
  }

  const fetchTransfers = async (type: 'in' | 'out') => {
    let url = `/api/stock-io?page=${
      type === 'in' ? pageIn + 1 : pageOut + 1
    }&limit=${rowsPerPage}&order=${orderBy}-${order}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { type: 'transfer' }

    if (type === 'out') {
      if (fromBranchOut.length) filter['stock.branch_id'] = fromBranchOut
      if (toBranchOut.length) filter['to.branch_id'] = toBranchOut
    } else {
      if (fromBranchIn.length) filter['stock.branch_id'] = fromBranchIn
      if (toBranchIn.length) filter['to.branch_id'] = toBranchIn
    }

    if (search) {
      filter['stock.item.name'] = search
    }

    if (Object.keys(filter).length) {
      url += `&search=${JSON.stringify(filter)}`
    }

    const res = await fetch(url)
    const { data, total } = await res.json()

    if (type === 'in') {
      setTotalIn(total)
    } else {
      setTotalOut(total)
    }

    return data
  }

  return {
    open,
    data,
    search,
    pageIn,
    pageOut,
    rowsPerPage,
    order,
    orderBy,
    activeTab,
    totalIn,
    totalOut,
    fromBranchOut,
    setFromBranchOut,
    toBranchOut,
    setToBranchOut,
    fromBranchIn,
    setFromBranchIn,
    toBranchIn,
    setToBranchIn,
    handleClick,
    handleDelete,
    fetchTransfers,
    setPageIn,
    setPageOut,
    setOpen,
    setMode,
    setData,
    setActiveTab,
    permission,
    user,
  }
}