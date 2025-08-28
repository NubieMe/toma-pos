import useTableStore from "@/store/table";
import { ActionTable } from "@/types/action";
import { Stock } from "@/types/stock";
import React from "react";

export default function useStock() {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<Stock | null>(null)
  const [branches, setBranches] = React.useState<string[]>([])
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    setTotal,
    setMode,
    setOpenAlert,
  } = useTableStore()

  const fetchStocks = async () => {
    let url = `/api/stock?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let search: any = { vendible: false }
    if (branches.length) {
      search = { ...search, branch_id: branches }
    }
    url += `&search=${JSON.stringify(search)}`
    const res = await fetch(url)
    const { data, total } = await res.json()

    setTotal(total)
    return data
  }

  const handleClick = (body: Stock | null, mode: ActionTable = 'view') => {
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

    setData(null)
    return result
  }

  return {
    open,
    data,
    branches,
    handleClick,
    handleDelete,
    fetchStocks,
    setBranches,
    setOpen,
    setMode,
    setData,
  }
}