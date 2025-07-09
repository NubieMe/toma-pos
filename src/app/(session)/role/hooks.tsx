import { toast } from "@/hooks/use-toast"
import useRoleStore from "@/store/role"
import { ActionTable } from "@/types/action"
import { Role } from "@prisma/client"
import React from "react"

export default function useRole() {
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Role | null>(null)
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')
  const [orderBy, setOrderBy] = React.useState<keyof Role>('created_date')
  const { roles, setRoles, deleteRole } = useRoleStore()

  const fetchRoles = async () => {
    if (!search) setLoading(true)
    try {
      let url = `/api/role?page=${page + 1}&limit=${rowsPerPage}&order=${orderBy}-${order}`
      if (search) {
        const value = JSON.stringify({ 'name-description': search })
        url += `&search=${value}`
      }

      const res = await fetch(url)
      const dat = (await res.json()).data
      setRoles(dat)
    } catch (err) {
      console.error('Error loading roles', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (body: Role | null, mode: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
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
    action,
    setAction,
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
  }
}