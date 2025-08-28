import useTableStore from "@/store/table"
import { ActionTable } from "@/types/action"
import { Uom } from "@prisma/client"
import { useState } from "react"

export default function useUom() {
  const [data, setData] = useState<Uom | null>(null)
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
  
  const handleClick = (body: Uom | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/uom/${data?.id}`, {
      method: 'DELETE',
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }
  
  const fetchUoms = async () => {
    let url = `/api/uom?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    if (search) {
      const value = JSON.stringify({ 'name-description': search })
      url += `&search=${value}`
    }
    const res = await fetch(url)
    const { data, total } = await res.json()

    setTotal(total)
    return data
  }

  return {
    open,
    data,
    handleClick,
    handleDelete,
    fetchUoms,
    setOpen,
    setData,
  }
}