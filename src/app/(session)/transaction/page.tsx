/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import BranchAuto from '@/components/auto-complete/branch'
import DataTable from '@/components/table/data-table'
import Search from '@/components/table/search'
import AlertDialog from '@/components/ui/alert'
import { TableColumn } from '@/types/column'
import { Transaction } from '@/types/transaction'
import { Box, Button } from '@mui/material'
import { format } from 'date-fns'
import { useEffect } from 'react'
import useTransaction from './hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const {
    // open,
    // setOpen,
    // mode,
    // data,
    fetchTransactions,
    handleDelete,
    handleClick,
    permission,
    branches,
    setBranches,
  } = useTransaction()
  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    search,
    setSearch,
    setOpenAlert,
  } = useTableStore()
  const debounceSearch = useDebounce(search)

  const columns: TableColumn<Transaction>[] = [
    { key: 'branch', label: 'Branch', render: (value) => (value as Transaction['branch'])?.name, disableSort: true },
    { key: 'code', label: 'Invoice' },
    { key: 'total', label: 'Total' },
    { key: 'paid', label: 'Status', render: (value) => value ? 'Paid' : 'Unpaid' },
    { key: 'created_date', label: 'Date', render: (value) => format(value as Date, 'd MMMM y')},
    { key: 'payment_method', label: 'Payment Method', render: (value) => (value as Transaction['payment_method']) },
  ]

  const query = useQuery({
    queryKey: ['transactions', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchTransactions,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      toast({ description: err.message, duration: 5000, variant: 'warning' })
    },
    onSettled: () => {
      setOpenAlert(false)
    }
  })

  useEffect(() => {
    setSearch('')
    setPage(0)
    setOrderBy('created_date')
    setOrder('desc')
    setRowsPerPage(10)
  }, [])

  return (
    <>
      <DataTable
        title='Transaction'
        loading={query.isPending}
        columns={columns}
        rows={query.data || []}
        rowIdKey='id'
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          <Box className="flex items-center gap-20">
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
          </Box>
        }
      />
      <AlertDialog
        title='Delete UOM'
        description='Are you sure you want to delete this UOM?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
