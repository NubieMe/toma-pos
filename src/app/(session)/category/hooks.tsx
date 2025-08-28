import useTableStore from "@/store/table"
import { ActionTable } from "@/types/action"
import { Category } from "@prisma/client"
import { useState } from "react"

export default function useCategory() {
  const [data, setData] = useState<Category | null>(null)
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
  
  const handleClick = (body: Category | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/category/${data?.id}`, {
      method: 'DELETE',
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    setData(null)
    return result
  }
  
  const fetchCategories = async () => {
    let url = `/api/category?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    if (search) {
      const value = JSON.stringify({ 'name-code-description': search })
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
    fetchCategories,
    setOpen,
    setData,
  }
}