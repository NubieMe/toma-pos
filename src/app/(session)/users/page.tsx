/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { format } from 'date-fns'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Button } from '@mui/material'
import Search from '@/components/table/search'
import useUser from './hooks'
import { UserWithRelations as User } from '@/types/user'

export default function Page() {
  const { permission } = usePermission()
  const {
    users,
    loading,
    openDelete,
    setOpenDelete,
    search,
    setSearch,
    fetchUsers,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    handleDelete,
    handleClick,
    total,
  } = useUser()

  const columns: TableColumn<User>[] = [
    { key: 'username', label: 'Username' },
    { key: 'profile', label: 'Name', render: (value) => (value as User['profile'])?.name, disableSort: true },
    { key: 'branch', label: 'Branch', render: (value) => (value as User['branch'])?.name, disableSort: true },
    { key: 'role', label: 'Role', render: (value) => (value as User['role'])?.name, disableSort: true },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value as Date, 'd MMMM y')},
  ]

  React.useEffect(() => {
    fetchUsers()
  }, [page, rowsPerPage, order, orderBy, search])

  return (
    <>
      <DataTable
        title='User Management'
        loading={loading}
        columns={columns}
        rows={users}
        total={total}
        rowIdKey='id'
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          <div className="flex items-center gap-20">
            <Search
              value={search}
              setValue={setSearch}
            />
            {permission.includes('add') && <Button onClick={() => handleClick(null, 'add')}>
              New
            </Button>}
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
      <AlertDialog
        title='Delete User'
        description='Are you sure you want to delete this User?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
