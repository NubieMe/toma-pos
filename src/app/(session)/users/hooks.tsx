import { toast } from "@/hooks/use-toast"
import useUserStore from "@/store/user"
import { ActionTable } from "@/types/action"
import { UserWithRelations as User } from "@/types/user"
import { useRouter } from "next/navigation"
import React from "react"

export default function useUser() {
  const router = useRouter()
  const { users, setUsers, deleteUser } = useUserStore()
  const [total, setTotal] = React.useState(0)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [data, setData] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof User>('created_date')
  
  const handleClick = (body: User | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenDelete(true)
    } else if (mode === 'add') {
      router.push(`/users/add`)
    } else {
      router.push(`/users/${body?.id}?mode=${mode}`)
    }
  }

  const handleDelete = async () => {
    const duration = 5000
    try {
      const res = await fetch(`/api/user/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteUser(data!.id)
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
    }
  }
  
  const fetchUsers = async () => {
    if (!search) setLoading(true)
    try {
      let url = `/api/user?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (search) {
        const value = JSON.stringify({ 'name-description': search })
        url += `&search=${value}`
      }
      const res = await fetch(url)
      const { data, total } = await res.json()

      setUsers(data)
      setTotal(total)
    } catch (err) {
      console.error('Error loading users', err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [search])

  return {
    openDelete,
    data,
    loading,
    search,
    page,
    rowsPerPage,
    order,
    orderBy,
    handleClick,
    handleDelete,
    fetchUsers,
    users,
    setSearch,
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setOpenDelete,
    setData,
    total,
  }
}