/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Uom } from '@prisma/client'
import { format } from 'date-fns'
import UomModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Button } from '@mui/material'
import { useAuth } from '@/context/auth-context'
import useUom from './hooks'
import Search from '@/components/table/search'

export default function Page() {
  const { permission } = usePermission()
  const { user }  = useAuth()
  const {
    uoms,
    loading,
    setAction,
    action,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    data,
    search,
    setSearch,
    fetchUoms,
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
  } = useUom()

  const columns: TableColumn<Uom>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y')},
  ]

  React.useEffect(() => {
    fetchUoms()
  }, [page, rowsPerPage, order, orderBy, search])

  React.useEffect(() => {
    if (permission.length) setAction(permission)
  }, [user])

  return (
    <>
      <DataTable
        title='Unit of Measurement'
        loading={loading}
        columns={columns}
        rows={uoms}
        total={total}
        rowIdKey='id'
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
      <UomModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete UOM'
        description='Are you sure you want to delete this UOM?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
