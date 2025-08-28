import useTableStore from '@/store/table'
import { ActionTable } from '@/types/action'
import { Item } from '@/types/item'
import React from 'react'

export default function useItem() {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<Item | null>(null)
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

  const handleClick = (body: Item | null = null, modes: ActionTable = 'view') => {
    setData(body)
    if (modes === 'delete') {
      setOpenAlert(true)
    } else {
      setOpen(true)
      setMode(modes)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/item/${data?.id}`, {
      method: 'DELETE',
    })
    
    const result = (await res.json()).message

    if (!res.ok) {
      throw new Error(result)
    }

    setData(null)
    return result
  }

  const fetchItems = async () => {
    let url = `/api/item?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
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
    handleClick,
    handleDelete,
    open,
    setOpen,
    data,
    setData,
    fetchItems,
  }
}