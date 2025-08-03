import { toast } from "@/hooks/use-toast"
import useTransferInStore from "@/store/transfer-in"
import useTransferOutStore from "@/store/transfer-out"
import { ActionTable } from "@/types/action"
import { StockIO } from "@/types/stock"
import { useAuth } from "@/context/auth-context"
import React from "react"
import { usePermission } from "@/hooks/use-permission"

export default function useTransfer() {
  const { user } = useAuth()
  const { permission } = usePermission()
  // State untuk Transfer Out
  const { transferOut, setTransferOut, deleteTransferOut } = useTransferOutStore()
  // State untuk Transfer In
  const { transferIn, setTransferIn, deleteTransferIn } = useTransferInStore()
  
  // Shared state
  const [totalIn, setTotalIn] = React.useState(0)
  const [totalOut, setTotalOut] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<ActionTable>('view')
  const [data, setData] = React.useState<StockIO | null>(null)
  const [loading, setLoading] = React.useState({
    in: false,
    out: false
  })
  const [search, setSearch] = React.useState('')
  const [pageIn, setPageIn] = React.useState(0)
  const [pageOut, setPageOut] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof StockIO>('created_date')
  const [activeTab, setActiveTab] = React.useState<'in' | 'out'>('out')

  // Filter state
  const [fromBranchOut, setFromBranchOut] = React.useState<string[]>([])
  const [toBranchOut, setToBranchOut] = React.useState<string[]>([])
  const [fromBranchIn, setFromBranchIn] = React.useState<string[]>([])
  const [toBranchIn, setToBranchIn] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!user) return
    
    if (!permission.includes('filter')) {
      if (activeTab === 'out' && user.branch.id) {
        setFromBranchOut([user.branch.id])
      } else if (activeTab === 'in' && user.branch.id) {
        setToBranchIn([user.branch.id])
      }
    }
  }, [user, permission, activeTab])

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
      const res = await fetch(`/api/stock-io/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      
      // Hapus dari store yang sesuai
      if (activeTab === 'in') {
        deleteTransferIn(data!.id)
      } else {
        deleteTransferOut(data!.id)
      }
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
    }
  }

  const fetchTransfers = async (type: 'in' | 'out') => {
    if (!search) setLoading(prev => ({ ...prev, [type]: true }))
    
    try {
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
        setTransferIn(data)
        setTotalIn(total)
      } else {
        setTransferOut(data)
        setTotalOut(total)
      }
    } catch (err) {
      console.error(`Error loading transfers ${type}`, err)
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }))
    }
  }

  return {
    open,
    openDelete,
    mode,
    data,
    loading,
    search,
    pageIn,
    pageOut,
    rowsPerPage,
    order,
    orderBy,
    activeTab,
    transferIn,
    transferOut,
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
    setSearch,
    setPageIn,
    setPageOut,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setOpen,
    setOpenDelete,
    setMode,
    setData,
    setActiveTab,
    permission,
    user,
  }
}