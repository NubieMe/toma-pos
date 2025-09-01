'use client'

import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { TableColumn } from '@/types/column'
import { StockIO } from '@/types/stock'
import { Box, Button, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import StockIOModal from '@/components/modal/stock-io'
import useTransfer from './hooks'
import { format } from 'date-fns'
import BranchAuto from '@/components/auto-complete/branch'
import Search from '@/components/table/search'
import useTableStore from '@/store/table'
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const {
    open,
    setOpen,
    fetchTransfers,
    handleDelete,
    handleClick,
    activeTab,
    setActiveTab,
    fromBranchOut,
    setFromBranchOut,
    toBranchOut,
    setToBranchOut,
    fromBranchIn,
    setFromBranchIn,
    toBranchIn,
    setToBranchIn,
    permission,
    pageIn,
    pageOut,
  } = useTransfer()
  const {
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

  // Common columns for both transfer in and out
  const columns: TableColumn<StockIO>[] = [
    { 
      key: 'stock', 
      label: 'Item', 
      render: (value) => (value as StockIO['stock'])?.item?.name,
      disableSort: true
    },
    { 
      key: 'qty', 
      label: 'Qty',
      numeric: true
    },
    { 
      key: 'stock', 
      label: 'From', 
      render: (value) => (value as StockIO['stock'])?.branch?.name,
      disableSort: true
    },
    { 
      key: 'to', 
      label: 'To', 
      render: (value) => (value as StockIO['to'])?.branch?.name,
      disableSort: true
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value) => (
        <Typography className='capitalize' color={
          value === 'success' ? 'success.main' :
          value === 'failed' ? 'error.main' :
          value === 'pending' ? 'warning.main' :
          'text.primary'
        }>
          {value as string}
        </Typography>
      ) 
    },
    { 
      key: 'created_date', 
      label: 'Date', 
      render: (value) => format(value as Date, 'd MMMM y') 
    },
  ]

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'in' | 'out') => {
    setActiveTab(newValue)
  }
  
  const [queryIn, queryOut]= useQueries({
    queries: [
      {
        queryKey: ['transfers-in', pageIn, rowsPerPage, order, orderBy, search, fromBranchIn, toBranchIn],
        queryFn: () => fetchTransfers('in'),
      },
      {
        queryKey: ['transfers-out', pageOut, rowsPerPage, order, orderBy, search, fromBranchOut, toBranchOut],
        queryFn: () => fetchTransfers('out'),
      },
    ]
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['transfers-' + res.activeTab] })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Transfer Stock
          </Typography>

          {activeTab === 'out' && permission.includes('add') && (
            <Button 
              variant="contained" 
              onClick={() => handleClick(null, 'add')}
              sx={{ textTransform: 'none' }}
            >
              New Transfer
            </Button>
          )}
        </Box>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab 
            label="Transfer Out" 
            value="out" 
            sx={{ textTransform: 'none', fontWeight: 600 }} 
          />
          <Tab 
            label="Transfer In" 
            value="in" 
            sx={{ textTransform: 'none', fontWeight: 600 }} 
          />
        </Tabs>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}>
          {activeTab === 'out' ? (
            <>
              <BranchAuto
                value={fromBranchOut}
                setValue={setFromBranchOut}
                label="From"
                disabled={!permission.includes('filter')}
              />
              <BranchAuto
                value={toBranchOut}
                setValue={setToBranchOut}
                label="To"
              />
              <Search
                value={search}
                setValue={setSearch}
              />
            </>
          ) : (
            <>
              <BranchAuto
                value={fromBranchIn}
                setValue={setFromBranchIn}
                label="From"
              />
              <BranchAuto
                value={toBranchIn}
                setValue={setToBranchIn}
                label="To"
                disabled={!permission.includes('filter')}
              />
              <Search
                value={search}
                setValue={setSearch}
              />
            </>
          )}

        </Box>

        {activeTab === 'out' ? (
          <DataTable
            title=''
            loading={queryOut.isPending}
            columns={columns}
            rows={queryOut.data || []}
            rowIdKey="id"
            onActionClick={(action, row) => handleClick(row, action)}
          />
        ) : (
          <DataTable
            title=''
            loading={queryIn.isPending}
            columns={columns}
            rows={queryIn.data || []}
            rowIdKey="id"
            onActionClick={(action, row) => handleClick(row, action)}
          />
        )}
      </Paper>

      <StockIOModal
        open={open}
        onClose={() => setOpen(false)}
        options={['transfer']}
        title='Transfer Stock'
      />

      <AlertDialog
        title="Delete Transfer"
        description="Are you sure you want to delete this transfer record?"
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
    </Box>
  )
}