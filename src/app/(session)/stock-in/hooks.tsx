import { stockIn } from "@/constant/enum";
import useTableStore from "@/store/table";
import { ActionTable } from "@/types/action";
import { StockIO } from "@/types/stock";
import { useState } from "react";

export default function useStockIn() {
  const [data, setData] = useState<StockIO | null>(null)
  const [open, setOpen] = useState(false)
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

  const fetchStocksIn = async () => {
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
    const result = (await res.json()).message

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }

  return {
    open,
    data,
    branches,
    setBranches,
    handleClick,
    handleDelete,
    fetchStocksIn,
    setOpen,
    setData,
  }
}