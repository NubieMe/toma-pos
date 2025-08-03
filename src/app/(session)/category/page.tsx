/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Category } from '@prisma/client'
import { format } from 'date-fns'
import CategoryModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Button } from '@mui/material'
import useCategory from './hooks'
import Search from '@/components/table/search'

export default function Page() {
  const { permission } = usePermission()
  const {
    categories,
    loading,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    data,
    search,
    setSearch,
    fetchCategories,
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
  } = useCategory()

  const columns: TableColumn<Category>[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y')},
  ]

  React.useEffect(() => {
    fetchCategories()
  }, [page, rowsPerPage, order, orderBy, search])

  return (
    <>
      <DataTable
        title='Category'
        loading={loading}
        columns={columns}
        rows={categories}
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
      <CategoryModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete Category'
        description='Anda yakin ingin menghapus Category ini?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
