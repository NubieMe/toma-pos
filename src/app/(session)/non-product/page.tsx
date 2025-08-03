'use client'

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { ioTypes } from '@/constant/enum'
import { usePermission } from '@/hooks/use-permission'
import { TableColumn } from '@/types/column'
import { Stock } from '@/types/stock'
import { Button } from '@mui/material'
import React from 'react'
import StockModal from '../../../components/modal/stock'
import StockIOModal from '../../../components/modal/stock-io'
import useStock from './hooks'

export default function Page() {
  const [openAdd, setOpenAdd] = React.useState(false)
  const { permission } = usePermission()
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
        title='Non-Product Stock Management'
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
            {permission.includes('add') && <Button onClick={() => setOpenAdd(true)}>
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
      <StockModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <StockIOModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        options={ioTypes}
        title=''
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
