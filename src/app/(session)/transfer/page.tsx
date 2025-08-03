'use client'

import DataTable from '@/components/table/data-table'
import AlertDialog from '@/components/ui/alert'
import { TableColumn } from '@/types/column'
import { StockIO } from '@/types/stock'
import { Box, Button, Paper, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import StockIOModal from '@/components/modal/stock-io'
import useTransfer from './hooks'
import { format } from 'date-fns'
import BranchAuto from '@/components/auto-complete/branch'
import Search from '@/components/table/search'

export default function Page() {
  const {
    transferIn,
    transferOut,
    loading,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    fetchTransfers,
    pageIn,
    setPageIn,
    pageOut,
    setPageOut,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    handleDelete,
    handleClick,
    totalIn,
    totalOut,
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
    search,
    setSearch,
    permission,
  } = useTransfer()

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

  React.useEffect(() => {
    fetchTransfers('out')
    fetchTransfers('in')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIn, pageOut, rowsPerPage, order, orderBy, search, 
      fromBranchOut, toBranchOut, fromBranchIn, toBranchIn])

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'in' | 'out') => {
    setActiveTab(newValue)
  }

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
            loading={loading.out}
            columns={columns}
            rows={transferOut}
            total={totalOut}
            rowIdKey="id"
            onActionClick={(action, row) => handleClick(row, action)}
            page={pageOut}
            setPage={setPageOut}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
        ) : (
          <DataTable
            title=''
            loading={loading.in}
            columns={columns}
            rows={transferIn}
            total={totalIn}
            rowIdKey="id"
            onActionClick={(action, row) => handleClick(row, action)}
            page={pageIn}
            setPage={setPageIn}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
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
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </Box>
  )
}