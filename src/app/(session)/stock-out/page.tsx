'use client'

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { stockOut } from '@/constant/enum'
import { useAuth } from '@/context/auth-context'
import { usePermission } from '@/hooks/use-permission'
import { TableColumn } from '@/types/column'
import { StockIO } from '@/types/stock'
import { Button } from '@mui/material'
import { format } from 'date-fns'
import React from 'react'
import StockIOModal from '../../../components/modal/stock-io'
import useStockOut from './hooks'

export default function Page() {
  const { permission } = usePermission()
  const { user }  = useAuth()
  const {
    stocksOut,
    loading,
    setAction,
    action,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    branches,
    setBranches,
    fetchStocksOut,
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
  } = useStockOut()

  const columns: TableColumn<StockIO>[] = [
    { key: 'stock', label: 'Item', render: (value) => (value as StockIO['stock']).item.name, disableSort: true },
    { key: 'stock', label: 'Branch', render: (value) => (value as StockIO['stock']).branch.name, disableSort: true },
    { key: 'type', label: 'Type', render: (value) => (value as StockIO['type']).split('').map((v, i) => i === 0 ? v.toUpperCase() : v).join('') },
    { key: 'qty', label: 'Qty' },
    { key: 'stock', label: 'Untuk Dijual?', render: (value) => ((value as StockIO['stock']).vendible ? 'Ya' : 'Tidak'), disableSort: true },
    { key: 'created_date', label: 'Date', render: (value) => format(value as Date, 'd MMMM y') },
  ]

  React.useEffect(() => {
    fetchStocksOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, order, orderBy, branches])

  React.useEffect(() => {
    if (permission.length) setAction(permission)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <>
      <DataTable
        title='Stock Out'
        loading={loading}
        columns={columns}
        rows={stocksOut}
        total={total}
        rowIdKey='id'
        getRowActions={() => action}
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          <div className="flex items-center gap-20">
            <BranchAuto
              value={branches}
              setValue={setBranches}
            />
            {permission.includes('add') && <Button onClick={() => setOpen(true)}>
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
      <StockIOModal
        open={open}
        onClose={() => setOpen(false)}
        options={[...stockOut]}
      />
      <AlertDialog
        title='Delete Stock'
        description='Anda yakin ingin menghapus Stock ini?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
