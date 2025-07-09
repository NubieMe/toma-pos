"use client"
import React from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Role } from '@prisma/client'
import { format } from 'date-fns'
import RoleModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { convertAction } from '@/utils/helper'
import { Button } from '@mui/material'
import useRole from './hooks'
import { useAuth } from '@/context/auth-context'
import Search from '@/components/table/search'

export default function Page() {
  const { permission } = usePermission()
  const { user } = useAuth()
  const {
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    data,
    action,
    setAction,
    loading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,  
    setOrder,
    orderBy,
    setOrderBy,
    search,
    setSearch,
    roles,
    fetchRoles,
    handleClick,
    handleDelete,
  } = useRole()

  const columns: TableColumn<Role>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y') },
  ]

  React.useEffect(() => {
    if (permission) setAction(convertAction(permission!))
  }, [user])

  React.useEffect(() => {
    fetchRoles()
  }, [page, rowsPerPage, order, orderBy, search])

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
          <div className="flex items-center gap-20">
            <Search
              value={search}
              setValue={setSearch}
            />
            {permission?.create && 
              <Button onClick={() => handleClick(null, 'add')}>
                New
              </Button>
            }
          </div>
        }
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
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
