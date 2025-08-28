import useTableStore from "@/store/table"
import { ActionTable } from "@/types/action"
import { Role } from "@prisma/client"
import { useState } from "react"

export default function useRole() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Role | null>(null)
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

  const fetchRoles = async () => {
    let url = `/api/role?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    if (search) {
      const value = JSON.stringify({ 'name-description': search })
      url += `&search=${value}`
    }

    const res = await fetch(url)
    const { data, total } = await res.json()

    setTotal(total)
    return data
  }

  const handleClick = (body: Role | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/role/${data?.id}`, {
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
    setOpen,
    data,
    setData,
    fetchRoles,
    handleClick,
    handleDelete,
  }
}