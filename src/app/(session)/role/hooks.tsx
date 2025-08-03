import { toast } from "@/hooks/use-toast"
import useRoleStore from "@/store/role"
import { ActionTable } from "@/types/action"
import { Role } from "@prisma/client"
import React from "react"

export default function useRole() {
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<ActionTable>('view')
  const [data, setData] = React.useState<Role | null>(null)
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Role>('created_date')
  const { roles, setRoles, deleteRole } = useRoleStore()
  const [total, setTotal] = React.useState(0)

  const fetchRoles = async () => {
    if (!search) setLoading(true)
    try {
      let url = `/api/role?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (search) {
        const value = JSON.stringify({ 'name-description': search })
        url += `&search=${value}`
      }

      const res = await fetch(url)
      const { data, total } = await res.json()

      setRoles(data)
      setTotal(total)
    } catch (err) {
      console.error('Error loading roles', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (body: Role | null, mode: ActionTable = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenDelete(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const duration = 5000
    try {
      const res = await fetch(`/api/role/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message

      deleteRole(data!.id)
      toast({ description: result, duration })
    } catch (error) {
      toast({ description: (error as Error).message, variant: 'warning', duration })
    } finally {
      setOpenDelete(false)
    }
  }

  return {
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    loading,
    setLoading,
    mode,
    setMode,
    data,
    setData,
    search,
    setSearch,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    roles,
    setRoles,
    deleteRole,
    fetchRoles,
    handleClick,
    handleDelete,
    total,
  }
}