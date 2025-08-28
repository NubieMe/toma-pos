'use client'

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { TableColumn } from '@/types/column'
import { Stock } from '@/types/stock'
import React, { useEffect } from 'react'
import StockModal from '../../../components/modal/stock'
import useStock from './hooks'
import { Box } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const {
    open,
    setOpen,
    data,
    branches,
    setBranches,
    fetchStocks,
    handleDelete,
    handleClick,
  } = useStock()
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

  const columns: TableColumn<Stock>[] = [
    { key: 'item', label: 'Item', render: (value) => (value as Stock['item']).name },
    { key: 'branch', label: 'Branch', render: (value) => (value as Stock['branch']).name },
    { key: 'qty', label: 'Qty' },
    { key: 'vendible', label: 'Untuk Dijual?', render: (value) => (value ? 'Ya' : 'Tidak') },
  ]

  const query = useQuery({
    queryKey: ['non-products', page, rowsPerPage, order, orderBy, branches],
    queryFn: fetchStocks,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['non-products'] })
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
        title='Non-Product Stock Management'
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
          </Box>
        }
      />
      <StockModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete Branch'
        description='Anda yakin ingin menghapus Item ini?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
