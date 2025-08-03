'use client'

import DataTable from '@/components/table/data-table'
import { usePermission } from '@/hooks/use-permission'
import { TableColumn } from '@/types/column'
import { Branch } from '@/types/branch'
import React from 'react'
import useBranch from './hooks'
import Search from '@/components/table/search'
import { Button } from '@mui/material'
import AlertDialog from '@/components/ui/alert'
import BranchModal from './modal'

export default function Page() {
  const { permission } = usePermission()
  const {
    branches,
    loading,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    data,
    search,
    setSearch,
    fetchBranches,
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
  } = useBranch()

  const columns: TableColumn<Branch>[] = [
    { key: 'name', label: 'Name' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'coordinate', label: 'Coordinate', render: (value) => Array.isArray(value) && value?.map(val => String(val)).join(', ') },
  ]

  React.useEffect(() => {
    fetchBranches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, order, orderBy, search])

  return (
    <>
      <DataTable
        title='Branch'
        loading={loading}
        columns={columns}
        rows={branches}
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
      <BranchModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete Branch'
        description='Anda yakin ingin menghapus Branch ini?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
