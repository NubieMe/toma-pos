"use client"
import React from 'react'
import useRoleStore from '@/store/role'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Role } from '@prisma/client'
import { format } from 'date-fns'
import RoleModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { usePermission } from '@/hooks/use-permission'
import { ActionTable } from '@/types/action'
import { convertAction } from '@/utils/helper'
import { Button } from '@mui/material'

export default function Page() {
  const { permission } = usePermission()
  const { roles, setRoles, deleteRole } = useRoleStore()
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Role | null>(null)
  const [action, setAction] = React.useState<ActionTable[]>([])

  const columns: TableColumn<Role>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y') },
  ]

  React.useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/role')
        const dat = (await res.json()).data
        setRoles(dat)
      } catch (err) {
        console.error('Error loading roles', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
    setAction(convertAction(permission!))
  }, [])

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

  return (
    <>
      <DataTable
        loading={loading}
        rows={roles}
        rowIdKey='id'
        columns={columns}
        title='Role Management'
        getRowActions={() => action}
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          (permission?.create && <Button onClick={() => handleClick(null, 'add')}>
            New
          </Button>)
        }
      />
      <RoleModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!} 
      />
      <AlertDialog 
        title='Delete Role'
        description='Are you sure you want to delete this role?'
        open={openDelete} 
        setOpen={setOpenDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
