/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import Search from '@/components/table/search'
import AlertDialog from '@/components/ui/alert'
import { TableColumn } from '@/types/column'
import { Transaction } from '@/types/transaction'
import { Button } from '@mui/material'
import { format } from 'date-fns'
import React from 'react'
import useTransaction from './hooks'

export default function Page() {
  const {
    transactions,
    loading,
    // open,
    // setOpen,
    openDelete,
    setOpenDelete,
    // mode,
    // data,
    search,
    setSearch,
    fetchTransactions,
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
    permission,
    branches,
    setBranches,
  } = useTransaction()

  const columns: TableColumn<Transaction>[] = [
    { key: 'branch', label: 'Branch', render: (value) => (value as Transaction['branch'])?.name, disableSort: true },
    { key: 'code', label: 'Invoice' },
    { key: 'total', label: 'Total' },
    { key: 'paid', label: 'Status', render: (value) => value ? 'Paid' : 'Unpaid' },
    { key: 'created_date', label: 'Date', render: (value) => format(value as Date, 'd MMMM y')},
    { key: 'payment_method', label: 'Payment Method', render: (value) => (value as Transaction['payment_method']) },
  ]

  React.useEffect(() => {
    fetchTransactions()
  }, [page, rowsPerPage, order, orderBy, search, branches])

  return (
    <>
      <DataTable
        title='Transaction'
        loading={loading}
        columns={columns}
        rows={transactions}
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
            <BranchAuto
              value={branches}
              setValue={setBranches}
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
        title='Delete UOM'
        description='Are you sure you want to delete this UOM?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
