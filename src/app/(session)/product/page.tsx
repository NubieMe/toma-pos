'use client'

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { TableColumn } from '@/types/column'
import { Stock } from '@/types/stock'
import React from 'react'
import StockModal from '../../../components/modal/stock'
import useStock from './hooks'

export default function Page() {
  const {
    stocks,
    loading,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    data,
    branches,
    setBranches,
    fetchStocks,
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
  } = useStock()

  const columns: TableColumn<Stock>[] = [
    { key: 'item', label: 'Item', render: (value) => (value as Stock['item']).name },
    { key: 'branch', label: 'Branch', render: (value) => (value as Stock['branch']).name },
    { key: 'qty', label: 'Qty' },
    { key: 'vendible', label: 'Untuk Dijual?', render: (value) => (value ? 'Ya' : 'Tidak') },
  ]

  React.useEffect(() => {
    fetchStocks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, order, orderBy, branches])

  return (
    <>
      <DataTable
        title='Product Stock Management'
        loading={loading}
        columns={columns}
        rows={stocks}
        total={total}
        rowIdKey='id'
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          <div className="flex items-center gap-20">
            <BranchAuto
              value={branches}
              setValue={setBranches}
            />
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
      <StockModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete Stock Product'
        description='Anda yakin ingin menghapus Stock Product ini?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
