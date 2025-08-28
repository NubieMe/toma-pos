import useTableStore from "@/store/table";
import { ActionTable } from "@/types/action";
import { Branch } from "@/types/branch";
import { useState } from "react";

export default function useBranch() {
  const [data, setData] = useState<Branch | null>(null)
  const [open, setOpen] = useState(false)
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

  const fetchBranches = async () => {
    let url = `/api/branch?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    if (search) {
      const value = JSON.stringify({ 'name-phone-address': search })
      url += `&search=${value}`
    }
    const res = await fetch(url)
    const { data, total } = await res.json()

    setTotal(total)
    return data
  }

  const handleClick = (body: Branch | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/branch/${data?.id}`, {
      method: 'DELETE',
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    setData(null)
    return result
  }

  return {
    data,
    setData,
    handleClick,
    handleDelete,
    fetchBranches,
    setMode,
    open,
    setOpen,
  }
}