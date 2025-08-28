import useTableStore from '@/store/table'
import { ActionTable } from '@/types/action'
import { Menu } from '@/types/menu'
import { useState } from 'react'

export default function useMenu() {
  const [data, setData] = useState<Menu | null>(null)
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

  const handleClick = (body: Menu | null = null, modes: ActionTable = 'view') => {
    setData(body)
    if (modes === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(modes)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/menu/${data?.id}`, {
      method: 'DELETE',
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    setData(null)
    return result
  }

  const fetchMenus = async () => {
    let url = `/api/menu?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
    if (search) {
      const value = JSON.stringify({ 'name-icon-path': search })
      url += `&search=${value}`
    }

    const res = await fetch(url)
    const { data, total } = await res.json()

    setTotal(total)
    return data
  }

  return {
    handleClick,
    handleDelete,
    data,
    setData,
    fetchMenus,
    open,
    setOpen,
  }
}