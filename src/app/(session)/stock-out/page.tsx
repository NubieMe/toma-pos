'use client'

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { stockOut } from '@/constant/enum'
import { usePermission } from '@/hooks/use-permission'
import { TableColumn } from '@/types/column'
import { StockIO } from '@/types/stock'
import { Box, Button } from '@mui/material'
import { format } from 'date-fns'
import React, { useEffect } from 'react'
import StockIOModal from '../../../components/modal/stock-io'
import useStockOut from './hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    open,
    setOpen,
    branches,
    setBranches,
    fetchStocksOut,
    handleDelete,
    handleClick,
  } = useStockOut()
  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    setOpenAlert,
  } = useTableStore()

  const columns: TableColumn<StockIO>[] = [
    { key: 'stock', label: 'Item', render: (value) => (value as StockIO['stock']).item.name, disableSort: true },
    { key: 'stock', label: 'Branch', render: (value) => (value as StockIO['stock']).branch.name, disableSort: true },
    { key: 'type', label: 'Type', render: (value) => (value as StockIO['type']).split('').map((v, i) => i === 0 ? v.toUpperCase() : v).join('') },
    { key: 'qty', label: 'Qty' },
    { key: 'stock', label: 'Untuk Dijual?', render: (value) => ((value as StockIO['stock']).vendible ? 'Ya' : 'Tidak'), disableSort: true },
    { key: 'created_date', label: 'Date', render: (value) => format(value as Date, 'd MMMM y') },
  ]

  const query = useQuery({
    queryKey: ['stocks-out', page, rowsPerPage, order, orderBy, branches],
    queryFn: fetchStocksOut,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['stocks-out'] })
    },
    onError: (err) => {
      toast({ description: err.message, duration: 5000, variant: 'warning' })
    },
    onSettled: () => {
      setOpenAlert(false)
    }
  })

  useEffect(() => {
    setPage(0)
    setOrderBy('created_date')
    setOrder('desc')
    setRowsPerPage(10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DataTable
        title='Stock Out'
        loading={query.isPending}
        columns={columns}
        rows={query.data || []}
        rowIdKey='id'
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          <Box className="flex items-center gap-20">
            <BranchAuto
              value={branches}
              setValue={setBranches}
            />
            {permission.includes('add') && <Button onClick={() => setOpen(true)}>
              New
            </Button>}
          </Box>
        }
      />
      <StockIOModal
        open={open}
        onClose={() => setOpen(false)}
        options={[...stockOut]}
        title='Add Stock Out'
      />
      <AlertDialog
        title='Delete Stock'
        description='Anda yakin ingin menghapus Stock ini?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
