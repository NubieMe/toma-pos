import { stockOut } from "@/constant/enum";
import useTableStore from "@/store/table";
import { ActionTable } from "@/types/action";
import { StockIO } from "@/types/stock";
import { useState } from "react";

export default function useStockOut() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<StockIO | null>(null)
  const [branches, setBranches] = useState<string[]>([])
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    setTotal,
    setMode,
    setOpenAlert,
  } = useTableStore()

  const fetchStocksOut = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = { type: stockOut }
    let url = `/api/stock-io?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    if (branches.length) {
      value = { ...value, 'stock.branch_id': branches }
    }
    value = JSON.stringify(value)
    url += `&search=${value}`
    const res = await fetch(url)
    const { data, total } = await res.json()

    setTotal(total)
    return data
  }

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
    const res = await fetch(`/api/stock/${data?.id}`, {
      method: 'DELETE',
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  return {
    open,
    data,
    branches,
    handleClick,
    handleDelete,
    fetchStocksOut,
    setBranches,
    setOpen,
    setData,
  }
}