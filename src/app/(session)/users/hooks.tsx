import useTableStore from "@/store/table"
import { ActionTable } from "@/types/action"
import { UserWithRelations as User } from "@/types/user"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function useUser() {
  const router = useRouter()
  const [data, setData] = useState<User | null>(null)
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    search,
    setTotal,
    setOpenAlert,
  } = useTableStore()
  
  const handleClick = (body: User | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenAlert(true)
    } else if (mode === 'add') {
      router.push(`/users/add`)
    } else {
      router.push(`/users/${body?.id}?mode=${mode}`)
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/user/${data?.id}`, {
      method: 'DELETE',
    })
    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message)
    }

    return result
  }
  
  const fetchUsers = async () => {
    let url = `/api/user?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
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
    data,
    handleClick,
    handleDelete,
    fetchUsers,
    setData,
  }
}